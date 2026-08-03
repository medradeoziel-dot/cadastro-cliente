import React, { useState, useEffect } from 'react';
import { Client } from './types';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import PhpCodeViewer from './components/PhpCodeViewer';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Zap, 
  Sparkles, 
  ArrowUpRight, 
  Globe2, 
  FileCode,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [viewCode, setViewCode] = useState<boolean>(false);

  // Load clients from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('s_clientes');
    if (saved) {
      try {
        setClients(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved clients');
      }
    } else {
      // Seed initial dummy clients for rich experience
      const initialSeed: Client[] = [
        {
          id: 'seed-1',
          type: 'CNPJ',
          document: '12345678000190',
          name: 'Brasil Tecnologias Ltda',
          fantasyName: 'BR Tech',
          cep: '01311200',
          street: 'Avenida Paulista, 1000',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          situation: 'ATIVA',
          contactPerson: 'Oziel Medrade',
          phone: '11988887777',
          email: 'medradeoziel@gmail.com',
          enabled: true,
          registrationDate: '2026-07-20'
        },
        {
          id: 'seed-2',
          type: 'CPF',
          document: '11122233344',
          name: 'Ana Maria Silva de Oliveira',
          fantasyName: '',
          cep: '20040002',
          street: 'Avenida Rio Branco, 156',
          neighborhood: 'Centro',
          city: 'Rio de Janeiro',
          state: 'RJ',
          situation: 'ATIVA',
          contactPerson: 'Filipe Silva',
          phone: '21977776666',
          email: 'ana.silva@gmail.com',
          enabled: true,
          registrationDate: '2026-07-21'
        }
      ];
      setClients(initialSeed);
      localStorage.setItem('s_clientes', JSON.stringify(initialSeed));
    }
  }, []);

  const saveClientsToStorage = (updatedList: Client[]) => {
    setClients(updatedList);
    localStorage.setItem('s_clientes', JSON.stringify(updatedList));
  };

  const handleSaveClient = (client: Client) => {
    const exists = clients.some(c => c.id === client.id);
    let updatedList: Client[];

    if (exists) {
      updatedList = clients.map(c => c.id === client.id ? client : c);
    } else {
      updatedList = [client, ...clients];
    }

    saveClientsToStorage(updatedList);
    setActiveClient(null);
  };

  const handleDeleteClient = (id: string) => {
    const updatedList = clients.filter(c => c.id !== id);
    saveClientsToStorage(updatedList);
    setActiveClient(null);
  };

  const handleExportClients = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "clientes_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Compute live stats for dashboard
  const totalCnpjs = clients.filter(c => c.type === 'CNPJ').length;
  const totalCpfs = clients.filter(c => c.type === 'CPF').length;
  const totalEnabled = clients.filter(c => c.enabled).length;

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 pb-12">
      
      {/* Decorative top strip */}
      <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500"></div>

      {/* Global Header */}
      <header className="bg-slate-900 text-white py-8 px-4 border-b border-indigo-950/40 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.18),rgba(255,255,255,0))]"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 backdrop-blur-xs">
              <Building2 className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">CADASTRO DE CLIENTES</h1>
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  API Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Preencha os dados de Pessoa Jurídica ou Física com consultas automatizadas integradas ao <b>SEFAZ, Receita Federal</b> e <b>ViaCEP</b>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Toggle view mode */}
            <button
              onClick={() => setViewCode(!viewCode)}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm border ${
                viewCode 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700/80'
              }`}
            >
              <FileCode className="w-4 h-4" />
              {viewCode ? 'Voltar para Cadastro' : 'Ver Código-Fonte PHP'}
              <ArrowUpRight className="w-3 h-3 opacity-60" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 mt-8 flex-1 w-full space-y-8">
        
        {/* Quick Dashboard Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total de Cadastros</span>
              <span className="text-2xl font-extrabold text-slate-800 block font-mono">{clients.length}</span>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100/50">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pessoas Jurídicas</span>
              <span className="text-2xl font-extrabold text-slate-800 block font-mono">{totalCnpjs}</span>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100/50">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pessoas Físicas</span>
              <span className="text-2xl font-extrabold text-slate-800 block font-mono">{totalCpfs}</span>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600 border border-purple-100/50">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-xs flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Habilitados / Ativos</span>
              <span className="text-2xl font-extrabold text-slate-800 block font-mono">
                {totalEnabled} <span className="text-xs text-emerald-500 font-bold ml-1">({clients.length > 0 ? Math.round((totalEnabled / clients.length) * 100) : 0}%)</span>
              </span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100/50">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Dynamic Panel Switcher */}
        {viewCode ? (
          /* PHP SOURCE CODE DISPLAY MODE */
          <div className="space-y-6">
            <div className="bg-indigo-950 text-white rounded-2xl p-6 shadow-sm border border-indigo-900/40 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <div className="space-y-1.5 relative z-10">
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Pronto para Produção em PHP!
                </h2>
                <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed">
                  Criamos um arquivo de PHP autossuficiente integrado ao seu banco de dados local. Você terá o mesmo formulário moderno com todas as consultas automáticas de API e interface baseada no Tailwind CSS do seu servidor Apache, Nginx ou XAMPP.
                </p>
              </div>
              <button 
                onClick={() => setViewCode(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all relative z-10 shrink-0"
              >
                Voltar para o App Interativo
              </button>
            </div>

            <PhpCodeViewer />
          </div>
        ) : (
          /* INTERACTIVE APP MODE (FORM + LIST) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Section */}
            <div className="lg:col-span-8 h-full">
              <ClientForm 
                activeClient={activeClient}
                onSave={handleSaveClient}
                onDelete={handleDeleteClient}
                onClear={() => setActiveClient(null)}
              />
            </div>

            {/* List Sidebar Section */}
            <div className="lg:col-span-4 h-full">
              <ClientList 
                clients={clients}
                activeClientId={activeClient?.id}
                onSelectClient={(c) => setActiveClient(c)}
                onExportClients={handleExportClients}
              />
            </div>

          </div>
        )}

        {/* API connection checklist */}
        <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200/40 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">API Receita Federal</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Integrada via BrasilAPI para consultar CNPJ instantaneamente com status da Receita Federal.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
              <Globe2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">ViaCEP API</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Auto-preenchimento completo de Logradouro, Bairro, Cidade e UF ao digitar os 8 números do CEP.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Exportação Rápida</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Clique no botão de download para exportar os clientes salvos em formato JSON a qualquer momento.</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto pt-12 border-t border-slate-200/60 max-w-7xl mx-auto w-full px-4 text-center">
        <p className="text-[11px] text-slate-400 font-medium">
          Cadastro de Clientes SEFAZ Live Integrator • Desenvolvido com React 19 + Tailwind v4 + Lucide Icons
        </p>
      </footer>

    </div>
  );
}
