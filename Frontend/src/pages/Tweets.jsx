import { useEffect, useState } from "react";
import { endpoints } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Tweets(){
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [content, setContent] = useState("");

  async function load(){
    if (!user) return;
    const { data } = await endpoints.getUserTweets(user._id);
    setTweets(data?.data || data || []);
  }

  useEffect(()=>{ load(); },[user]);

  async function create(e){
    e.preventDefault();
    if (!content.trim()) return;
    await endpoints.createTweet({ content: content.trim() });
    setContent("");
    await load();
  }

  async function remove(id){ await endpoints.deleteTweet(id); await load(); }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Tweets</h1>
      <form onSubmit={create} className="flex gap-2 mb-4">
        <input className="flex-1 px-3 py-2 rounded-lg bg-neutral-800" value={content} onChange={(e)=>setContent(e.target.value)} placeholder="What is happening?" />
        <button className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500">Tweet</button>
      </form>
      <ul className="space-y-3">
        {tweets.map((t)=> (
          <li key={t._id} className="p-4 rounded-xl bg-neutral-900 flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-neutral-400">{t.owner?.username || "You"}</div>
              <div>{t.content}</div>
            </div>
            <button onClick={()=>remove(t._id)} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}








