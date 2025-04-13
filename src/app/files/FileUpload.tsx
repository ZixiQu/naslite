'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FileUpload() {
    const [files, setFiles] = useState<File[]>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false
    });

    const handleUpload = () => {
        if (files.length === 0) return alert('No file selected');
        // Upload the files to Cloud here.
        console.log('Uploading:', files[0]);
    };

    return (
        <div className="flex flex-col items-center space-y-4 w-full">
            <div {...getRootProps()} className={`border-4 border-dashed rounded-3xl p-10 w-full flex flex-col items-center justify-center text-center cursor-pointer transition ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                <input {...getInputProps()} />
                <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Drag & drop your file here or click to select to upload to the current path.</p>
                {files.length > 0 && <p className="text-sm mt-2 text-foreground">Selected: {files[0].name}</p>}
            </div>

            <Button onClick={handleUpload} disabled={files.length === 0}>
                Upload
            </Button>
        </div>
    );
}
