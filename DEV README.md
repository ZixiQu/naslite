## Final Project Development Note

Sometimes I forgot what I did, and why things work. Hence I am writing something down

### Setting up DB
This step is not prisma setting up schema, but creating a new psql user for my local usage. By taking into consideration this project will be open-sourced in the future, I need to make sure sensitive information is not leaked. For example, passwords...

I create a new db user, for development and testing purpose. Every db operation should be done under this user:

First loggin to psql with root user
```bash
psql -U zixiqu
```
I can log in without password. This is dangerous and I don't know why, but I will figure out why later. Nobody can touch my laptop and I did not setup remote login, so I'm ok.

```sql
CREATE ROLE naslite WITH LOGIN PASSWORD 'passwd';
ALTER ROLE naslite CREATEDB;
```

Ok, psql user set, .env variables set, good to go

BTW, some command to check DB metadata:
```sql
\du  -- List of roles (users)
\d   -- List of relations (tables)
\l   -- List of databases

\c naslite naslite  -- connect to db naslite via user naslite
```



### Setting up better-auth prisma schema

1. We create user model under `schema.prisma` and migrate
   
    I don't know if this step is necessary. We might able to skip
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



### better-auth authentication and authorization
Few important things:
If you want login functionality, you must `authClient.signIn.email()` in a `"use client"` environment. This function sets session token in cookie, so that you can do authorization within the app (you request, server knows you, give you data, not rejecting you). If you invoke this function in an `"use server"` environment, the cookie is not set in user's browser, user is only logged-in in the server, but no token no cookie, act if not logged-in.

Working endpoints:

`localhost:3000/signup`

`localhost:3000/signin`

`localhost:3000/signin2`  <- different UI

`localhost:3000/greeting` <- To test if signed-in.

to do authorization, check `/src/app/(auth)/greeting/page.tsx` or `src/app/api/upload/route.ts`


### Important note about DO's(DigitalOcean) path
DO's folder is virtual folder, we can upload a file `folder/folder2/folder3/file.txt`, without creating folder1/2/3. So there is no folder1/2/3 (although you can create them, will talk about that later), and the filename of `file.txt` is literially `folder/folder2/folder3/file.txt`. What sucks about it is if you are looking for `folder//folder2////folder3/////file.txt`, you can't find it, since name not matched.

So we need to be very careful about storing the paths. Few rules.
If you are storing any path, perhaps the full path to the file (therefore the real name of the file), or the folder is in ("folder/folder2/folder3/"),
1. remove leading and tailing slashs
2. normalize slashes in the middle (folder//folder2 -> folder/folder2)
3. Only explicitly include / if you are concatenating path

There's a function you can `import { trimAndNormalizePath } from "@/lib/path"` that apply both 1. and 2.


### Set user's current path in cookie
User's viewing path is stored in cookie. We set the path when user is checking out a path. When user is creating new item (folder/file), it is created under the path. The benefit of storing in cookie is cookie is persist after closing the browser.

Issue: Need to clean up cookie after session logout/expires.


### Backend API:
1. GET /api/list

    > No params, no payload

    return a Tree structure of user's entire FS

2. GET /api/file

    > Params: key: users target file. Note, key should follow path rule mentioned above (no double slash, no leading/tailing slash). The key does not include user_id

    return temp link to target file. 

3. POST /api/upload

    > payload: file: js built-in File type (not the one we defined)
    
    File will be stored under `${currentPath}/${file.name}`, `${currentPath}` from user's cookie.

4. POST /api/create_folder

   >  Params: key: folder name (should not include "/" in folder name. Frontend checks it, backend doesn't)

    Will create a folder under user's current path (from cookie)

5. DELETE /api/delete

    > Params: key: fullpath to the file to delete.

    Will delete the target file. Will return success code (204 No Content) even if file not exist.

6. GET /api/test

   > No params, no payload
   
    For development purpose, will print a greeting message if user is logged-in.
