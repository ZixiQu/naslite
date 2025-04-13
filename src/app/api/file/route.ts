import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from "@/lib/auth";


const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT, // https://nyc3.digitaloceanspaces.com
  region: process.env.SPACES_REGION, // nyc3
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});


export async function GET(req: NextRequest) {
  // let key = "dMzDvZE0SLLUTGUVvfEgvUcHDqiUK7KN/small.mp4";

  const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json(
      { error: "Missing key" },
      { status: 400 }
    );
  }
  
  const command = new GetObjectCommand({
    Bucket: process.env.SPACES_BUCKET,
    Key: key,
    });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });

  return NextResponse.json({ url: signedUrl });
}