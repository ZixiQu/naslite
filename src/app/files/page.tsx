"use client"

import { authClient } from "@/lib/auth-client" // import the auth client
import { File, columns } from "./columns"
import { DataTable } from "./data-table"

const files: File[] = [
  {
    name: "Project Report",
    size: 1240,
    type: "PDF",
    link: "/files/project-report.pdf",
  },
  {
    name: "Design Mockup",
    size: 856,
    type: "PNG",
    link: "/files/design-mockup.png",
  },
  {
    name: "Meeting Notes",
    size: 48,
    type: "TXT",
    link: "/files/meeting-notes.txt",
  },
  {
    name: "Product Demo",
    size: 153600,
    type: "Directory",
    link: "/files/product-demo.mp4",
  },
  {
    name: "Theme Music",
    size: 9200,
    type: "MP3",
    link: "/files/theme-music.mp3",
  },
  {
    name: "Archive Backup",
    size: 32200,
    type: "ZIP",
    link: "/files/archive-backup.zip",
  },
  {
    name: "Team Plan",
    size: 1024,
    type: "DOCX",
    link: "/files/team-plan.docx",
  },
  {
    name: "Budget Sheet",
    size: 2048,
    type: "XLSX",
    link: "/files/budget-sheet.xlsx",
  },
]

export default function Page() {
  // Retrieve the session using Better Auth's server-side API
  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = authClient.useSession() 

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
      <div className="w-full">
          {session?.user?.name ? (
              <DataTable columns={columns} data={files} />
          ) : (
              <h1 className="text-6xl font-bold mb-4">Not logged in</h1>
          )}
      </div>
  );
}