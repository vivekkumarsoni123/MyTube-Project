import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-neutral-950 text-neutral-100">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-neutral-900 p-6 rounded-xl shadow-lg space-y-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <input className="w-full px-3 py-2 rounded-lg bg-neutral-800 outline-none" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        <input className="w-full px-3 py-2 rounded-lg bg-neutral-800 outline-none" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50">{loading?"Signing in...":"Sign in"}</button>
        <p className="text-sm text-neutral-400">No account? <Link className="text-red-400" to="/register">Register</Link></p>
      </form>
    </div>
  );
}




