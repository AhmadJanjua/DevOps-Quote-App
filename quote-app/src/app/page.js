'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [visit, set_visit] = useState({
    loading: true,
    error: null,
    count: null,
    quote: '',
    author: '',
  });

  // update visit from api response
  useEffect(() => {
    const fetch_visit = async () => {
      // call api
      const response = await fetch('/api/visit');

      // update with json response if valid
      if (response.ok) {
        const data = await response.json();

        set_visit({
          loading: false,
          error: null,
          count: data.count,
          quote: data.quote,
          author: data.author,
        });

      // otherwise fill with failed values
      } else {
        set_visit({
          loading: false,
          error: err.message,
          count: 0,
          quote: '',
          author: '',
        });
      }
    };

    fetch_visit();
  }, []);

  // show loading screen
  if (visit.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-xl">Loading…</p>
      </div>
    );
  }

  // show error screen
  if (visit.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl">
          Error: {visit.error}
        </p>
      </div>
    );
  }

  // show successful screen
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl">
          You are visitor number {visit.count}
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md max-w-lg text-center">
          <p className="italic text-lg text-black mb-2">
            “{visit.quote}”
          </p>
          <p className="text-right text-md text-gray-500">
            - {visit.author || 'Unknown'}
          </p>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center">
        <span>© {new Date().getFullYear()} Ahmad Janjua</span>
      </footer>
    </div>
  );
}
