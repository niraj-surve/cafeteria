import React from "react";

const Footer = () => {
  return (
    <div className="text-center px-6 py-[16px] w-full bg-primary text-white max-sm:text-sm">
      Copyright ©{" "}
      <a href="/">
        <span className="hover:text-dark">Cafeteria |</span>
      </a>
      &nbsp;All Rights Reserved
    </div>
  );
};

export default Footer;