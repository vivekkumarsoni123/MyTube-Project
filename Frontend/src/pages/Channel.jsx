import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { endpoints } from "../lib/api";
import VideoCard from "../components/VideoCard";
import { useAuth } from "../context/AuthContext";

export default function Channel() {
  const { username } = useParams();
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [liked, setLiked] = useState([]);
  const [history, setHistory] = useState([]);
  const [active, setActive] = useState("videos");
  const [showSubs, setShowSubs] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const isOwnChannel = useMemo(() => {
    const name = channel?.username || username;
    return !!user && user?.username === name;
  }, [user, channel, username]);

  async function handleSubscribe() {
    try {
      if (!channel?._id) return;
      await endpoints.toggleSubscription(channel._id);
      // Refresh subscription status
      const { data } = await endpoints.checkSubscriptionStatus(channel._id);
      setIsSubscribed(data?.data?.isSubscribed || false);
      // Refresh channel data for subscriber count
      const { data: channelData } = await endpoints.channelProfile(username);
      setChannel(channelData?.data || channelData || channel);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to update subscription");
    }
  }

  async function openSubscribers() {
    try {
      if (!channel?._id) return;
      const { data } = await endpoints.getChannelSubscribers(channel._id);
      const list = data?.data || data || [];
      setSubscribers(Array.isArray(list) ? list : []);
      setShowSubs(true);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load subscribers");
    }
  }

  async function handlePlaylistClick(playlist) {
    try {
      setLoading(true);
      setSelectedPlaylist(playlist);
      const { data } = await endpoints.getPlaylistById(playlist._id);
      const playlistData = data?.data || data || null;
      setPlaylistVideos(playlistData?.videos || []);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to load playlist videos");
    } finally {
      setLoading(false);
    }
  }

  function handleBackToPlaylists() {
    setSelectedPlaylist(null);
    setPlaylistVideos([]);
  }

  async function handleDeleteVideo(video) {
    console.log("Delete button clicked for video:", video);
    if (!confirm(`Are you sure you want to delete "${video.title}"?`)) return;
    
    const videoId = video._id || video.id;
    if (!videoId) {
      alert("Video ID not found");
      return;
    }
    
    try {
      console.log("Attempting to delete video with ID:", videoId);
      await endpoints.deleteVideo(videoId);
      console.log("Video deleted successfully");
      // Refresh videos list
      if (channel?._id) {
        const vidsRes = await endpoints.getVideos({ userId: channel._id });
        const payload = vidsRes?.data?.data ?? vidsRes?.data ?? [];
        const list = Array.isArray(payload) ? payload : (payload?.docs ?? []);
        setVideos(Array.isArray(list) ? list : []);
      }
      alert("Video deleted successfully");
    } catch (e) {
      console.error("Delete video error:", e);
      alert(e?.response?.data?.message || "Failed to delete video");
    }
  }

  function handleEditVideo(video) {
    console.log("Edit button clicked for video:", video);
    // For now, we'll use a simple prompt-based approach
    // Later this can be replaced with a proper modal
    const newTitle = prompt("Enter new title:", video.title);
    if (!newTitle || newTitle === video.title) return;
    
    const newDescription = prompt("Enter new description:", video.description || "");
    
    const videoId = video._id || video.id;
    if (!videoId) {
      alert("Video ID not found");
      return;
    }
    
    // Update video
    updateVideoDetails(videoId, { title: newTitle, description: newDescription });
  }

  async function updateVideoDetails(videoId, updates) {
    try {
      console.log("Updating video with ID:", videoId, "Updates:", updates);
      await endpoints.updateVideo(videoId, updates);
      console.log("Video updated successfully");
      // Refresh videos list
      if (channel?._id) {
        const vidsRes = await endpoints.getVideos({ userId: channel._id });
        const payload = vidsRes?.data?.data ?? vidsRes?.data ?? [];
        const list = Array.isArray(payload) ? payload : (payload?.docs ?? []);
        setVideos(Array.isArray(list) ? list : []);
      }
      alert("Video updated successfully");
    } catch (e) {
      console.error("Update video error:", e);
      alert(e?.response?.data?.message || "Failed to update video");
    }
  }

  useEffect(() => {
    (async()=>{
      setLoading(true); setError("");
      try {
        const { data } = await endpoints.channelProfile(username);
        const profile = data?.data || data || null;
        setChannel(profile);
        
        // Check subscription status if user is logged in and not viewing own channel
        if (user && profile?._id && !isOwnChannel) {
          try {
            const { data: subData } = await endpoints.checkSubscriptionStatus(profile._id);
            setIsSubscribed(subData?.data?.isSubscribed || false);
          } catch {}
        }
        
        try {
          const vidsRes = await endpoints.getVideos({ userId: profile?._id });
          const payload = vidsRes?.data?.data ?? vidsRes?.data ?? [];
          const list = Array.isArray(payload) ? payload : (payload?.docs ?? []);
          setVideos(Array.isArray(list) ? list : []);
        } catch {}
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load channel");
      } finally {
        setLoading(false);
      }
    })();
  }, [username, user, isOwnChannel]);

  useEffect(() => {
    (async() => {
      if (!channel?._id) return;
      if (active === "playlists") {
        setLoading(true); setError("");
        try {
          const { data } = await endpoints.getUserPlaylists(channel._id);
          const list = data?.data || data || [];
          setPlaylists(Array.isArray(list) ? list : []);
        } catch (e) {
          setError(e?.response?.data?.message || "Failed to load playlists");
        } finally { setLoading(false); }
      }
      if (active === "liked" && isOwnChannel) {
        setLoading(true); setError("");
        try {
          const { data } = await endpoints.likedVideos();
          const list = data?.data || data || [];
          setLiked(Array.isArray(list) ? list : []);
        } catch (e) {
          setError(e?.response?.data?.message || "Failed to load liked videos");
        } finally { setLoading(false); }
      }
      if (active === "history" && isOwnChannel) {
        setLoading(true); setError("");
        try {
          const { data } = await endpoints.watchHistory();
          const list = data?.data || data || [];
          setHistory(Array.isArray(list) ? list : []);
        } catch (e) {
          setError(e?.response?.data?.message || "Failed to load history");
        } finally { setLoading(false); }
      }
    })();
  }, [active, channel, isOwnChannel]);

  async function handleSave(video) {
    try {
      // Simple prompt-based flow: choose existing or create new
      const action = window.prompt("Type existing to save to an existing playlist, or new to create a playlist:", "existing");
      if (!action) return;
      if (action.toLowerCase() === "new") {
        const name = window.prompt("Playlist name:");
        if (!name) return;
        const description = window.prompt("Description (optional):") || "";
        await endpoints.createPlaylist({ name, description });
        // refetch playlists quickly
        const { data } = await endpoints.getUserPlaylists(channel._id);
        const list = data?.data || data || [];
        setPlaylists(Array.isArray(list) ? list : []);
        const target = (Array.isArray(list) ? list : []).find(p => p.name === name);
        if (target?._id) {
          await endpoints.addVideoToPlaylist(video._id || video.id, target._id);
          alert("Saved to new playlist.");
        }
      } else {
        // existing flow
        if (!Array.isArray(playlists) || playlists.length === 0) {
          alert("No playlists found. Create a new one first.");
          return;
        }
        const options = playlists.map((p, i) => `${i+1}. ${p.name}`).join("\n");
        const pick = window.prompt(`Pick playlist number:\n${options}`);
        const idx = Number(pick) - 1;
        const chosen = playlists[idx];
        if (!chosen?._id) return;
        await endpoints.addVideoToPlaylist(video._id || video.id, chosen._id);
        alert("Saved to playlist.");
      }
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to save to playlist");
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="h-40 rounded-xl bg-neutral-900 mb-4 overflow-hidden">
        {channel?.coverImage && (
          <img src={channel?.coverImage?.url||channel?.coverImage} alt="cover" className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-neutral-800 overflow-hidden">
          {channel?.avatar && <img src={channel?.avatar?.url||channel?.avatar} alt="avatar" className="w-full h-full object-cover" />}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{channel?.username||username}</h1>
          <div className="text-sm text-neutral-400">
            <button onClick={openSubscribers} className="hover:underline">
              {channel?.subscribersCount ?? 0} subscribers
            </button>
          </div>
        </div>
        <div className="flex-1" />
        {!isOwnChannel ? (
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
        ) : (
          <a href="/upload" className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-sm">Upload</a>
        )}
      </div>
      <div className="mt-6 border-b border-neutral-800 flex gap-1 text-sm overflow-x-auto">
        <button onClick={()=>setActive("videos")} className={`px-4 py-2 rounded-t-lg ${active==="videos"?"bg-neutral-900 text-white":"text-neutral-400 hover:text-neutral-200"}`}>Videos</button>
        <button onClick={()=>setActive("playlists")} className={`px-4 py-2 rounded-t-lg ${active==="playlists"?"bg-neutral-900 text-white":"text-neutral-400 hover:text-neutral-200"}`}>Playlists</button>
        {isOwnChannel && (
          <>
            <button onClick={()=>setActive("liked")} className={`px-4 py-2 rounded-t-lg ${active==="liked"?"bg-neutral-900 text-white":"text-neutral-400 hover:text-neutral-200"}`}>Liked</button>
            <button onClick={()=>setActive("history")} className={`px-4 py-2 rounded-t-lg ${active==="history"?"bg-neutral-900 text-white":"text-neutral-400 hover:text-neutral-200"}`}>History</button>
          </>
        )}
      </div>

      {error && <div className="mt-4 text-red-400 text-sm">{error}</div>}

      {active === "videos" && (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(videos) && videos.map((v)=> (
            <VideoCard 
              key={v._id||v.id} 
              video={v} 
              showActions 
              onSave={handleSave}
              onDelete={handleDeleteVideo}
              onEdit={handleEditVideo}
            />
          ))}
          {!loading && Array.isArray(videos) && videos.length===0 && (
            <div className="col-span-full text-neutral-400">No videos yet.</div>
          )}
        </div>
      )}

      {active === "playlists" && (
        <>
          {selectedPlaylist ? (
            <div className="mt-4">
              <div className="flex items-center gap-4 mb-4">
                <button 
                  onClick={handleBackToPlaylists}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm"
                >
                  ← Back to Playlists
                </button>
                <div>
                  <h2 className="text-xl font-semibold">{selectedPlaylist.name}</h2>
                  <p className="text-sm text-neutral-400">{selectedPlaylist.description}</p>
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(playlistVideos) && playlistVideos.map((v) => (
                  <VideoCard 
                    key={v._id||v.id} 
                    video={v} 
                    showActions 
                    onSave={handleSave}
                    onDelete={handleDeleteVideo}
                    onEdit={handleEditVideo}
                  />
                ))}
                {!loading && Array.isArray(playlistVideos) && playlistVideos.length===0 && (
                  <div className="col-span-full text-neutral-400">No videos in this playlist yet.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.isArray(playlists) && playlists.map((p) => (
                <div 
                  key={p._id} 
                  className="p-4 rounded-xl bg-neutral-900 cursor-pointer hover:bg-neutral-800 transition-colors"
                  onClick={() => handlePlaylistClick(p)}
                >
                  <div className="font-semibold line-clamp-1">{p.name}</div>
                  <div className="text-sm text-neutral-400 line-clamp-2">{p.description}</div>
                  <div className="text-xs text-neutral-500 mt-1">{p.videos?.length||0} videos</div>
                </div>
              ))}
              {!loading && Array.isArray(playlists) && playlists.length===0 && (
                <div className="col-span-full text-neutral-400">No playlists yet.</div>
              )}
            </div>
          )}
        </>
      )}

      {active === "liked" && isOwnChannel && (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(liked) && liked.map((v)=> (
            <VideoCard 
              key={v._id||v.id} 
              video={v} 
              showActions 
              onSave={handleSave}
              onDelete={handleDeleteVideo}
              onEdit={handleEditVideo}
            />
          ))}
          {!loading && Array.isArray(liked) && liked.length===0 && (
            <div className="col-span-full text-neutral-400">No liked videos yet.</div>
          )}
        </div>
      )}

      {active === "history" && isOwnChannel && (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(history) && history.map((v)=> <VideoCard key={v._id||v.id} video={v} />)}
          {!loading && Array.isArray(history) && history.length===0 && (
            <div className="col-span-full text-neutral-400">No history yet.</div>
          )}
        </div>
      )}

      {loading && <div className="mt-4 text-neutral-400">Loading...</div>}

      {showSubs && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
          <div className="w-full max-w-md rounded-xl bg-neutral-900 p-5">
            <div className="text-lg font-semibold mb-3">Subscribers</div>
            <div className="max-h-80 overflow-auto divide-y divide-neutral-800">
              {subscribers.map((s) => (
                <div key={s._id||s.id} className="py-3 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full overflow-hidden bg-neutral-800">
                    {s.avatar && <img src={s.avatar?.url||s.avatar} alt={s.username} className="w-full h-full object-cover" />}
                  </div>
                  <div className="text-sm">{s.username}</div>
                </div>
              ))}
              {subscribers.length === 0 && <div className="text-sm text-neutral-400 py-4">No subscribers yet.</div>}
            </div>
            <div className="flex justify-end mt-4">
              <button onClick={()=>setShowSubs(false)} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


