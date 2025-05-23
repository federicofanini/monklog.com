import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { FoodPage } from "@/components/private/food/food-page";

export default function Food() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[500px] w-full">
          <Loader2 className="h-8 w-8 animate-spin text-red-500/50" />
        </div>
      }
    >
      <FoodPage />
    </Suspense>
  );
}
