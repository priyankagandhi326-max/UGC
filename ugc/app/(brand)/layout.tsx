import type { ReactNode } from "react";

import BrandFrame from "@/components/brand/BrandFrame";

export default function BrandLayout({ children }: { children: ReactNode }) {
  return <BrandFrame>{children}</BrandFrame>;
}
