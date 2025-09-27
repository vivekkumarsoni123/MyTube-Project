import { useEffect, useState } from "react";
import { endpoints } from "../lib/api";
import VideoCard from "../components/VideoCard";
import Sidebar from "../components/Sidebar";

export default function Liked() {
  const [videos, setVideos] = useState([]);
  useEffect(() => { (async()=>{ const { data } = await endpoints.likedVideos(); setVideos(data?.data || data || []); })(); }, []);
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-4 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Liked Videos</h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((v)=> <VideoCard key={v._id||v.id} video={v} />)}
          </div>
        </div>
      </div>
    </div>
  );
}












