import { HabitTracker } from "@/components/private/users/habits/HabitTracker";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function Page() {
  const { getUser } = await getKindeServerSession();
  const user = await getUser();

  return (
    <div className="flex flex-col gap-4 p-6 md:gap-6 md:py-6">
      <HabitTracker userId={user?.id} />
    </div>
  );
}
