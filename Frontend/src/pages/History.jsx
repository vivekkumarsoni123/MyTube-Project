import { useEffect, useState } from "react";
import { endpoints } from "../lib/api";
import VideoCard from "../components/VideoCard";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setError("Please login to view your watch history");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await endpoints.watchHistory();
        const list = data?.data || data || [];
        setHistory(Array.isArray(list) ? list : []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load watch history");
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
            <h1 className="text-2xl font-bold mb-6">Watch History</h1>
            <div className="text-center py-12">
              <div className="text-neutral-400 text-lg">Please login to view your watch history</div>
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
          <h1 className="text-2xl font-bold mb-6">Watch History</h1>
          
          {loading && <div className="text-neutral-400">Loading...</div>}
          {error && <div className="text-red-400">{error}</div>}
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.isArray(history) && history.length > 0 && history.map((v) => (
              <VideoCard key={v._id || v.id} video={v} />
            ))}
            {!loading && Array.isArray(history) && history.length === 0 && (
              <div className="col-span-full text-neutral-400 text-center py-12">
                <div className="text-lg">No watch history yet</div>
                <div className="text-sm mt-2">Videos you watch will appear here</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}