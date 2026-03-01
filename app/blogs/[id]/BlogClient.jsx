"use client";
export const dynamic = "force-dynamic";

import { assets } from "@/Assets/assets";
import Footer from "@/Components/Footer";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import BackButton from "@/Components/BackButton";
import ProfileMenu from "@/Components/ProfileMenu";

export default function Page() {
  const { id } = useParams();
  const { status } = useSession();

  const router = useRouter();
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const fetchBlogData = async () => {
    const response = await axios.get(`/api/blog/${id}`);
    setData(response.data);
  };

  useEffect(() => {
    if (id) fetchBlogData();
  }, [id]);

  const handleVote = async (value) => {
    if (status !== "authenticated") {
      alert("Login to vote");
      return;
    }

    await axios.post(`/api/blog/${id}/vote`, { value });
    fetchBlogData();
  };

  if (!data) return null;

  return (
    <>
      <div className="bg-gray-200 py-5 px-5 md:px-12 lg:px-28">
        <div className="flex justify-between items-center">
            <Image
              src={assets.logo}
              alt=""
              width={180}
              className="w-32.5 sm:w-auto"
            />
            <ProfileMenu showHomeLink={true}/>
        </div>

        <BackButton from={from} />
        <div className="text-center my-24">
          <h1 className="text-5xl font-semibold max-w-175 mx-auto">
            {data.title}
          </h1>

          <p className="mt-4 text-lg text-gray-700">By {data.user?.username}</p>
        </div>
      </div>

      <div className="mx-5 max-w-200 md:mx-auto -mt-25 mb-10">
        <Image
          src={data.image}
          alt=""
          width={1280}
          height={720}
          className="border-4 border-white"
        />
        <span className="flex mt-4 text-xl justify-center font-semibold">
          Score : {data.score}
        </span>
        {/* <div className="mt-6 space-y-6 text-lg leading-relaxed">
          {data.description
            .split("\n")
            .map((para, index) =>
              para.trim() ? <p key={index}>{para}</p> : null,
            )}
        </div> */}
        <div className="mt-6 space-y-4 text-lg leading-relaxed">
          {data.description.split("\n").map((line, index) => {
            const text = line.trim();
            if (!text) return null;

            const isHeading =
              text.endsWith(":") && text.length <= 60 && !/[.!?]$/.test(text); // avoid sentences

            if (isHeading) {
              return (
                <p key={index} className="font-semibold text-xl mt-6">
                  {text}
                </p>
              );
            }

            return <p key={index}>{text}</p>;
          })}
        </div>

        {/* Voting Section */}
        <div className="flex items-center gap-6 mt-10">
          <button
            onClick={() => handleVote(1)}
            className={`px-3 py-1 cursor-pointer rounded ${
              data.currentUserVote === 1
                ? "bg-green-600 text-white"
                : "bg-gray-200 dark:invert"
            }`}
          >
            ▲ Upvote
          </button>

          <button
            onClick={() => handleVote(-1)}
            className={`px-3 py-1 cursor-pointer rounded ${
              data.currentUserVote === -1
                ? "bg-red-600 text-white"
                : "bg-gray-200 dark:invert"
            }`}
          >
            ▼ Downvote
          </button>
        </div>

        <div className="my-24">
          <p className="text-black font-semibold my-4">
            Share this on social media
          </p>
          <div className="flex gap-3">
            <Link href={"https://www.facebook.com/"}>
              <Image src={assets.facebook_icon} alt="" width={50} />
            </Link>
            <Link href={"https://x.com/"}>
              <Image src={assets.twitter_icon} alt="" width={50} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
