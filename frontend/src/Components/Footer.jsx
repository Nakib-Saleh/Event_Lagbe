import React from "react";
import logos from "../assets/EVENT.png";

const Footer = () => {
  return (
    <div>
      <footer className="footer flex justify-between bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-10 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <aside>
          <img src={logos} alt="Event Lagbe" className="h-12" />
          <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Event Lagbe
            <br />
            Providing reliable tech since 1992
          </p>
        </aside>
        <nav>
          <h6 className="footer-title text-gray-900 dark:text-white font-semibold transition-colors duration-300">Services</h6>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Branding</a>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Design</a>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Marketing</a>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Advertisement</a>
        </nav>
        <nav>
          <h6 className="footer-title text-gray-900 dark:text-white font-semibold transition-colors duration-300">Company</h6>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">About us</a>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Contact</a>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Jobs</a>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Press kit</a>
        </nav>
        <nav>
          <h6 className="footer-title text-gray-900 dark:text-white font-semibold transition-colors duration-300">Legal</h6>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Terms of use</a>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Privacy policy</a>
          <a className="link link-hover text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200">Cookie policy</a>
        </nav>
      </footer>
    </div>
  );
};

export default Footer;
