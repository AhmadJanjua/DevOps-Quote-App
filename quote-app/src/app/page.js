'use client';
import { useEffect, useState } from 'react';

// calls the server side api to get the quotes and visit count
export async function fetchVisit(set_visit) {
  // update with json response if valid
  try {
    const response = await fetch('/api/visit');

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
        error: `Error ${response.status}: ${response.statusText}`,
        count: 0,
        quote: '',
        author: '',
      });
    }

  } catch (err) {
      set_visit({
        loading: false,
        error: err.message,
        count: 0,
        quote: '',
        author: '',
      });
  }
}

// renders loading screen
export function LoadingDiv() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-500 text-xl">Loading…</p>
    </div>
  );
}

// render error message
export function ErrorDiv({error}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-red-500 text-xl">
        Error: {error}
      </p>
    </div>
  );
}

// renders the quote screen
export function QuoteDiv({count, quote, author, name}) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-2xl">
          You are visitor number {count || '1'}
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md max-w-lg text-center">
          <p className="italic text-lg text-black mb-2">
            “{quote || 'Quote went missing >_<'}”
          </p>
          <p className="text-right text-md text-gray-500">
            - {author || 'Unknown'}
          </p>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center">
        <span>© {new Date().getFullYear()} {name}</span>
      </footer>
    </div>
  );
}

export default function Home() {
  const [visit, set_visit] = useState({
    loading: true,
    error: null,
    count: null,
    quote: '',
    author: '',
  });

  // update visit from api response
  useEffect(() => { fetchVisit(set_visit); }, []);

  // show loading screen
  if (visit.loading) {
    return <LoadingDiv />;
  }

  // show error screen
  if (visit.error) {
    return <ErrorDiv error={visit.error} />;
  }

  // show successful screen
  return <QuoteDiv count={visit.count} quote={visit.quote} author={visit.author} name={"Ahmad Janjua"} />;
}
