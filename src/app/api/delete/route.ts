import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


const s3Client = new S3Client({
    endpoint: process.env.SPACES_ENDPOINT,
    region: process.env.SPACES_REGION,
    credentials: {
      accessKeyId: process.env.SPACES_KEY!,
      secretAccessKey: process.env.SPACES_SECRET!,
    },
  });


export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const user_id = session.user.id;
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: `${user_id}/${key}`,
    });
    await s3Client.send(command);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Retrieve error: ", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
  
}