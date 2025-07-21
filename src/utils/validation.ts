import { Node, Edge } from 'reactflow';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateRule(
  ruleNodes: Node[],
  conditionNodes: Node[],
  actionNodes: Node[],
  edges: Edge[]
): ValidationResult {
  const errors: string[] = [];

  // Check if there's at least one rule node
  if (ruleNodes.length === 0) {
    errors.push('At least one rule node is required');
  }

  // Check if rule has a name
  ruleNodes.forEach(rule => {
    if (!rule.data.name || rule.data.name.trim() === '') {
      errors.push('Rule must have a name');
    }
  });

  // Check if there's at least one condition
  if (conditionNodes.length === 0) {
    errors.push('At least one condition is required');
  }

  // Check if there's at least one action
  if (actionNodes.length === 0) {
    errors.push('At least one action is required');
  }

  // Validate condition nodes
  conditionNodes.forEach((condition, index) => {
    const { field, operator, value } = condition.data;
    
    if (!field || field.trim() === '') {
      errors.push(`Condition ${index + 1}: Field is required`);
    }
    
    if (!operator || operator.trim() === '') {
      errors.push(`Condition ${index + 1}: Operator is required`);
    }
    
    if (!value || value.trim() === '') {
      errors.push(`Condition ${index + 1}: Value is required`);
    }
  });

  // Validate action nodes
  actionNodes.forEach((action, index) => {
    const { type, target, value } = action.data;
    
    if (!type || type.trim() === '') {
      errors.push(`Action ${index + 1}: Type is required`);
    }
    
    if (!target || target.trim() === '') {
      errors.push(`Action ${index + 1}: Target is required`);
    }
    
    if (!value || value.trim() === '') {
      errors.push(`Action ${index + 1}: Value is required`);
    }
  });

  // Check connections
  const ruleIds = ruleNodes.map(n => n.id);
  const conditionIds = conditionNodes.map(n => n.id);
  const actionIds = actionNodes.map(n => n.id);

  // Check if rules are connected to conditions
  const ruleToConditionConnections = edges.filter(edge => 
    ruleIds.includes(edge.source) && conditionIds.includes(edge.target)
  );

  if (ruleToConditionConnections.length === 0) {
    errors.push('Rules must be connected to conditions');
  }

  // Check if rules are connected to actions
  const ruleToActionConnections = edges.filter(edge => 
    ruleIds.includes(edge.source) && actionIds.includes(edge.target)
  );

  if (ruleToActionConnections.length === 0) {
    errors.push('Rules must be connected to actions');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}