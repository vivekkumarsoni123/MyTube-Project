```markdown
# MyTube Project

A full-stack video streaming web application built to mimic YouTube’s core functionalities — upload, view, like, comment, playlists, and user profiles.

## 📦 Features

- User Authentication & Authorization  
- Video Upload & Storage  
- Video Streaming & Playback  
- Like / Dislike videos  
- Commenting system  
- User Profiles / Dashboard  
- Playlists & Save for Later  
- Search & Browse videos  
- Responsive UI for desktop & mobile  

## 🏗 Architecture & Tech Stack

| Layer | Technology / Tools |
|-------|--------------------|
| Frontend | (React ) |
| Backend / API | (Node.js / Express ) |
| Database | (MongoDB ) |
| Storage | (Cloudinary ) |
| Authentication | JWT |
| Deployment | ( Vercel) |


## 🧩 Project Structure



root
│
├── backend/        # Backend server code (APIs, business logic)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── ...
│
├── frontend/       # Frontend app (UI, pages, components)
│   ├── components/
│   ├── pages/
│   ├── services/   # API calls, HTTP client
│   └── ...
│
├── README.md       # This file
└── .gitignore


dify this to match your actual folder organization.

## 🚀 Getting Started

These instructions will help you get a copy of the project running on your local machine for development and testing.

### Prerequisites

- Node.js (version ≥ 20.17)  
- npm   
- A database (e.g. MongoDB, PostgreSQL)  
- Storage setup for video files / media (or local fallback or cloudinary account)  

### Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/vivekkumarsoni123/MyTube-Project.git
   cd MyTube-Project
````

2. **Setup backend**

   ```bash
   cd backend
   npm install     # or yarn install
   ```

   Create a `.env` file with relevant environment variables, for example:

   ```
   PORT=8000
   DB_URI=your_database_connection_string
   JWT_SECRET=your_jwt_secret
   STORAGE_PATH=/path/to/video/storage
   CLOUDINARY= *
   ACCESS TOKEN= *
   REFRESH TOKEN=
   ```

3. **Setup frontend**

   ```bash
   cd ../frontend
   npm install     # or yarn install
   ```

   Configure frontend environment (e.g. `.env.local`) with API base URL and other required variables:

   ```
   REACT_APP_API_URL=http://localhost:5173/api
   ```

4. **Run in Development Mode**

   * In backend folder:

     ```bash
     npm run dev    # or `npm start`
     ```

   * In frontend folder:

     ```bash
     npm run dev    # or `npm start`
     ```

   Then open your browser at `http://localhost:3000` (or whichever port your frontend runs).

## 📋 API Endpoints (sample)

| Method | Endpoint                  | Description             |
| ------ | ------------------------- | ----------------------- |
| `POST` | `/api/v1/users/register`      | Register a new user     |
| `POST` | `/api/v1/users/login`         | User login & get JWT    |
| `POST` | `/api/v1/videos/upload`      | Upload a video          |
| `GET`  | `/api/v1/videos/:id`         | Get video info & stream |
| `POST` | `/api/v1/videos/:id/like`    | Like a video            |
| `POST` | `/api/v1/videos/:id/comment` | Add a comment           |
| `GET`  | `/api/v1/comments/`      | Comment on videos           |




## 🧪 Demo / Screenshots

<img width="1582" height="781" alt="image" src="https://github.com/user-attachments/assets/c9850d5c-07c7-45ae-8c0a-2a65afe93430" />

<img width="1892" height="969" alt="image" src="https://github.com/user-attachments/assets/e8488f00-0008-4bb3-b603-2b2705aba634" />

<img width="1817" height="892" alt="image" src="https://github.com/user-attachments/assets/6f0f3804-69b4-47d1-bd38-6ee3beee782e" />

<img width="1797" height="977" alt="image" src="https://github.com/user-attachments/assets/bf9a9f2e-ff0a-4523-944b-3f0f62b4a8f5" />

<img width="1772" height="922" alt="image" src="https://github.com/user-attachments/assets/d2e1c2e9-8555-4897-ac03-eea7917699d9" />

<img width="1680" height="770" alt="image" src="https://github.com/user-attachments/assets/30c03ae9-cd5c-4f15-afaa-1bb268edb3fe" />

<img width="1672" height="717" alt="image" src="https://github.com/user-attachments/assets/f0adce49-2720-4d66-b6e5-35f9373c8e4e" />

<img width="1881" height="980" alt="image" src="https://github.com/user-attachments/assets/23474860-e975-4490-ab10-e4c7bae2553c" />

<img width="1891" height="967" alt="image" src="https://github.com/user-attachments/assets/3f7b1ded-e9fa-478c-815b-7de72af5e941" />




## 🤝 Contribution

Contributions are welcome! To contribute:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/AwesomeFeature`)
3. Commit changes (`git commit -m 'Add some feature'`)
4. Push to branch (`git push origin feature/AwesomeFeature`)
5. Open a Pull Request

Please adhere to the code style, write tests if applicable, and document new features.

---

Thank you for checking out **MyTube Project**! If you run into issues or have ideas, feel free to open an issue or contact me.

