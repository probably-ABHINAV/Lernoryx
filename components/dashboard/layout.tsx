import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function Layout({ children }: any) {
  return (
    <div className="flex h-screen bg-[#f8fafb] font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1360px] mx-auto px-8 pb-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
