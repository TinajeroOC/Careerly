import { z } from 'zod'

export const profileIntroSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  headline: z.string().max(120, { message: 'Headline must not exceed 120 characters' }),
})

export type ProfileIntroInput = z.infer<typeof profileIntroSchema>

export const profileContactInfoSchema = z.object({
  publicEmail: z.string().email(),
  publicPhoneNumber: z.string().max(50, { message: 'Phone number must not exceed 50 characters' }),
  publicWebsiteUrl: z.string().url(),
})

export type ProfileContactInfoInput = z.infer<typeof profileContactInfoSchema>

export const profileAboutSchema = z.object({
  about: z.string().max(2000, { message: 'About must not exceed 2000 characters' }),
})

export type ProfileAboutInput = z.infer<typeof profileAboutSchema>

export const profileExperienceSchema = z
  .object({
    companyName: z
      .string()
      .min(1)
      .max(120, { message: 'Company name must not exceed 120 characters' }),
    employmentType: z.enum([
      'Full-time',
      'Part-time',
      'Internship',
      'Contract',
      'Seasonal',
      'Freelance',
      'Self-employed',
    ]),
    location: z.string().min(1).max(120, { message: 'Location must not exceed 250 characters' }),
    locationType: z.enum(['On-site', 'Hybrid', 'Remote']),
    activeRole: z.boolean(),
    startDate: z.object({
      from: z.date(),
      to: z.date(),
    }),
    endDate: z.object({
      from: z.date(),
      to: z.date(),
    }),
    title: z.string().min(1).max(120, { message: 'Title must not exceed 120 characters' }),
    description: z.string().max(2000, { message: 'Description must not exceed 2000 characters' }),
  })
  .superRefine(({ startDate, endDate, activeRole }, context) => {
    if (startDate.to.toISOString() > new Date().toISOString()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['startDate'],
        message: 'Start date cannot be later than today',
      })
    }

    if (!activeRole && endDate.to.toISOString() < startDate.to.toISOString()) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['endDate'],
        message: 'End date cannot be earlier than start date',
      })
    }
  })

export type ProfileExperienceInput = z.infer<typeof profileExperienceSchema>

export const profilePictureSchema = z.object({
  profilePicture: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Profile picture must be a JPG or PNG file'
    ),
})

export type ProfilePictureInput = z.infer<typeof profilePictureSchema>

export const profileBannerSchema = z.object({
  profileBanner: z
    .instanceof(File)
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type),
      'Profile banner must be a JPG or PNG file'
    ),
})

export type ProfileBannerInput = z.infer<typeof profileBannerSchema>
