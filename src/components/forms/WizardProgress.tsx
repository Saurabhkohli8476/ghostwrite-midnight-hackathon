'use client';

import { Check } from 'lucide-react';

interface WizardProgressProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: 'Context' },
  { id: 2, name: 'Draft & Notes' },
  { id: 3, name: 'Finalise' },
];

export default function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="mb-12 flex items-center justify-center gap-0">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isActive = currentStep === step.id;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-500"
                style={{
                  backgroundColor: isCompleted
                    ? 'var(--success)'
                    : isActive
                    ? 'var(--accent)'
                    : 'var(--surface-alt)',
                  color: isCompleted || isActive ? '#fff' : 'var(--ink-faint)',
                  border: '1px solid ' + (isCompleted ? 'var(--success)' : isActive ? 'var(--accent)' : 'var(--border)'),
                }}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : <span>{step.id}</span>}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap transition-colors duration-300"
                style={{
                  color: isActive ? 'var(--accent)' : isCompleted ? 'var(--ink-muted)' : 'var(--ink-faint)',
                }}
              >
                {step.name}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className="mx-3 h-px w-16 sm:w-24 transition-colors duration-500"
                style={{ backgroundColor: isCompleted ? 'var(--success)' : 'var(--border)' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
