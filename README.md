## ECE1724 - React - Final Project

### Team

Zixi Qu (1006143861, zixi.qu@mail.utoronto.ca)

Kangzhi Gao (1006307827, kangzhi.gao@mail.utoronto.ca)

### Video Demo
[Watch on YouTube](https://www.youtube.com/watch?v=pH8vuNILAG4&ab_channel=ZixiQu)



### Introduction

This project is a NAS server that provide a browser based frontend, that easily setup for a personal storage securely. Our frontend UI are so elegant, that you can manage you files at the tip of your finger! For this project, web-framework is [Next.js](https://nextjs.org/), the user content are stored in [DigitialOcean](https://cloud.digitalocean.com), the UI are [tailwind-CSS](https://tailwindcss.com/)-based and incorporated with [shadcn/ui](https://ui.shadcn.com/), and user authentication is powered by [better-auth](https://www.better-auth.com/).


### Motivation

It is trivial to mention the importance of data storage. To carry files or to make data portable from device to device, people choose a variety of solutions, including carrying an USB, pay for cloud storage including google drive or iCloud. However, both USB and cloud storage have their drawbacks. USB drive requires carrying the physical drive, you may lose it, or not having it in hand when you need it the most. Cloud storage can be more portable, and you don't need to worry about losing the data, but data are not private. Although the companies claim their protection to user data, you don't have control if they want to peek. Cloud storage is also going to charge more if your usage starts to goes up, so cloud storage, especially free versions, are only good for small-amount, non-important data storage.

NAS has been a modern, highly scalable, and highly configurable solution to geeks, that ensures the data is private, accessible, scalable. NAS usually refers to a tiny computer, that different from the day-to-day laptop that we use, has only a few hard drive opening slots for upgrading storage size, that has a dedicate design for file storage server. NAS is usually kept at home, so the data is secure.

Although the upfront cost of NAS, including the hardware cost and configuration cost, is high, once setup, you can store and access your precious data all over the world, without worrying about data integrity, security, and cost. The idea of NAS is relatively new compare to USB and cloud storage, still there's only a small portion of people are using NAS to protect their data due to the high upfront cost and setup hardness, but from the increasing amount of online resources including setting up videos, blogs, and forums, the community is growing rapidly, and eventually when the cost problem is gradually solved and more accessible to non-professionals, people will tend to choose this more secure and personal data storage solution.

Entrepreneur-level NAS companies, including [Synology](https://www.synology.com), [UGREEN](https://nas.ugreen.com/), or [TrueNAS](https://www.truenas.com/), provide a rather heavy solution, including a lot of features that might be overwhelmed to small players who only want a basic upload and view functionalities. Our team decide to design a free, easy-to-setup, super-lightweight application, to manage file upload and preview in a web-browser, that only requires a computer and a storage place. For project educational purpose, we will choose one of the cloud storage provider, DigitalOcean Spaces, AWS S3, or Azure, whichever is cheaper. My ideal storage method, which we will adopt after we have finish the course, would be local computer storage, so that my deprecated ex-MacBook pro can serve more that it can now, which is nothing.



### Objective

This project aim to create a light-weight NAS server, that provide a full stack application to allow user to easily setup local computer storage or cloud storage as a personal NAS. Each user has a space of storage, that allows uploading all kinds of file type, and support a few common file type preview, including jpg/png image, txt file, mp4/mov videos.



### Technical Stack

This project adopts a **Next.js Full-Stack** approach to deliver a modern web application. Below are the key technologies used in building NASlite:

- **Frontend & Full-Stack Framework**: [Next.js](https://nextjs.org/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Authentication**: [Better-auth](https://www.better-auth.com/)
- **Storage**: [DigitalOcean Spaces](https://cloud.digitalocean.com)
- **Database**: **PostgreSQL**
- **ORM**: [Prisma](https://www.prisma.io/)



### Development Guide

1. Clone the repository or download the source code (`.zip` or via `git clone`).

2. A new database user and database need to be created for the project.

   First, log into `psql` using a PostgreSQL root or admin user:

   ```bash
   psql -U <root user>
   ```

   Then, run the following SQL commands to create a new user and grant the necessary permissions:

   ```sql
   CREATE ROLE naslite WITH LOGIN PASSWORD 'passwd';
   ALTER ROLE naslite CREATEDB;
   ```

   This allows Prisma to connect using the following environment variable:

   ```bash
   DATABASE_URL="postgresql://naslite:passwd@localhost:5432/naslite?schema=public"
   ```

3. Create a `.env` file in the root directory with the following content:

   ```env
   DATABASE_URL="postgresql://naslite:passwd@localhost:5432/naslite?schema=public"
   BETTER_AUTH_SECRET="a_very_long_random_string"
   BETTER_AUTH_URL="http://localhost:3000"

   SPACES_KEY=your-access-key
   SPACES_SECRET=your-secret-key
   SPACES_REGION=nyc3
   SPACES_BUCKET=next-app-files
   SPACES_ENDPOINT=https://nyc3.digitaloceanspaces.com
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. Build and start the application:

   ```bash
   npm run build
   npm run start
   ```

6. You're all set! Open [http://localhost:3000](http://localhost:3000) in your browser to try it out.

> **Note:** All required credentials have been shared with **Professor Ying** via email.



### Key Features

- **User Authentication**
  - Sign up and sign in via a user-friendly interface.
  - Secure session management with the ability to sign out safely.

- **File Management**
  - Full-featured file explorer accessible from `/files`.
  - Upload, download, preview and search files.
  - Drag and drop multiple files for batch upload.
  - Media preview: images and videos play in pop-up tabs.
  - Delete files directly from the interface.
  - Copy file name with a single click for easy referencing or sharing.
  - Persistent path memory: resume from where you left off after closing the tab.

- **Navigation**
  - Intuitive sidebar for quick access to all major routes (`/`, `/signin`, `/signup`, `/signout`, `/profile`, `/files`).
  - Current path display with easy back-navigation in the file view.

- **User Profile**
  - Accessible via sidebar username link.
  - Edit user display name (email is fixed for identity consistency).

- **Password Management**
  - Dedicated `/update_password` page for secure password updates.
  - Requires current password and double confirmation for safety.

- **Responsive UI**
  - Elegant and intuitive UI built with Tailwind CSS and shadcn/ui.



### User Guide:

#### 1. `/`

The front page of the project. You can find find both `signup` and `signin` button on the left sidebar of the page. Signup an account and sign-in with it, you will be taking to `/files`, which is the main entry point of your file system.

#### 2. `/signin`

Sign-in page. You can also be taken to the sign-in page by clicking on the button in the **sidebar**.

#### 3. `/signup`

Sign-up page. You can also be taken to the sign-up page by clicking on the button in the **sidebar**.

#### 4. `/signout`

Securely sign-out current session. You can find "Sign Out" button in the **sidebar**.

#### 5. `/files`

Main entry point of your files. We spent a lot of time polishing the UI to make the application user friendly, therefore the UI is very intuitive. You can browser your files, create folder, search for files, and upload files, all in one page. You can drag and drop multiple files and upload all at once! If you click on your files, for example and `.png` image file, you can immediately view it in the pop-up tab. If the file is a video, you can also view it online in the pop-up window. The triple-dots (...) on the right of the files gives more options to manipulate your files, including download and delete file. 

This page is more powerful than you think. You can clearly view your current path from the bar, and browse back your previous folders with ease.

![1bar](assets/1bar.png)

You current path will be stored with your session. If you accidently close the tab, re-opening the page will take you back to the point where you left! You can read about more technical detail in [this section](#Set User's Current Path in Cookie).

#### 6. `/profile`

**The best way to access this page is by clicking on the user name in the side bar.** You will be taking to a page that can change your profiles. User name can be changed, but we do not allow changing email because it is against our design philosophy.

![2profile](assets/2profile.png)

#### 7. `/update_password`

Password update is more critical, therefore we separate password page to another endpoint. **The best way of accessing this page is through `/profile` page.** The user needs to provide old password in order to change password. It also double-check passwords.

![3password](assets/3password.png)



### Individual Contributions

#### [Zixi Qu](https://github.com/ZixiQu)

- **User Authentication**:  
  Implemented secure login and signup using [better-auth](https://www.better-auth.com/) with session management and access control.

- **File Storage**:  
  Set up file storage using DigitalOcean Spaces. Ensured each user's files are stored correctly and securely.

- **Backend API**:  
  Developed RESTful API endpoints for handling file operations and user sessions.

- **Database Design**:  
  Designed and implemented the PostgreSQL database using Prisma to store user and file information.

- **Frontend Work**:
  Contributed to the user interface using React and Tailwind CSS.

#### [Kangzhi Gao](https://github.com/Connor315)

- **File System UI**:  
  Built the web-based file explorer using React and shadcn/ui. Implemented features like folder navigation, selection, and drag-and-drop.

- **File Sorting and Preview**:  
  Added sorting options and file previews for the files.

- **Frontend-Backend Integration**:  
  Connected the frontend to the backend API for uploading, deleting, and displaying files and folders.

- **User Experience**:  
  Designed and improved file navigation, upload behavior, and visual feedback based on user flow.

#### Shared Contributions

- **Frontend Design**:  
  Both members worked on creating a clean, responsive, and consistent interface using Tailwind CSS and shadcn/ui components.

- **Planning and Coordination**:  
  Collaborated on project planning, user experience design, defining user workflows, and brainstorming key features like file preview, session persistence, and optional file search.

- **Testing**:  
  Worked together to test the entire application—ensuring core features like authentication, file operations, and navigation worked smoothly and reliably.



### Limitations:

We are a two-people team. There are lots of features in our mind that we didn't have the time to implement. However, we plan to keep working on NASlite to make it a fully available light weight NAS server after the course ends, so that everyone can set up a NAS server at home to save some money and privacy on their precious memories!

#### 1. Moving Files  
Right now, users can’t move files from one folder to another. We would like to build extra backend and frontend features to support that.

#### 2. Storage on DigitalOcean  
We use DigitalOcean for file storage because it’s easy to set up, not too expensive, and includes free CDN. But our original idea was to make storage completely free by saving files on the user’s local disk. To do that, we’d need to build a local file access API.

#### 3. Uploading Folders  
You can upload multiple files, but not entire folders. It would be more user-friendly if you could drag and drop folders to upload. This needs more complex code on the frontend to handle folders and their contents.

#### 4. User Profile Features  
To keep things simple, we only support email and password login. We don’t yet support features like profile pictures or email verification.

#### 5. Third-Party Login  
Logging in with Google, GitHub, or other platforms isn’t available yet, but we’d like to add this in the future to make signing in easier.

---

### Additional Technical Insights

### Backend API:

#### GET /api/list

> No params, no payload

   return a Tree structure of user's entire FS

#### GET /api/file

   > Params: key: users target file. Note, key should follow path rule mentioned above (no double slash, no leading/tailing slash). The key does not include user_id

   return temp link to target file. 

#### POST /api/upload

   > payload: file: js built-in File type (not the one we defined)

   File will be stored under `${currentPath}/${file.name}`, `${currentPath}` from user's cookie.

#### POST /api/create_folder

   >  Params: key: folder name (should not include "/" in folder name. Frontend checks it, backend doesn't)

   Will create a folder under user's current path (from cookie)

#### DELETE /api/delete

   > Params: key: full path to the file to delete.

   Will delete the target file. Will return success code (204 No Content) even if file not exist.

#### GET /api/test

   > No params, no payload

   For development purpose, will print a greeting message if user is logged-in.



### Technical Details

#### 1. Setting up DB
A new DB user and new table shall be created for the project. First log into psql with root user:

```bash
psql -U <root user>
```
Create new user and give proper authority.

```sql
CREATE ROLE naslite WITH LOGIN PASSWORD 'passwd';
ALTER ROLE naslite CREATEDB;
```

Therefore, a valid environment variable is:

```bash
DATABASE_URL="postgresql://naslite:passwd@localhost:5432/naslite?schema=public"
```



Some useful psql command to check DB metadata:
```sql
\du  -- List of roles (users)
\d   -- List of relations (tables)
\l   -- List of databases

\c naslite naslite  -- connect to db naslite via user naslite
```



#### 2.  Setting up better-auth prisma schema

1. We create user model under `schema.prisma` and migrate
   
    <!-- I don't know if this step is necessary. We might be able to skip -->
    ```sql
    model User {
        id        String   @id @default(uuid())
        email     String   @unique
        name      String
        createdAt DateTime @default(now())
        updatedAt DateTime @updatedAt
    }
    ```
    migrate: `npx prisma migrate dev --name init`


2. User better-auth cli to generate necessary prisma model.

    under `src/lib/auth.ts`
    ```ts
    import { betterAuth } from "better-auth";
    import { prismaAdapter } from "better-auth/adapters/prisma";
    import { PrismaClient } from "@prisma/client";
    
    const prisma = new PrismaClient();
    export const auth = betterAuth({
        database: prismaAdapter(prisma, {
            provider: "postgresql",
        }),
    });
    ```
    This `auth.ts` does two things, connect to psql based on .env, also (important) connect better-auth with prisma. If you don't follow exactly this way, better-auth is not aware of prisma, and `npx @better-auth/cli generate` will create an .sql file for you to manually apply. No good. We want better-auth to modify schema.prisma directly, so that DB options are handled by prisma. We never touch .sql nor psql nor manually set prisma.

    After `auth.ts` is setup this way, run `npx @better-auth/cli generate --config src/lib/auth.ts`, `schema.prisma` will be updated. And `migrate` (which will generate automatically)



#### 3.  better-auth Authentication and Authorization

If you want login functionality, you must `authClient.signIn.email()` in a `"use client"` environment. This function sets session token in cookie, so that you can do authorization within the app (you request, server knows you, give you data, not rejecting you). If you invoke this function in an `"use server"` environment, the cookie is not set in user's browser, user is only logged-in in the server, but no token no cookie, act if not logged-in.

Working endpoints:

`localhost:3000/signup`

`localhost:3000/signin`

`localhost:3000/signin2`  <- different UI

`localhost:3000/greeting` <- To test if signed-in.

to do authorization, check `/src/app/(auth)/greeting/page.tsx` or `src/app/api/upload/route.ts`



#### 4.  Important Notes on DO's(DigitalOcean) File Path

DO's folder is virtual folder, we can upload a file `folder1/folder2/folder3/file.txt`, without creating folder1/2/3. So there is no folder1/2/3 (although you can create them, will talk about that later), and the filename of `file.txt` is literally `folder1/folder2/folder3/file.txt`. What sucks about it is if you are looking for `folder1//folder2////folder3/////file.txt`, you can't find it, since name not matched.

So we need to be very careful about storing the paths. Few rules:

If you are storing any path, perhaps the full path to the file (therefore the real name of the file), or the folder is in (`folder1/folder2/folder3/`),

1. remove leading and tailing slashes
2. normalize slashes in the middle (`folder1//folder2` ->`folder1/folder2`)
3. Only explicitly include / if you are concatenating path

There's a function you can `import { trimAndNormalizePath } from "@/lib/path"` that apply both 1. and 2.



#### 5. Set User's Current Path in Cookie

User's viewing path is stored in cookie. We set the path when user is checking out a path. When user is creating new item (folder/file), it is created under the path. The benefit of storing in cookie is cookie is persist after closing the browser. 