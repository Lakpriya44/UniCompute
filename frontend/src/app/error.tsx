"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="empty-state" role="alert"><h1>Something went wrong</h1><p>Your saved demo jobs remain in this browser. Try loading this page again.</p><button className="button primary" onClick={reset}>Try again</button></div>;
}
