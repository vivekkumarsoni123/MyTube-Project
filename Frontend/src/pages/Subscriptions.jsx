import { useEffect, useState } from "react";
import { endpoints } from "../lib/api";
import VideoCard from "../components/VideoCard";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function Subscriptions() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError("Please login to view your subscriptions");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        // For now, we'll show all videos since we don't have a specific endpoint for subscription videos
        // In a real app, you'd have an endpoint like endpoints.getSubscriptionVideos()
        const { data } = await endpoints.getVideos({ page: 1, limit: 24 });
        const payload = data?.data ?? data ?? [];
        const list = Array.isArray(payload)
          ? payload
          : (payload?.docs ?? payload?.results ?? payload?.items ?? []);
        setVideos(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load subscription videos");
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
            <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
            <div className="text-center py-12">
              <div className="text-neutral-400 text-lg">Please login to view your subscriptions</div>
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
          <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>
          
          {loading && <div className="text-neutral-400">Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.isArray(videos) && videos.length > 0 && videos.map((v) => (
              <VideoCard key={v._id || v.id} video={v} />
            ))}
            {!loading && Array.isArray(videos) && videos.length === 0 && (
              <div className="col-span-full text-neutral-400 text-center py-12">
                <div className="text-lg">No subscription videos yet</div>
                <div className="text-sm mt-2">Subscribe to channels to see their latest videos here</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


