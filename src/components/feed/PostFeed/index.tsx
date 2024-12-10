'use client'

import { User } from '@supabase/supabase-js'
import { useCallback, useEffect, useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { Database } from '@/types/supabase'

import { CreatePost } from '../CreatePost'
import { Post } from '../Post'

export type PostWithUser = Database['public']['Tables']['posts']['Row'] & {
  profiles: NonNullable<Database['public']['Tables']['profiles']['Row']>
  post_media: Database['public']['Tables']['post_media']['Row'][]
}

interface FeedProps {
  user?: User
}

export function Feed({ user }: FeedProps) {
  const [posts, setPosts] = useState<PostWithUser[]>([])
  const supabase = createClient()

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(
        `
      *,
      profiles!inner (*),
      post_media (*)
    `
      )
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      return
    }

    setPosts(data as PostWithUser[])
  }, [supabase]) // supabase as dependency

  useEffect(() => {
    fetchPosts()

    const channel = supabase
      .channel('posts_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
        },
        () => {
          fetchPosts()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchPosts, supabase])

  const addNewPost = (newPost: PostWithUser) => {
    setPosts((currentPosts) => [newPost, ...currentPosts])
  }

  const handlePostDelete = (postId: number) => {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== postId))
  }

  return (
    <div>
      {user && <CreatePost user={user} onPostCreated={addNewPost} />}
      <div className='space-y-4'>
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            currentUserId={user?.id}
            onPostDeleted={handlePostDelete}
          />
        ))}
      </div>
    </div>
  )
}
