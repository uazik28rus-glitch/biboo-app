import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/use-auth";

export const metadata: Metadata = {
  title: "Биба — для нас двоих",
  description: "Приложение для пар: задачи, календарь, бюджет и воспоминания",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" defer />
      </head>
      <body className="bg-background text-white antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
