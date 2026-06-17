import React from "react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-12 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6">
      <span className="text-[12px] text-neutral-400 dark:text-neutral-500">
        © {new Date().getFullYear()} AppName
      </span>
      <div className="flex items-center gap-4">
        <a
          href="/privacy"
          className="text-[12px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          Privacy
        </a>
        <div className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" />
        <a
          href="/terms"
          className="text-[12px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          Terms
        </a>
        <div className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" />
        <a
          href="/support"
          className="text-[12px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
        >
          Support
        </a>
      </div>
    </footer>
  );
};

export default Footer;
