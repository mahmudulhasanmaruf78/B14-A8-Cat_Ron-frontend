import React from "react";
import { LoadingSpinner } from "@/components/common/Loading";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <LoadingSpinner text="Loading..." />
    </div>
  );
}
