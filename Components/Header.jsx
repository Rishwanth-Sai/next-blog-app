"use client";

import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/Assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import ProfileMenu from "./ProfileMenu";

const Header = () => {
  const { status } = useSession();
  const { data: session } = useSession();

  return (
    <div className="py-5 px-5 md:px-12 lg:px-28">
      <div className="flex justify-between items-center">
        <Image
          src={assets.logo}
          width={180}
          alt=""
          className="w-32.5 sm:w-auto"
        />
        <div className="flex gap-4 items-center">
          {status !== "authenticated" && (
            <>
              <Link href="/login" className="px-4 py-2 border border-black">
                Login
              </Link>
              <Link href="/signup" className="px-4 py-2 bg-black text-white">
                Signup
              </Link>
            </>
          )}

          {status === "authenticated" && (
            <>
              {/* {session?.user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="bg-black text-white px-4 py-2 ml-4"
                >
                  Admin Panel
                </Link>
              )} */}
              <ProfileMenu />
              {/* <Link href="/dashboard" className="px-4 py-2 border border-black">
                Dashboard
              </Link> */}
              {/* <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 bg-black text-white cursor-pointer"
              >
                Logout
              </button> */}
            </>
          )}
        </div>
      </div>
      <div className="text-center my-8">
        <h1 className="text-3xl sm:text-5xl font-medium">Blogs</h1>
        <p className="mt-10 max-w-185 m-auto text-xs sm:text-base">
          Thoughtful reads on technology, lifestyle, travel, food, and finance
        </p>
      </div>
    </div>
  );
};

export default Header;
