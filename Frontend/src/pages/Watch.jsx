import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { endpoints } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import VideoCard from "../components/VideoCard";
import SaveToPlaylistModal from "../components/SaveToPlaylistModal";

export default function Watch() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upNext, setUpNext] = useState([]);
  const { user } = useAuth();
  const [showSave, setShowSave] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const videoUrl = useMemo(() => video?.videoFile || video?.url || video?.videoUrl || "", [video]);

  async function loadAll() {
    try {
      const [vRes, cRes] = await Promise.all([
        endpoints.getVideoById(id),
        endpoints.getVideoComments(id),
      ]);
      const videoData = vRes?.data?.data || vRes?.data || null;
      setVideo(videoData);
      setComments(cRes?.data?.data || cRes?.data || []);
      
      // Check subscription status if user is logged in and not the video owner
      if (user && videoData?.owner?._id && user?.username !== videoData?.owner?.username) {
        try {
          const { data: subData } = await endpoints.checkSubscriptionStatus(videoData.owner._id);
          setIsSubscribed(subData?.data?.isSubscribed || false);
        } catch {}
      }
      
      try {
        const upRes = await endpoints.getVideos({ page: 1, limit: 20 });
        const payload = upRes?.data?.data ?? upRes?.data ?? [];
        const list = Array.isArray(payload) ? payload : (payload?.docs ?? []);
        setUpNext((Array.isArray(list) ? list : []).filter((v)=> (v._id||v.id) !== id));
      } catch {}
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load video");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { setLoading(true); loadAll(); }, [id]);
  useEffect(() => {
    let counted = false;
    const onPlay = async () => {
      if (counted) return;
      counted = true;
      try { await endpoints.addView(id); } catch {}
    };
    // Attempt to count when component mounts as a fallback (e.g., autoplay)
    const timer = setTimeout(onPlay, 1200);
    return () => { clearTimeout(timer); };
  }, [id]);

  async function handleLike() {
    try { await endpoints.toggleVideoLike(id); await loadAll(); } catch(_){}
  }

  async function handlePublishToggle() {
    try { await endpoints.togglePublish(id); await loadAll(); } catch(_){}
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    try { await endpoints.addComment(id, newComment.trim()); setNewComment(""); await loadAll(); } catch(_){}
  }

  function openSave() { setShowSave(true); }
  function closeSave(saved, msg) { setShowSave(false); if (msg) alert(msg); }

  async function handleSubscribe() {
    try {
      const channelId = video?.owner?._id || video?.owner?.id;
      if (!channelId) return;
      await endpoints.toggleSubscription(channelId);
      // Refresh subscription status
      const { data } = await endpoints.checkSubscriptionStatus(channelId);
      setIsSubscribed(data?.data?.isSubscribed || false);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update subscription");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          {videoUrl ? (
            <video src={videoUrl} controls className="w-full h-full" />
          ) : (
            <div className="w-full h-full grid place-items-center text-neutral-500">No video</div>
          )}
        </div>
        <h1 className="mt-3 text-xl font-semibold">{video?.title || "Untitled"}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-neutral-400">
          <span>{video?.views ?? 0} views</span>
          <button onClick={handleLike} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700">Like</button>
          <button onClick={openSave} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700">Save</button>
          {!user || user?.username !== video?.owner?.username ? (
            <button 
              onClick={handleSubscribe} 
              className={`px-3 py-1.5 rounded-lg text-sm ${
                isSubscribed 
                  ? 'bg-red-600 hover:bg-red-500 text-white' 
                  : 'bg-neutral-800 hover:bg-neutral-700'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          ) : null}
          <button onClick={handlePublishToggle} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700">Toggle publish</button>
        </div>
        <p className="mt-4 text-neutral-300 whitespace-pre-wrap">{video?.description}</p>

        <section className="mt-8">
          <h2 className="font-semibold mb-3">Comments</h2>
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input value={newComment} onChange={(e)=>setNewComment(e.target.value)} placeholder="Add a comment" className="flex-1 px-3 py-2 rounded-lg bg-neutral-800" />
            <button className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500">Comment</button>
          </form>
          <ul className="mt-4 space-y-3">
            {comments.map((c)=> (
              <li key={c._id} className="p-3 rounded-lg bg-neutral-900">
                <div className="text-sm text-neutral-400">{c.owner?.username || "User"}</div>
                <div>{c.content}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <SaveToPlaylistModal open={showSave} onClose={closeSave} videoId={id} />
      <div className="lg:col-span-1">
        <h3 className="font-semibold mb-3">Up next</h3>
        <div className="space-y-4">
          {Array.isArray(upNext) && upNext.map((v)=> (
            <VideoCard key={v._id||v.id} video={v} />
          ))}
        </div>
      </div>
      {loading && <div className="col-span-full text-neutral-400">Loading...</div>}
      {error && <div className="col-span-full text-red-400">{error}</div>}
    </div>
  );
}




