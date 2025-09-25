import { useEffect, useState } from "react";
import { endpoints } from "../lib/api";
import VideoCard from "../components/VideoCard";

export default function Dashboard(){
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(()=>{
    (async()=>{
      try { const s = await endpoints.channelStats(); setStats(s?.data?.data || s?.data || null); } catch{}
      try { const v = await endpoints.channelVideos(); setVideos(v?.data?.data || v?.data || []); } catch{}
    })();
  },[]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Creator Dashboard</h1>
      {stats && (
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-neutral-900"><div className="text-sm text-neutral-400">Total Views</div><div className="text-2xl font-semibold">{stats?.totalViews ?? 0}</div></div>
          <div className="p-4 rounded-xl bg-neutral-900"><div className="text-sm text-neutral-400">Subscribers</div><div className="text-2xl font-semibold">{stats?.subscribers ?? 0}</div></div>
          <div className="p-4 rounded-xl bg-neutral-900"><div className="text-sm text-neutral-400">Videos</div><div className="text-2xl font-semibold">{stats?.videos ?? 0}</div></div>
        </div>
      )}
      <h2 className="font-semibold mb-3">Your Videos</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v)=> <VideoCard key={v._id||v.id} video={v} />)}
      </div>
    </div>
  );
}







