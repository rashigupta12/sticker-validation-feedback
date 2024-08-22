import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthSessionProvider from "@/provider/sessionProvider";
import Navbar from "@/components/navbar";
import { DarkModeProvider } from "@/provider/darkmodecontext";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/[...nextauth]/options";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
   // Extract the session from the request using the provided context
   const session = await getServerSession({ authOptions });


  return (
    <html lang="en">
      <body className={inter.className}>
        <DarkModeProvider>
          <NextAuthSessionProvider>
            <Navbar session={session} />
            {children}
          </NextAuthSessionProvider>
        </DarkModeProvider>
      </body>
    </html>
  );
}