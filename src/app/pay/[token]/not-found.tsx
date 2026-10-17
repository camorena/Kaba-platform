import {
  getPublishedContactInfo,
  getPublishedHeroCopy,
} from "@/lib/cms/public";
import { getPayMessages } from "@/lib/pay/messages";
import Link from "next/link";

/** 404 for unknown, demo (in production) or not-yet-payable pay links. */
export default function PayNotFoundPage() {
  const m = getPayMessages("en");
  return (
    <PayNotFound
      title={m.notFoundTitle}
      body={m.notFoundBody}
      contact={getPublishedContactInfo()}
      brandName={getPublishedHeroCopy().name}
    />
  );
}

function PayNotFound({
  title,
  body,
  contact,
  brandName,
}: {
  title: string;
  body: string;
  contact: { phone: string; phoneHref: string };
  brandName: string;
}) {
  return (
    <div className="rounded-xl border border-ink/10 px-5 py-8 text-center">
      <h1 className="font-display text-xl font-semibold text-ink">{title}</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      <p className="mt-4 text-sm">
        <a
          href={contact.phoneHref}
          className="font-semibold text-bronze-dark hover:underline dark:text-bronze-light"
        >
          {contact.phone}
        </a>
        {" · "}
        <Link href="/" className="font-semibold text-ink hover:underline">
          {brandName}
        </Link>
      </p>
    </div>
  );
}
