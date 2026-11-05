# 📖 BookNook - A Small Online Library (Client)

A modern full-stack digital online library management platform where users can browse diverse book collections, borrow titles with real-time inventory control, manage personal book listings, and return books seamlessly.

- 🌐 **Live Application**: [https://b14-a8-cat-ron-frontend.vercel.app](https://b14-a8-cat-ron-frontend.vercel.app)
- 🔌 **Backend API**: [https://b14-a8-cat-ron-backend.vercel.app](https://b14-a8-cat-ron-backend.vercel.app)
- 📂 **Backend Repo**: [https://github.com/mahmudulhasanmaruf78/B14-A8-Cat-Ron-backend](https://github.com/mahmudulhasanmaruf78/B14-A8-Cat-Ron-backend)

---

## 🌟 Key Features

1. **📚 Complete Catalog & Discovery**:
   - Browse the complete library collection with real-time text search (by title and author) and category filters (`Fiction`, `Science`, `History`, `Kids`, `Others`).
   - Interactive hero slider highlighting featured literature and fresh new arrivals.

2. **🔐 Secure Authentication**:
   - Robust authentication powered by **BetterAuth** supporting both Email/Password registration/login and one-click Google OAuth.

3. **🌓 Dark & Light Mode Support**:
   - Built-in theme switcher with smooth transitions and persistent storage in `localStorage`.
   - Hydration-safe script prevents Flash of Unstyled Theme (FOUT).

4. **✏️ Book Contribution & Management (Full CRUD)**:
   - Add new books with cover images uploaded to ImgBB.
   - Private **My Books** dashboard to inspect, edit (pre-filled modal), and delete contributed books.

5. **🔄 Borrowing & Real-Time Stock Control**:
   - Interactive Borrow Modal with custom date-range pickers and automatic validation.
   - Decrements available copies atomically using MongoDB `$inc`.
   - **Double-Borrow Prevention**: Blocks borrowing the same book twice simultaneously.

6. **📥 My Borrows & Return Flow**:
   - Private **My Borrows** circulation panel showing active borrowings and due dates.
   - Return book operation with confirmation dialog, immediately restoring available copies.

7. **✨ Polished UX & Feedback**:
   - Route-level and component-level loading skeletons and spinners.
   - Custom BookNook-themed 404 Not Found page.
   - Dynamic page metadata and browser document titles (`generateMetadata`).
   - Informative toast alerts using `@heroui/react`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router & Turbopack) |
| **Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [Hero UI](https://heroui.com/) & Custom Accessible Modals |
| **Authentication** | [BetterAuth](https://better-auth.com/) (MongoDB Adapter & Google OAuth) |
| **Carousels & Motion** | [Swiper.js](https://swiperjs.com/) & [Framer Motion](https://www.framer.com/motion/) |
| **Image Hosting** | [ImgBB API](https://imgbb.com/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🗺️ Route Matrix

| Route | Page Title | Access | Description |
|---|---|---|---|
| `/` | BookNook - Your Online Library | **Public** | Hero slider, New Arrivals, categories, and workflow steps |
| `/books` | All Books - BookNook | **Public** | Catalog with search, filter tabs, and book cards |
| `/books/[id]` | [Book Title] - BookNook | **Private** | Detailed overview, stock status, and Borrow modal |
| `/add-book` | Add a Book - BookNook | **Private** | Form with image upload to contribute new titles |
| `/my-books` | My Books - BookNook | **Private** | Manage contributed books with Edit and Delete modals |
| `/my-borrows` | My Borrows - BookNook | **Private** | Track active borrowings and process book returns |
| `/login` | Login - BookNook | **Public** | Sign in with Credentials or Google |
| `/register` | Register - BookNook | **Public** | Register a new reader account |
| `/not-found` | Page Not Found | **Public** | BookNook-styled custom 404 page |

---

## ⚙️ Environment Variables

Create a `.env` file in the `client/` directory:

```env
# Live Backend API URL
NEXT_PUBLIC_API_URL=https://b14-a8-cat-ron-backend.vercel.app

# Frontend Application URL
NEXT_PUBLIC_APP_URL=https://b14-a8-cat-ron-frontend.vercel.app

# BetterAuth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_32_chars_minimum
BETTER_AUTH_URL=https://b14-a8-cat-ron-frontend.vercel.app

# MongoDB Connection (for BetterAuth storage)
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=booknook

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Image Hosting
IMGBB_API_KEY=your_imgbb_api_key

# JWT Secret for Server Communication
JWT_SECRET=your_shared_jwt_secret_matching_backend
```

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js 18 or newer
- npm, yarn, or pnpm

### 2. Installation
```bash
cd client
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```
