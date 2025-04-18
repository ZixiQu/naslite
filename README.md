## ECE1724 - React - Final Project

### Team

Zixi Qu (1006143861)

Kangzhi Gao ()



### Introduction

This project is a NAS server that provide a browser based frontend, that easily setup for a personal storage securely. Our frontend UI are so elegant, that you can manage you files at the tip of your finger! For this project, web-framework is [Next.js](https://nextjs.org/), the user content are stored in [DigitialOcean](https://cloud.digitalocean.com), the UI are [tailwind-CSS](https://tailwindcss.com/)-based and incorporated with [shadcn/ui](https://ui.shadcn.com/), and user authentication is powered by [better-auth](https://www.better-auth.com/).



### Usage

1. Get the source code (download the .zip file, or `git clone` from the GitHub repo)
2. [Setting up DB for better-auth](#1.-Setting-up-DB)
3. `npx prisma migrate dev`
4. `npm run build; npm run start;`  
5. Good to go! Checkout it out [in the browser](http://localhost:3000)



### Frontend Endpoints:

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
   
    I don't know if this step is necessary. We might be able to skip
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



### Contributions:

[Zixi Qu](https://github.com/ZixiQu): Mainly backend. User authentication, file retrieval authorization, cloud storage DevOps and backend API. Also implement a bit frontend for practice.

[Kangzhi Gao](https://github.com/Connor315): Mainly frontend. Incorporate with backend data and visualize it nicely in the React and Tailwind-based UI.



### Limitations:

We are a two-people team. There are lots of features in our mind that we didn't have the time to implement. However, we plan to keep working on NASlite to make it a fully available light weight NAS server after the course ends, so that everyone can set up a NAS server at home to save some money and privacy on their precious memories!

#### 1. Move files around

The files cannot be moved to another folder. 

#### 2. User's file are stored in DigitalOcean

Although DigitalOcean has a fair price on the service, and can easily scale-up and provide free CDN, our initial thought is to make the cloud storage completely free, by storing the file on local disks. An local file retrieval API need to implemented for such functionality. 

#### 3. Upload entire folder

We can upload multiple files at once, but it would be even better if we can drag and drop entire folder or folders and upload them all at once! A more complicated  frontend logic need to be implemented for such functionality.

#### 4. Advanced user identity

User image, verifying email. We kept our project simple for the scale of the course. Currently we only support email and password login.

#### 5. Third-party login

Login through Google, GitHub, etc.
