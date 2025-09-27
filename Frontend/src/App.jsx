import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Playlists from "./pages/Playlists";
import Liked from "./pages/Liked";
import History from "./pages/History";
import Channel from "./pages/Channel";
import Dashboard from "./pages/Dashboard";
import Tweets from "./pages/Tweets";
import Subscriptions from "./pages/Subscriptions";
import Library from "./pages/Library";
import PlaylistDetails from "./pages/PlaylistDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-950 text-neutral-100">
        <Navbar />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/upload" element={<Upload />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/liked" element={<Liked />} />
            <Route path="/history" element={<History />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tweets" element={<Tweets />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/library" element={<Library />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
          </Route>
          <Route path="/" element={<Home />} />
          <Route path="/watch/:id" element={<Watch />} />
          <Route path="/channel/:username" element={<Channel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
