import { HabitTracker } from "@/components/private/users/habits/HabitTracker";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-6 md:gap-6 md:py-6">
      <HabitTracker />
    </div>
  );
}
