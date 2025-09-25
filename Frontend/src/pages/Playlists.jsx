import { useEffect, useState } from "react";
import { endpoints } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Playlists() {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  async function load() {
    if (!user) return;
    const { data } = await endpoints.getUserPlaylists(user._id);
    setPlaylists(data?.data || data || []);
  }

  useEffect(() => { load(); }, [user]);

  async function create(e){
    e.preventDefault();
    await endpoints.createPlaylist({ name, description: desc });
    setName(""); setDesc("");
    await load();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Playlists</h1>
      <form onSubmit={create} className="flex gap-2 mb-6">
        <input className="px-3 py-2 rounded-lg bg-neutral-800" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} required />
        <input className="px-3 py-2 rounded-lg bg-neutral-800 flex-1" placeholder="Description" value={desc} onChange={(e)=>setDesc(e.target.value)} />
        <button className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500">Create</button>
      </form>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {playlists.map((p) => (
          <div key={p._id} className="p-4 rounded-xl bg-neutral-900">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-neutral-400 line-clamp-2">{p.description}</div>
            <div className="text-xs text-neutral-500 mt-1">{p.videos?.length||0} videos</div>
          </div>
        ))}
      </div>
    </div>
  );
}







