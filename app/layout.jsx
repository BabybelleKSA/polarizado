import "../styles/globals.css";

export const metadata = {
  title: "Diaz Polarizado | Instant Tint Pricing",
  description: "Get instant pricing for Diaz Polarizado window tint services in seconds."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-brand-light text-brand-dark">
        {children}
      </body>
    </html>
  );
}
