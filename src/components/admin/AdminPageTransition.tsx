"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/** Lightweight enter animation on route change — CSS only, no framer. */
export default function AdminPageTransition({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  return (
    <div key={key} className="admin-page-enter">
      {children}
    </div>
  );
}
