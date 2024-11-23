'use client'

import { Loader2Icon, Plus } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

interface UploadProfilePicture {
  userId: string
  url: string
  className?: string
}

export function UploadProfilePicture({ userId, url, className }: UploadProfilePicture) {
  const [uploading, setUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  async function uploadProfilePicture(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true)

      const target = event.target
      if (!target.files || target.files.length === 0)
        throw new Error('You must select an image to upload.')

      const file = target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `picture_${Math.random()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      const supabase = createClient()

      const { data: getUser, error: getUserError } = await supabase.auth.getUser()

      if (getUserError) throw getUserError

      const { data: upload, error: uploadError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_MEDIA_BUCKET_NAME)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: pictureUrl } = supabase.storage
        .from(process.env.NEXT_PUBLIC_MEDIA_BUCKET_NAME)
        .getPublicUrl(upload.path)

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ picture_url: pictureUrl.publicUrl })
        .eq('id', getUser.user?.id)

      if (updateProfileError) throw updateProfileError

      const { error: updateUserError } = await supabase.auth.updateUser({
        data: {
          picture_url: pictureUrl.publicUrl,
        },
      })

      if (updateUserError) throw updateUserError

      router.refresh()
    } catch (error) {
      console.error('Unable to upload profile picture: ', (error as Error).message)
      toast({
        title: 'Unable to upload profile picture',
        description: 'Contact us if this issue persists',
      })
    } finally {
      setUploading(false)
    }
  }

  const onClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      {url ? (
        <Image
          src={url}
          height={400}
          width={400}
          alt='Picture'
          className='h-28 w-28 cursor-pointer rounded-full border bg-background'
          onClick={onClick}
        />
      ) : (
        <div
          className='grid h-28 w-28 cursor-pointer place-items-center rounded-full border bg-background transition-colors duration-150 hover:bg-secondary'
          onClick={onClick}
        >
          {uploading ? <Loader2Icon className='animate-spin' /> : <Plus />}
        </div>
      )}
      <input
        ref={fileInputRef}
        type='file'
        id='single'
        accept='image/png, image/jpg, image/jpeg'
        className='hidden'
        onChange={uploadProfilePicture}
        disabled={uploading}
      />
    </div>
  )
}