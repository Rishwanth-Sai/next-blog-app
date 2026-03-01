"use client";
import { assets, blog_data } from '@/Assets/assets'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";


const BlogItem = ({title,description,category,image,id}) => {

  const { status } = useSession();
  const router = useRouter();

  const handleOpen = (e) => {
    if (status !== "authenticated") {
      e.preventDefault();
      // alert("Login to read full blog");
      router.push("/login");
    }
  };

  return (
    <div className='max-w-82.5 sm:max-w-75 bg-white border border-black hover:shadow-[-7px_7px_7px_#000000]'>
      <Link href={`/blogs/${id}`} onClick={handleOpen}>
        <div>
          <Image src={image} alt='' width={400} height={400} className='border-b border-black'/>
        </div>

        <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm'>{category}</p>

        <div className="p-5">
          <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900'>{title}</h5>

          <p className='mb-3 text-sm tracking-tight text-gray-700'
            dangerouslySetInnerHTML={{__html:description.slice(0,110)}} />

          <div className='inline-flex items-center py-2 font-semibold text-center'>
            Read more
            <Image className='ml-2' src={assets.arrow} alt='' width={12}/>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default BlogItem