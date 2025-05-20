"use client";

import { Button } from "@/components/ui/button";

interface RelapseButtonProps {
  id: string;
  name: string;
}

export function RelapseButton({ id, name }: RelapseButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="justify-start hover:bg-red-500/20 hover:text-red-500"
      onClick={(e) => {
        const input = document.createElement("input");
        input.type = "checkbox";
        input.name = id;
        input.checked = !e.currentTarget.classList.contains("bg-red-500/20");
        input.hidden = true;
        e.currentTarget.appendChild(input);
        e.currentTarget.classList.toggle("bg-red-500/20");
        e.currentTarget.classList.toggle("text-red-500");
      }}
    >
      {name}
    </Button>
  );
}
