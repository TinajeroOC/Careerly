/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import { User } from '@supabase/supabase-js'
import { Image, Loader2, Video, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { Textarea } from '@/components/ui/Textarea'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

import type { PostWithUser } from '../PostFeed'

interface CreatePostProps {
  user: User
  onPostCreated: (post: PostWithUser) => void
}

export function CreatePost({ user, onPostCreated }: CreatePostProps) {
  const [content, setContent] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<
    Array<{
      url: string
      type: 'image' | 'video'
      orderIndex: number
    }>
  >([])

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  const { toast } = useToast()

  interface MediaFile {
    url: string
    type: 'image' | 'video'
    orderIndex: number
  }

  const handleFileUpload = async (files: FileList | null, type: 'image' | 'video') => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const uploadedFiles: MediaFile[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `${type}/${fileName}`

        // Upload to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw uploadError
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('post-media').getPublicUrl(filePath)

        if (!publicUrlData.publicUrl) {
          throw new Error('Failed to get public URL')
        }

        uploadedFiles.push({
          url: publicUrlData.publicUrl,
          type,
          orderIndex: mediaFiles.length + i,
        })
      }

      setMediaFiles((current) => [...current, ...uploadedFiles])
      toast({
        title: 'Files uploaded successfully',
        description: `${files.length} ${type}${files.length > 1 ? 's' : ''} added to your post`,
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      toast({
        title: 'Upload failed',
        description: 'There was a problem uploading your files. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const removeMedia = (index: number) => {
    setMediaFiles((current) => current.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (!content.trim() && mediaFiles.length === 0) return

    try {
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          content,
          user_id: user.id,
        })
        .select(
          `
          *,
          profiles!inner (*),
          post_media (*)
        `
        )
        .single()

      if (postError) throw postError

      if (mediaFiles.length > 0) {
        const mediaInserts = mediaFiles.map((file) => ({
          post_id: post.id,
          media_url: file.url,
          media_type: file.type,
          order_index: file.orderIndex,
        }))

        const { error: mediaError } = await supabase.from('post_media').insert(mediaInserts)

        if (mediaError) throw mediaError

        // Update the post object with the media files for immediate display
        post.post_media = mediaFiles.map((file, index) => ({
          id: index,
          post_id: post.id,
          media_url: file.url,
          media_type: file.type,
          order_index: file.orderIndex,
          created_at: new Date().toISOString(),
        }))
      }

      onPostCreated(post)
      setContent('')
      setMediaFiles([])

      toast({
        title: 'Post created successfully',
        description: 'Your post has been published to your feed',
      })
    } catch (error) {
      console.error('Error creating post:', error)
      toast({
        title: 'Error creating post',
        description: 'There was a problem creating your post. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='mb-6 rounded-lg border bg-card p-4 shadow'>
      <div className='flex gap-4'>
        <div className='h-10 w-10 overflow-hidden rounded-full'>
          <img
            src={user.user_metadata.picture_url || '/api/placeholder/40/40'}
            alt={user.user_metadata.full_name}
            className='h-full w-full object-cover'
          />
        </div>
        <Textarea
          placeholder='What do you want to talk about?'
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {mediaFiles.length > 0 && (
        <div className='mt-4 grid grid-cols-2 gap-2'>
          {mediaFiles.map((file, index) => (
            <div key={index} className='group relative aspect-video'>
              {file.type === 'image' ? (
                <img src={file.url} alt='' className='h-full w-full rounded object-cover' />
              ) : (
                <video src={file.url} className='h-full w-full rounded object-cover' controls />
              )}
              <button
                onClick={() => removeMedia(index)}
                className='absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className='mt-4 flex items-center justify-between'>
        <div className='flex gap-2'>
          <input
            type='file'
            ref={imageInputRef}
            className='hidden'
            accept='image/*'
            multiple
            onChange={(e) => handleFileUpload(e.target.files, 'image')}
          />
          <input
            type='file'
            ref={videoInputRef}
            className='hidden'
            accept='video/*'
            multiple
            onChange={(e) => handleFileUpload(e.target.files, 'video')}
          />
          <button
            className='flex h-10 items-center justify-center rounded-md px-3 text-foreground/60 hover:bg-accent hover:text-foreground disabled:opacity-50'
            disabled={isUploading}
            onClick={() => imageInputRef.current?.click()}
          >
            <Image className='h-5 w-5' />
          </button>
          <button
            className='flex h-10 items-center justify-center rounded-md px-3 text-foreground/60 hover:bg-accent hover:text-foreground disabled:opacity-50'
            disabled={isUploading}
            onClick={() => videoInputRef.current?.click()}
          >
            <Video className='h-5 w-5' />
          </button>
          {isUploading && <Loader2 className='h-5 w-5 animate-spin' />}
        </div>
        <button
          onClick={handleSubmit}
          disabled={(!content.trim() && mediaFiles.length === 0) || isUploading}
          className='rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50'
        >
          Post
        </button>
      </div>
    </div>
  )
}
