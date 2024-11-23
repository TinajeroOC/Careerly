import { z } from 'zod'

export const personalInformationSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
})

export type PersonalInformationInput = z.infer<typeof personalInformationSchema>

export const profileSchema = z.object({
  headline: z.string().max(120, { message: 'Headline must not exceed 120 characters' }),
  about: z.string().max(2000, { message: 'About must not exceed 2000 characters' }),
})

export type ProfileInput = z.infer<typeof profileSchema>

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
