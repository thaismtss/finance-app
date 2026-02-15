"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Receipt, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const navItems = [
    {
        title: "Dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Lançamentos",
        href: "/transactions",
        icon: Receipt
    },
    {
        title: "Configurações",
        href: "/settings",
        icon: Settings
    }
];

export function SidebarContent() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push("/auth/login");
    };

    return (
        <div className="flex h-full flex-col gap-4 overflow-hidden">
            <div className="flex h-[60px] shrink-0 items-center px-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#008573] text-white">
                        <span className="text-xl font-bold">D</span>
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-800 leading-tight">Drogaria Ipupiara</h1>
                        <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">Gestão Financeira</p>
                    </div>
                </Link>
            </div>
            <div className="flex-1 px-4 overflow-y-auto">
                <nav className="grid gap-1 py-1">
                    {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 rounded-lg px-3 py-2 transition-all",
                                    pathname === item.href
                                        ? "bg-[#008573] text-white hover:bg-[#007061] hover:text-white shadow-sm"
                                        : "text-slate-600 hover:bg-slate-100"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                <span className="text-sm font-medium">{item.title}</span>
                            </Button>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="mt-auto border-t p-4 shrink-0">
                <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 text-slate-600 hover:bg-slate-100 px-3 hover:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    <span className="text-sm font-medium">Sair</span>
                </Button>
            </div>
        </div>
    );
}
