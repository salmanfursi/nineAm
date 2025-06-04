# Submission Note: MERN Multi-Tenant Auth App

## ✅ What I Completed

I successfully built the full MERN stack application **locally** with all required features:

* ✅ **User Signup/Login** with password validation and JWT token
* ✅ Users must enter **3 unique shop names** (globally unique across all users)
* ✅ Each shop name leads to a dynamic subdomain like `shopname.localhost`
* ✅ Cookie-based **authentication works across subdomains** in local setup
* ✅ "Remember Me" feature implemented to extend session for 7 days
* ✅ Dashboard and logout logic work as expected
* ✅ Frontend deployed on **Railway** and live for testing

> 🔄 I tested the entire workflow **locally**, and it performed exactly as described in the assignment.

---

## 🧪 Live Testing Info

* You can **signup and login easily**
* Use shop names without spaces for easy navigation
* Live test account:
  **username:** `user1`
  **password:** `user@1111`

---

## 🧠 API Features Overview

### 🔐 Authentication Routes (`/api/auth/...`)

* `POST /signup` – Register new user with validation (min 3 shops, unique shop names, strong password)
* `POST /signin` – Login with username/password, sets secure cookie with optional 7-day session
* `GET /profile` – Protected route that returns user data
* `POST /logout` – Clears cookie to end session

### 🛍️ Shop Management (`/api/...`)

* `GET /shops` – Returns all shops from all users (populated with owner username)
* `GET /shop/:shopname` – Verifies if logged-in user owns the given shop name; otherwise blocks

### 🔄 Middleware

* `authenticateToken` – Checks cookie/authorization token, decodes user, and attaches to `req.user`

---

## ❌ What Issues I Faced in Deployment

### ❗ Hosting Constraints

* **Wildcard Subdomains** are **not supported** on:

  * Vercel (only available in **Pro plan**)
  * Netlify, Surge, Render (no wildcard or multi-tenant support in free tier)
  * AWS Amplify (required AWS account, which I couldn’t set up in time)

### 🌐 Domain Challenges

* Free domain providers **do not offer wildcard subdomain support**
* I borrowed a domain from a friend (`replicate-test.com`) and used **Cloudflare** to manage DNS

### 🔄 Hosting Setup Attempt

* Backend on Vercel with custom domain setup via Cloudflare
* Frontend deployed to Railway (supports custom domains)
* **BUT:**

  * Cookie-based cross-subdomain auth **did not work** in production
  * Vercel backend had issues issuing cookies with `SameSite=None` over custom domain
  * Even after using ping/keep-alive routes, random 500 errors occurred

---

## 🚧 Why I Couldn't Fully Submit Production URL

Due to these issues:

* ❌ Lack of wildcard subdomain support in free-tier hosting
* ❌ Need for **paid custom domain** or Pro plan
* ❌ Time constraints for provisioning and domain DNS propagation
* ❌ Cookie/session issue with Railway backend wasn’t resolved before the submission deadline

---

## 🧠 What I Learned

* Managing cookies across subdomains needs careful setup of domain + HTTPS + `SameSite=None`
* Free hosting platforms are limited for **multi-tenant architecture**
* Cloudflare can handle wildcard subdomains but requires backend and frontend to be perfectly aligned
* Railway can be used for frontend, but cookie issues from separate domain backends must be solved

---

## ✅ Conclusion

I completed and tested the application **locally with full functionality**.
Although I couldn’t host the full setup in production due to platform and domain limitations, I demonstrated:

* Full working logic
* API implementation with full validation
* Cookie/session-based authentication with cross-subdomain logic
* Domain-level experience with Cloudflare, Vercel, and Railway

> I'm confident that with a proper paid domain and Pro plan hosting, the project would work 100% in production.

Thank you for the opportunity!
