import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-3">
        <p className="text-sm text-center md:text-left">
          &copy; {year} Real Estate AI. All rights reserved.
        </p>
        <p className="text-sm text-center md:text-right">
          Created by{" "}
          <a
            href="https://www.neerajprajapati.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline transition"
          >
            Neeraj Prajapati
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
