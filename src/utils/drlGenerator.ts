import { Node, Edge } from 'reactflow';

export function generateDRL(
  ruleNodes: Node[],
  conditionNodes: Node[],
  actionNodes: Node[],
  edges: Edge[]
): string {
  if (ruleNodes.length === 0) {
    return '// No rules defined';
  }

  const rule = ruleNodes[0];
  const ruleName = rule.data.name || 'UnnamedRule';
  const ruleDescription = rule.data.description || '';
  const priority = rule.data.priority || 1;

  // Get connected conditions and actions
  const connectedConditions = conditionNodes.filter(condition =>
    edges.some(edge => edge.source === rule.id && edge.target === condition.id)
  );

  const connectedActions = actionNodes.filter(action =>
    edges.some(edge => edge.source === rule.id && edge.target === action.id)
  );

  let drl = `package com.example.rules;\n\n`;
  drl += `import java.util.*;\n`;
  drl += `import java.math.*;\n\n`;
  
  if (ruleDescription) {
    drl += `/**\n * ${ruleDescription}\n */\n`;
  }
  
  drl += `rule "${ruleName}"\n`;
  drl += `    salience ${priority}\n`;
  drl += `when\n`;

  // Generate conditions (WHEN clause)
  if (connectedConditions.length > 0) {
    connectedConditions.forEach((condition, index) => {
      const { field, operator, value } = condition.data;
      const fieldParts = field.split('.');
      const objectName = fieldParts[0];
      const propertyName = fieldParts.slice(1).join('.');
      
      drl += `    $${objectName} : ${capitalizeFirst(objectName)}(`;
      
      // Convert operator to DRL syntax
      let drlOperator = operator;
      switch (operator) {
        case '==':
          drlOperator = '==';
          break;
        case '!=':
          drlOperator = '!=';
          break;
        case '>':
          drlOperator = '>';
          break;
        case '<':
          drlOperator = '<';
          break;
        case '>=':
          drlOperator = '>=';
          break;
        case '<=':
          drlOperator = '<=';
          break;
        case 'contains':
          drlOperator = 'contains';
          break;
        case 'matches':
          drlOperator = 'matches';
          break;
      }
      
      // Format value based on type
      let formattedValue = value;
      if (isNaN(Number(value)) && value !== 'true' && value !== 'false') {
        formattedValue = `"${value}"`;
      }
      
      drl += `${propertyName} ${drlOperator} ${formattedValue}`;
      drl += `)\n`;
    });
  } else {
    drl += `    // No conditions defined\n`;
  }

  drl += `then\n`;

  // Generate actions (THEN clause)
  if (connectedActions.length > 0) {
    connectedActions.forEach((action, index) => {
      const { type, target, value } = action.data;
      const targetParts = target.split('.');
      const objectName = targetParts[0];
      const propertyName = targetParts.slice(1).join('.');
      
      switch (type) {
        case 'setProperty':
          let formattedValue = value;
          if (isNaN(Number(value)) && value !== 'true' && value !== 'false') {
            formattedValue = `"${value}"`;
          }
          drl += `    $${objectName}.set${capitalizeFirst(propertyName)}(${formattedValue});\n`;
          break;
        case 'callMethod':
          drl += `    $${objectName}.${value}();\n`;
          break;
        case 'insertFact':
          drl += `    insert(new ${capitalizeFirst(target)}());\n`;
          break;
        case 'deleteFact':
          drl += `    delete($${objectName});\n`;
          break;
        case 'modifyFact':
          drl += `    modify($${objectName}) {\n`;
          drl += `        set${capitalizeFirst(propertyName)}(${value})\n`;
          drl += `    }\n`;
          break;
        default:
          drl += `    // Unknown action type: ${type}\n`;
      }
    });
    
    drl += `    update($${connectedActions[0]?.data.target.split('.')[0] || 'object'});\n`;
  } else {
    drl += `    // No actions defined\n`;
  }

  drl += `end\n`;

  return drl;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}