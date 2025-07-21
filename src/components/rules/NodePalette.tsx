import React from 'react';
import { FileText, Filter, Zap } from 'lucide-react';

const nodeTypes = [
  {
    type: 'rule',
    label: 'Rule',
    icon: FileText,
    color: '#966FB1',
    description: 'Main rule container'
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: Filter,
    color: '#5E39A4',
    description: 'Rule condition/when clause'
  },
  {
    type: 'action',
    label: 'Action',
    icon: Zap,
    color: '#CE85B8',
    description: 'Rule action/then clause'
  },
];

export default function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="p-6 border-b border-white/20">
      <h2 className="text-lg font-semibold text-white mb-4">Node Palette</h2>
      <p className="text-sm text-white/60 mb-4">Drag nodes to the canvas to build your rule</p>

      <div className="space-y-3">
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <div
              key={nodeType.type}
              className="glass-rule-card p-3 cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all duration-300 border-2 border-white/20 hover:border-white/40"
              draggable
              onDragStart={(event) => onDragStart(event, nodeType.type)}
              title={`Drag to add ${nodeType.label}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${nodeType.color}40` }}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-medium text-white text-sm">{nodeType.label}</div>
                  <div className="text-white/60 text-xs">{nodeType.description}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
        <p className="text-xs text-white/70">
          💡 <strong>Tip:</strong> Drag nodes from here to the canvas, then connect them to build your business rules.
        </p>
      </div>
    </div>
  );
}
