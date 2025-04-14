import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supportedFileTypes, File} from "@/lib/file-types"
import { object } from "better-auth";


const s3Client = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT, // https://nyc3.digitaloceanspaces.com
  region: process.env.SPACES_REGION, // nyc3
  credentials: {
    accessKeyId: process.env.SPACES_KEY!,
    secretAccessKey: process.env.SPACES_SECRET!,
  },
});

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
  for (const type of supportedFileTypes) {
    if (filename.toLowerCase().includes(type.toLowerCase())) {
      return type;
    }
  }
  return "UNKNOWN";
}

/**
 * 
 * @param {File[]} files old 1D file list structure that does not have folder hierarchy
 * @return {Object[]} file system structure in a tree structure
 */
function filesToTree(files: File[], currentPath: string=""): object[] {
  // find all immediate folders in files
  let leaves = [];
  let folders: { [folderName: string]: File[] } = {};  // {folder_name: [items]}
  let no_folders = true;
  for (let file of files) {
    let filename = file.name;
    let type = file.type;
    if (type === "DIR") {  // "DIR" does not mean a directory, but means a file under dir(s)
      no_folders = false;
      const match = filename.match(/^([^\/]+)\/(.+)$/);
      let folderName = match![1];
      let truncatePath = match![2];
      let newFile: File = {
        name: truncatePath,
        type: analyzeFileType(truncatePath),
        size: file.size,
        link: ""
      } 
      folders[folderName] = [...(folders[folderName] || []), newFile];
    }
    else {
      leaves.push({
        name: filename,
        type: type,
        href: `${currentPath}${filename}`
      });
    }
  }

  // if no folders (all leaves), base case, return (trivial, keep for readablility)
  if (no_folders) {
    return leaves
  }
  // else, structure = {all leaves, filesToTree(folder1), filesToTree(folder2)}
  for (let folderName of Object.keys(folders)) {
    leaves.push({
      name: folderName,
      // size: null,
      type: "DIR",    // in this case, unlike above, DIR actually means a real folder
      href: `${currentPath}/${folderName}`, 
      children: filesToTree(folders[folderName], `${currentPath}/${folderName}/`)
    })
  }
  return leaves
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
      let files: File[] = [];
      for (let content of response.Contents!) {
        let fullPath = content.Key as string;
        const match = fullPath.match(/^([^\/]+)\/(.+)$/);
        if (!match) {
          return {
            name: "",
            size: 0,
            type: "UNKNOWN",
            link: ""
          }
        }
        let response = await fetch(`http://localhost:3000/api/file?key=${content.Key}`, {
          headers: {
            Cookie: req.headers.get("cookie") || "",
          },
        });
        let data = await response.json();
        files.push({
          name: match[2],
          size: content.Size as number,
          type: analyzeFileType(match[2]),
          link: data.url  
        })
      }
      console.log(files);
      let tree = filesToTree(files);
      console.log(tree);
      return NextResponse.json(
        { tree },
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

