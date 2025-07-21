import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { FileText, Edit3, Settings, Trash2 } from 'lucide-react';

interface RuleNodeProps {
  data: {
    label: string;
    name: string;
    description: string;
    priority: number;
  };
  selected: boolean;
  id: string;
}

export default function RuleNode({ data, selected, id }: RuleNodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(data);

  const handleSave = () => {
    Object.assign(data, editData);
    setIsEditing(false);
    window.dispatchEvent(new CustomEvent('nodeEditEnd'));
  };

  const handleDelete = () => {
    // Get the deleteElements function from React Flow context
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
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-[#966FB1] border-2 border-white"
      />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#966FB1]/30 flex items-center justify-center">
          <FileText className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-white text-sm">{data.name}</div>
          <div className="text-white/60 text-xs">Priority: {data.priority}</div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handleEditStart}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            title="Edit rule"
          >
            <Edit3 className="w-4 h-4 text-white/70" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
            title="Delete rule"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </button>
        </div>
      </div>

      <p className="text-white/80 text-xs mb-3 line-clamp-2">
        {data.description}
      </p>

      <div className="flex items-center gap-2 text-xs text-white/60">
        <Settings className="w-3 h-3" />
        <span>Rule Configuration</span>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#966FB1]/95 to-[#5E39A4]/95 backdrop-blur-xl border-3 border-white/60 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-4">Edit Rule</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full p-3 glass-input text-white placeholder-white/50"
                  placeholder="Enter rule name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Description
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full p-3 glass-input text-white placeholder-white/50 h-20 resize-none"
                  placeholder="Enter rule description"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Priority
                </label>
                <input
                  type="number"
                  value={editData.priority}
                  onChange={(e) => setEditData({ ...editData, priority: parseInt(e.target.value) })}
                  className="w-full p-3 glass-input text-white placeholder-white/50"
                  min="1"
                  max="100"
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