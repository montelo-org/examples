import "./globals.css";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Montelo - Product Hunt Researcher",
  description:
    "Montelo is a Product Hunt Researcher that helps you research the top products on Product Hunt today. 🚀",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} grainy-background w-screen h-screen`}>
        <div className={"grainy-paper w-[45%] h-[90%] mx-auto rounded-lg"}>
          <div className={"flex flex-row justify-between items-center"}>
            <a href={"https://montelo.ai"} target={"_blank"} rel="noopener noreferrer">
              <img src={"/LightModeLogo.svg"} alt={"MonteloAI Logo"} className={"h-7"} />
            </a>
            <a
              href={"https://github.com/montelo-org/montelo"}
              target={"_blank"}
              rel="noopener noreferrer"
              className={"hover:underline"}
            >
              <p>Code</p>
            </a>
          </div>
          <div className={"mt-4"}>{children}</div>
        </div>
      </body>
    </html>
  );
}
