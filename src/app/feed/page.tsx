import { Feed } from '@/components/feed/PostFeed'
import { createClient } from '@/lib/supabase/server'

export default async function FeedPage() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <main className='my-8 flex w-full flex-col gap-4 px-4 md:px-8'>
      <Feed user={session?.user} />
    </main>
  )
}
