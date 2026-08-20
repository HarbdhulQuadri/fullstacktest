import type { UserFormValues } from '../../features/users/types';

function ContactRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-16 shrink-0 text-slate-400">{label}</span>
      <span className="text-slate-700">{value}</span>
    </div>
  );
}

export default function ResumeTemplate({ values }: { values: UserFormValues }) {
  const { userInfo, userContact, userAddress, userAcademics } = values;
  const initial = `${userInfo.firstName?.[0] ?? ''}${userInfo.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="card overflow-hidden">
      <header className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 px-8 py-7 text-white">
        <div className="flex items-center gap-5">
          {userInfo.profilePhoto ? (
            <img
              src={userInfo.profilePhoto}
              alt=""
              className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/30"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-2xl font-semibold ring-4 ring-white/30">
              {initial}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {userInfo.firstName} {userInfo.lastName}
            </h1>
            <p className="mt-0.5 text-indigo-100">{userInfo.occupation || '—'}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2">
        <section>
          <h2 className="section-title">Contact</h2>
          <div className="space-y-1.5">
            <ContactRow label="Email" value={userContact.email} />
            <ContactRow label="Phone" value={userContact.phoneNumber} />
            <ContactRow label="Fax" value={userContact.fax} />
            <ContactRow label="LinkedIn" value={userContact.linkedInUrl} />
          </div>
        </section>

        <section>
          <h2 className="section-title">Address</h2>
          <div className="space-y-1 text-sm text-slate-700">
            <p>{userAddress.address}</p>
            <p>
              {userAddress.city}, {userAddress.state} {userAddress.zipCode}
            </p>
            <p>{userAddress.country}</p>
          </div>
        </section>

        <section>
          <h2 className="section-title">Personal</h2>
          <div className="space-y-1.5">
            <ContactRow label="DOB" value={userInfo.dob} />
            <ContactRow label="Gender" value={userInfo.gender} />
          </div>
        </section>
      </div>

      <div className="border-t border-slate-100 px-8 py-6">
        <h2 className="section-title">Education</h2>
        {userAcademics.length === 0 ? (
          <p className="text-sm text-slate-400">No education records.</p>
        ) : (
          <ul className="space-y-4">
            {userAcademics.map((a, i) => (
              <li key={i} className="relative border-l-2 border-indigo-200 pl-4">
                <span className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-indigo-500" />
                <p className="font-medium text-slate-900">{a.schoolName}</p>
                <p className="text-sm text-slate-500">
                  {[a.degree, a.fieldOfStudy].filter(Boolean).join(' · ')}
                </p>
                {(a.startDate || a.endDate) && (
                  <p className="text-xs text-slate-400">
                    {a.startDate || '?'} — {a.endDate || 'Present'}
                  </p>
                )}
                {a.description && (
                  <p className="mt-1 text-sm text-slate-600">{a.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
