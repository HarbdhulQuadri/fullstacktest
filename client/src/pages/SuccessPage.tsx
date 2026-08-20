import { Link } from 'react-router-dom';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-100">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
          Submission Successful
        </h1>
        <p className="text-slate-500 mb-8">
          Thank you for submitting your information. We have successfully received your record.
        </p>
        <Link to="/" className="btn-primary w-full justify-center">
          Submit Another
        </Link>
      </div>
    </div>
  );
}
