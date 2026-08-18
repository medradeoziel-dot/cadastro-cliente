import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  ClipboardList,
  TrendingUp,
  BarChart3,
  Code2,
  ChevronRight,
  Cog,
} from "lucide-react";
import type { PageName } from "@/lib/types";

interface NavItem {
  page: PageName;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { page: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { page: "clientes", label: "Cadastro de Clientes", icon: <Users size={18} /> },
  { page: "produtos", label: "Cadastro de Produtos", icon: <Package size={18} /> },
  { page: "orcamento", label: "Lançamento / Orçamento", icon: <FileText size={18} /> },
  { page: "os-diaria", label: "OS Diária", icon: <ClipboardList size={18} /> },
  { page: "forca-vendas", label: "Força de Vendas", icon: <TrendingUp size={18} /> },
  { page: "propostas", label: "Relatórios & Propostas", icon: <BarChart3 size={18} /> },
  { page: "codigo-php", label: "Código PHP/MySQL", icon: <Code2 size={18} /> },
];

interface SidebarProps {
  currentPage: PageName;
  onNavigate: (page: PageName) => void;
  collapsed: boolean;
}

export default function Sidebar({ currentPage, onNavigate, collapsed }: SidebarProps) {
  return (
    <aside
      className={`flex flex-col h-screen bg-slate-900 border-r border-slate-700/60 transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } flex-shrink-0`}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/60">
        <div className="flex-shrink-0 w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
          <Cog size={18} className="text-slate-900" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm leading-tight">Usicorte Metais</p>
            <p className="text-amber-400 text-xs font-medium tracking-wider uppercase">ERP Sistema</p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const active = currentPage === item.page;
            return (
              <li key={item.page}>
                <button
                  onClick={() => onNavigate(item.page)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                    active
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <span className={`flex-shrink-0 ${active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="text-sm font-medium flex-1 truncate">{item.label}</span>
                      {active && <ChevronRight size={14} className="text-amber-400 flex-shrink-0" />}
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {!collapsed && (
        <div className="p-4 border-t border-slate-700/60">
          <p className="text-slate-600 text-xs text-center">v1.0.0 — 2026</p>
        </div>
      )}
    </aside>
  );
}
