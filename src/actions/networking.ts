'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export async function fetchNetworkData() {
  const supabase = await createClient();

  // Get the current user
  const { data: getUser, error: getUserError } = await supabase.auth.getUser();
  if (getUserError) throw getUserError;

  const userId = getUser.user?.id;
  if (!userId) throw new Error('User not authenticated.');

  // Fetch the user's profile
  const { data: getUserProfile, error: getUserProfileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', userId);

  if (getUserProfileError) throw getUserProfileError;

  // Fetch connection requests
  const { data: connectionRequests, error: connectionRequestsError } = await supabase
    .from('connections')
    .select('*')
    .eq('status', 'pending')
    .eq('receiver_id', userId);

  if (connectionRequestsError) throw connectionRequestsError;

  // Fetch active connections
  const { data: activeConnections, error: activeConnectionsError } = await supabase
    .from('connections')
    .select('*')
    .eq('status', 'accepted')
    .or(`receiver_id.eq.${userId},sender_id.eq.${userId}`);

  if (activeConnectionsError) throw activeConnectionsError;

  // Revalidate network page cache
  revalidatePath('/network');

  return {
    userProfile: getUserProfile,
    connectionRequests,
    activeConnections,
  };
}
