import { useEffect, useState } from "react";
import { endpoints } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function SaveToPlaylistModal({ videoId, open, onClose }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    (async()=>{
      try {
        const { data } = await endpoints.getUserPlaylists(user._id);
        const list = data?.data || data || [];
        setPlaylists(Array.isArray(list) ? list : []);
      } catch {}
    })();
  }, [open, user]);

  async function handleSave() {
    try {
      setLoading(true);
      // create new playlist if name provided
      if (name.trim()) {
        const { data } = await endpoints.createPlaylist({ name: name.trim(), description: desc.trim() });
        const newPl = data?.data || data;
        if (newPl?._id) {
          await endpoints.addVideoToPlaylist(videoId, newPl._id);
        }
      }
      // add to checked playlists
      const picks = Object.entries(selected).filter(([,v]) => v).map(([id]) => id);
      if (picks.length > 0) {
        // run sequentially to honor backend side effects
        for (const pid of picks) {
          await endpoints.addVideoToPlaylist(videoId, pid);
        }
      }
      onClose(true);
    } catch (e) {
      onClose(false, e?.response?.data?.message || "Failed to save to playlist");
    } finally { setLoading(false); }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="w-full max-w-md rounded-xl bg-neutral-900 p-5">
        <div className="text-lg font-semibold mb-3">Save to playlist</div>
        <div className="max-h-56 overflow-auto space-y-2">
          {playlists.map((p)=> (
            <label key={p._id} className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={!!selected[p._id]} onChange={(e)=> setSelected(s=>({...s, [p._id]: e.target.checked}))} />
              <span className="truncate">{p.name}</span>
            </label>
          ))}
          {playlists.length === 0 && <div className="text-sm text-neutral-400">No playlists yet.</div>}
        </div>
        <div className="mt-4 border-t border-neutral-800 pt-4">
          <div className="text-sm font-medium mb-2">Create new playlist</div>
          <input className="w-full px-3 py-2 rounded-lg bg-neutral-800 mb-2" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} />
          <input className="w-full px-3 py-2 rounded-lg bg-neutral-800 mb-3" placeholder="Description (optional)" value={desc} onChange={(e)=>setDesc(e.target.value)} />
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={()=>onClose(false)} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-sm">Cancel</button>
          <button disabled={loading} onClick={handleSave} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-sm">{loading?"Saving...":"Save"}</button>
        </div>
      </div>
    </div>
  );
}


