import React from "react";

export default function ProfileFooter() {
  return (
    <footer className="w-full mt-auto py-[20px] border-gray-300 text-center text-gray-500 text-[14px]">
      <div className="w-full flex justify-center gap-[15px] mt-[10px]">
        {["About", "Blog", "Help", "Locations", "Privacy", "Terms", "Contact"].map((link) => (
          <a key={link} href="#" className="hover:underline">
            {link}
          </a>
        ))}
      </div>
      <p>
        &copy; {new Date().getFullYear()} Instagram Clone
      </p>
    </footer>
  );
}
