"use client";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';
import { Card } from '@/components/ui/card';

export default function ProfilePage () {
    return (
        <div className='flex items-center justify-center w-full h-screen'>
            <div className='w-[935px] h-full px-[20px] pt-[30px] flex flex-col'>
                <div className='flex flex-col gap-[30px]'>
                    <div className='flex flex-row'>
                        {/* profile image */}
                        <div className='w-[283.67px] h-[181px] '>
                            <div className='w-[51.12px] h-[42px] bg-gray-700 flex justify-center items-center rounded-md text-xs text-gray-400'>Note... </div>
                            <div className='w-[150px] h-[150px] bg-gray-300 rounded-full overflow-hidden'>
                                {/* <img src='https://via.placeholder.com/283.67x181' alt='Profile Background' className='w-full h-full rounded-full' /> */}
                                <div
                                    className="h-1/2 box-border group relative bg-slate-400 bg-cover bg-center"
                                    // style={{
                                    // backgroundImage: `url(${
                                    //     images.cover.preview || "https://shorturl.at/reOZ8"
                                    // })`,
                                    // }}
                                ></div>
                            </div>
                        </div> 
                        <div className='flex flex-col ml-[20px] gap-[30px]'>
                            <div className='text-[20px] font-normal flex flex-row items-center gap-[8px]'>
                                <div>@username</div>
                                <Button variant="secondary" onClick={() => window.location.href = "/accounts/edit/"} >Edit profile</Button>  
                                <Button variant="secondary">View archive</Button>
                            </div>
                            <div className='text-[16px] text-gray-400 flex flex-row gap-[30px]'>
                                <div>posts</div>
                                <div>followers</div>
                                <div>following</div>
                            </div>
                            <div className='text-[16px] text-gray-500'>Bio goes here</div>
                        </div>
                    </div>
                    {/* highlights section */}
                    <div className='w-full'>
                        <div role="tab" className='w-[89px] flex flex-col items-center cursor-pointer'>
                            <div className='w-[89px] h-[89px] rounded-full border border-gray-400 flex items-center justify-center'>
                                <div className='w-[77px] h-[77px] rounded-full bg-gray-900 flex items-center justify-center'>
                                    <Plus />
                                </div>
                            </div>
                            <div>New</div>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col mt-[30px]'>
                    <div className='flex flex-row justify-center gap-[30px] border-t border-gray-300 pt-[20px]'>
                        <a aria-selected="true" role="tab" className='text-[16px] font-medium text-gray-500 hover:text-white'>Posts</a>
                        <a aria-selected="false" role="tab" className='text-[16px] font-medium text-gray-500 hover:text-white'>Saved</a>
                        <a aria-selected="false" role="tab" className='text-[16px] font-medium text-gray-500 hover:text-white'>Tagged</a>
                    </div>
                    <div className='mt-[20px]'>
                        <div className='grid grid-cols-3 gap-[10px]'>
                            {/* Example posts */}
                            <div className='w-full aspect-square bg-gray-300'></div>
                            {/* <div className='w-full aspect-square bg-gray-300'></div>
                            <div className='w-full aspect-square bg-gray-300'></div>
                            <div className='w-full aspect-square bg-gray-300'></div>
                            <div className='w-full aspect-square bg-gray-300'></div>
                            <div className='w-full aspect-square bg-gray-300'></div> */}
                        </div>
                    </div>
                </div>
                <footer className='w-full mt-auto py-[20px] border-gray-300 text-center text-gray-500 text-[14px]'>
                    <div className='w-full flex justify-center gap-[15px] mt-[10px]'>
                        <a href='#' className='hover:underline'>About</a>
                        <a href='#' className='hover:underline'>Blog</a>
                        <a href='#' className='hover:underline'>Help</a>
                        <a href='#' className='hover:underline'>Locations</a>
                        <a href='#' className='hover:underline'>Privacy</a>
                        <a href='#' className='hover:underline'>Terms</a>
                        <a href='#' className='hover:underline'>Contact</a>
                    </div>
                    <p>&copy; {new Date().getFullYear()} Instagram Clone. All rights reserved.</p>
                </footer>
            </div>
        </div>
    )
}
