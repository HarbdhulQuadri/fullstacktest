import { z } from 'zod';

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const userInfoSchema = z.object({
  profilePhoto: z.string().url('Must be a valid URL').optional().or(z.literal('')).nullable(),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(100, 'First name is too long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(100, 'Last name is too long'),
  dob: z.string().regex(dateRegex, 'Date of birth must be YYYY-MM-DD').refine((date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime()) && d < new Date();
  }, 'Must be a valid past date'),
  occupation: z.string().max(100, 'Occupation is too long').optional().or(z.literal('')).nullable(),
  gender: z.string().min(1, 'Please select a gender').max(20, 'Gender is too long'),
});

export const userContactSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Must be a valid international phone number (e.g. +1234567890)'),
  fax: z.string().max(30).optional().or(z.literal('')).nullable(),
  linkedInUrl: z.string().url('Must be a valid LinkedIn URL').optional().or(z.literal('')).nullable(),
});

export const userAddressSchema = z.object({
  address: z.string().min(5, 'Address is too short').max(255, 'Address is too long'),
  city: z.string().min(2, 'City is required').max(100, 'City is too long'),
  state: z.string().min(2, 'State is required').max(100, 'State is too long'),
  country: z.string().min(2, 'Country is required').max(100, 'Country is too long'),
  zipCode: z.string().min(2, 'Zip Code is required').max(20, 'Zip Code is too long'),
});

export const userAcademicSchema = z.object({
  schoolName: z.string().min(2, 'School name is required').max(255, 'School name is too long'),
  degree: z.string().max(150, 'Degree is too long').optional().or(z.literal('')).nullable(),
  fieldOfStudy: z.string().max(150, 'Field of study is too long').optional().or(z.literal('')).nullable(),
  startDate: z.string().regex(dateRegex, 'Must be YYYY-MM-DD').optional().or(z.literal('')).nullable(),
  endDate: z.string().regex(dateRegex, 'Must be YYYY-MM-DD').optional().or(z.literal('')).nullable(),
  description: z.string().max(1000, 'Description is too long').optional().or(z.literal('')).nullable(),
}).refine(data => {
  if (data.startDate && data.endDate) {
    return new Date(data.startDate) <= new Date(data.endDate);
  }
  return true;
}, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const userFormSchema = z.object({
  userInfo: userInfoSchema,
  userContact: userContactSchema,
  userAddress: userAddressSchema,
  userAcademics: z.array(userAcademicSchema),
});

export type UserFormSchemaType = z.infer<typeof userFormSchema>;
