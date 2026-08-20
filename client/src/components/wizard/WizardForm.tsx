import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import type { UserFormValues } from '../../features/users/types';
import { userFormSchema } from '../../features/users/schema';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import ContactStep from './steps/ContactStep';
import AddressStep from './steps/AddressStep';
import AcademicsStep from './steps/AcademicsStep';
import ConfirmStep from './steps/ConfirmStep';
import Stepper from './Stepper';
import Spinner from '../ui/Spinner';

const steps = ['Personal', 'Contact', 'Address', 'Education', 'Confirm'];

const stepFields: Array<Array<keyof UserFormValues>> = [
  ['userInfo'],
  ['userContact'],
  ['userAddress'],
  ['userAcademics'],
  [],
];

const BASE_DEFAULTS: UserFormValues = {
  userInfo: { firstName: '', lastName: '', dob: '', gender: '' },
  userContact: { email: '', phoneNumber: '' },
  userAddress: { address: '', city: '', state: '', country: '', zipCode: '' },
  userAcademics: [],
};

interface PersistedState {
  step: number;
  values: UserFormValues;
}

interface Props {
  defaultValues?: Partial<UserFormValues>;
  submitLabel: string;
  /** When provided, the wizard persists its state to sessionStorage under this key. */
  storageKey?: string;
  onSubmit: (data: UserFormValues) => void | Promise<void>;
}

function readPersisted(key: string): PersistedState | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!parsed || typeof parsed !== 'object' || !parsed.values) return null;
    return parsed;
  } catch {
    return null;
  }
}

export default function WizardForm({
  defaultValues,
  submitLabel,
  storageKey,
  onSubmit,
}: Props) {
  const persisted = storageKey ? readPersisted(storageKey) : null;

  const methods = useForm<UserFormValues>({
    mode: 'onTouched',
    shouldFocusError: false,
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      ...BASE_DEFAULTS,
      ...defaultValues,
      ...(persisted ? persisted.values : null),
    } as UserFormValues,
  });

  const {
    formState: { isSubmitting },
  } = methods;

  const [step, setStep] = useState(
    persisted ? Math.min(persisted.step, steps.length - 1) : 0,
  );
  const isLast = step === steps.length - 1;

  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    if (!storageKey) return;
    const subscription = methods.watch((values) => {
      const state: PersistedState = {
        step: stepRef.current,
        values: values as UserFormValues,
      };
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(state));
      } catch {
        /* storage may be unavailable; persistence is best-effort */
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, storageKey]);

  const persistStep = (next: number) => {
    setStep(next);
    if (!storageKey) return;
    const raw = sessionStorage.getItem(storageKey);
    const parsed = raw ? (JSON.parse(raw) as PersistedState) : { values: methods.getValues() };
    try {
      sessionStorage.setItem(
        storageKey,
        JSON.stringify({ step: next, values: parsed.values }),
      );
    } catch {
      /* ignore */
    }
  };

  const next = async () => {
    const fields = stepFields[step];
    const valid = fields.length ? await methods.trigger(fields) : true;
    if (valid) persistStep(Math.min(step + 1, steps.length - 1));
  };

  const prev = () => persistStep(Math.max(step - 1, 0));

  const goTo = async (i: number) => {
    if (i === step) return;
    
    // Always allow navigating backwards
    if (i < step) {
      persistStep(i);
      return;
    }
    
    // Validate current step before allowing forward navigation
    const fields = stepFields[step];
    const valid = fields.length ? await methods.trigger(fields) : true;
    if (valid) {
      persistStep(i);
    }
  };

  const onInvalid = (errors: Record<string, unknown>) => {
    // Surface the earliest invalid step so the user isn't stuck on Confirm
    // with an error hidden on a previous step.
    for (let i = 0; i < stepFields.length; i++) {
      if (stepFields[i].some((field) => errors[field])) {
        setStep(i);
        return;
      }
    }
  };

  const handleSubmit = methods.handleSubmit(
    async (data: unknown) => {
      await onSubmit(data as UserFormValues);
      if (storageKey) {
        try {
          sessionStorage.removeItem(storageKey);
        } catch {
          /* ignore */
        }
      }
    },
    onInvalid,
  );

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-3xl">
        <Stepper steps={steps} current={step} onStepClick={goTo} />

        <form onSubmit={handleSubmit} className="card relative overflow-hidden bg-white/80 p-6 shadow-xl backdrop-blur-xl sm:p-10">
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                {step === 0 && <PersonalInfoStep />}
                {step === 1 && <ContactStep />}
                {step === 2 && <AddressStep />}
                {step === 3 && <AcademicsStep />}
                {step === 4 && <ConfirmStep />}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0 || isSubmitting}
              className="btn-ghost disabled:opacity-0"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            {!isLast ? (
              <button type="button" onClick={next} className="btn-primary">
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex items-center gap-2 bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-500 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Saving…
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    {submitLabel}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
