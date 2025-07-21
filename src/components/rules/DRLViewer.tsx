import React from 'react';
import { X, Copy, Download } from 'lucide-react';

interface DRLViewerProps {
  drlContent: string;
  onClose: () => void;
}

export default function DRLViewer({ drlContent, onClose }: DRLViewerProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(drlContent);
    console.log('DRL content copied to clipboard');
  };

  const downloadDRL = () => {
    const blob = new Blob([drlContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rule.drl';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('DRL file downloaded');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="modal-panel p-8 max-w-4xl w-full max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Generated DRL Code</h2>
          <div className="flex gap-3">
            <button
              onClick={copyToClipboard}
              className="p-3 glass-button text-white hover:bg-white/20 transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-5 h-5" />
            </button>
            <button
              onClick={downloadDRL}
              className="p-3 glass-button text-white hover:bg-white/20 transition-colors"
              title="Download DRL file"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-3 glass-button text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <pre className="bg-slate-900/70 border-2 border-white/30 rounded-xl p-6 text-green-300 font-mono text-sm overflow-auto backdrop-blur-sm">
            <code>{drlContent}</code>
          </pre>
        </div>

        <div className="mt-6 text-sm text-white/80 bg-white/10 rounded-lg p-4 border border-white/20">
          <p className="font-medium mb-2">📋 About this DRL Code:</p>
          <p>This DRL (Drools Rule Language) code represents your visual rule in Spring Boot Drools format. You can copy this code and use it directly in your Spring Boot application with Drools integration.</p>
        </div>
      </div>
    </div>
  );
}