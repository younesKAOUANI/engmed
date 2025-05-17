import React from "react";
import Image from "next/image";
import { RiDashboardFill } from "react-icons/ri";
import Menu, { MenuItem } from "./Menu";
import { signOut } from "next-auth/react";
import { FiBook } from "react-icons/fi";
import { FaUsers } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import { LucideSpeech } from "lucide-react";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";


export default function AdminSidebar() {
  return (
    <div className="fixed top-0 left-0 h-full flex flex-col items-center w-[250px] bg-white py-6 text-gray-700 shadow-md">
      <div className="flex flex-col items-center justify-center gap-2 pb-8 mb-8 border-b-2 border-gray-700 mx-4">
        <Image src="/logo.png" width={32} height={32} alt="logo" />
        <p className="text-gray-700 font-bold text-xl uppercase">Admin Panel</p>
      </div>
      <Menu>
        <MenuItem href={"/admin"}>
          <RiDashboardFill className="text-2xl" /> Dashboard
        </MenuItem>
        <MenuItem href={"/admin/courses"}>
          <FiBook className="text-2xl" /> Courses
        </MenuItem>
        <MenuItem href={"/admin/users"}>
          <FaUsers className="text-2xl" /> Users
        </MenuItem>
        <MenuItem href={"/admin/events"}>
          <MdEventNote className="text-2xl" /> Events
        </MenuItem>
        <MenuItem href={"/admin/speech-quizzes"}>
          <LucideSpeech className="text-2xl" /> Speech Quizzes
        </MenuItem>
        <MenuItem href={"/admin/settings"}>
          <IoMdSettings className="text-2xl" /> Settings
        </MenuItem>
        <MenuItem href={"/admin/profile"}>
          <CgProfile className="text-2xl" /> Profile
        </MenuItem>
      </Menu>
        <button
          onClick={signOut}
          className="p-2 bg-red-500 mt-auto text-white rounded-md hover:bg-red-600 w-48 "
        >
          Logout
        </button>
    </div>
  );
}