import { useEffect, useState } from "react";
import { endpoints } from "../lib/api";
import VideoCard from "../components/VideoCard";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await endpoints.getVideos({ page: 1, limit: 24 });
        const payload = data?.data ?? data ?? [];
        const list = Array.isArray(payload)
          ? payload
          : (payload?.docs ?? payload?.results ?? payload?.items ?? []);
        setVideos(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load videos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {loading && <div className="text-neutral-400">Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.isArray(videos) && videos.length > 0 && videos.map((v) => (
              <VideoCard key={v._id || v.id} video={v} />
            ))}
            {!loading && Array.isArray(videos) && videos.length === 0 && (
              <div className="col-span-full text-neutral-400">No videos yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


