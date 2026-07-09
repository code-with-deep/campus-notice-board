import Head from "next/head";
import Navbar from "@/components/Navbar";

export default function Layout({ children, title = "Campus Notice Board" }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Campus notice board for exams, events, and general announcements." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </>
  );
}
