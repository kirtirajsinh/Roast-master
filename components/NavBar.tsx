import Image from "next/image";
import React from "react";

const NavBar = () => {
  return (
    <div className="z-50  fixed top-8 left-1/2 transform -translate-x-1/2 inline-flex mx-auto justify-between w-8/12 sm:w-2/5 rounded-full backdrop-blur-xl border border-1 border-blue-500/10 backdrop-filter bg-blue-900/10 pl-8 pr-8 py-3 items-center ">
      <Image src="/logo.png" width="50" height="50" alt="logo" />
      <h1 className="text-xl font-bold">Roast Master</h1>
    </div>
  );
};

export default NavBar;
