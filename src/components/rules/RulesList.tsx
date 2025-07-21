import React from 'react';
import { FileText, Clock, Trash2, Eye } from 'lucide-react';
import { useRulesStore } from '../../store/rulesStore';

interface RulesListProps {
  onLoadRule?: (rule: any) => void;
}

export default function RulesList({ onLoadRule }: RulesListProps) {
  const { rules, removeRule } = useRulesStore();

  const handleLoadRule = (rule: any) => {
    if (onLoadRule) {
      onLoadRule(rule);
    }
  };
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold text-white mb-4">Created Rules</h2>

      <div className="space-y-3">
        {rules.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/60 text-sm">No rules created yet</p>
            <p className="text-white/40 text-xs mt-1">Start by creating your first rule</p>
          </div>
        ) : (
          rules.map((rule) => (
            <div key={rule.id} className="glass-card p-4 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-white text-sm mb-1">{rule.name}</h3>
                  <p className="text-white/70 text-xs mb-2 line-clamp-2">
                    {rule.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-2 text-white/50 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(rule.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleLoadRule(rule)}
                    className="p-1 hover:bg-blue-500/20 rounded-lg transition-colors"
                    title="Load rule"
                  >
                    <Eye className="w-4 h-4 text-blue-400" />
                  </button>
                  <button
                    onClick={() => removeRule(rule.id)}
                    className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete rule"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex gap-2 text-xs">
                <span className="px-2 py-1 bg-[#966FB1]/30 rounded-full text-white/80">
                  {rule.nodes.filter(n => n.type === 'condition').length} conditions
                </span>
                <span className="px-2 py-1 bg-[#5E39A4]/30 rounded-full text-white/80">
                  {rule.nodes.filter(n => n.type === 'action').length} actions
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
