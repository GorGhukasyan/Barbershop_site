'use client';

const STEPS = [1, 2, 3, 4, 5] as const;

export function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((step) => (
        <div key={step} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              step === currentStep
                ? 'bg-gold text-dark'
                : step < currentStep
                  ? 'bg-gold/20 text-gold'
                  : 'bg-dark-3 text-cream-dim'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < 5 && (
            <div className={`w-8 h-px ${step < currentStep ? 'bg-gold/40' : 'bg-dark-4'}`} />
          )}
        </div>
      ))}
    </div>
  );
}
