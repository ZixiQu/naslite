import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT, // https://nyc3.digitaloceanspaces.com
  region: process.env.SPACES_REGION, // nyc3
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user_id = session.user.id;
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const mode = searchParams.get('mode');

  if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
  }

  try {
      const command = new GetObjectCommand({
          Bucket: process.env.SPACES_BUCKET,
          Key: `${user_id}/${key}`,
          ...(mode === 'download' && { ResponseContentDisposition: `attachment; filename="${key.split('/').pop()}"` })
      });

      const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 * 5 });

      return NextResponse.json({ url: signedUrl });
  } catch (error) {
      console.error('Retrieve error: ', error);
      return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
  
}