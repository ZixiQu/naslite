'use client';

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from '@/components/ui/alert-dialog';
import { CheckCircleIcon } from 'lucide-react';

interface SuccessDialogProps {
    open: boolean;
    message: string;
    onClose: () => void;
}

export function SuccessDialog({ open, message, onClose }: SuccessDialogProps) {
    return (
        <AlertDialog open={open}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader className="flex flex-col items-center text-center space-y-2">
                    <CheckCircleIcon className="w-8 h-8 text-green-500" />
                    <AlertDialogTitle className="text-xl">Action Successful</AlertDialogTitle>
                    <AlertDialogDescription className="text-base text-muted-foreground">{message}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-center mt-4">
                    <AlertDialogAction onClick={onClose} className="px-6 py-2 cursor-pointer">
                        OK
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
