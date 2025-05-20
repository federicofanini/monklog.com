import { HabitStats } from "@/components/private/users/habits/HabitStats";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function HabitsPage() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <HabitStats userId={user?.id} />
    </div>
  );
}
