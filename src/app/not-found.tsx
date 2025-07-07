export const dynamic = 'force-static';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-center text-2xl font-bold mb-4">404 – Page not found</h1>
      <p className="text-center text-lg text-gray-500">Sorry, the page you are looking for does not exist.</p>
    </main>
  );
} 