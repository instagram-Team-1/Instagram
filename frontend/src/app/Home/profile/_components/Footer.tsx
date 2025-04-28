import React from 'react'

const Footer = () => {
  return (
    <div className="w-full mt-auto py-[20px] border-gray-300 text-center text-gray-500 text-[14px]">
      <div className="w-full flex justify-center gap-[15px] mt-[10px]">
        <a href="#" className="hover:underline">
          About
        </a>
        <a href="#" className="hover:underline">
          Blog
        </a>
        <a href="#" className="hover:underline">
          Help
        </a>
        <a href="#" className="hover:underline">
          Locations
        </a>
        <a href="#" className="hover:underline">
          Privacy
        </a>
        <a href="#" className="hover:underline">
          Terms
        </a>
        <a href="#" className="hover:underline">
          Contact
        </a>
      </div>
      <p>© {new Date().getFullYear()} Instagram Clone</p>
    </div>
  );
}

export default Footer