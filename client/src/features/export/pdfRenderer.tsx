import type { User } from '../users/types';
import { userToFormValues } from '../users/types';
import { Document, Page, View, Text, Image, StyleSheet, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

const INDIGO = '#4f46e5';
const SLATE_900 = '#0f172a';
const SLATE_700 = '#334155';
const SLATE_500 = '#64748b';
const SLATE_400 = '#94a3b8';
const BORDER = '#f1f5f9';

const styles = StyleSheet.create({
  page: { backgroundColor: '#f8fafc', fontFamily: 'Helvetica', padding: 24 },
  sheet: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', overflow: 'hidden' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    padding: 28,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: '#f8fafc',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    color: INDIGO,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 26,
    fontWeight: 'bold',
  },
  avatarImg: { width: 72, height: 72, borderRadius: 16, objectFit: 'cover' },
  name: { fontSize: 22, fontWeight: 'bold', color: SLATE_900 },
  occupation: { fontSize: 12, color: INDIGO, marginTop: 2 },
  grid: { flexDirection: 'row', padding: 32, gap: 28 },
  col: { flex: 1 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: SLATE_400,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  row: { flexDirection: 'row', gap: 8, fontSize: 11, marginBottom: 5 },
  rowLabel: { width: 64, color: SLATE_400 },
  rowValue: { flex: 1, color: SLATE_700 },
  addressText: { color: SLATE_700, fontSize: 11, marginBottom: 3 },
  education: { borderTopWidth: 1, borderTopColor: BORDER, padding: 28 },
  eduItem: { borderLeftWidth: 2, borderLeftColor: '#c7d2fe', paddingLeft: 12, marginBottom: 12 },
  eduSchool: { fontSize: 12, fontWeight: 'bold', color: SLATE_900 },
  eduDetail: { fontSize: 10, color: SLATE_500 },
  eduDates: { fontSize: 9, color: SLATE_400 },
  eduDesc: { fontSize: 10, color: SLATE_700, marginTop: 2 },
  muted: { fontSize: 11, color: SLATE_400 },
});

function SectionTitle({ children }: { children: string }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function ResumePdf({ user }: { user: User }) {
  const v = userToFormValues(user);
  const initial = `${v.userInfo.firstName?.[0] ?? ''}${v.userInfo.lastName?.[0] ?? ''}`.toUpperCase();
  const hasPhoto = !!v.userInfo.profilePhoto;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            {hasPhoto ? (
              <Image style={styles.avatarImg} src={v.userInfo.profilePhoto!} />
            ) : (
              <View style={styles.avatar}>
                <Text>{initial}</Text>
              </View>
            )}
            <View>
              <Text style={styles.name}>
                {v.userInfo.firstName} {v.userInfo.lastName}
              </Text>
              <Text style={styles.occupation}>{v.userInfo.occupation || '—'}</Text>
            </View>
          </View>

          <View style={styles.grid}>
            <View style={styles.col}>
              <SectionTitle>Contact</SectionTitle>
              <Row label="Email" value={v.userContact.email} />
              <Row label="Phone" value={v.userContact.phoneNumber} />
              <Row label="Fax" value={v.userContact.fax} />
              <Row label="LinkedIn" value={v.userContact.linkedInUrl} />
            </View>

            <View style={styles.col}>
              <SectionTitle>Address</SectionTitle>
              <View style={{ marginBottom: 16, flexDirection: 'column' }}>
                <Text style={styles.addressText}>{v.userAddress.address}</Text>
                <Text style={styles.addressText}>
                  {v.userAddress.city}, {v.userAddress.state} {v.userAddress.zipCode}
                </Text>
                <Text style={styles.addressText}>{v.userAddress.country}</Text>
              </View>

              <SectionTitle>Personal</SectionTitle>
              <Row label="DOB" value={v.userInfo.dob} />
              <Row label="Gender" value={v.userInfo.gender} />
            </View>
          </View>

          <View style={styles.education}>
            <SectionTitle>Education</SectionTitle>
            {v.userAcademics.length === 0 ? (
              <Text style={styles.muted}>No education records.</Text>
            ) : (
              v.userAcademics.map((a, i) => (
                <View key={i} style={styles.eduItem} wrap={false}>
                  <Text style={styles.eduSchool}>{a.schoolName}</Text>
                  <Text style={styles.eduDetail}>
                    {[a.degree, a.fieldOfStudy].filter(Boolean).join(' · ')}
                  </Text>
                  {(a.startDate || a.endDate) && (
                    <Text style={styles.eduDates}>
                      {a.startDate || '?'} — {a.endDate || 'Present'}
                    </Text>
                  )}
                  {a.description && <Text style={styles.eduDesc}>{a.description}</Text>}
                </View>
              ))
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function exportUserPdf(user: User): Promise<void> {
  const blob = await pdf(<ResumePdf user={user} />).toBlob();
  const v = userToFormValues(user);
  const safe = `${v.userInfo.firstName}-${v.userInfo.lastName}`.replace(/\s+/g, '');
  saveAs(blob, `resume-${safe}.pdf`);
}
