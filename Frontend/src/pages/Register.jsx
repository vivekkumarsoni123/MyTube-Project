import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", fullName: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(k, v){ setForm((s)=>({ ...s, [k]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatar) fd.append("avatar", avatar);
      if (coverImage) fd.append("coverImage", coverImage);
      await register(fd);
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-950 text-neutral-100">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-neutral-900 p-6 rounded-xl shadow-lg space-y-4">
        <h1 className="text-2xl font-semibold">Create account</h1>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <div className="grid grid-cols-2 gap-3">
          <input className="px-3 py-2 rounded-lg bg-neutral-800" placeholder="Username" value={form.username} onChange={(e)=>updateField("username", e.target.value)} required />
          <input className="px-3 py-2 rounded-lg bg-neutral-800" placeholder="Full name" value={form.fullName} onChange={(e)=>updateField("fullName", e.target.value)} required />
        </div>
        <input className="w-full px-3 py-2 rounded-lg bg-neutral-800" placeholder="Email" type="email" value={form.email} onChange={(e)=>updateField("email", e.target.value)} required />
        <input className="w-full px-3 py-2 rounded-lg bg-neutral-800" placeholder="Password" type="password" value={form.password} onChange={(e)=>updateField("password", e.target.value)} required />
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm text-neutral-300">Avatar<input className="block mt-1" type="file" accept="image/*" onChange={(e)=>setAvatar(e.target.files?.[0]||null)} /></label>
          <label className="text-sm text-neutral-300">Cover Image<input className="block mt-1" type="file" accept="image/*" onChange={(e)=>setCoverImage(e.target.files?.[0]||null)} /></label>
        </div>
        <button disabled={loading} className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50">{loading?"Creating...":"Create account"}</button>
        <p className="text-sm text-neutral-400">Have an account? <Link className="text-red-400" to="/login">Sign in</Link></p>
      </form>
    </div>
  );
}










