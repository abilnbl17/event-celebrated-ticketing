import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          {/* <div className="flex h-screen flex-col"> */}
          <Header></Header>
          <main>{children}</main>
          {/* <main className="flex-1">{children}</main> */}
          <Footer></Footer>
        </div>
      </body>
    </html>
  );
}
