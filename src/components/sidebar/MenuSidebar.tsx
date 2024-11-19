/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOpenModalLogout } from "@/redux/features/userSlice";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import { menuItemsSlibar } from "@/constants/data/menuItemsSlibar";
import { UserRoleEnum } from "@/constants/userRole";
import UserTypeStorage from "@/utils/localStorage/userTypeStorage";

const MenuSidebar = () => {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState(pathname);
  const dispatch = useDispatch();
  const role = UserRoleStorage.getUserRole() || UserRoleEnum.NONE;
  const dataType =
    UserTypeStorage.getUserType() == "HO"
      ? UserRoleEnum.SHOW_ALL
      : UserRoleEnum.NONE;

  useEffect(() => {
    setActiveHref(pathname);
  }, [pathname]);

  function onNavigation(item: string) {
    if (item == "/logout") {
      dispatch(setOpenModalLogout());
    } else {
      setActiveHref(item);
    }
  }

  return (
    <div className="bg-gray-700 w-20 lg:w-[16%] xl:w-[14%] overflow-y-scroll px-4  scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <Link
        href="/login-user"
        className="flex mb-4 items-end py-2 gap-2 sticky left-0 right-0 top-0"
      >
        <img src="/img/haha.png" alt="logo" width={52} height={42} />
      </Link>
      <div data-aos="fade-right" className=" ">
        <div className="text-sm flex flex-col space-y-4 text-gray-300">
          {menuItemsSlibar.map((section, index) => (
            <div className="flex flex-col gap-2" key={section.title + index}>
              <span className="hidden lg:block text-white font-light">
                {section.title}
              </span>
              {section.items.map((item, index) => {
                if (
                  item.visible.includes(role as UserRoleEnum) ||
                  item.visible.includes(dataType)
                ) {
                  const isActive = activeHref == item.href;
                  return (
                    <Link
                      prefetch={true}
                      href={item.href == "/logout" ? "" : item.href}
                      key={item.label + index}
                      onClick={() => onNavigation(item.href)}
                      className={`flex mb-2 lg:mb-0 items-center justify-center lg:justify-start gap-2 py-1 md:px-1.5 rounded-md transition-colors ${
                        isActive
                          ? "text-white font-semibold bg-blue-500 shadow-md" // Active background blue-500
                          : "text-gray-400 hover:text-white hover:bg-blue-500 hover:bg-opacity-30" // Hover effect with blue-500
                      }`}
                    >
                      {/* Render the icon */}
                      <span className="text-lg lg:text-sm">{item.icon}</span>
                      <span className="text-sm hidden lg:block overflow-hidden whitespace-nowrap overflow-ellipsis">
                        {item.label}
                      </span>
                    </Link>
                  );
                }
                return null; // Return null if not visible
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuSidebar;
