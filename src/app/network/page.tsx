"use client";

import { useEffect, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  headline?: string;
};

type PendingConnection = {
  id: number; // Connection ID
  user: Profile; // The user associated with this connection
  isSender: boolean; // Indicates if current user is the sender
};

type ConnectedConnection = {
  id: number; // Connection ID
  user: Profile; // The connected user
};

export default function EnhancedSupabaseQueryPage() {
  const [connectedUsers, setConnectedUsers] = useState<ConnectedConnection[]>([]);
  const [pendingConnections, setPendingConnections] = useState<PendingConnection[]>([]);
  const [notConnectedUsers, setNotConnectedUsers] = useState<Profile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch authenticated user
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
          throw new Error("No authenticated user found.");
        }

        const userId = userData.user.id;

        // Fetch all profiles
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, headline");

        if (profilesError) throw profilesError;

        // Fetch connections involving the current user
        const { data: connectionsData, error: connectionsError } = await supabase
          .from("connections")
          .select("id, user_id_1, user_id_2, status")
          .or(`user_id_1.eq.${userId},user_id_2.eq.${userId}`);

        if (connectionsError) throw connectionsError;

        const connected: ConnectedConnection[] = [];
        const pending: PendingConnection[] = [];
        const connectedOrPendingIds = new Set<string>();

        // Process connections
        connectionsData?.forEach((connection) => {
          const { id, user_id_1, user_id_2, status } = connection;
          const otherUserId = user_id_1 === userId ? user_id_2 : user_id_1;
          connectedOrPendingIds.add(otherUserId);

          const otherUserProfile = profilesData?.find((profile) => profile.id === otherUserId);

          if (status === "accepted") {
            connected.push({
              id,
              user: otherUserProfile!,
            });
          } else if (status === "pending") {
            pending.push({
              id,
              user: otherUserProfile!,
              isSender: user_id_1 === userId,
            });
          }
        });

        // Determine Not Connected Users
        const notConnected =
          profilesData?.filter(
            (profile) => profile.id !== userId && !connectedOrPendingIds.has(profile.id)
          ) || [];

        // Update state
        setConnectedUsers(connected);
        setPendingConnections(pending);
        setNotConnectedUsers(notConnected);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "An unknown error occurred.");
      }
    };

    fetchData();
  }, [supabase]);

  // Handle connection requests
  const handleConnect = async (userId: string) => {
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        throw new Error("No authenticated user found.");
      }

      const currentUserId = userData.user.id;

      const { data, error } = await supabase
        .from("connections")
        .insert({
          user_id_1: currentUserId,
          user_id_2: userId,
          status: "pending",
        })
        .select();

      if (error) throw error;

      const newConnectionId = data[0].id;
      const connectedUser = notConnectedUsers.find((user) => user.id === userId);

      if (connectedUser) {
        setNotConnectedUsers((prev) => prev.filter((user) => user.id !== userId));
        setPendingConnections((prev) => [
          ...prev,
          { id: newConnectionId, user: connectedUser, isSender: true },
        ]);
      }
    } catch (err: any) {
      console.error("Error creating connection request:", err);
      setError(err.message || "An error occurred while sending the connection request.");
    }
  };

  const handleApprove = async (connectionId: number) => {
    try {
      const { error } = await supabase
        .from("connections")
        .update({ status: "accepted" })
        .eq("id", connectionId);

      if (error) throw error;

      const approvedConnection = pendingConnections.find((conn) => conn.id === connectionId);

      if (approvedConnection) {
        setPendingConnections((prev) => prev.filter((conn) => conn.id !== connectionId));
        setConnectedUsers((prev) => [...prev, { id: connectionId, user: approvedConnection.user }]);
      }
    } catch (err: any) {
      console.error("Error approving connection:", err);
      setError(err.message || "An error occurred while approving the connection.");
    }
  };

  const handleRejectOrCancel = async (connectionId: number) => {
    try {
      const { error } = await supabase
        .from("connections")
        .delete()
        .eq("id", connectionId);

      if (error) throw error;

      const removedConnection = pendingConnections.find((conn) => conn.id === connectionId);

      if (removedConnection) {
        setPendingConnections((prev) => prev.filter((conn) => conn.id !== connectionId));
        if (removedConnection.isSender) {
          setNotConnectedUsers((prev) => [...prev, removedConnection.user]);
        }
      }
    } catch (err: any) {
      console.error("Error rejecting or cancelling connection:", err);
      setError(err.message || "An error occurred while rejecting or cancelling the connection.");
    }
  };

  const handleRemove = async (connectionId: number) => {
    try {
      const { error } = await supabase
        .from("connections")
        .delete()
        .eq("id", connectionId);

      if (error) throw error;

      const removedConnection = connectedUsers.find((conn) => conn.id === connectionId);

      if (removedConnection) {
        setConnectedUsers((prev) => prev.filter((conn) => conn.id !== connectionId));
        setNotConnectedUsers((prev) => [...prev, removedConnection.user]);
      }
    } catch (err: any) {
      console.error("Error removing connection:", err);
      setError(err.message || "An error occurred while removing the connection.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Connections</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Connected Users */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Connected Users</h2>
        {connectedUsers.length > 0 ? (
          <ul className="list-disc pl-6">
            {connectedUsers.map((conn) => (
              <li key={conn.id} className="flex justify-between items-center">
                <div>
                  {conn.user.first_name} {conn.user.last_name}{" "}
                  {conn.user.headline && `- ${conn.user.headline}`}
                </div>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded-md"
                  onClick={() => handleRemove(conn.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No connected users.</p>
        )}
      </section>

      {/* Pending Connections */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pending Connections</h2>
        {pendingConnections.length > 0 ? (
          <ul className="list-disc pl-6">
            {pendingConnections.map((conn) => (
              <li key={conn.id} className="flex justify-between items-center">
                <div>
                  {conn.user.first_name} {conn.user.last_name}{" "}
                  {conn.user.headline && `- ${conn.user.headline}`}
                </div>
                {conn.isSender ? (
                  <button
                    className="px-3 py-1 bg-gray-500 text-white rounded-md"
                    onClick={() => handleRejectOrCancel(conn.id)}
                  >
                    Cancel Request
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      className="px-3 py-1 bg-green-500 text-white rounded-md"
                      onClick={() => handleApprove(conn.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md"
                      onClick={() => handleRejectOrCancel(conn.id)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending connections.</p>
        )}
      </section>

      {/* Not Connected Users */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Not Connected Users</h2>
        {notConnectedUsers.length > 0 ? (
          <ul className="list-disc pl-6">
            {notConnectedUsers.map((user) => (
              <li key={user.id} className="flex justify-between items-center">
                <div>
                  {user.first_name} {user.last_name} {user.headline && `- ${user.headline}`}
                </div>
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded-md"
                  onClick={() => handleConnect(user.id)}
                >
                  Connect
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No users to connect with.</p>
        )}
      </section>
    </div>
  );
}
