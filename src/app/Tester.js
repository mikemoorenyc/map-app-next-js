import { auth } from "./auth";

export default async function Tester() {
  const session = await auth()
  console.log(session);
}