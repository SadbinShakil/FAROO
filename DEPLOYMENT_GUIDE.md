# Deploying Faroo to Vercel (Free & Fastest)

I have updated your code to use **PostgreSQL** instead of SQLite, which is required for professional hosting like Vercel.

### Step 1: Create a Database on Vercel
1.  Go to your project dashboard on [Vercel](https://vercel.com).
2.  Click on the **"Storage"** tab at the top.
3.  Click **"Create Database"** and select **"Postgres"**.
4.  Accept the terms and click **"Create"**.
5.  Once created, click **"Connect"** to link it to your project. This will automatically add the `DATABASE_URL` and other variables to your project.

### Step 2: Push the code changes
I have updated your `schema.prisma`. You need to push this change to GitHub so Vercel can see it:
```bash
git add .
git commit -m "Switch to PostgreSQL for Vercel deployment"
git push
```

### Step 3: Trigger a New Deployment
1.  Go back to the **"Deployments"** tab in Vercel.
2.  Click the three dots `...` on your latest failed deployment and click **"Redeploy"**.
3.  **OR** simply wait for the push from Step 2 to trigger a new build automatically.

### Step 4: Sync your Database
Because this is a new database, it won't have your tables or products yet.
1.  In Vercel, go to the **"Settings"** -> **"Environment Variables"**.
2.  Copy the `DATABASE_URL` value.
3.  On your **local computer**, open your `.env` file and paste that `DATABASE_URL` (replace the one that points to `dev.db`).
4.  Run this command in your local terminal:
    ```bash
    npx prisma db push
    ```
    *This will create all the tables in your live Vercel database.*

5.  (Optional) Seed your data:
    ```bash
    npx prisma db seed
    ```
    *This will add your initial products to the live site.*

### Why was it failing?
Next.js was trying to build your site while Prisma was looking for a database connection that didn't exist yet. By connecting **Vercel Postgres** first, the variables will be ready when the build starts.
