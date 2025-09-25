// Axios API client with JWT cookies and optional bearer token support
import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { "X-Requested-With": "XMLHttpRequest" },
});

// Attach Authorization header if access token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingQueue = [];

function subscribeTokenRefresh(cb) {
  pendingQueue.push(cb);
}

function onRefreshed(newToken) {
  pendingQueue.forEach((cb) => cb(newToken));
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }
      isRefreshing = true;
      try {
        const { data } = await api.post("/users/refreshToken");
        const newToken = data?.data?.accessToken || data?.accessToken;
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          onRefreshed(newToken);
        } else {
          onRefreshed(null);
        }
        return api(originalRequest);
      } catch (e) {
        onRefreshed(null);
        localStorage.removeItem("accessToken");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const endpoints = {
  health: () => api.get("/healthcheck"),
  // Users
  register: (formData) => api.post("/users/register", formData, { headers: { "Content-Type": "multipart/form-data" } }),
  login: (payload) => api.post("/users/login", payload),
  logout: () => api.post("/users/logout"),
  currentUser: () => api.get("/users/getcurrentuser"),
  changePassword: (payload) => api.post("/users/change-password", payload),
  updateDetails: (payload) => api.patch("/users/update-details", payload),
  updateAvatar: (file) => {
    const fd = new FormData();
    fd.append("avatar", file);
    return api.patch("/users/update-avatar", fd);
  },
  updateCover: (file) => {
    const fd = new FormData();
    fd.append("coverImage", file);
    return api.patch("/users/update-coverimage", fd);
  },
  channelProfile: (username) => api.get(`/users/c/${username}`),
  watchHistory: () => api.get("/users/watch-history"),

  // Videos
  getVideos: (params) => api.get("/videos", { params }),
  getVideoById: (videoId) => api.get(`/videos/${videoId}`),
  addView: (videoId) => api.post(`/videos/view/${videoId}`),
  publishVideo: ({ videoFile, thumbnail, body }) => {
    const fd = new FormData();
    if (videoFile) fd.append("videoFile", videoFile);
    if (thumbnail) fd.append("thumbnail", thumbnail);
    if (body) Object.entries(body).forEach(([k, v]) => fd.append(k, v));
    return api.post("/videos", fd);
  },
  updateVideo: (videoId, payloadOrFile) => {
    if (payloadOrFile instanceof File) {
      const fd = new FormData();
      fd.append("thumbnail", payloadOrFile);
      return api.patch(`/videos/${videoId}`, fd);
    }
    return api.patch(`/videos/${videoId}`, payloadOrFile);
  },
  deleteVideo: (videoId) => api.delete(`/videos/${videoId}`),
  togglePublish: (videoId) => api.patch(`/videos/toggle/publish/${videoId}`),

  // Likes
  toggleVideoLike: (videoId) => api.post(`/likes/toggle/v/${videoId}`),
  toggleCommentLike: (commentId) => api.post(`/likes/toggle/c/${commentId}`),
  toggleTweetLike: (tweetId) => api.post(`/likes/toggle/t/${tweetId}`),
  likedVideos: () => api.get("/likes/videos"),

  // Comments
  getVideoComments: (videoId) => api.get(`/comments/${videoId}`),
  addComment: (videoId, content) => api.post(`/comments/${videoId}`, { content }),
  updateComment: (commentId, content) => api.patch(`/comments/c/${commentId}`, { content }),
  deleteComment: (commentId) => api.delete(`/comments/c/${commentId}`),

  // Playlists
  createPlaylist: (payload) => api.post("/playlist", payload),
  getPlaylistById: (playlistId) => api.get(`/playlist/${playlistId}`),
  updatePlaylist: (playlistId, payload) => api.patch(`/playlist/${playlistId}`, payload),
  deletePlaylist: (playlistId) => api.delete(`/playlist/${playlistId}`),
  addVideoToPlaylist: (videoId, playlistId) => api.patch(`/playlist/add/${videoId}/${playlistId}`),
  removeVideoFromPlaylist: (videoId, playlistId) => api.patch(`/playlist/remove/${videoId}/${playlistId}`),
  getUserPlaylists: (userId) => api.get(`/playlist/user/${userId}`),

  // Subscription
  toggleSubscription: (channelId) => api.post(`/subscriptions/c/${channelId}`),
  getSubscribedChannels: (channelId) => api.get(`/subscriptions/c/${channelId}`),
  getChannelSubscribers: (channelId) => api.get(`/subscriptions/u/${channelId}`),
  checkSubscriptionStatus: (channelId) => api.get(`/subscriptions/status/${channelId}`),

  // Tweets
  createTweet: (payload) => api.post("/tweets", payload),
  getUserTweets: (userId) => api.get(`/tweets/user/${userId}`),
  updateTweet: (tweetId, payload) => api.patch(`/tweets/${tweetId}`, payload),
  deleteTweet: (tweetId) => api.delete(`/tweets/${tweetId}`),

  // Dashboard
  channelStats: () => api.get("/dashboard/stats"),
  channelVideos: () => api.get("/dashboard/videos"),
};


