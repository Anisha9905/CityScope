// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "Citizen Dashboard",
  description: "Civic app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
