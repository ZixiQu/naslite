import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";


const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT, // https://nyc3.digitaloceanspaces.com
  region: process.env.SPACES_REGION, // nyc3
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});

const supportTypes: string[] = ["PDF", "PNG", "TXT", "MP3", "ZIP", "DOCX", "XLSX", "DIR", "MP4", "JPG", "JPEG"];

/**
 * 
 * @param {string} filename: the filename (full path) looking for file type analyze
 * 
 * @returns {string} examples: "upload.txt" -> "TXT", "test/upload.txt" -> "DIR"
 */
function analyzeFileType(filename: string) {
  if (filename.includes("/")) {
    return "DIR";
  }
  for (let supportType of supportTypes) {
    if (filename.toLowerCase().includes(supportType.toLowerCase())) {
      return supportType;
    }
  }
  return "UNKNOWN";
}


export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const user_id = session.user.id;
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.SPACES_BUCKET,
        Prefix: `${user_id}/`, 
      });
      
      const response = await s3Client.send(listCommand);
      const files = response.Contents?.map(obj => { 
        let fullPath = obj.Key as string;
        const match = fullPath.match(/^([^\/]+)\/(.+)$/);
        if (!match) {
          return {
            name: "",
            size: 0,
            type: "UNKNOWN",
            link: ""
          }
        }
        return {
          name: match[2],
          size: obj.Size,
          type: analyzeFileType(match[2]),
          link: fetch(`/api/file?key=${obj.Key}`)  // TODO: fetch returns {} now.
        }
      });
  
      // console.log(files);
      return NextResponse.json(
        { files },
        { status: 200 }
      );
    }
    catch (error) {
      console.error("Upload error:", error);
      return NextResponse.json(
        { error: "Failed to get file list" },
        { status: 500 }
      );
    }
    
}

