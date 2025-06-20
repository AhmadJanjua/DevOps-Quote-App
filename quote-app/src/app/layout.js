import "./globals.css";

export const metadata = {
  title: "Quote Dispenser",
  description: "An app that supplies a simple random quote to those who visit the site.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
