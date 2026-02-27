import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Primetrade Notes App",
  description: "Backend Developer Intern Assignment",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
