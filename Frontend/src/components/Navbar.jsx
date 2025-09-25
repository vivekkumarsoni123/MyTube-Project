import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="text-red-500">▶</span>
          <span>MyTube</span>
        </Link>
        <div className="flex-1" />
        <nav className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              
              <Link to={`/channel/${user?.username}`} className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700">Channel</Link>
              <button onClick={logout} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700">Login</Link>
              <Link to="/register" className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


