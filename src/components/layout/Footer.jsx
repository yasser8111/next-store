import React from "react";
import { STORE_INFO } from "../../utils/constants"
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 py-12 transition-colors duration-300">
      <div className="container mx-auto px-6 max-w-screen-xl">
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 text-right"
          dir="rtl"
        >
          {/* Section 1: Brand */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter ">
              {STORE_INFO.NAME}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              متجر ملابس شبابي يقدم أحدث التصاميم العصرية بجودة عالية وأسعار
              مناسبة.
            </p>
          </div>

          {/* Section 2: Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition"
                >
                  الرئيسية
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition"
                >
                  جميع التيشيرتات
                </a>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white text-sm transition"
                >
                  الشروط و الاحكم
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">
              تواصل معنا
            </h3>
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <a
                  href="mailto:nextstore811@gmail.com"
                  className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-all font-bold"
                >
                  {STORE_INFO.EMAIL}
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l2.28-2.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <a
                  href="tel:770583685"
                  className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-all font-bold"
                  dir="ltr"
                >
                  {STORE_INFO.PHONE}
                </a>
              </div>

              {/* Address */}
              <div className="flex items-center gap-3 group cursor-pointer">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-all">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-600 dark:text-gray-400"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 drak:text-gray-00 group-hover:text-black dark:group-hover:text-white transition-all font-bold">
                  {STORE_INFO.ADDRESS}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 text-center">
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            © 2025 NEXT Store. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
