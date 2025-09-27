import { useState } from "react";
import { endpoints } from "../lib/api";

export default function Upload() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);
    try {
      await endpoints.publishVideo({ videoFile, thumbnail, body: { title, description } });
      setMessage("Uploaded successfully");
      setTitle(""); setDescription(""); setVideoFile(null); setThumbnail(null);
    } catch (err) {
      setMessage(err?.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-900 p-5 rounded-xl">
        <input className="w-full px-3 py-2 rounded-lg bg-neutral-800" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        <textarea className="w-full px-3 py-2 rounded-lg bg-neutral-800" rows={5} placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <label className="text-sm text-neutral-300">Video file<input className="block mt-1" type="file" accept="video/*" onChange={(e)=>setVideoFile(e.target.files?.[0]||null)} required /></label>
          <label className="text-sm text-neutral-300">Thumbnail<input className="block mt-1" type="file" accept="image/*" onChange={(e)=>setThumbnail(e.target.files?.[0]||null)} /></label>
        </div>
        <button disabled={loading} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50">{loading?"Uploading...":"Upload"}</button>
        {message && <div className="text-sm mt-2">{message}</div>}
      </form>
    </div>
  );
}










