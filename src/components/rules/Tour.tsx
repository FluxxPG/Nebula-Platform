import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const tourSteps = [
  {
    title: 'Welcome to Drools Designer',
    content: 'This is a visual rule builder that helps you create business rules using drag-and-drop components.',
    highlight: 'none'
  },
  {
    title: 'Node Palette',
    content: 'Drag nodes from here to the canvas. Rules contain conditions and actions.',
    highlight: 'palette'
  },
  {
    title: 'Canvas Area',
    content: 'Drop nodes here and connect them to build your rules. Use the controls to zoom and navigate.',
    highlight: 'canvas'
  },
  {
    title: 'Rules List',
    content: 'View all your created rules here. Each rule shows its conditions and actions count.',
    highlight: 'rules'
  },
  {
    title: 'Save & Execute',
    content: 'Save your rules to localStorage and execute them. Validation ensures your rules are correct.',
    highlight: 'actions'
  }
];

interface TourProps {
  onClose: () => void;
}

export default function Tour({ onClose }: TourProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="modal-panel p-8 max-w-lg w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            Step {currentStep + 1} of {tourSteps.length}
          </h2>
          <button
            onClick={onClose}
            className="p-2 glass-button text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">
            {tourSteps[currentStep].title}
          </h3>
          <p className="text-white/90 leading-relaxed text-lg">
            {tourSteps[currentStep].content}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 glass-button text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-3">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-white scale-125' : 'bg-white/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 glass-button text-white hover:bg-white/20 transition-all duration-300"
          >
            {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}