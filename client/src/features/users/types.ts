export interface UserInfo {
  profilePhoto?: string | null;
  firstName: string;
  lastName: string;
  dob: string;
  occupation?: string | null;
  gender: string;
}

export interface UserContact {
  email: string;
  phoneNumber: string;
  fax?: string | null;
  linkedInUrl?: string | null;
}

export interface UserAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface UserAcademic {
  schoolName: string;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
}

/** Shape submitted to the backend (mirrors CreateUserDto). */
export interface UserFormValues {
  userInfo: UserInfo;
  userContact: UserContact;
  userAddress: UserAddress;
  userAcademics: UserAcademic[];
}

/** A persisted user returned by the API (relations include ids). */
export interface User {
  id: string;
  profilePhoto?: string | null;
  firstName: string;
  lastName: string;
  dob: string;
  occupation?: string | null;
  gender: string;
  contact: UserContact & { id: string };
  address: UserAddress & { id: string };
  academics: Array<UserAcademic & { id: string }>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

export type UserFormValuesPayload = UserFormValues;

/** Convert empty optional strings to null for optional backend fields. */
export function toApiPayload(values: UserFormValues): UserFormValuesPayload {
  const emptyToNull = (v: string | null | undefined) =>
    v === undefined || v === '' ? null : v;

  return {
    userInfo: {
      ...values.userInfo,
      profilePhoto: emptyToNull(values.userInfo.profilePhoto),
      occupation: emptyToNull(values.userInfo.occupation),
    },
    userContact: {
      ...values.userContact,
      fax: emptyToNull(values.userContact.fax),
      linkedInUrl: emptyToNull(values.userContact.linkedInUrl),
    },
    userAddress: { ...values.userAddress },
    userAcademics: values.userAcademics.map((a) => ({
      schoolName: a.schoolName,
      degree: emptyToNull(a.degree),
      fieldOfStudy: emptyToNull(a.fieldOfStudy),
      startDate: emptyToNull(a.startDate),
      endDate: emptyToNull(a.endDate),
      description: emptyToNull(a.description),
    })),
  };
}

export function userToFormValues(user: User): UserFormValues {
  return {
    userInfo: {
      profilePhoto: user.profilePhoto ?? '',
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      occupation: user.occupation ?? '',
      gender: user.gender,
    },
    userContact: {
      email: user.contact.email,
      phoneNumber: user.contact.phoneNumber,
      fax: user.contact.fax ?? '',
      linkedInUrl: user.contact.linkedInUrl ?? '',
    },
    userAddress: {
      address: user.address.address,
      city: user.address.city,
      state: user.address.state,
      country: user.address.country,
      zipCode: user.address.zipCode,
    },
    userAcademics: user.academics.map((a) => ({
      schoolName: a.schoolName,
      degree: a.degree ?? '',
      fieldOfStudy: a.fieldOfStudy ?? '',
      startDate: a.startDate ?? '',
      endDate: a.endDate ?? '',
      description: a.description ?? '',
    })),
  };
}
