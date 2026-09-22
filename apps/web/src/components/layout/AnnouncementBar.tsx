import { Fragment } from "react";
import Link from "next/link";
import { COPY, STORE } from "@/lib/site";

function keepCityIntact(text: string) {
  const token = "Fartura-SP";
  const parts = text.split(token);
  if (parts.length === 1) return text;
  return parts.map((part, index) => (
    <Fragment key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? <span className="whitespace-nowrap">{token}</span> : null}
    </Fragment>
  ));
}

export function AnnouncementBar() {
  return (
    <div
      className="bg-brand-primary text-white text-center px-3 text-xs sm:text-sm overflow-hidden"
      role="region"
      aria-label="Anúncio"
    >
      <Link
        href="/produtos"
        className="hover:underline transition-colors flex min-h-11 items-center justify-center px-1 py-2 leading-snug"
      >
        {keepCityIntact(COPY.announcementPreferred)}
      </Link>
      <span className="sr-only">
        {COPY.announcementAlt}. {STORE.tagline}.
      </span>
    </div>
  );
}
