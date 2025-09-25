import { useEffect, useState } from "react";
import { endpoints } from "../lib/api";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Library() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError("Please login to view your library");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await endpoints.getUserPlaylists(user._id);
        const list = data?.data || data || [];
        setPlaylists(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load playlists");
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Library</h1>
            <div className="text-center py-12">
              <div className="text-neutral-400 text-lg">Please login to view your library</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Library</h1>
          
          {loading && <div className="text-neutral-400">Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.isArray(playlists) && playlists.length > 0 && playlists.map((playlist) => (
              <Link
                key={playlist._id}
                to={`/playlist/${playlist._id}`}
                className="block p-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 transition-colors"
              >
                <div className="font-semibold line-clamp-1 mb-2">{playlist.name}</div>
                <div className="text-sm text-neutral-400 line-clamp-2 mb-2">{playlist.description}</div>
                <div className="text-xs text-neutral-500">{playlist.videos?.length || 0} videos</div>
              </Link>
            ))}
            {!loading && Array.isArray(playlists) && playlists.length === 0 && (
              <div className="col-span-full text-neutral-400 text-center py-12">
                <div className="text-lg">No playlists yet</div>
                <div className="text-sm mt-2">Create playlists to organize your favorite videos</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


