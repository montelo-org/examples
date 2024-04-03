import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { AI } from "@/app/action";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cody by Montelo",
  description:
    "Cody is the first AI Software Engineer Intern.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
    <body className={`${inter.className} grainy-background w-screen h-screen`}>
    <AI>
      {children}
    </AI>
    </body>
    </html>
  );
}
