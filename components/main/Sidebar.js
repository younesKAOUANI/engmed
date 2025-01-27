import React from "react";
import Image from "next/image";
import { RiDashboardFill } from "react-icons/ri";
import Menu, { MenuItem } from "./Menu";

export default function Sidebar({ type }) {
  if (type === "admin") {
    return <AdminSidebar />;
  }
  return <DefaultSidebar />;
}

const DefaultSidebar = () => (
  <div className="fixed top-0 left-0 h-full w-[200px] bg-white py-6 text-gray-700 shadow-md">
    <div className="flex items-center justify-center gap-2 pb-8 mb-8 border-b-2 border-gray-700 mx-4">
      <Image src="/logo.png" width={32} height={32} alt="logo" />
      <p className="text-gray-700 font-bold text-2xl">EngMed</p>
    </div>
    <Menu>
      <MenuItem href={"/dashboard"}>
        <RiDashboardFill className="text-2xl" /> Dashboard
      </MenuItem>
      <MenuItem href={"/dashboard/courses"}>
        <RiDashboardFill className="text-2xl" /> Courses
      </MenuItem>
      <MenuItem href={"/dashboard/enrollements"}>
        <RiDashboardFill className="text-2xl" /> Enrollements
      </MenuItem>
      <MenuItem href={"/dashboard/certifications"}>
        <RiDashboardFill className="text-2xl" /> Certifications
      </MenuItem>
      <MenuItem href={"/dashboard/settings"}>
        <RiDashboardFill className="text-2xl" /> Settings
      </MenuItem>
    </Menu>
  </div>
);

const AdminSidebar = () => (
  <div className="fixed top-0 left-0 h-full w-[200px] bg-white py-6 text-gray-700 shadow-md">
    <div className="flex flex-col items-center justify-center gap-2 pb-8 mb-8 border-b-2 border-gray-700 mx-4">
      <Image src="/logo.png" width={32} height={32} alt="logo" />
      <p className="text-gray-700 font-bold text-xl uppercase">Admin Panel</p>
    </div>
    <Menu>
      <MenuItem href={"/admin"}>
        <RiDashboardFill className="text-2xl" /> Dashboard
      </MenuItem>
      <MenuItem href={"/admin/courses"}>
        <RiDashboardFill className="text-2xl" /> Courses
      </MenuItem>
      <MenuItem href={"/admin/settings"}>
        <RiDashboardFill className="text-2xl" /> Settings
      </MenuItem>
      <MenuItem href={"/admin/profile"}>
        <RiDashboardFill className="text-2xl" /> Profile
      </MenuItem>
    </Menu>
  </div>
);
