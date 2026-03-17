import type { ReactNode } from "react";

import CreatorShell from "@/components/dashboard/CreatorShell";

export default function CreatorHubLayout({ children }: { children: ReactNode }) {
  return <CreatorShell>{children}</CreatorShell>;
}
