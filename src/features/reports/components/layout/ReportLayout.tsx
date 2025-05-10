"use client";

import React, { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ReportLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function ReportLayout({
  children,
  header,
  footer,
  className = "",
}: ReportLayoutProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {header}
      <Card className="p-4">{children}</Card>
      {footer}
    </div>
  );
}
