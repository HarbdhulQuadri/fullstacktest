import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { UserFormValues } from '../../features/users/types';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import PersonalInfoStep from './steps/PersonalInfoStep';
import ContactStep from './steps/ContactStep';
import AddressStep from './steps/AddressStep';
import AcademicsStep from './steps/AcademicsStep';
import ConfirmStep from './steps/ConfirmStep';

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
    defaultValues: {
      ...BASE_DEFAULTS,
      ...defaultValues,
      ...(persisted ? persisted.values : null),
    } as UserFormValues,
  });

  const [step, setStep] = useState(
    persisted ? Math.min(persisted.step, steps.length - 1) : 0,
  );
  const isLast = step === steps.length - 1;
  const progress = (step / (steps.length - 1)) * 100;

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
    async (data) => {
      await onSubmit(data);
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
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">
              Step {step + 1} of {steps.length}
            </span>
            <span className="text-slate-400">{steps[step]}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
          <div key={step} className="animate-fadeIn">
            {step === 0 && <PersonalInfoStep />}
            {step === 1 && <ContactStep />}
            {step === 2 && <AddressStep />}
            {step === 3 && <AcademicsStep />}
            {step === 4 && <ConfirmStep />}
          </div>

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={prev}
              disabled={step === 0}
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
                className="btn-primary bg-emerald-600 shadow-emerald-600/20 hover:bg-emerald-500"
              >
                <Check className="h-4 w-4" />
                {submitLabel}
              </button>
            )}
          </div>
        </form>
      </div>
    </FormProvider>
  );
}
