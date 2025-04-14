'use client';

import { useCallback, useState, useTransition } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SuccessDialog } from '@/components/ui/success-dialog';

export function FileUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();
    const [fileUpload, setFileUpload] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false
    });

    const handleUpload = () => {
        if (files.length === 0) {
            setError('No file selected.');
            return;
        }

        setError('');
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.append('file', files[0]);

                const result = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!result.ok) {
                    throw new Error('Upload failed');
                }
                setFileUpload(true);
                setFiles([]);
            } catch {
                setError('Failed to upload file.');
            }
        });
    };

    return (
        <>
            <div className="flex flex-col items-center space-y-4 w-full">
                <div {...getRootProps()} className={`border-4 border-dashed rounded-3xl p-10 w-full flex flex-col items-center justify-center text-center cursor-pointer transition ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}`}>
                    <input {...getInputProps()} />
                    <UploadCloud className="w-10 h-10 mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Drag & drop your file here or click to select to upload to the current path.</p>
                    {files.length > 0 && <p className="text-sm mt-2 text-foreground">Selected: {files[0].name}</p>}
                </div>

                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

                <Button onClick={handleUpload} disabled={files.length === 0 || isPending}>
                    {isPending ? 'Uploading...' : 'Upload'}
                </Button>
            </div>

            <SuccessDialog open={fileUpload} message="Your file was uploaded successfully." onClose={() => setFileUpload(false)} />
        </>
    );
}
