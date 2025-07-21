import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Play, Save, FileText, Info, Sparkles, Plus } from 'lucide-react';
import RulesList from './RulesList';
import NodePalette from './NodePalette';
import RuleNode from './nodes/RuleNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import Tour from './Tour';
import DRLViewer from './DRLViewer';
import ExecutionResult from './ExecutionResult';
import ExecuteRuleModal from './ExecuteRuleModal';
import { useRulesStore } from '../../store/rulesStore';
import { generateDRL } from '../../utils/drlGenerator';
import { saveToLocalStorage, loadFromLocalStorage } from '../../utils/localStorage';
import { executeRule } from '../../utils/ruleExecutor';
import { validateRule } from '../../utils/validation';
import { GlassButton } from '../../ui';
;

const nodeTypes = {
  rule: RuleNode,
  condition: ConditionNode,
  action: ActionNode,
};

const initialNodes: Node[] = [
  {
    id: 'sample-rule',
    type: 'rule',
    position: { x: 300, y: 100 },
    data: {
      label: 'Sample Rule',
      name: 'Customer Age Validation',
      description: 'Validates customer age for eligibility',
      priority: 1
    },
  },
  {
    id: 'sample-condition',
    type: 'condition',
    position: { x: 100, y: 250 },
    data: {
      label: 'Age >= 18',
      field: 'customer.age',
      operator: '>=',
      value: '18'
    },
  },
  {
    id: 'sample-action',
    type: 'action',
    position: { x: 500, y: 250 },
    data: {
      label: 'Set Eligible',
      type: 'setProperty',
      target: 'customer.eligible',
      value: 'true'
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'rule-condition',
    source: 'sample-rule',
    target: 'sample-condition',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#CE85B8', strokeWidth: 2 },
  },
  {
    id: 'rule-action',
    source: 'sample-rule',
    target: 'sample-action',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#CE85B8', strokeWidth: 2 },
  },
];

export default function DroolsDesigner() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [showTour, setShowTour] = useState(false);
  const [showDRL, setShowDRL] = useState(false);
  const [showExecuteModal, setShowExecuteModal] = useState(false);
  const [showExecutionResult, setShowExecutionResult] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [drlContent, setDrlContent] = useState('');
  const [isAnyNodeEditing, setIsAnyNodeEditing] = useState(false);

  const { rules, addRule, updateRule } = useRulesStore();
  const { screenToFlowPosition } = useReactFlow();

  // Handle node deletion
  useEffect(() => {
    const handleDeleteNode = (event: CustomEvent) => {
      const { nodeId } = event.detail;
      setNodes((nds) => nds.filter(node => node.id !== nodeId));
      setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
      console.log('Deleted node:', nodeId);
    };

    const handleNodeEditStart = () => {
      setIsAnyNodeEditing(true);
    };

    const handleNodeEditEnd = () => {
      setIsAnyNodeEditing(false);
    };

    window.addEventListener('deleteNode', handleDeleteNode as EventListener);
    window.addEventListener('nodeEditStart', handleNodeEditStart);
    window.addEventListener('nodeEditEnd', handleNodeEditEnd);
    return () => {
      window.removeEventListener('deleteNode', handleDeleteNode as EventListener);
      window.removeEventListener('nodeEditStart', handleNodeEditStart);
      window.removeEventListener('nodeEditEnd', handleNodeEditEnd);
    };
  }, [setNodes, setEdges]);

  // Drag and drop handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNodeId = `${type}-${Date.now()}`;
      let newNode: Node;

      switch (type) {
        case 'rule':
          newNode = {
            id: newNodeId,
            type: 'rule',
            position,
            data: {
              label: 'New Rule',
              name: 'New Rule',
              description: 'Enter rule description',
              priority: 1
            },
          };
          break;
        case 'condition':
          newNode = {
            id: newNodeId,
            type: 'condition',
            position,
            data: {
              label: 'New Condition',
              field: 'object.property',
              operator: '==',
              value: 'value'
            },
          };
          break;
        case 'action':
          newNode = {
            id: newNodeId,
            type: 'action',
            position,
            data: {
              label: 'New Action',
              type: 'setProperty',
              target: 'object.property',
              value: 'value'
            },
          };
          break;
        default:
          return;
      }

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );
  const onConnect = useCallback(
    (params: Connection) => {
      const edge = {
        ...params,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#CE85B8', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const createNewRule = useCallback(() => {
    // Clear the canvas
    setNodes([]);
    setEdges([]);

    // Add a new rule node in the center
    const newRuleNode: Node = {
      id: `rule-${Date.now()}`,
      type: 'rule',
      position: { x: 300, y: 100 },
      data: {
        label: 'New Rule',
        name: 'New Rule',
        description: 'Enter rule description',
        priority: 1
      },
    };

    setNodes([newRuleNode]);
    console.log('Created new rule workspace');
  }, [setNodes, setEdges]);
  const saveRule = useCallback(() => {
    const ruleNodes = nodes.filter(node => node.type === 'rule');
    const conditionNodes = nodes.filter(node => node.type === 'condition');
    const actionNodes = nodes.filter(node => node.type === 'action');

    const validation = validateRule(ruleNodes, conditionNodes, actionNodes, edges);
    setIsValid(validation.isValid);
    setValidationErrors(validation.errors);

    if (validation.isValid) {
      const rule = {
        id: Date.now().toString(),
        name: ruleNodes[0]?.data.name || 'Untitled Rule',
        description: ruleNodes[0]?.data.description || '',
        nodes: nodes,
        edges: edges,
        createdAt: new Date().toISOString(),
      };

      addRule(rule);
      saveToLocalStorage('drools-rules', [...rules, rule]);
      console.log('Rule saved successfully:', rule);
    } else {
      console.error('Validation errors:', validation.errors);
    }
  }, [nodes, edges, addRule, rules]);

  const executeRuleHandler = useCallback((inputData: any) => {
    const ruleNodes = nodes.filter(node => node.type === 'rule');
    const conditionNodes = nodes.filter(node => node.type === 'condition');
    const actionNodes = nodes.filter(node => node.type === 'action');

    console.log('Executing rule with nodes:', { ruleNodes, conditionNodes, actionNodes });
    console.log('Input data:', inputData);

    const result = executeRule(ruleNodes, conditionNodes, actionNodes, edges, inputData);
    setExecutionResult(result);
    setShowExecuteModal(false);
    setShowExecutionResult(true);

    console.log('Rule execution result:', result);
  }, [nodes, edges]);

  const viewDRL = useCallback(() => {
    const ruleNodes = nodes.filter(node => node.type === 'rule');
    const conditionNodes = nodes.filter(node => node.type === 'condition');
    const actionNodes = nodes.filter(node => node.type === 'action');

    const drl = generateDRL(ruleNodes, conditionNodes, actionNodes, edges);
    setDrlContent(drl);
    setShowDRL(true);

    console.log('Generated DRL:', drl);
  }, [nodes, edges]);

  useEffect(() => {
    const savedRules = loadFromLocalStorage('drools-rules');
    if (savedRules && Array.isArray(savedRules)) {
      savedRules.forEach(rule => addRule(rule));
    }
  }, [addRule]);

  return (
    <div className="h-screen flex glass-container">
      {/* Left Sidebar */}
      <div className="w-80 glass-panel border-r border-white/20 flex flex-col">
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#966FB1] to-[#5E39A4] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white">Policy Designer</h4>
              <p className="text-sm text-white/70">Visual Policy Builder</p>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <GlassButton variant="ghost"
              onClick={createNewRule}
              className="flex-1 glass-button text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Rule
            </GlassButton>
          </div>

          <div className="flex gap-2">
            <GlassButton variant="ghost"
              onClick={() => setShowTour(true)}
              className="glass-button text-white"
            >
              <Info className="w-4 h-4 mr-2" />
              Tour
            </GlassButton>
            <GlassButton variant="ghost"
              onClick={saveRule}
              className="flex-1 glass-button text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </GlassButton>
          </div>
        </div>

        <NodePalette />
        <RulesList onLoadRule={(rule) => {
          setNodes(rule.nodes);
          setEdges(rule.edges);
          console.log('Loaded rule:', rule.name);
        }} />
      </div>

      {/* Main Canvas */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-900/30 to-slate-800/30">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          fitViewOptions={{
            padding: 0.3,
            minZoom: 0.5,
            maxZoom: 1.5
          }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          minZoom={0.3}
          maxZoom={2}
          className="bg-transparent"
        >
          <Background
            color="#ffffff30"
            gap={20}
            size={1}
            variant="dots"
          />
          <Controls className="glass-controls" />
          <MiniMap
            className="glass-minimap"
            nodeColor="#CE85B8"
            maskColor="rgba(150, 111, 177, 0.1)"
          />
        </ReactFlow>

        {/* Validation Panel */}
        {!isValid && (
          <div className="absolute top-4 right-4 glass-rule-panel p-4 max-w-md border-2 border-red-400/50 bg-red-900/30 backdrop-blur-xl">
            <h3 className="text-red-200 font-semibold mb-2">Validation Errors</h3>
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-red-100">
                  • {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Bar */}
        <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${isAnyNodeEditing ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}>
          <div className="flex gap-4 glass-panel p-4 border-2 border-white/40 backdrop-blur-xl">
            <GlassButton variant="ghost"
              onClick={() => setShowExecuteModal(true)}
              disabled={!isValid}
              className="glass-button text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4 mr-2" />
              Execute Rule
            </GlassButton>
            <GlassButton variant="ghost"
              onClick={viewDRL}
              className="glass-button text-white hover:bg-white/20 transition-all duration-300"
            >
              <FileText className="w-4 h-4 mr-2" />
              View DRL
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTour && <Tour onClose={() => setShowTour(false)} />}
      {showDRL && (
        <DRLViewer
          drlContent={drlContent}
          onClose={() => setShowDRL(false)}
        />
      )}
      {showExecuteModal && (
        <ExecuteRuleModal
          onExecute={executeRuleHandler}
          onClose={() => setShowExecuteModal(false)}
        />
      )}
      {showExecutionResult && (
        <ExecutionResult
          result={executionResult}
          onClose={() => setShowExecutionResult(false)}
        />
      )}
    </div>
  );
}
