"use client";

import { Button } from "./button";

export function RetryButton() {
  return (
    <Button
      onClick={() => window.location.reload()}
      className="bg-red-500 hover:bg-red-600"
    >
      Retry
    </Button>
  );
}
