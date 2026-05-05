'use client';
import { useEffect } from 'react';
import ErrorState from '@/components/ErrorState';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Runtime Error:", error);
    }, [error]);

    return (
        <main className="min-h-screen bg-white">
            <ErrorState 
                code="500"
                title="Something went wrong!"
                message="An unexpected error occurred while rendering this page. Our team has been notified."
                reset={reset}
            />
        </main>
    );
}
