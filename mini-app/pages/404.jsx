import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | PEOPLE POWER</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="space-x-4">
            <Link href="/" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg inline-block transition-colors">
              Go Home
            </Link>
            <Link href="/admin" className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg inline-block transition-colors">
              Admin Dashboard
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>If you believe this is an error, please contact support.</p>
          </div>
        </div>
      </div>
    </>
  );
}
