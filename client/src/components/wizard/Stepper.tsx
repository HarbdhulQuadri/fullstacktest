import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface StepperProps {
  steps: string[];
  current: number;
  /** Fired when any step indicator is clicked. */
  onStepClick?: (index: number) => void;
}

export default function Stepper({ steps, current, onStepClick }: StepperProps) {
  const progress = steps.length > 1 ? (current / (steps.length - 1)) * 100 : 0;

  return (
    <div className="mb-8">
      <div className="relative flex items-center justify-between">
        {/* track */}
        <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-200" />
        {/* animated fill */}
        <motion.div
          className="absolute left-0 top-4 h-0.5 bg-emerald-500"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />

        {steps.map((label, i) => {
          const completed = i < current;
          const active = i === current;
          const clickable = !!onStepClick;

          return (
            <div key={label} className="relative z-10 flex flex-col items-center gap-2">
              <motion.button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onStepClick!(i)}
                whileTap={clickable ? { scale: 0.9 } : undefined}
                className={[
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                  completed
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : active
                      ? 'border-indigo-600 bg-white text-indigo-600 ring-4 ring-indigo-100'
                      : 'border-slate-300 bg-white text-slate-400',
                  clickable ? 'cursor-pointer' : 'cursor-default',
                ].join(' ')}
                aria-current={active ? 'step' : undefined}
              >
                {completed ? <Check className="h-4 w-4" /> : i + 1}
              </motion.button>
              <span
                className={[
                  'text-xs font-medium',
                  completed
                    ? 'text-emerald-600'
                    : active
                      ? 'text-indigo-600'
                      : 'text-slate-400',
                ].join(' ')}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
