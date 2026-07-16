import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Financial Flight - Learn Money Habits Fast",
  description: "A fun 10-week course teaching teens ages 13-16 everything they need to know about money.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
