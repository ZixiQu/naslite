'use client';

import { useCallback, useState, useTransition } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SuccessDialog } from '@/components/ui/success-dialog';
import { GetPaths } from '@/lib/get-paths';
import { usePath } from '@/lib/path-context';

export function FileUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();
    const [fileUpload, setFileUpload] = useState(false);
    const { setFileTree } = usePath();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(prev => [...prev, ...acceptedFiles]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: true
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
                files.forEach(file => {
                    formData.append('file', file);
                });

                const result = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!result.ok) {
                    throw new Error('Upload failed');
                }

                const refetchFileTree = await GetPaths();
                if (refetchFileTree.error) {
                    setError(refetchFileTree.error);
                    return;
                }

                setFileTree(refetchFileTree.paths);
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
                    {files.length > 0 && (
                        <div className="text-sm mt-2 text-foreground space-y-1">
                            <p className="font-medium">Selected Files:</p>
                            {files.map((file, index) => (
                                <p key={index} className="ml-2">
                                    • {file.name}
                                </p>
                            ))}
                        </div>
                    )}
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
