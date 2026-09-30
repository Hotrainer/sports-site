import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
export const metadata: Metadata = {
  title: "Hotrainer · A niched sports",
  description:
    "A place where niched sports lives",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body><Header />{children}<Footer /></body>
    </html>
  );
}
