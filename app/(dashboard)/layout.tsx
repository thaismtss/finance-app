import { SidebarContent } from "@/components/layout/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar */}
            <aside className="hidden w-[260px] border-r bg-white lg:block h-screen sticky top-0">
                <SidebarContent />
            </aside>

            <div className="flex flex-1 flex-col">
                <header className="sticky top-0 z-10 w-full border-b bg-white px-4 py-3 sm:px-8">
                    <div className="mx-auto flex max-w-7xl items-center justify-between">
                        <div className="flex items-center gap-3 lg:hidden">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#008573] text-white">
                                <span className="text-xl font-bold">D</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-slate-800 leading-tight">Drogaria Ipupiara</h1>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Dashboard Financeiro</h2>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Mobile Navigation */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="lg:hidden">
                                        <Menu className="h-6 w-6" />
                                        <span className="sr-only">Toggle menu</span>
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-[280px]">
                                    <SidebarContent />
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
