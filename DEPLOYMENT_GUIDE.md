# Deployment Guide for Faroo

## Option 1: Vercel (Recommended for Next.js)

Vercel is the creators of Next.js and offers the easiest deployment experience.

### Prerequisites
1.  **Database**: Vercel does NOT support local SQLite files (`dev.db`). You must use a cloud database.
    *   **Recommendation**: Use **Vercel Postgres** (free tier available) or **Neon.tech**.
    *   Update your `.env` file with `DATABASE_URL="postgres://..."`
    *   Update `prisma/schema.prisma` to use `provider = "postgresql"` instead of "sqlite".
    *   Run `npx prisma db push` to sync your schema.

### Steps
1.  **Push to GitHub**:
    *   Create a repository on GitHub.
    *   Push your code to the repository.

2.  **Deploy on Vercel**:
    *   Go to [vercel.com](https://vercel.com) and sign up/login.
    *   Click "Add New..." -> "Project".
    *   Import your GitHub repository.
    *   In "Environment Variables", add:
        *   `DATABASE_URL`: Your cloud database connection string.
    *   Click "Deploy".

## Option 2: Render (Free Alternative)

Render offers free web services that can run Node.js/Next.js apps.

1.  **Database**: Same as above, you need a cloud database (Render also offers a free Postgres database).
2.  **Deploy**:
    *   Connect your GitHub repo to Render.
    *   Build Command: `npm install && npm run build`
    *   Start Command: `npm start`

## Important Note on "Free" vs "Production"
*   **Database**: SQLite (`file:./dev.db`) is great for development but *will not work* on free hosting platforms like Vercel because the file system is temporary (ephemeral). Every time you deploy, your data would be wiped. **You must switch to Postgres.**
