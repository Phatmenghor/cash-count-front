/* eslint-disable react-hooks/exhaustive-deps */
import UserManagementService from "@/redux/service/userManagementService";
import { AppDispatch, RootState } from "@/redux/store";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ModalConfirmation from "../modal/ModalConfirmation";
import { setCloseModalLogout } from "@/redux/features/userSlice";
import { clearLocalStorage } from "@/utils/localStorage/auth";
import { route } from "@/constants/routed";
import { useRouter } from "next/navigation";
import showToast from "../toast/useToast";
import Link from "next/link";

const Navbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { userData, isOpenLogout } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (isOpenLogout) {
      setIsDialogOpen(true);
    }
  }, [isOpenLogout]);

  async function fetchData() {
    dispatch(UserManagementService.getUserByToken());
  }

  function onCloseModal() {
    dispatch(setCloseModalLogout());
    setIsDialogOpen(false);
  }

  const handleLogout = () => {
    clearLocalStorage();
    router.replace(`/${route.LOGIN}`);
    showToast("You have successfully logged out.", "success");
    onCloseModal();
  };

  function onClickNotification() {
    router.push("/user-request");
  }

  return (
    <div className="flex items-center justify-end p-4 ">
      {/* SEARCH BAR */}
      <div className="flex items-center gap-6 justify-end w-full">
        <div
          onClick={onClickNotification}
          className="bg-gray-50 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer shadow relative"
        >
          <Image
            src="/img/announcement.png"
            alt="Notifications"
            width={20}
            height={20}
          />
          <div className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-purple-400 text-white rounded-full text-xs shadow-sm">
            2
          </div>
        </div>
        <div className="flex flex-col text-gray-700">
          <span className="text-xs leading-3 font-medium">
            {userData?.name}
          </span>
          <span className="text-[10px] text-gray-500 text-right">
            {userData?.role.name}
          </span>
        </div>
        <Link href="/profile" prefetch={true}>
          <Image
            src="/img/avatar.png"
            alt="User avatar"
            width={36}
            height={36}
            className="rounded-full border border-gray-200 shadow-sm"
          />
        </Link>
      </div>

      {/* Confirmation Dialog */}
      <ModalConfirmation
        isOpen={isDialogOpen}
        title="Confirm Logout!"
        onClose={onCloseModal}
        onConfirm={handleLogout}
        message={`Are you sure you want to log out, ${userData?.name ?? ""}?`}
      />
    </div>
  );
};

export default Navbar;
