"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Clock, Building, Users, Calendar, FileText, BarChart3, Settings, UserCog, LogOut } from 'lucide-react';

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    if (pathname === '/login') return null;

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <nav className="border-b bg-white dark:bg-zinc-950 font-sans sticky top-0 z-50">
            <div className="flex h-16 items-center px-4 max-w-7xl mx-auto overflow-x-auto">
                <div className="flex items-center space-x-2 mr-6 sm:mr-8 flex-shrink-0">
                    <Clock className="w-6 h-6 text-blue-600" />
                    <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-gray-100">Painel Ponto</span>
                </div>
                <div className="flex space-x-6 items-center min-w-max">
                    <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Batida
                    </Link>
                    <Link href="/admin/empresas" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <Building className="w-4 h-4" /> Empresas
                    </Link>
                    <Link href="/admin/unidades" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <Building className="w-4 h-4" /> Unidades
                    </Link>
                    <Link href="/admin/colaboradores" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <Users className="w-4 h-4" /> Colaboradores
                    </Link>
                    <Link href="/admin/usuarios" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <UserCog className="w-4 h-4" /> Usuários
                    </Link>
                    <Link href="/admin/configuracoes" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <Settings className="w-4 h-4" /> Configurações
                    </Link>
                    <Link href="/admin/jornadas" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Jornadas
                    </Link>
                    <Link href="/admin/gestao" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Gestão (Férias)
                    </Link>
                    <Link href="/admin/relatorios" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" /> Relatórios
                    </Link>
                    <div className="w-px h-6 bg-slate-200 mx-2"></div>
                    <button onClick={handleLogout} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-2">
                        <LogOut className="w-4 h-4" /> Sair
                    </button>
                </div>
            </div>
        </nav>
    );
}
