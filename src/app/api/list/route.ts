import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supportedFileTypes, type File, type FileTree} from "@/lib/file-types"
// import { object, string } from 'better-auth';
// import { constants } from 'node:buffer';

const s3Client = new S3Client({
    endpoint: process.env.SPACES_ENDPOINT, // https://nyc3.digitaloceanspaces.com
    region: process.env.SPACES_REGION, // nyc3
    credentials: {
        accessKeyId: process.env.SPACES_KEY!,
        secretAccessKey: process.env.SPACES_SECRET!
    }
});

/**
 *
 * @param {string} filename: the filename (full path) looking for file type analyze
 *
 * @returns {string} examples: "upload.txt" -> "TXT", "test/upload.txt" -> "DIR"
 */
function analyzeFileType(filename: string) {
    if (filename.includes('/')) {
        return 'DIR';
    }
    for (const type of supportedFileTypes) {
        if (filename.toLowerCase().includes(type.toLowerCase())) {
            return type;
        }
    }
    return 'UNKNOWN';
}

/**
 *
 * @param {File[]} files old 1D file list structure that does not have folder hierarchy
 * @return {FileTree} file system structure in a tree structure
 */
function filesToTree(files: File[], currentPath: string = ''): FileTree {
    // find all immediate folders in files
    const leaves: FileTree = {};
    const folders: { [folderName: string]: File[] } = {};
    let no_folders = true;
    for (const file of files) {
        const filename: string = file.name;
        const type = file.type;
        if (type === 'DIR') {
            // in this case, unlike below, "DIR" does not mean a directory, but means a file under dir(s)
            no_folders = false;
            const match = filename.match(/^([^\/]+)\/(.+)$/);
            if (!match) {
                const folderName = filename.slice(0, -1);
                folders[folderName] = [...(folders[folderName] || [])];
                continue;
            }
            const folderName = match![1];
            const truncatePath = match![2];
            const newFile: File = {
                name: truncatePath,
                type: analyzeFileType(truncatePath),
                size: file.size,
                link: ''
            };
            folders[folderName] = [...(folders[folderName] || []), newFile];
        } else {
            leaves[filename] = {
                name: filename,
                type: type,
                size: file.size ?? 0,
                link: `${currentPath}${filename}`
            };
        }
    }

    // if no folders (all leaves), base case, return (trivial, keep for readablility)
    if (no_folders) {
        return leaves;
    }
    // else, structure = {all leaves, filesToTree(folder1), filesToTree(folder2)}
    for (const folderName of Object.keys(folders)) {
        leaves[folderName] = {
            name: folderName,
            // size: null,
            type: 'DIR', // in this case, unlike above, DIR actually means a real folder
            link: `${currentPath}${folderName}`,
            children: filesToTree(folders[folderName], `${currentPath}${folderName}/`)
        };
    }
    return leaves;
}

export async function GET(req: NextRequest): Promise<NextResponse<FileTree | { error: string }>> {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const user_id = session.user.id;
    try {
        const listCommand = new ListObjectsV2Command({
            Bucket: process.env.SPACES_BUCKET,
            Prefix: `${user_id}/`
        });

        const response = await s3Client.send(listCommand);
        if (!response.Contents) {
            return NextResponse.json({});
        }
        
        const files: File[] = [];
        for (const content of response.Contents!) {
            const fullPath = content.Key as string;
            const match = fullPath.match(/^([^\/]+)\/(.+)$/);
            if (!match) {
                files.push({
                    name: '',
                    size: 0,
                    type: 'UNKNOWN',
                    link: ''
                });
            } else {
              files.push({
                  name: match[2],
                  size: content.Size as number,
                  type: analyzeFileType(match[2]),
                  link: ''
              });
            }
        }
        const tree = filesToTree(files);
        return NextResponse.json(tree);
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: 'Failed to get file list' }, { status: 500 });
    }
}
