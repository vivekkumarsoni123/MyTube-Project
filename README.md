# ChaiAurCode

A modern backend API for user authentication and profile management, built with Node.js, Express, and MongoDB.

## Features

- User registration and login
- JWT authentication and refresh tokens
- Password change and account updates
- Avatar and cover image uploads
- User channel profile and watch history

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB

### Installation

```bash
git clone https://github.com/vivekkumarsoni123/Utube-SocialMedia-Backend.git

cd chaiAurCode
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add your configuration:

```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Running the App

```bash
npm start
```

## API Endpoints

- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login user
- `POST /api/v1/users/logout` - Logout user
- `POST /api/v1/users/refreshToken` - Refresh access token
- `POST /api/v1/users/change-password` - Change password
- `GET /api/v1/users/getcurrentuser` - Get current user info
- `PATCH /api/v1/users/update-details` - Update account details
- `PATCH /api/v1/users/update-avatar` - Update avatar image
- `PATCH /api/v1/users/update-coverimage` - Update cover image
- `GET /api/v1/users/c/:username` - Get user channel profile
- `GET /api/v1/users/watch-history` - Get watch history

## License

MIT
