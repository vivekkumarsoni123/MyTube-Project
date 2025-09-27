import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { endpoints } from "../lib/api";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";

export default function PlaylistDetails() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!playlistId) return;
    (async () => {
      try {
        const { data } = await endpoints.getPlaylistById(playlistId);
        setPlaylist(data?.data || data || null);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load playlist");
      } finally {
        setLoading(false);
      }
    })();
  }, [playlistId]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          {loading && <div className="text-neutral-400">Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}
          {playlist && (
            <>
              <h1 className="text-2xl font-bold mb-2">{playlist.name}</h1>
              <div className="text-neutral-400 mb-6">{playlist.description}</div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.isArray(playlist.videos) && playlist.videos.length > 0 ? (
                  playlist.videos.map((v) => (
                    <VideoCard key={v._id} video={v} />
                  ))
                ) : (
                  <div className="col-span-full text-neutral-400">No videos in this playlist yet.</div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


