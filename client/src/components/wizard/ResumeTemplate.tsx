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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="section-title">{title}</h2>
      <div className="space-y-1.5">{children}</div>
    </section>
  );
}

export default function ResumeTemplate({ values }: { values: UserFormValues }) {
  const { userInfo, userContact, userAddress, userAcademics } = values;
  const initial = `${userInfo.firstName?.[0] ?? ''}${userInfo.lastName?.[0] ?? ''}`.toUpperCase();

  return (
    <div className="rounded-3xl bg-slate-50 p-2 sm:p-6">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
        <header className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 border-b border-slate-100 bg-slate-50/70 px-4 sm:px-8 py-6">
          {userInfo.profilePhoto ? (
            <img
              src={userInfo.profilePhoto}
              alt=""
              className="h-20 w-20 rounded-2xl object-cover ring-2 ring-indigo-100"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                e.currentTarget.nextElementSibling?.classList.add('flex');
              }}
            />
          ) : null}
          <div className={`h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-2xl font-semibold text-indigo-600 ${userInfo.profilePhoto ? 'hidden' : 'flex'}`}>
            {initial}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {userInfo.firstName} {userInfo.lastName}
            </h1>
            <p className="mt-0.5 font-medium text-indigo-600">{userInfo.occupation || '—'}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 p-4 sm:p-8 md:grid-cols-2">
          <Section title="Contact">
            <ContactRow label="Email" value={userContact.email} />
            <ContactRow label="Phone" value={userContact.phoneNumber} />
            <ContactRow label="Fax" value={userContact.fax} />
            <ContactRow label="LinkedIn" value={userContact.linkedInUrl} />
          </Section>

          <Section title="Address">
            <div className="space-y-1 text-sm text-slate-700">
              <p>{userAddress.address}</p>
              <p>
                {userAddress.city}, {userAddress.state} {userAddress.zipCode}
              </p>
              <p>{userAddress.country}</p>
            </div>
          </Section>

          <Section title="Personal">
            <ContactRow label="DOB" value={userInfo.dob} />
            <ContactRow label="Gender" value={userInfo.gender} />
          </Section>
        </div>

        <div className="border-t border-slate-100 px-4 sm:px-8 py-6">
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
    </div>
  );
}
