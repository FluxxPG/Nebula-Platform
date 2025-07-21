import { Node, Edge } from 'reactflow';

export function executeRule(
  ruleNodes: Node[],
  conditionNodes: Node[],
  actionNodes: Node[],
  edges: Edge[],
  inputData: any
): any {
  const startTime = Date.now();
  const logs: string[] = [];
  let outputData = JSON.parse(JSON.stringify(inputData)); // Deep clone
  
  logs.push('Starting rule execution...');
  
  if (ruleNodes.length === 0) {
    logs.push('No rules to execute');
    return {
      success: false,
      executionTime: Date.now() - startTime,
      inputData,
      outputData,
      rulesExecuted: 0,
      logs
    };
  }

  const rule = ruleNodes[0];
  logs.push(`Executing rule: ${rule.data.name}`);

  // Get connected conditions and actions
  const connectedConditions = conditionNodes.filter(condition =>
    edges.some(edge => edge.source === rule.id && edge.target === condition.id)
  );

  const connectedActions = actionNodes.filter(action =>
    edges.some(edge => edge.source === rule.id && edge.target === action.id)
  );

  logs.push(`Found ${connectedConditions.length} conditions and ${connectedActions.length} actions`);

  // Evaluate conditions
  let allConditionsMet = true;
  
  for (const condition of connectedConditions) {
    const { field, operator, value } = condition.data;
    const actualValue = getNestedValue(outputData, field);
    
    logs.push(`Evaluating condition: ${field} ${operator} ${value}`);
    logs.push(`Actual value: ${actualValue}`);
    
    const conditionResult = evaluateCondition(actualValue, operator, value);
    logs.push(`Condition result: ${conditionResult}`);
    
    if (!conditionResult) {
      allConditionsMet = false;
      break;
    }
  }

  if (!allConditionsMet) {
    logs.push('Not all conditions were met. Rule execution stopped.');
    return {
      success: false,
      executionTime: Date.now() - startTime,
      inputData,
      outputData,
      rulesExecuted: 0,
      logs
    };
  }

  logs.push('All conditions met. Executing actions...');

  // Execute actions
  for (const action of connectedActions) {
    const { type, target, value } = action.data;
    
    logs.push(`Executing action: ${type} on ${target} with value ${value}`);
    
    try {
      switch (type) {
        case 'setProperty':
          setNestedValue(outputData, target, parseValue(value));
          logs.push(`Set ${target} = ${value}`);
          break;
        case 'callMethod':
          logs.push(`Called method: ${value} (simulated)`);
          break;
        case 'insertFact':
          logs.push(`Inserted fact: ${target} (simulated)`);
          break;
        case 'deleteFact':
          logs.push(`Deleted fact: ${target} (simulated)`);
          break;
        case 'modifyFact':
          setNestedValue(outputData, target, parseValue(value));
          logs.push(`Modified ${target} = ${value}`);
          break;
        default:
          logs.push(`Unknown action type: ${type}`);
      }
    } catch (error) {
      logs.push(`Error executing action: ${error}`);
    }
  }

  const executionTime = Date.now() - startTime;
  logs.push(`Rule execution completed in ${executionTime}ms`);

  return {
    success: true,
    executionTime,
    inputData,
    outputData,
    rulesExecuted: 1,
    logs
  };
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop();
  
  if (!lastKey) return;
  
  const target = keys.reduce((current, key) => {
    if (!current[key]) {
      current[key] = {};
    }
    return current[key];
  }, obj);
  
  target[lastKey] = value;
}

function parseValue(value: string): any {
  // Try to parse as number
  if (!isNaN(Number(value))) {
    return Number(value);
  }
  
  // Try to parse as boolean
  if (value === 'true') return true;
  if (value === 'false') return false;
  
  // Return as string
  return value;
}

function evaluateCondition(actualValue: any, operator: string, expectedValue: string): boolean {
  const parsedExpected = parseValue(expectedValue);
  
  switch (operator) {
    case '==':
      return actualValue == parsedExpected;
    case '!=':
      return actualValue != parsedExpected;
    case '>':
      return Number(actualValue) > Number(parsedExpected);
    case '<':
      return Number(actualValue) < Number(parsedExpected);
    case '>=':
      return Number(actualValue) >= Number(parsedExpected);
    case '<=':
      return Number(actualValue) <= Number(parsedExpected);
    case 'contains':
      return String(actualValue).includes(String(parsedExpected));
    case 'matches':
      try {
        const regex = new RegExp(String(parsedExpected));
        return regex.test(String(actualValue));
      } catch {
        return false;
      }
    default:
      return false;
  }
}