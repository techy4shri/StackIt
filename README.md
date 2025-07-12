# StackIt – A Minimal Q&A Forum Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.17.0-green?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-purple?logo=clerk)](https://clerk.com/)


## 🧩 Problem Statement (ID: 2)

Design and develop **StackIt**, a minimal Question-and-Answer platform that supports collaborative learning and structured knowledge sharing. The platform should be simple, intuitive, and focused on the core experience of asking and answering questions within a community.

The system must:
- Allow users to ask and answer questions using a rich text editor.
- Implement voting, tagging, and answer acceptance features.
- Include user roles (Guest, User, Admin) with appropriate permissions.
- Support notifications and moderation controls for admins.


---

## 📚 Project Overview

**StackIt** is a lightweight and focused Q&A platform tailored for learning communities. It emphasizes simplicity, collaboration, and meaningful interactions without unnecessary complexity.



## 🔑 User Roles & Permissions

| Role   | Permissions                                                                 |
|--------|------------------------------------------------------------------------------|
| Guest  | View all questions and answers                                              |
| User   | Register, log in, post questions and answers, vote on answers               |
| Admin  | Moderate content, ban users, send announcements, download reports           |

---

## 🧠 Core Features

### 1. Ask Questions
- Submit questions with:
  - **Title** – Concise and descriptive
  - **Description** – Created using a rich text editor
  - **Tags** – Multi-select input (e.g., `React`, `JWT`)

### 2. Rich Text Editor
Supports formatting options for both questions and answers:
- Bold, Italic, Strikethrough
- Numbered & Bullet lists
- Emoji insertion
- Hyperlinks
- Image uploads
- Text alignment: Left, Center, Right

### 3. Answering Questions
- Logged-in users can answer any question
- Full formatting supported via the same rich text editor

### 4. Voting & Accepted Answers
- Users can upvote/downvote answers
- Question owners can mark one answer as accepted

### 5. Tagging System
- Mandatory tags on questions
- Helps in content discovery and categorization

### 6. Notification System
- Bell icon shows unread count
- Notifications for:
  - Answers to user’s question
  - Comments on user’s answers
  - Mentions via `@username`
- Dropdown view for recent activity


## 🔐 Admin Capabilities

Admins have access to moderation and analytics tools:
- Reject inappropriate or spammy questions
- Ban users violating platform policies
- Send platform-wide messages (e.g., feature updates, downtime alerts)
- Download reports: user activity, feedback, question/answer statistics



## ⚙️ Tech Stack

- **Frontend**: Next.js 15.3.5, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB
- **Text Editor**: TipTap with rich text extensions
- **Authentication**: Clerk
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS with custom theme
- **Animation**: Framer Motion
- **Icons**: Lucide React

---

## 📁 Project Structure

```
StackIt/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin dashboard pages
│   ├── api/                 # API routes
│   ├── ask/                 # Question creation page
│   ├── question/           # Question detail pages
│   ├── search/             # Search results page
│   ├── sign-in/            # Authentication pages
│   └── sign-up/            # User registration pages
├── components/              # React components
│   ├── editor/             # Rich text editor components
│   └── ui/                 # Reusable UI components
├── lib/                    # Utility functions and types
└── public/                 # Static assets
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ [[Download](https://nodejs.org)]
- MongoDB database [[MongoDB Atlas](https://www.mongodb.com/atlas/database)]
- Clerk account for authentication [[Sign up](https://clerk.com)]

<!-- ### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
-->
### Installation

1. Fork the [techy4shri/stackit](https://github.com/techy4shri/stackit) repository:

1. Clone the repository:
   ```bash
   git clone https://github.com/techy4shri/stackit.git
   cd stackit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server


---

## 👥 Team Details

| Role      | GitHub |
|-----------|--------|
| Team Lead | [Garima](https://github.com/techy4shri) |
| Member    | [Swati Sharma](https://github.com/swatified) |
| Member    | [Priyanshu Aggarwal](https://github.com/jindalpriyanshu101) |

