import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function VideoCard({ video, showActions = false, onSave, onDelete, onEdit }) {
  const { user } = useAuth();
  const thumb = video?.thumbnail?.url || video?.thumbnail || "";
  const title = video?.title || "Untitled";
  const channelName = video?.owner?.username || video?.channel?.username || video?.ownerName || "Channel";
  const views = video?.views ?? 0;
  const id = video?._id || video?.id;
  const isOwner = user && video?.owner?._id && String(user._id) === String(video.owner._id);
  
  console.log("VideoCard render:", { 
    video, 
    user, 
    isOwner, 
    showActions,
    user_id: user?._id,
    video_owner_id: video?.owner?._id
  });

  return (
    <div className="group block">
      <Link to={`/watch/${id}`} className="block">
        <div className="aspect-video rounded-xl overflow-hidden bg-neutral-800">
          {thumb ? (
            <img src={thumb} alt={title} className="w-full h-full object-cover group-hover:scale-[1.02] transition" />
          ) : (
            <div className="w-full h-full grid place-items-center text-neutral-500">No thumbnail</div>
          )}
        </div>
      </Link>
      <div className="mt-2 flex gap-3 items-start">
        <div className="h-9 w-9 rounded-full overflow-hidden bg-neutral-800">
          {/* avatar if provided */}
          {video?.owner?.avatar && (
            <img src={video?.owner?.avatar?.url || video?.owner?.avatar} alt={channelName} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <Link to={`/watch/${id}`} className="block">
            <h3 className="font-medium line-clamp-2">{title}</h3>
          </Link>
          <div className="text-sm text-neutral-400">{channelName}</div>
          <div className="text-xs text-neutral-500">{views} views</div>
        </div>
        {(showActions || isOwner) && (
          <div className="ml-2 flex gap-1">
            {showActions && (
              <button onClick={()=>onSave?.(video)} className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-xs">Save</button>
            )}
            {isOwner && (
              <>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Edit button clicked in VideoCard");
                    onEdit?.(video);
                  }} 
                  className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-xs text-white"
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Delete button clicked in VideoCard");
                    onDelete?.(video);
                  }} 
                  className="px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-xs text-white"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




