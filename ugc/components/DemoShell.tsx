"use client";

import type { ReactNode } from "react";

import BrandHeader from "@/components/brand/BrandHeader";

export default function DemoShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <BrandHeader title={title} subtitle={subtitle} actions={actions} />
      {children}
    </div>
  );
}
