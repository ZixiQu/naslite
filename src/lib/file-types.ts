export const supportedFileTypes = ['PNG', 'TXT', 'MP4', 'MP3', 'PDF', 'ZIP', 'DOCX', 'XLSX', 'DIR', 'JPG', 'JPEG'] as const
export type FileType = typeof supportedFileTypes[number]

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type File = {
  name: string
  size: number
  type: FileType | "UNKNOWN"
  link: string
  deleteLink?: string
}