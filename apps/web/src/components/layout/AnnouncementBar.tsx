import Link from "next/link";
import { COPY, STORE } from "@/lib/site";

export function AnnouncementBar() {
  return (
    <div
      className="bg-brand-primary text-white text-center py-2.5 px-3 text-xs sm:text-sm overflow-hidden"
      role="region"
      aria-label="Anúncio"
    >
      <Link
        href="/produtos"
        className="hover:underline transition-colors block leading-snug px-1 min-h-8 flex items-center justify-center"
      >
        {COPY.announcementPreferred}
      </Link>
      <span className="sr-only">
        {COPY.announcementAlt}. {STORE.tagline}.
      </span>
    </div>
  );
}
