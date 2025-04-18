import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentPath } from "@/lib/path";
import { auth } from "@/lib/auth";

const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT, // https://nyc3.digitaloceanspaces.com
  region: process.env.SPACES_REGION, // nyc3
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  const user_id = session.user.id;
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { error: "Missing key" },
      { status: 400 }
    );
  }
  
  try {
    const currentPath = await getCurrentPath();
    const fullPath = `${user_id}/${currentPath ? (currentPath + '/') : ""}${key}/`
    // console.log(fullPath);
    const command = new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET!,
      Key: fullPath,
      Body: "", // Empty body to simulate folder
    });

    await s3Client.send(command);
    return new NextResponse(null, { status: 204 }); 
  } catch (error) {
    console.error("Error during create folder:", error);
    return NextResponse.json(
      { error: "Failed to create folder" },
      { status: 500 }
    );
  }
  


}