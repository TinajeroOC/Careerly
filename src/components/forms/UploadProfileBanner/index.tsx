'use client'
import { Loader2Icon, Plus } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

interface UploadProfileBanner {
  userId: string
  url: string | null
  disabled?: boolean
}

export function UploadProfileBanner({ userId, url, disabled = false }: UploadProfileBanner) {
  const [uploading, setUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  async function uploadProfileBanner(event: React.ChangeEvent<HTMLInputElement>) {
    if (disabled) return

    try {
      setUploading(true)

      const target = event.target
      if (!target.files || target.files.length === 0)
        throw new Error('You must select an image to upload.')

      const file = target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `banner_${Math.random()}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      const supabase = createClient()

      const { data: getUser, error: getUserError } = await supabase.auth.getUser()

      if (getUserError) throw getUserError

      const { data: upload, error: uploadError } = await supabase.storage
        .from(process.env.NEXT_PUBLIC_MEDIA_BUCKET_NAME)
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: bannerUrl } = supabase.storage
        .from(process.env.NEXT_PUBLIC_MEDIA_BUCKET_NAME)
        .getPublicUrl(upload.path)

      const { error: updateProfileError } = await supabase
        .from('profiles')
        .update({ banner_url: bannerUrl.publicUrl })
        .eq('id', getUser.user?.id)

      if (updateProfileError) throw updateProfileError

      const { error: updateUserError } = await supabase.auth.updateUser({
        data: {
          banner_url: bannerUrl.publicUrl,
        },
      })

      if (updateUserError) throw updateUserError

      router.refresh()
    } catch (error) {
      console.error('Unable to upload profile banner: ', (error as Error).message)
      toast({
        title: 'Unable to upload profile banner',
        description: 'Contact us if this issue persists',
      })
    } finally {
      setUploading(false)
    }
  }

  const onClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  if (disabled) {
    return (
      <div>
        {url ? (
          <Image
            src={url}
            alt='Banner'
            width={1200}
            height={600}
            className='h-32 w-full rounded-t-lg md:h-60 object-cover'
          />
        ) : (
          <div className='grid h-32 w-full rounded-t-lg border-b bg-accent md:h-60' />
        )}
      </div>
    )
  }

  return (
    <div>
      {url ? (
        <Image
          src={url}
          alt='Banner'
          width={1200}
          height={600}
          className='h-32 w-full cursor-pointer rounded-t-lg md:h-60 object-cover'
          onClick={onClick}
        />
      ) : (
        <div
          className='grid h-32 w-full cursor-pointer place-items-center rounded-t-lg border-b transition-colors duration-150 hover:bg-secondary md:h-60'
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
        onChange={uploadProfileBanner}
        disabled={uploading}
      />
    </div>
  )
}
