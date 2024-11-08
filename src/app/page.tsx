"use client";

import LoadingFullPage from "@/components/loading/LoadingFullPage";
import { route } from "@/constants/routed";
import { UserRoleEnum } from "@/constants/userRole";
import TokenStorage from "@/utils/localStorage/tokenStorage";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import { useRouter } from "next/navigation";

export default function App() {
  const router = useRouter();
  if (!TokenStorage.getToken()) {
    router.push(`/${route.LOGIN}`);
    return;
  }

  if (
    UserRoleStorage.getUserRole() == UserRoleEnum.IT_ADMIN_USER ||
    UserRoleStorage.getUserRole() == UserRoleEnum.OPERATION_ADMIN_USER
  ) {
    router.push(`/${route.USER_MANAGEMENT}`);
  } else {
    router.push("/cash-management");
  }

  return <LoadingFullPage loading={true}/>;
}
