"use client"

import { authClient } from "@/lib/auth-client" // import the auth client
import { columns } from "./columns"
import { type File } from "@/lib/file-types"
import { DataTable } from "./data-table"
import { FileUpload } from "./FileUpload"
import NotLoggedInPage from '../401/page';

const files: File[] = [
    {
        name: 'Project Report',
        size: 1240,
        type: 'PDF',
        link: '/files/project-report.pdf'
    },
    {
        name: 'Design Mockup',
        size: 856,
        type: 'PNG',
        link: '/files/design-mockup.png'
    },
    {
        name: 'Meeting Notes',
        size: 48,
        type: 'TXT',
        link: '/files/meeting-notes.txt'
    },
    {
        name: 'Product Demo',
        size: 153600,
        type: 'DIR',
        link: '/files/product-demo.mp4'
    },
    {
        name: 'Theme Music',
        size: 9200,
        type: 'MP3',
        link: '/files/theme-music.mp3'
    },
    {
        name: 'Archive Backup',
        size: 32200,
        type: 'ZIP',
        link: '/files/archive-backup.zip'
    },
    {
        name: 'Team Plan',
        size: 1024,
        type: 'DOCX',
        link: '/files/team-plan.docx'
    },
    {
        name: 'Budget Sheet',
        size: 2048,
        type: 'XLSX',
        link: '/files/budget-sheet.xlsx'
    }
];

export default function Page() {
    // Retrieve the session using Better Auth's server-side API
    const {
        data: session,
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession();

    if (isPending) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="w-full">
            {session?.user?.name ? (
                <div className="flex">
                    <div className="flex w-full">
                        {/* Left section: 2/3 */}
                        <div className="w-2/3 flex items-center justify-center">
                            <DataTable columns={columns} data={files} />
                        </div>

                        {/* Right section: 1/3 */}
                        <div className="w-1/3 flex items-center justify-center p-4 border-l">
                            <FileUpload />
                        </div>
                    </div>
                </div>
            ) : (
                <NotLoggedInPage />
            )}
        </div>
    );
}