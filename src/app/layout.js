
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import BootstrapClient from "./bootstrapClient";
import "./globals.css";
import Footer from "@/components/Footer";
import ReduxProvider from "./ReduxProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ReduxProvider>
          <BootstrapClient />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
