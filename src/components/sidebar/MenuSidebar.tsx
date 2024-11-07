import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setOpenModalLogout } from "@/redux/features/userSlice";
import Image from "next/image";
import UserRoleStorage from "@/utils/localStorage/userRoleStorage";
import { menuItemsSlibar } from "@/constants/data/menuItemsSlibar";
import { UserRoleEnum } from "@/constants/userRole";

const MenuSidebar = () => {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState(pathname);
  const dispatch = useDispatch();
  const role = UserRoleStorage.getUserRole() || UserRoleEnum.NONE;

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
    <div className="bg-gray-700 w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] overflow-y-scroll px-4  scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <Link
        href="/login"
        className="flex items-end py-2 gap-2 sticky left-0 right-0 top-0"
      >
        <Image src="/img/logo.png" alt="logo" width={32} height={32} />
        <span className="hidden lg:block font-bold text-white">
          Cash Management
        </span>
      </Link>
      <div data-aos="fade-right" className=" ">
        <div className="text-sm text-gray-300">
          {menuItemsSlibar.map((section, index) => (
            <div className="flex flex-col gap-2" key={section.title + index}>
              <span className="hidden lg:block text-white font-light mt-4">
                {section.title}
              </span>
              {section.items.map((item, index) => {
                if (item.visible.includes(role as UserRoleEnum)) {
                  const isActive = activeHref == item.href;
                  return (
                    <Link
                      prefetch={true}
                      href={item.href == "/logout" ? "" : item.href}
                      key={item.label + index}
                      onClick={() => onNavigation(item.href)}
                      className={`flex items-center justify-center lg:justify-start gap-2 py-2 md:px-2 rounded-md transition-colors ${
                        isActive
                          ? "text-white font-semibold bg-blue-500 shadow-md" // Active background blue-500
                          : "text-gray-400 hover:text-white hover:bg-blue-500 hover:bg-opacity-30" // Hover effect with blue-500
                      }`}
                    >
                      {/* Render the icon */}
                      <span className="text-xl">{item.icon}</span>
                      <span className="hidden lg:block overflow-hidden whitespace-nowrap overflow-ellipsis">
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
