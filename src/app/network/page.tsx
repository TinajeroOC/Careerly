"use client"; // Add this directive at the top

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/server'


// import { fetchNetworkData } from '@/src/actions/networking'; // Adjust the path as needed


// use effect to make the api call


type ConnectionRequest = {
  id: string;
  name: string;
};

type ActiveConnection = {
  id: string;
  name: string;
};

const mockConnectionRequests: ConnectionRequest[] = [
  { id: '1', name: 'Alice Johnson' },
  { id: '2', name: 'Bob Smith' },
];

const mockActiveConnections: ActiveConnection[] = [
  { id: '3', name: 'Charlie Brown' },
  { id: '4', name: 'Diana Prince' },
];


// // databse calls -- not working yet
// const supabase = await createClient()

// const { data: getUser, error: getUserError } = await supabase.auth.getUser()

// if (getUserError) throw getUserError

// const { data: getUserProfile, error: getUserProfileError } = await supabase
//   .from('profiles')
//   .select()
//   .eq('id', getUser.user?.id)

// if (getUserProfileError) throw getUserProfileError

// main page 
export default function NetworkPage() {
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [activeConnections, setActiveConnections] = useState<ActiveConnection[]>([]);

  useEffect(() => {
    // Simulate API calls
    setConnectionRequests(mockConnectionRequests);
    setActiveConnections(mockActiveConnections);
  }, []);

  const approveRequest = (id: string) => {
    const approvedRequest = connectionRequests.find((request) => request.id === id);
    if (approvedRequest) {
      setActiveConnections([...activeConnections, approvedRequest]);
      setConnectionRequests(connectionRequests.filter((request) => request.id !== id));
    }
  };

  const ignoreRequest = (id: string) => {
    setConnectionRequests(connectionRequests.filter((request) => request.id !== id));
  };

  const approveAllRequests = () => {
    setActiveConnections([...activeConnections, ...connectionRequests]);
    setConnectionRequests([]);
  };

  const ignoreAllRequests = () => {
    setConnectionRequests([]);
  }

  return (
    <div className="my-8 flex w-full flex-col px-4 md:px-8">
      <main className="w-full">
        <h1 className="text-xl font-bold mb-6">Careerly</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Connection Requests Section */}
          <section className="p-4 border rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Connection Requests</h2>
            {connectionRequests.length > 0 ? (
              <>
                <ul className="space-y-2">
                  {connectionRequests.map((request) => (
                    <li
                      key={request.id}
                      className="flex items-center justify-between p-2 border rounded-md"
                    >
                      <span>{request.name}</span>
                      <div className="space-x-2">
                        <button
                          className="px-3 py-1 bg-blue-500 text-white rounded-md"
                          onClick={() => approveRequest(request.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-3 py-1 bg-gray-500 text-white rounded-md"
                          onClick={() => ignoreRequest(request.id)}
                        >
                          Ignore
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="flex space-x-2 mt-4">
                  <button
                    className="flex-1 py-2 bg-green-500 text-white rounded-md"
                    onClick={approveAllRequests}
                  >
                    Approve All
                  </button>
                  <button
                    className="flex-1 py-2 bg-red-500 text-white rounded-md"
                    onClick={ignoreAllRequests}
                  >
                    Ignore All
                  </button>
                </div>

              </>
            ) : (
              <p>No connection requests.</p>
            )}
          </section>


          {/* Active Connections Section */}
          <section className="p-4 border rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Active Connections</h2>
            {activeConnections.length > 0 ? (
              <ul className="space-y-2">
                {activeConnections.map((connection) => (
                  <li
                    key={connection.id}
                    className="p-2 border rounded-md"
                  >
                    {connection.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No active connections.</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
