import React from 'react';
import { X, CheckCircle, XCircle, Clock, Activity } from 'lucide-react';

interface ExecutionResultProps {
  result: {
    success: boolean;
    executionTime: number;
    inputData: any;
    outputData: any;
    rulesExecuted: number;
    logs: string[];
  };
  onClose: () => void;
}

export default function ExecutionResult({ result, onClose }: ExecutionResultProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="modal-panel p-8 max-w-4xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-white">Rule Execution Result</h2>
            {result.success ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/40 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-green-300 font-medium">SUCCESS</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/40 rounded-lg">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-300 font-medium">FAILED</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-3 glass-button text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Execution Summary */}
          <div className="glass-card p-6 border-2 border-white/30">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-6 h-6 text-white" />
              <h3 className="text-xl font-semibold text-white">Execution Summary</h3>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{result.rulesExecuted}</div>
                <div className="text-white/70 text-sm">Rules Executed</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold text-white flex items-center justify-center gap-2 mb-1">
                  <Clock className="w-6 h-6" />
                  {result.executionTime}ms
                </div>
                <div className="text-white/70 text-sm">Execution Time</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                <div className={`text-3xl font-bold mb-1 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {result.success ? '✓' : '✗'}
                </div>
                <div className="text-white/70 text-sm">Status</div>
              </div>
            </div>
          </div>

          {/* Data Comparison */}
          <div className="grid grid-cols-2 gap-6">
            {/* Input Data */}
            <div className="glass-card p-6 border-2 border-blue-400/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                Input Data
              </h3>
              <pre className="bg-slate-900/70 border border-white/20 rounded-lg p-4 text-blue-300 font-mono text-sm overflow-auto max-h-48">
                <code>{JSON.stringify(result.inputData, null, 2)}</code>
              </pre>
            </div>

            {/* Output Data */}
            <div className="glass-card p-6 border-2 border-green-400/30">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                Output Data
              </h3>
              <pre className="bg-slate-900/70 border border-white/20 rounded-lg p-4 text-green-300 font-mono text-sm overflow-auto max-h-48">
                <code>{JSON.stringify(result.outputData, null, 2)}</code>
              </pre>
            </div>
          </div>

          {/* Execution Logs */}
          <div className="glass-card p-6 border-2 border-yellow-400/30">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
              Execution Logs
            </h3>
            <div className="bg-slate-900/70 border border-white/20 rounded-lg p-4 max-h-48 overflow-auto">
              {result.logs.map((log, index) => (
                <div key={index} className="text-yellow-300 font-mono text-sm mb-2 flex items-start gap-2">
                  <span className="text-white/50 text-xs mt-0.5">[{String(index + 1).padStart(2, '0')}]</span>
                  <span className="flex-1">{log}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-sm text-white/80 bg-white/10 rounded-lg p-4 border border-white/20">
          <p className="font-medium mb-2">🚀 Execution Complete!</p>
          <p>Your rule has been executed with the sample data. Check the logs above for detailed step-by-step execution information and compare the input vs output data to see the changes made by your rule.</p>
        </div>
      </div>
    </div>
  );
}