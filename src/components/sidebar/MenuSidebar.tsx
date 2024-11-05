import { UserRole } from "@/constants/userRole";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaUsers,
  FaHome,
  FaMoneyBillWave,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa"; // Import the icons you want to use
import ModalConfirmation from "../modal/ModalConfirmation";
import { clearLocalStorage } from "@/utils/localStorage/auth";
import { route } from "@/constants/routed";
import showToast from "../toast/useToast";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setOpenModalLogout } from "@/redux/features/userSlice";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        label: "Department",
        href: "/department",
        icon: <FaUsers />, // Add an icon
        visible: [UserRole.IT_ADMIN_USER, "teacher", "student", "parent"],
      },
      {
        label: "Branch",
        href: "/branch",
        icon: <FaHome />, // Add an icon
        visible: [UserRole.IT_ADMIN_USER, "teacher", "student", "parent"],
      },
      {
        label: "Position",
        href: "/position",
        icon: <FaCog />, // Add an icon
        visible: [UserRole.IT_ADMIN_USER],
      },
      {
        label: "User Management",
        href: "/user-management",
        icon: <FaUserCircle />, // Add an icon
        visible: [UserRole.IT_ADMIN_USER],
      },
      {
        label: "User Request",
        href: "/user-request",
        icon: <FaUserCircle />, // Add an icon
        visible: [UserRole.IT_ADMIN_USER],
      },
      {
        label: "Cash Management",
        href: "/cash-management",
        icon: <FaMoneyBillWave />, // Add an icon
        visible: [UserRole.IT_ADMIN_USER],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        label: "Profile",
        href: "/profile",
        icon: <FaUserCircle />,
        visible: [UserRole.IT_ADMIN_USER],
      },
      {
        label: "Logout",
        href: "/logout",
        icon: <FaSignOutAlt />,
        visible: [UserRole.IT_ADMIN_USER],
      },
    ],
  },
];

const role = UserRole.IT_ADMIN_USER;

const MenuSidebar = () => {
  const pathname = usePathname();
  const [activeHref, setActiveHref] = useState(pathname);
  const dispatch = useDispatch();

  useEffect(() => {
    setActiveHref(pathname);
  }, [pathname]);

  function onNavigation(item: string) {
    if (item == "/logout") {
      dispatch(setOpenModalLogout());
    }
    setActiveHref(item);
  }

  return (
    <div
      data-aos="fade-right"
      className="bg-gray-700 w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] overflow-y-scroll px-4 py-16 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
    >
      <div className="text-sm text-gray-300">
        {menuItems.map((section, index) => (
          <div className="flex flex-col gap-2" key={index}>
            <span className="hidden lg:block text-white font-light my-4">
              {section.title}
            </span>
            {section.items.map((item, index) => {
              if (item.visible.includes(role)) {
                const isActive = activeHref === item.href;
                return (
                  <Link
                    href={item.href == "/logout" ? "" : item.href}
                    key={index}
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
  );
};

export default MenuSidebar;
