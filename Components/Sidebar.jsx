"use client"
import { assets } from "@/Assets/assets";
import Image from "next/image";
import Link from "next/link";
import React from "react";
// import { useSession } from "next-auth/react";

const Sidebar = () => {
  // const { data: session } = useSession();

  return (
    <div className="flex flex-col bg-slate-100">
      <div className="px-2 sm:pl-14 py-3 border border-black">
        <Image src={assets.logo} alt="" width={120} />
      </div>
      <div className="w-28 sm:w-80 h-screen relative py-12 border border-black">
        <div className="w-[50%] sm:w-[80%] absolute right-0">
          <Link
            href="/"
            className="flex items-center border border-black gap-3 font-medium px-3 py-2 my-5 bg-white shadow-[-5px_5px_0px_#000000]"
          >
            <p>Home</p>
          </Link>
          <Link
            href="/dashboard/create"
            className="flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
          >
            <Image src={assets.add_icon} alt="" width={28} />
            <p>Create a Blog</p>
          </Link>
          <Link
            href="/dashboard/myblogs"
            className="mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]"
          >
            <Image src={assets.blog_icon} alt="" width={28} />
            <p>Your Blogs</p>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center border border-black gap-3 font-medium px-3 py-2 my-5 bg-white shadow-[-5px_5px_0px_#000000]"
          >
            <p>Dashboard</p>
          </Link>
          {/* {session?.user?.role === "admin" && (
            <Link href="/admin" className="flex items-center border border-black gap-3 font-medium px-3 py-2 my-5 bg-white shadow-[-5px_5px_0px_#000000]">
              Admin Panel
            </Link>
          )} */}
          {/* <Link href='/admin/dashboard/subscriptions' className='mt-5 flex items-center border border-black gap-3 font-medium px-3 py-2 bg-white shadow-[-5px_5px_0px_#000000]'>
                    <Image src={assets.email_icon} alt='' width={28}/><p>Subscriptions</p>
                </Link> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;