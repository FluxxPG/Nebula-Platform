import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import Joyride, { Step } from 'react-joyride';
import { useThemeColors } from '../../ui/hooks/useThemeColors';
import { spacing, borderRadius, shadows } from '../../ui/tokens/spacing';
import DroolsDesigner from '../../components/rules/DroolsDesigner';
import { ArrowLeft, Plus, Edit, Shield } from 'lucide-react';
import { PageLayout, GlassButton } from '../../ui';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start (Sample Condition)' },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    data: { label: 'Action: Approve' },
    position: { x: 100, y: 100 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
];

const tourSteps: Step[] = [
  {
    target: '.drools-rule-list',
    content: 'All your created rules will appear here. Click to load or delete them.',
  },
  {
    target: '.react-flow__renderer',
    content: 'Drag and connect nodes to create your rule logic.',
  },
  {
    target: '.save-rule-btn',
    content: 'Click here to validate and save your rule.',
  },
];

function getSavedRules() {
  const saved = localStorage.getItem('drools_rules');
  return saved ? JSON.parse(saved) : [];
}

function saveRules(rules: any[]) {
  localStorage.setItem('drools_rules', JSON.stringify(rules));
}

const DroolsDesignerPage: React.FC = () => {
  const colors = useThemeColors();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rules, setRules] = useState<any[]>(getSavedRules());
  const [ruleName, setRuleName] = useState('');
  const [tourRun, setTourRun] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRule, setSelectedRule] = useState<number | null>(null);

  useEffect(() => {
    saveRules(rules);
  }, [rules]);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const validateRule = () => {
    if (!ruleName.trim()) {
      setError('Rule name is required.');
      return false;
    }
    if (nodes.length < 2) {
      setError('At least two nodes are required to form a rule.');
      return false;
    }
    if (edges.length < 1) {
      setError('At least one connection is required.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSaveRule = () => {
    if (!validateRule()) return;
    const newRule = {
      name: ruleName,
      nodes,
      edges,
      created: new Date().toISOString(),
    };
    setRules([...rules, newRule]);
    setRuleName('');
    // Print to console
    console.log('Saved Rule:', newRule);
  };

  const handleRuleClick = (idx: number) => {
    const rule = rules[idx];
    setNodes(rule.nodes);
    setEdges(rule.edges);
    setRuleName(rule.name);
    setSelectedRule(idx);
  };

  const handleDeleteRule = (idx: number) => {
    const newRules = rules.filter((_, i) => i !== idx);
    setRules(newRules);
    setSelectedRule(null);
    setNodes(initialNodes);
    setEdges(initialEdges);
    setRuleName('');
  };
  const isEditMode = true;
  const onBack = () => {

  }
  return (
    <PageLayout
      title={`Rules Designer`}
      subtitle={`Rules Designer`}
      actions={
        <div style={{ display: 'flex', gap: spacing.md }}>
          <GlassButton variant="ghost" onClick={onBack}>
            <ArrowLeft size={16} style={{ marginRight: spacing.sm }} />
            Back
          </GlassButton>

          {isEditMode ? (
            <>
              <GlassButton
                variant="ghost"
                onClick={() => console.log('Add Form Widget')}
              >
                <Plus size={16} style={{ marginRight: spacing.sm }} />
                Add Form Widget
              </GlassButton>

              <GlassButton
                variant="primary"
                onClick={() => console.log('Cancel Editing')}
              >
                Cancel Editing
              </GlassButton>
            </>
          ) : (
            <GlassButton
              variant="primary"
              onClick={() => console.log('Design Page')}
            >
              <Edit size={16} style={{ marginRight: spacing.sm }} />
              Design Page
            </GlassButton>
          )}

          <GlassButton variant="accent">
            <Shield size={16} style={{ marginRight: spacing.sm }} />
            Security Actions
          </GlassButton>
        </div>
      }
    >

      <ReactFlowProvider>
        {/* Sidebar */}
        <DroolsDesigner />
      </ReactFlowProvider>
    </PageLayout>
  );
};

export default DroolsDesignerPage;
