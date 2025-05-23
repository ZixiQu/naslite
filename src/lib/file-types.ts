export const supportedFileTypes = ['DIR', 'MP4', 'MP3', 'JPG', 'JPEG', 'PNG', 'TXT', 'PDF', 'DOCX', 'XLSX', 'ZIP'] as const
export type FileType = typeof supportedFileTypes[number]

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type File = {
  name: string
  size?: number   // if type is DIR, will not calculate size, undefined
  type: FileType | "UNKNOWN"
  link: string
  children?: FileTree 
}


export type FileTree = {
  [key: string]: File; // tree or leaf with files
};