# Full-Stack Blog Platform

A cloud-deployed full-stack blog platform built using **Next.js 16, React, MongoDB, and NextAuth**, featuring role-based authentication, blog management, voting system, and persistent reading mode.

**Live Demo:**  
https://next-blog-518312514898.asia-south1.run.app

---

## Features

### Authentication & Authorization
- Secure login & signup using **NextAuth (JWT strategy)**
- Role-based access control (**Admin / User**)
- Protected API routes
- Session persistence

### Blog Management
- Create, edit, delete blogs
- Admin can manage all blogs
- Users manage their own blogs
- Blog rating system (upvote/downvote with user state tracking)

### Profile Management
- Update username and email
- Secure password change with current password verification
- Persistent reading mode preference (stored per user)

### UI Features
- Light / Reading Mode (user preference stored in database)
- Responsive design using TailwindCSS
- Real-time UI updates
- Profile dropdown with dynamic navigation

### Deployment & DevOps
- Dockerized application
- Deployed to **Google Cloud Run**
- MongoDB Atlas production database
- Environment-based configuration
- Production-ready build using Next.js standalone output

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- React
- TailwindCSS
- Axios

### Backend
- Next.js API Routes
- MongoDB (Mongoose)
- NextAuth (JWT Authentication)

### Cloud & DevOps
- Docker
- Google Cloud Run
- MongoDB Atlas

---

## Project Structure
app/
├── admin/
├── dashboard/
├── blogs/
├── login/
├── signup/
├── profile/
api/
lib/
components/


---

## Local Setup

### Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```
### Install dependencies
```bash
npm install
```
### Create .env.local
```bash
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
```
### Run development server
```bash
npm run dev
```

### Docker build
```bash
docker build -t next-blog .
docker run -p 3000:3000 next-blog
```

## Architecture Highlights
- JWT-based authentication with session callbacks
- Role-based middleware for admin protection
- RESTful API structure with proper HTTP status handling
- Suspense handling for client-side hooks in App Router
- Stateful vote system preventing duplicate votes
- Secure password hashing using bcrypt

## Future Improvements
- Cloud image storage (GCS / S3)
- Blog search & filtering
- Pagination optimization
- Comment system
- Caching layer (Redis)

## Author

### Rishwanth Sai Guntuku
- IIT Indore – Computer Science
- GitHub: https://github.com/Rishwanth-Sai
- LinkedIn: https://linkedin.com/in/rishwanth-sai
