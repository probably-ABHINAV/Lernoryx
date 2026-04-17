import Sidebar from "./sidebar";
import Navbar from "./navbar";
import PageWrapper from "@/components/ui/page-wrapper";

export default function Layout({ children }: any) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-zinc-950 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <PageWrapper>{children}</PageWrapper>
        </main>
      </div>
    </div>
  );
}
