export default function NewsletterErrorPage() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h1 className="text-2xl font-bold text-red-700">This link is invalid or has expired</h1>
      <p className="mt-3 text-gray-600">Try subscribing again from the homepage.</p>
    </div>
  );
}
