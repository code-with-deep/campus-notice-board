import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "text-sm",
          duration: 3000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-fg)",
          },
        }}
      />
    </ThemeProvider>
  );
}
