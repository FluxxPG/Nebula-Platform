import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Filter, Edit3, Trash2 } from 'lucide-react';

interface ConditionNodeProps {
  data: {
    label: string;
    field: string;
    operator: string;
    value: string;
  };
  selected: boolean;
  id: string;
}

const operators = ['==', '!=', '>', '<', '>=', '<=', 'contains', 'matches'];

export default function ConditionNode({ data, selected, id }: ConditionNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);

  const handleSave = () => {
    Object.assign(data, editData);
    setIsEditing(false);
    window.dispatchEvent(new CustomEvent('nodeEditEnd'));
  };

  const handleDelete = () => {
    const event = new CustomEvent('deleteNode', { detail: { nodeId: id } });
    window.dispatchEvent(event);
  };

  const handleEditStart = () => {
    setIsEditing(true);
    window.dispatchEvent(new CustomEvent('nodeEditStart'));
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditData(data);
    window.dispatchEvent(new CustomEvent('nodeEditEnd'));
  };

  return (
    <div className={`glass-node ${selected ? 'ring-2 ring-white/50' : ''}`}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-[#5E39A4] border-2 border-white"
      />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#5E39A4]/30 flex items-center justify-center">
          <Filter className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-sm">Condition</div>
          <div className="text-white/60 text-xs">When clause</div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleEditStart}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            title="Edit condition"
          >
            <Edit3 className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
            title="Delete condition"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-white/60">Field:</span>
          <span className="text-white font-mono">{data.field}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60">Operator:</span>
          <span className="text-white font-mono">{data.operator}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/60">Value:</span>
          <span className="text-white font-mono">{data.value}</span>
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#966FB1]/95 to-[#5E39A4]/95 backdrop-blur-xl border-3 border-white/60 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Condition</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Field
                </label>
                <input
                  type="text"
                  value={editData.field}
                  onChange={(e) => setEditData({ ...editData, field: e.target.value })}
                  className="w-full p-3 glass-input text-white placeholder-white/50"
                  placeholder="e.g., customer.age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Operator
                </label>
                <select
                  value={editData.operator}
                  onChange={(e) => setEditData({ ...editData, operator: e.target.value })}
                  className="w-full p-3 glass-input text-white"
                >
                  {operators.map(op => (
                    <option key={op} value={op} className="bg-[#966FB1] text-white">
                      {op}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Value
                </label>
                <input
                  type="text"
                  value={editData.value}
                  onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                  className="w-full p-3 glass-input text-white placeholder-white/50"
                  placeholder="e.g., 18"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditCancel}
                className="flex-1 px-6 py-3 bg-white/20 hover:bg-white/30 border-2 border-white/40 rounded-xl text-white font-medium transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-white/30 hover:bg-white/40 border-2 border-white/50 rounded-xl text-white font-medium transition-all duration-300"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}