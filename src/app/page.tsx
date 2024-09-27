import { route } from "@/utils/constants/routed";
import { redirect } from "next/navigation";

export default function App() {
  return redirect(route.Login);
}
