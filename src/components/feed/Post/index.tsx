/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { formatDistanceToNow } from 'date-fns'
import { Loader2, Play, Trash2, X } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

import type { PostWithUser } from '../PostFeed'

interface MediaModalProps {
  url: string
  type: 'image' | 'video'
  isOpen: boolean
  onClose: () => void
}

function MediaModal({ url, type, isOpen, onClose }: MediaModalProps) {
  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/80'
      onClick={onClose}
    >
      <button
        className='absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70'
        onClick={onClose}
      >
        <X className='h-6 w-6' />
      </button>
      <div className='max-h-[90vh] max-w-[90vw] overflow-auto' onClick={(e) => e.stopPropagation()}>
        {type === 'image' ? (
          <img
            src={url}
            alt=''
            className='h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain'
          />
        ) : (
          <video src={url} controls className='h-auto max-h-[90vh] w-auto max-w-[90vw]' />
        )}
      </div>
    </div>
  )
}

interface PostProps {
  post: PostWithUser
  currentUserId?: string | null
  onPostDeleted?: (postId: number) => void
}

export function Post({ post, currentUserId, onPostDeleted }: PostProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string
    type: 'image' | 'video'
  } | null>(null)
  const supabase = createClient()
  const { toast } = useToast()
  const isOwner = currentUserId === post.user_id

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return

    setIsDeleting(true)
    try {
      const { error } = await supabase.from('posts').delete().eq('id', post.id)

      if (error) throw error

      onPostDeleted?.(post.id)
      toast({
        title: 'Post deleted',
        description: 'Your post has been removed',
      })
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: 'Error deleting post',
        description: 'There was a problem deleting your post',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const renderMediaItem = (
    file: PostWithUser['post_media'][0],
    index: number,
    totalCount: number
  ) => {
    if (file.media_type === 'image') {
      return (
        <img
          src={file.media_url}
          alt=''
          className='h-full w-full object-cover transition-transform group-hover:scale-105'
        />
      )
    }

    return (
      <div className='relative h-full'>
        <video src={file.media_url} className='h-full w-full object-cover' />
        <div className='absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30'>
          <div className='rounded-full bg-black/50 p-3 transition-colors group-hover:bg-black/70'>
            <Play className='h-8 w-8 fill-white text-white' />
          </div>
        </div>
      </div>
    )
  }

  const renderMediaGrid = () => {
    const media = post.post_media.sort((a, b) => a.order_index - b.order_index)
    const count = media.length

    if (count === 0) return null

    if (count === 1) {
      return (
        <div className='mt-4'>
          <div
            className='group relative cursor-pointer overflow-hidden rounded-xl'
            onClick={() =>
              setSelectedMedia({
                url: media[0].media_url,
                type: media[0].media_type as 'image' | 'video',
              })
            }
          >
            <div className='relative h-[320px]'>{renderMediaItem(media[0], 0, count)}</div>
          </div>
        </div>
      )
    }

    return (
      <div className='mt-4'>
        {/* First image takes full width */}
        <div
          className='group relative mb-0.5 h-[320px] cursor-pointer overflow-hidden rounded-t-xl'
          onClick={() =>
            setSelectedMedia({
              url: media[0].media_url,
              type: media[0].media_type as 'image' | 'video',
            })
          }
        >
          {renderMediaItem(media[0], 0, count)}
        </div>

        {/* Remaining images in a single row */}
        {count > 1 && (
          <div className='flex h-40 gap-0.5 overflow-hidden rounded-b-xl bg-gray-100 dark:bg-gray-800'>
            {media.slice(1, 4).map((file, index) => {
              const isLastWithMore = count > 4 && index === 2

              return (
                <div
                  key={file.id}
                  className='group relative flex-1 cursor-pointer overflow-hidden'
                  onClick={() =>
                    setSelectedMedia({
                      url: file.media_url,
                      type: file.media_type as 'image' | 'video',
                    })
                  }
                >
                  {renderMediaItem(file, index + 1, count)}
                  {isLastWithMore && (
                    <div className='absolute inset-0 flex items-center justify-center bg-black/60 text-white'>
                      <span className='text-2xl font-bold'>+{count - 4}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <div className='rounded-lg border bg-card p-4 shadow'>
        <div className='flex items-center justify-between'>
          <Link href={`/ly/${post.profiles.vanity_url}`}>
            <div className='flex items-center gap-4'>
              <div className='h-12 w-12 overflow-hidden rounded-full'>
                <img
                  src={post.profiles.picture_url || '/api/placeholder/48/48'}
                  alt={`${post.profiles.first_name} ${post.profiles.last_name}`}
                  className='h-full w-full object-cover'
                />
              </div>
              <div>
                <div className='font-semibold'>
                  {`${post.profiles.first_name} ${post.profiles.last_name}`}
                </div>
                <div className='text-sm text-muted-foreground'>{post.profiles.headline}</div>
                <div className='text-sm text-muted-foreground'>
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
          </Link>
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className='flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-destructive/10'
            >
              {isDeleting ? (
                <Loader2 className='h-5 w-5 animate-spin' />
              ) : (
                <Trash2 className='h-5 w-5' />
              )}
            </button>
          )}
        </div>
        <p className='mt-4 whitespace-pre-wrap'>{post.content}</p>
        {renderMediaGrid()}
      </div>

      {selectedMedia && (
        <MediaModal
          url={selectedMedia.url}
          type={selectedMedia.type}
          isOpen={true}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  )
}
