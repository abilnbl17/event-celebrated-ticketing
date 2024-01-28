import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
export const Footer = () => {
  return (
    <footer className="border-t mt-5">
      <div
        className="flex-center wrapper flex-between flex flex-col
      gap-4 p-5 text-center sm:flex-row"
      >
        <Link href="/">
          <Image
            src="/assets/images/company.png"
            alt="logo"
            width={128}
            height={38}
          />
        </Link>
        <p>2023 Evently. ALL Rights reserved.</p>
      </div>
    </footer>
  );
};
