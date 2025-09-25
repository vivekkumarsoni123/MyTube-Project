import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Trending", path: "/trending", icon: "🔥" },
    { name: "Subscriptions", path: "/subscriptions", icon: "📺" },
    { name: "Library", path: "/library", icon: "📚" },
    { name: "History", path: "/history", icon: "🕒" },
    { name: "Your Videos", path: "/your-videos", icon: "📹" },
    { name: "Watch Later", path: "/watch-later", icon: "⏰" },
    { name: "Liked Videos", path: "/liked", icon: "👍" },
  ];

  const userItems = user ? [
    { name: "Your Channel", path: `/c/${user.username}`, icon: "👤" },
    { name: "Upload Video", path: "/upload", icon: "⬆️" },
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
  ] : [];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-neutral-900 min-h-screen p-4">
      <div className="space-y-2">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive(item.path)
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </div>

        {/* Divider */}
        {user && (
          <>
            <div className="border-t border-neutral-800 my-4"></div>
            
            {/* User-specific items */}
            <div className="space-y-1">
              <h3 className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                You
              </h3>
              {userItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive(item.path)
                      ? "bg-neutral-800 text-white"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Divider */}
        <div className="border-t border-neutral-800 my-4"></div>

        {/* Additional Links */}
        <div className="space-y-1">
          <h3 className="px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Explore
          </h3>
          <Link
            to="/music"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive("/music")
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            <span className="text-lg">🎵</span>
            Music
          </Link>
          <Link
            to="/gaming"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive("/gaming")
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            <span className="text-lg">🎮</span>
            Gaming
          </Link>
          <Link
            to="/news"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive("/news")
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            <span className="text-lg">📰</span>
            News
          </Link>
          <Link
            to="/sports"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive("/sports")
                ? "bg-neutral-800 text-white"
                : "text-neutral-400 hover:text-white hover:bg-neutral-800"
            }`}
          >
            <span className="text-lg">⚽</span>
            Sports
          </Link>
        </div>
      </div>
    </div>
  );
}


