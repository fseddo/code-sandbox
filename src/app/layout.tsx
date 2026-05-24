import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPaletteProvider } from "@/components/CommandPaletteProvider";
import { Toaster } from "@/components/ui/sonner";
import { listProblemSummaries } from "@/problems/data/problems";
import { listTopicSummaries } from "@/learn/data/topics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "noodle — live code playground",
  description: "Write code and watch a live bundled preview, side by side.",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          forcedTheme="dark"
        >
          <CommandPaletteProvider problems={listProblemSummaries()} topics={listTopicSummaries()}>
            {children}
          </CommandPaletteProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
