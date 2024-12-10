import { Feed } from '@/components/feed/post-feed'
import { createClient } from '@/lib/supabase/server'

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <div className="container mx-auto max-w-2xl py-6">
      <Feed user={session?.user ?? null} />
    </div>
  )
}
