import React, { useState } from 'react';
import { X, Play, RotateCcw, Code, User, Settings } from 'lucide-react';

interface ExecuteRuleModalProps {
  onExecute: (inputData: any) => void;
  onClose: () => void;
}

const defaultInputData = {
  customer: {
    id: 1,
    name: "John Doe",
    age: 25,
    email: "john.doe@example.com",
    eligible: false,
    accountType: "premium",
    balance: 1500.50
  },
  order: {
    id: 101,
    amount: 299.99,
    items: 3,
    category: "electronics"
  },
  context: {
    timestamp: new Date().toISOString(),
    source: "web"
  }
};

const sampleTemplates = [
  {
    name: "Customer Profile",
    icon: User,
    data: {
      customer: {
        id: 1,
        name: "John Doe",
        age: 25,
        email: "john.doe@example.com",
        eligible: false,
        accountType: "premium",
        balance: 1500.50
      }
    }
  },
  {
    name: "Order Processing",
    icon: Settings,
    data: {
      order: {
        id: 101,
        amount: 299.99,
        items: 3,
        category: "electronics",
        priority: "normal"
      },
      customer: {
        id: 1,
        membershipLevel: "gold"
      }
    }
  },
  {
    name: "Complex Scenario",
    icon: Code,
    data: defaultInputData
  }
];

export default function ExecuteRuleModal({ onExecute, onClose }: ExecuteRuleModalProps) {
  const [inputData, setInputData] = useState(JSON.stringify(defaultInputData, null, 2));
  const [isValidJson, setIsValidJson] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const handleInputChange = (value: string) => {
    setInputData(value);
    try {
      JSON.parse(value);
      setIsValidJson(true);
    } catch {
      setIsValidJson(false);
    }
  };

  const handleExecute = () => {
    if (isValidJson) {
      try {
        const parsedData = JSON.parse(inputData);
        onExecute(parsedData);
      } catch (error) {
        console.error('Error parsing input data:', error);
      }
    }
  };

  const resetToDefault = () => {
    setInputData(JSON.stringify(defaultInputData, null, 2));
    setIsValidJson(true);
  };

  const loadTemplate = (templateData: any) => {
    setInputData(JSON.stringify(templateData, null, 2));
    setIsValidJson(true);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="modal-panel p-8 max-w-6xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#966FB1] to-[#5E39A4] flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Execute Rule</h2>
              <p className="text-white/70">Configure input data and execute your business rule</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 glass-button text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
          {/* Templates Panel */}
          <div className="glass-card p-6 border-2 border-white/30 flex flex-col">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Input Templates
            </h3>
            
            <div className="space-y-3 flex-1">
              {sampleTemplates.map((template, index) => {
                const Icon = template.icon;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedTemplate(index);
                      loadTemplate(template.data);
                    }}
                    className={`w-full p-4 glass-card hover:bg-white/20 transition-all duration-300 text-left ${
                      selectedTemplate === index ? 'ring-2 ring-white/50 bg-white/15' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#966FB1]/30 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-white text-sm">{template.name}</span>
                    </div>
                    <p className="text-white/60 text-xs">
                      {Object.keys(template.data).join(', ')} objects
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <button
                onClick={resetToDefault}
                className="w-full glass-button text-white hover:bg-white/20 transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </button>
            </div>
          </div>

          {/* Input Editor */}
          <div className="col-span-2 glass-card p-6 border-2 border-white/30 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Code className="w-5 h-5" />
                Input Data (JSON)
              </h3>
              <div className="flex items-center gap-2">
                {isValidJson ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 border border-green-400/40 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-300 text-sm font-medium">Valid JSON</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-400/40 rounded-lg">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-red-300 text-sm font-medium">Invalid JSON</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 relative">
              <textarea
                value={inputData}
                onChange={(e) => handleInputChange(e.target.value)}
                className={`w-full h-full p-4 glass-input text-white font-mono text-sm resize-none ${
                  !isValidJson ? 'border-red-400/50 bg-red-900/20' : ''
                }`}
                placeholder="Enter your input data as JSON..."
                style={{ minHeight: '400px' }}
              />
              
              {!isValidJson && (
                <div className="absolute bottom-2 left-2 right-2 p-2 bg-red-500/20 border border-red-400/40 rounded-lg">
                  <p className="text-red-300 text-xs">
                    ⚠️ Invalid JSON format. Please check your syntax.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
          <div className="text-sm text-white/70">
            <p className="mb-1">💡 <strong>Tips:</strong></p>
            <p>• Use the templates on the left for quick setup</p>
            <p>• Ensure your JSON structure matches your rule conditions</p>
            <p>• Check field names and data types carefully</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 glass-button text-white hover:bg-white/20 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleExecute}
              disabled={!isValidJson}
              className="px-8 py-3 glass-button text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#966FB1]/30 to-[#5E39A4]/30 border-2 border-[#CE85B8]/50"
            >
              <Play className="w-4 h-4 mr-2" />
              Execute Rule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}