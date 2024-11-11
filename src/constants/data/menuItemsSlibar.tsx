import {
  FaHome,
  FaMoneyBillWave,
  FaCog,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdGroup, MdPersonAdd } from "react-icons/md";
import { UserRoleEnum } from "../userRole";

export const menuItemsSlibar = [
  {
    title: "MENU",
    items: [
      {
        label: "Branch",
        href: "/branch",
        icon: <FaHome />, // Add an icon
        visible: [
          UserRoleEnum.IT_ADMIN_USER,
          UserRoleEnum.OPERATION_ADMIN_USER,
        ],
      },
      {
        label: "Position",
        href: "/position",
        icon: <FaCog />, // Add an icon
        visible: [
          UserRoleEnum.IT_ADMIN_USER,
          UserRoleEnum.OPERATION_ADMIN_USER,
        ],
      },
      {
        label: "User Management",
        href: "/user-management",
        icon: <MdGroup />, // Add an icon
        visible: [
          UserRoleEnum.IT_ADMIN_USER,
          UserRoleEnum.OPERATION_ADMIN_USER,
        ],
      },
      {
        label: "User Request",
        href: "/user-request",
        icon: <MdPersonAdd />, // Add an icon
        visible: [
          UserRoleEnum.IT_ADMIN_USER,
          UserRoleEnum.OPERATION_ADMIN_USER,
        ],
      },
      {
        label: "Cash Management",
        href: "/cash-management",
        icon: <FaMoneyBillWave />, // Add an icon
        visible: [
          UserRoleEnum.INPUTTER_USER,
          UserRoleEnum.CHECKER_USER,
          UserRoleEnum.AUTHORIZER_USER,
        ],
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
        visible: [
          UserRoleEnum.IT_ADMIN_USER,
          UserRoleEnum.OPERATION_ADMIN_USER,
          UserRoleEnum.AUTHORIZER_USER,
          UserRoleEnum.CHECKER_USER,
          UserRoleEnum.INPUTTER_USER,
        ],
      },
      {
        label: "Logout",
        href: "/logout",
        icon: <FaSignOutAlt />,
        visible: [
          UserRoleEnum.IT_ADMIN_USER,
          UserRoleEnum.OPERATION_ADMIN_USER,
          UserRoleEnum.AUTHORIZER_USER,
          UserRoleEnum.CHECKER_USER,
          UserRoleEnum.INPUTTER_USER,
          UserRoleEnum.NONE,
        ],
      },
    ],
  },
];
