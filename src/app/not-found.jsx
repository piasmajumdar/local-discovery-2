import ErrorState from '@/components/ErrorState';

export const metadata = {
    title: '404 - Page Not Found | Local Discovery',
    description: 'Sorry, the page you are looking for does not exist.'
};

export default function NotFound() {
    return (
        <main className="min-h-screen bg-white">
            <ErrorState 
                code="404"
                title="Whoops! You're Lost."
                message="The page you're looking for seems to have vanished into thin air. Let's get you back on track."
            />
        </main>
    );
}
