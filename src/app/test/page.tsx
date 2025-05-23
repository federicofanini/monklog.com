import { getPublicProfile } from "@/packages/database/user/public-profile";

export default async function Test() {
  const profile = await getPublicProfile("demo");
  return <div>{JSON.stringify(profile)}</div>;
}
