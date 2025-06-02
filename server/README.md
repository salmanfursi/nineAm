<!-- # MERN Stack Shop Auth Backend

## Overview

This is the backend for a MERN stack app with user authentication, global shop name uniqueness, and cross-subdomain session support.

---

## Features

- User signup with username, password, and 3+ unique shop names
- Password validation (min 8 chars, 1 number, 1 special char)
- Global uniqueness for shop names
- User login with "Remember Me" (7 days) or 30 min session
- JWT authentication via HTTP-only cookies
- Profile/dashboard with shop list and logout
- Shop-specific dashboard with subdomain support (e.g., http://beautyhub.localhost:5173)
- Cross-subdomain authentication (cookie shared on all \*.localhost)

---

## Setup Instructions

1. **Clone the repo**
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Create a `.env` file** (see `.env.example` for required variables)
4. **Start the server**
   ```sh
   node server.js
   ```

---

## API Endpoints

### Auth

- `POST /api/auth/signup` — Signup (username, password, shops[])
- `POST /api/auth/signin` — Login (username, password, rememberMe)
- `GET /api/auth/profile` — Get user profile (requires auth)
- `POST /api/auth/logout` — Logout

### Shops

- `GET /api/shops` — List all shops
- `GET /api/shop/:shopname` — Verify shop ownership (requires auth)

---

## Usage Notes

- All protected routes require the JWT cookie set by login/signup.
- Shop names must be unique across all users.
- Passwords must be strong (see validation rules above).
- For cross-subdomain auth, set `COOKIE_DOMAIN=.localhost` in `.env`.

---

## HTTPS for Local Testing

- To test with `secure: true` and `sameSite: "none"`, you must run your backend and frontend with HTTPS.
- Use [mkcert](https://github.com/FiloSottile/mkcert) to generate local SSL certificates.
- Update your dev server configs to use these certs.

---

## Example .env

```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-jwt-secret
NODE_ENV=development
PORT=5000
COOKIE_DOMAIN=.localhost
```

---

## Questions?

Open an issue or contact the maintainer. -->





# MERN Stack Multi-Shop Authentication System

A comprehensive MERN stack application featuring user authentication, dynamic shop creation, and cross-subdomain session management.

## 🚀 Features

- **User Authentication**: Secure signup/signin with JWT tokens
- **Dynamic Shop Creation**: Users can create multiple shops with unique names
- **Cross-Subdomain Authentication**: Seamless authentication across shop subdomains
- **Session Management**: Configurable session duration (30min or 7 days)
- **Shop Dashboard**: Individual dashboards for each shop
- **Global Shop Uniqueness**: Shop names are unique across all users

## 📋 Requirements

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd mern-shop-auth
```

### 2. Backend Setup
```bash
cd server
npm install
```

### 3. Frontend Setup
```bash
cd client
npm install
```

### 4. Environment Configuration
Create a `.env` file in the server directory:
```env
MONGODB_URI=mongodb://localhost:27017/shopauth
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
PORT=5000
COOKIE_DOMAIN=.localhost
```

### 5. Start the Application
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

## 🌐 Usage

1. **Signup**: Create account with username, password, and 3+ shop names
2. **Login**: Sign in with optional "Remember Me" feature
3. **Dashboard**: View profile and manage shops
4. **Shop Access**: Click shop names to access individual shop dashboards
5. **Subdomain Access**: Each shop runs on `http://shopname.localhost:5173`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - User logout

### Shops
- `GET /api/shops` - List all shops
- `GET /api/shop/:shopname` - Get shop details

## 🔒 Security Features

- Password validation (min 8 characters, 1 number, 1 special character)
- JWT token authentication
- HTTP-only cookies for secure token storage
- CORS configuration for cross-origin requests
- Protected routes with middleware

## 🌍 Deployment

This application supports deployment on platforms like Heroku, Vercel, or DigitalOcean. Update the `COOKIE_DOMAIN` environment variable for your production domain.

## 📞 Support

For issues or questions, please open an issue in the repository or contact the development team.

---

## 🔧 Development Notes & Technical Issues

*This section is for developers working on the project*

### Cross-Subdomain Authentication Challenge

#### The Problem
When implementing cross-subdomain authentication with `localhost`, browsers enforce strict security policies that prevent cookie sharing between `localhost` and `subdomain.localhost`. This causes authentication failures when users navigate to shop subdomains.

#### Technical Details
- **Issue**: Cookie set on `localhost` not accessible on `shopname.localhost`
- **Browser Behavior**: Chrome, Firefox, and Edge treat these as separate origins
- **Result**: 401 Unauthorized errors on subdomain requests

#### Solution Implemented
We use a hybrid approach combining JWT tokens and localStorage:

1. **Token Passing**: Pass JWT token via URL parameters when redirecting to subdomains
2. **Local Storage**: Store token in localStorage on subdomain for subsequent requests
3. **Fallback Authentication**: Backend accepts tokens from multiple sources (cookies, headers, query params)

#### Code Implementation
```javascript
// Redirect with token
export const redirectToShop = (shopname) => {
  const token = getAuthToken();
  const currentDomain = window.location.hostname;
  
  if (currentDomain === 'localhost') {
    window.location.href = `http://${shopname}.localhost:5173?token=${token}`;
  } else {
    window.location.href = `http://${shopname}.${currentDomain}?token=${token}`;
  }
};

// Multi-source token verification
const authenticateToken = (req, res, next) => {
  let token = req.cookies.token || 
             req.headers.authorization?.split(' ')[1] || 
             req.query.token;
  // ... verification logic
};
```

#### Alternative Solutions Considered
1. **Custom Domain**: Using `.local` domains (requires hosts file modification)
2. **Proxy Setup**: Configuring dev server proxy (complex for dynamic subdomains)
3. **Production Deployment**: Works naturally with real domains

#### Testing Notes
- ✅ Works with `localhost` in development
- ✅ Works with custom domains in production
- ✅ Handles direct subdomain access
- ✅ Maintains security with HttpOnly cookies where possible

#### Browser Compatibility
- Chrome: ✅ Working
- Firefox: ✅ Working  
- Safari: ✅ Working
- Edge: ✅ Working

### Development Workflow
1. Test authentication on main domain
2. Test shop creation and uniqueness
3. Test subdomain redirects
4. Test direct subdomain access
5. Test session persistence

### Known Limitations
- `localhost` subdomain limitations (by design)
- Requires JavaScript enabled for token management
- Token visible in URL during redirect (brief moment)

### Future Improvements
- Implement secure token exchange mechanism
- Add refresh token functionality
- Consider WebRTC for secure cross-subdomain communication