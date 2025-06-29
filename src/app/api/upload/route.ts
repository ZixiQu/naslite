import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCurrentPath, trimAndNormalizePath } from "@/lib/path"

const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT, // https://nyc3.digitaloceanspaces.com
  region: process.env.SPACES_REGION, // nyc3
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
  }
  const user_id = session.user.id;

  const contentType = req.headers.get("content-type");
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: "Invalid content type" },
      { status: 400 }
    );
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll('file') as File[];

    if (!files || files.length === 0) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const currentPath = await getCurrentPath();
    const urls: string[] = [];

    for (const file of files) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const key = trimAndNormalizePath(`${user_id}/${currentPath}/${file.name}`);

        const command = new PutObjectCommand({
            Bucket: process.env.SPACES_BUCKET, // next-app-files
            Key: key,
            Body: fileBuffer,
            ContentType: file.type || 'application/octet-stream'
        });

        await s3Client.send(command);
        const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.digitaloceanspaces.com/${key}`;
        urls.push(url);
    }

    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}