# BookNook - A Small Online Library

## Project Overview
**BookNook** is a modern full-stack digital online library management platform. It allows readers and book enthusiasts to discover diverse literary titles, borrow books with real-time inventory management, add and manage their personal book contributions, and track reading borrowings.

Built with performance, security, and responsive design in mind using the Next.js App Router, Hero UI, and an Express.js/MongoDB backend.

---

## Key Features
1. **Browse Complete Book Collection**: Explore all books in a responsive catalog filtered by category (Fiction, Science, History, Kids, Others) with real-time availability badges.
2. **User Authentication**: Secure authentication supporting both Email/Password registration/login and Google OAuth via BetterAuth with MongoDB adapter.
3. **Add, Edit, and Delete Books**: Authenticated users can contribute books with cover photos hosted on imgbb, pre-filled update forms, and custom confirmation modals.
4. **Borrowing with Real-Time Inventory Control**: Borrow books with borrow/return date scheduling and atomic `$inc` stock decrement, ensuring copies never drop below zero.
5. **Prevent Duplicate Borrowing**: Users cannot borrow multiple copies of the same book simultaneously.
6. **My Books Management**: Private dashboard allowing contributors to review, update, or remove the books they have added.
7. **My Borrows Dashboard & Return Book**: Private dashboard listing all active borrowings with a custom Return Book confirmation modal restoring available copies.
8. **Consistent UX Polish**: Route and component-level loading spinners, custom BookNook-themed 404 Not Found page, and dynamic page metadata titles.

---

## Technology Stack
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Hero UI & Custom Accessible Modals
- **Authentication**: BetterAuth (MongoDB Adapter & Google OAuth)
- **Image Hosting**: imgbb API
- **Icons & Sliders**: Swiper & Custom SVG Icons

---

## Available Pages & Route Matrix

| Route | Page Title | Access Level | Description |
|---|---|---|---|
| `/` | BookNook - Your Online Library | **Public** | Hero slider, New Arrivals, categories, and workflow overview |
| `/books` | All Books - BookNook | **Public** | Complete public library catalog |
| `/books/[id]` | [Book Title] - BookNook | **Private** | Detailed book view, contributor metadata, and Borrow modal |
| `/add-book` | Add a Book - BookNook | **Private** | Form with image upload to add new titles |
| `/my-books` | My Books - BookNook | **Private** | Manage personal books with pre-filled edit and delete modals |
| `/my-borrows` | My Borrows - BookNook | **Private** | Manage active borrowings and return books |
| `/login` | Login - BookNook | **Public** | Account sign-in (Credentials & Google) |
| `/register` | Register - BookNook | **Public** | Create a new reader account |
| `/not-found` | Page Not Found | **Public** | Custom 404 page with navigation shortcuts |

---

## Environment Variables
Create a `.env.local` file in the `client` directory with the following variables:

```env
# Live or local backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# BetterAuth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_32_characters_minimum
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB Connection (for BetterAuth Adapter)
MONGODB_URI=your_mongodb_connection_string
DB_NAME=booknook

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Image Upload
IMGBB_API_KEY=your_imgbb_api_key

# JWT Token Secret for Backend Communication
JWT_ACCESS_SECRET=your_jwt_access_secret_matching_backend
```

> **Note:** Never commit actual secrets or private API keys to version control.

---

## Project Structure
```text
client/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/          # Login page
│   │   │   └── register/       # Register page
│   │   ├── add-book/           # Add Book private route
│   │   ├── api/
│   │   │   ├── auth/           # BetterAuth route handler
│   │   │   ├── books/          # Authenticated proxy to backend books API
│   │   │   ├── borrows/        # Authenticated proxy to backend borrows API
│   │   │   └── upload/         # Imgbb image upload proxy route
│   │   ├── books/
│   │   │   ├── [id]/           # Book Details private route & metadata
│   │   │   ├── loading.tsx     # Route-level books loading skeleton
│   │   │   └── page.tsx        # All Books public catalog
│   │   ├── my-books/           # My Books private dashboard
│   │   ├── my-borrows/         # My Borrows private dashboard
│   │   ├── layout.tsx          # Root layout with Navbar & Footer
│   │   ├── loading.tsx         # Global route loading spinner
│   │   ├── not-found.tsx       # Custom BookNook 404 page
│   │   └── page.tsx            # Homepage
│   ├── components/
│   │   ├── auth/               # Login & Register forms
│   │   ├── books/              # BookCard, BooksGrid, AddBookForm, Modals
│   │   ├── borrows/            # MyBorrowsClient & ReturnConfirmationModal
│   │   ├── common/             # LoadingSpinner, Skeletons, EmptyState
│   │   ├── home/               # HeroSlider, NewArrivals, HowItWorks
│   │   └── layout/             # Responsive Navbar & Footer
│   ├── lib/
│   │   ├── auth.ts             # BetterAuth server config
│   │   ├── auth-client.ts      # BetterAuth React client hooks
│   │   └── mongodb.ts          # MongoClient instance for Auth
│   ├── services/
│   │   └── books.service.ts    # Unified API service layer
│   └── types/                  # TypeScript interfaces (Book, Borrow, etc.)
```

---

## Backend Integration
The client communicates with the Express.js and MongoDB backend using typed service calls (`BooksService`):
- Public endpoints (`GET /books`, `GET /books/:id`) are queried directly.
- Protected endpoints (`POST /books`, `PATCH /books/:id`, `DELETE /books/:id`, `POST /borrows`, `GET /borrows`, `DELETE /borrows/:id`) authenticate via verified HS256 JWT tokens generated through authenticated server route handlers, ensuring complete cryptographic validation and ownership enforcement.

---

## Installation and Setup
1. **Prerequisites**: Node.js 18+ and npm / pnpm / yarn installed.
2. **Install Dependencies**: Install packages configured in `package.json`.
3. **Environment Setup**: Copy environment variable placeholders into `.env.local` and provide your MongoDB, Google OAuth, and imgbb credentials.
4. **Run Development Server**: Start the local development server (default port `3000`).
5. **Build for Production**: Compile the Next.js production build using `next build`.

---

## Deployment
The client is optimized for deployment on **Vercel**:
- Ensure all environment variables listed above are added in the Vercel Project Settings.
- Configure authorized redirect URIs in Google Cloud Console to include your production Vercel domain (`https://<your-project>.vercel.app/api/auth/callback/google`).
