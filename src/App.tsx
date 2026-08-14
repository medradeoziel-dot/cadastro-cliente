import React, { useState, useEffect } from 'react';
import { Client, Quote, QuoteItem } from './types';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import SalesModule from './components/SalesModule';
import ProductsModule from './components/ProductsModule';
import ReportsModule from './components/ReportsModule';
import PhpCodeViewer from './components/PhpCodeViewer';
import LoginModule from './components/LoginModule';
import DailyOSModule from './components/DailyOSModule';
import UsicorteCalculatorModal from './components/UsicorteCalculatorModal';
import Logo from './components/Logo';
import { MaterialProfile, MATERIAL_PROFILES, formatCurrency, formatWeightKg } from './utils/calculator';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Zap, 
  Sparkles, 
  Globe2, 
  FileCode,
  FileSpreadsheet,
  Layers,
  Calculator,
  ShieldCheck,
  PackageCheck,
  Package,
  ShoppingCart,
  FileText,
  Home,
  CheckCircle2,
  Scale,
  Clock,
  ArrowRight,
  TrendingUp,
  Search,
  PlusCircle,
  FolderKanban,
  ClipboardList,
  Lock,
  Menu,
  X
} from 'lucide-react';

export type ScreenType = 'home' | 'clientes' | 'produtos' | 'orcamento' | 'ordem_servico' | 'vendas' | 'relatorios' | 'php';

export default function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [selectedMaterialForQuote, setSelectedMaterialForQuote] = useState<MaterialProfile | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    return sessionStorage.getItem('usuario_logado') || null;
  });
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(() => {
    return !sessionStorage.getItem('usuario_logado');
  });

  // Modal de Calculadora Usicorte Flutuante / Rápida
  const [isQuickCalcOpen, setIsQuickCalcOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const handleAddItemFromQuickCalc = (item: any) => {
    const updatedItems = [...currentQuote.items, item];
    const subtotalTotal = Number(updatedItems.reduce((acc, i) => acc + (i.subtotal || 0), 0).toFixed(2));
    const grandTotal = Number((subtotalTotal - (currentQuote.discount || 0) + (currentQuote.shipping || 0)).toFixed(2));
    const totalWeightKg = Number(updatedItems.reduce((acc, i) => acc + (i.totalWeightKg || 0), 0).toFixed(3));

    const updatedQuote: Quote = {
      ...currentQuote,
      items: updatedItems,
      subtotalTotal,
      grandTotal,
      totalWeightKg
    };

    setCurrentQuote(updatedQuote);
    setCurrentScreen('orcamento');
  };

  // Top-level quote state synced across screens
  const [currentQuote, setCurrentQuote] = useState<Quote>({
    id: `COT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    quoteNumber: `COT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    clientName: 'Brasil Tecnologias Ltda',
    clientDocument: '12.345.678/0001-90',
    contactPerson: 'Oziel Medrade',
    clientPhone: '(11) 98888-7777',
    clientEmail: 'medradeoziel@gmail.com',
    clientCity: 'São Paulo',
    clientState: 'SP',
    date: new Date().toISOString().split('T')[0],
    validityDays: 10,
    paymentTerms: 'À Vista / Pix (3% Desc.)',
    status: 'Rascunho',
    items: [
      {
        id: 'item-1',
        date: new Date().toISOString().split('T')[0],
        companyName: 'Brasil Tecnologias Ltda',
        description: 'Chapa de Aço SAE 1020 Cortada a Plasma CNC',
        descricao: 'Chapa de Aço SAE 1020 Cortada a Plasma CNC',
        constantName: 'CHAPA',
        constanteNome: 'CHAPA',
        material: 'CHAPA',
        geometryType: 'chapa',
        constant: '0.00785',
        pricePerKg: 22.00,
        measure: '1/2" (12.7mm)',
        thickness: '1/2" (12.7mm)',
        thicknessMm: 12.7,
        diameter: '-',
        widthLength: '1200 x 2400 mm',
        widthMm: 1200,
        lengthMm: 2400,
        unitWeightKg: 287.117,
        totalWeightKg: 574.234,
        pesoTotal: 574.234,
        unitPrice: 6316.57,
        valorUnitario: 6316.57,
        quantity: 2,
        qtd: 2,
        subtotal: 12633.14,
        notes: 'Bordas escariadas e desbastadas',
        observacao: 'Bordas escariadas e desbastadas',
        info: 'Bordas escariadas e desbastadas'
      },
      {
        id: 'item-2',
        date: new Date().toISOString().split('T')[0],
        companyName: 'Brasil Tecnologias Ltda',
        description: 'Chapa Aço SAE 1045 Bloco Retangular',
        descricao: 'Chapa Aço SAE 1045 Bloco Retangular',
        constantName: 'CHAPA',
        constanteNome: 'CHAPA',
        material: 'CHAPA',
        geometryType: 'chapa',
        constant: '0.00785',
        pricePerKg: 17.80,
        measure: '1" (25.4mm)',
        thickness: '1" (25.4mm)',
        thicknessMm: 25.4,
        diameter: '-',
        widthLength: '300 x 600 mm',
        widthMm: 300,
        lengthMm: 600,
        unitWeightKg: 35.889,
        totalWeightKg: 143.556,
        pesoTotal: 143.556,
        unitPrice: 638.82,
        valorUnitario: 638.82,
        quantity: 4,
        qtd: 4,
        subtotal: 2555.28,
        notes: 'Tolerância e esquadro usinados',
        observacao: 'Tolerância e esquadro usinados',
        info: 'Tolerância e esquadro usinados'
      }
    ],
    discount: 100.00,
    discountAmount: 100.00,
    shipping: 150.00,
    shippingAmount: 150.00,
    subtotalTotal: 15188.42,
    subtotal: 15188.42,
    grandTotal: 15238.42,
    totalAmount: 15238.42,
    totalWeightKg: 717.790,
    observations: 'Preços com impostos inclusos. Material sujeito a conferência no ato do recebimento.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Real-time clock
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR'));
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

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
      const initialSeed: Client[] = [
        {
          id: 'seed-1',
          type: 'CNPJ',
          document: '12.345.678/0001-90',
          name: 'Brasil Tecnologias Ltda',
          fantasyName: 'BR Tech Industrial',
          cep: '01311-200',
          street: 'Avenida Paulista, 1000',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          situation: 'ATIVA',
          contactPerson: 'Oziel Medrade',
          phone: '(11) 98888-7777',
          email: 'medradeoziel@gmail.com',
          enabled: true,
          registrationDate: '2026-07-20'
        },
        {
          id: 'seed-2',
          type: 'CPF',
          document: '111.222.333-44',
          name: 'Ana Maria Silva de Oliveira',
          fantasyName: '',
          cep: '20040-002',
          street: 'Avenida Rio Branco, 156',
          neighborhood: 'Centro',
          city: 'Rio de Janeiro',
          state: 'RJ',
          situation: 'ATIVA',
          contactPerson: 'Filipe Silva',
          phone: '(21) 97777-6666',
          email: 'ana.silva@gmail.com',
          enabled: true,
          registrationDate: '2026-07-21'
        },
        {
          id: 'seed-3',
          type: 'CNPJ',
          document: '04.252.011/0001-10',
          name: 'Metalúrgica UsiCorte Estruturas Eireli',
          fantasyName: 'UsiCorte Matriz',
          cep: '09010-000',
          street: 'Rua Coronel Oliveira Lima, 450',
          neighborhood: 'Centro',
          city: 'Santo André',
          state: 'SP',
          situation: 'ATIVA',
          contactPerson: 'Engenharia Comercial',
          phone: '(11) 4433-2211',
          email: 'comercial@usicorte.ind.br',
          enabled: true,
          registrationDate: '2026-08-01'
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

  // Switch screen helper
  const trocarTela = (nomeTela: ScreenType) => {
    setCurrentScreen(nomeTela);
    setIsMobileSidebarOpen(false);
  };

  // Launch product directly into quote
  const handleLaunchProductIntoQuote = (material: MaterialProfile) => {
    setSelectedMaterialForQuote(material);
    setCurrentScreen('orcamento');
  };

  // Live stats
  const totalCnpjs = clients.filter(c => c.type === 'CNPJ').length;
  const totalCpfs = clients.filter(c => c.type === 'CPF').length;
  const totalEnabled = clients.filter(c => c.enabled).length;

  return (
    <div id="app-root" className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 1. BARRA SUPERIOR (TOPBAR / MENU SUPERIOR RÁPIDO) */}
      <header className="topbar no-print h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 sm:px-5 z-20 shrink-0 sticky top-0">
        
        <div className="flex items-center gap-3">
          {/* Hamburger button (Mobile only) */}
          <button 
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden text-slate-300 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            title="Abrir Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Logo */}
          <button 
            onClick={() => trocarTela('home')}
            className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer text-left"
          >
            <Logo className="h-9 sm:h-10 w-auto" />
            <span className="text-[10px] bg-red-600/20 text-red-500 border border-red-600/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider hidden sm:inline-block">
              ERP
            </span>
          </button>
        </div>

        {/* Quick Nav Shortcuts (Estilo Atalhos ERP) */}
        <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1">
          <button 
            onClick={() => trocarTela('produtos')}
            className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer min-w-[70px] ${
              currentScreen === 'produtos'
                ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-600/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] font-semibold">Produtos</span>
          </button>

          <button 
            onClick={() => trocarTela('clientes')}
            className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer min-w-[70px] ${
              currentScreen === 'clientes'
                ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-600/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] font-semibold">Clientes</span>
          </button>

          <button 
            onClick={() => trocarTela('orcamento')}
            className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer min-w-[70px] ${
              currentScreen === 'orcamento'
                ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-600/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] font-semibold">Lançamento</span>
          </button>

          <button 
            onClick={() => trocarTela('vendas')}
            className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer min-w-[70px] ${
              currentScreen === 'vendas'
                ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-600/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] font-semibold">Vendas</span>
          </button>

          <button 
            onClick={() => trocarTela('relatorios')}
            className={`flex flex-col items-center justify-center px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer min-w-[70px] ${
              currentScreen === 'relatorios'
                ? 'bg-blue-600 text-white border-transparent shadow-md shadow-blue-600/30'
                : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span className="text-[11px] font-semibold">Relatórios</span>
          </button>
        </nav>

        {/* User Profile / Login Button */}
        <button 
          onClick={() => setIsLoginOpen(true)}
          className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-800 hover:opacity-80 transition-opacity cursor-pointer text-left"
          title="Clique para alternar usuário ou cadastrar novo funcionário"
        >
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-inner uppercase">
            {currentUser ? currentUser.charAt(0) : '?'}
          </div>
          <div className="flex flex-col text-left hidden sm:flex">
            <span className="text-xs font-bold text-slate-200 leading-tight">
              {currentUser || 'Entrar no Sistema'}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {currentUser === 'ADMINISTRADOR' ? 'Administrador' : currentUser ? 'Funcionário' : 'Clique para Login'}
            </span>
          </div>
        </button>
      </header>

      {/* 2. CORPO PRINCIPAL (SIDEBAR + ÁREA DE CONTEÚDO DINÂMICA) */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* MÁSCARA ESCURA (BACKDROP DO MENU NO MOBILE) */}
        {isMobileSidebarOpen && (
          <div 
            id="sidebarOverlay" 
            onClick={() => setIsMobileSidebarOpen(false)} 
            className="fixed inset-0 bg-black/70 z-30 md:hidden backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Menu Lateral (Sidebar Adaptável) */}
        <aside className={`sidebar no-print fixed md:static inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 flex flex-col p-3 gap-1 overflow-y-auto shrink-0 select-none z-40 transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}>
          
          {/* Cabeçalho da Sidebar (Fechar no Mobile) */}
          <div className="flex justify-between items-center md:hidden pb-2.5 border-b border-slate-800 mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu de Navegação</span>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)} 
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pt-2 pb-1">
            Navegação Principal
          </div>

          <button 
            id="menu-home"
            onClick={() => trocarTela('home')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer w-full text-left ${
              currentScreen === 'home'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>Início / Dashboard</span>
          </button>

          <button 
            id="menu-clientes"
            onClick={() => trocarTela('clientes')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer w-full text-left ${
              currentScreen === 'clientes'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 shrink-0" />
              <span>Cadastro de Clientes</span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
              {clients.length}
            </span>
          </button>

          <button 
            id="menu-produtos"
            onClick={() => trocarTela('produtos')}
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer w-full text-left ${
              currentScreen === 'produtos'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 shrink-0" />
              <span>Cadastro de Produtos</span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
              {MATERIAL_PROFILES.length}
            </span>
          </button>

          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pt-4 pb-1">
            Vendas & Lançamentos
          </div>

          <button 
            id="menu-orcamento"
            onClick={() => trocarTela('orcamento')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer w-full text-left ${
              currentScreen === 'orcamento'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0" />
            <span>Lançamento / Orçamento</span>
          </button>

          <button 
            id="menu-calc-popup"
            onClick={() => setIsQuickCalcOpen(true)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer w-full text-left bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20 border border-blue-400/30"
          >
            <Calculator className="w-4 h-4 shrink-0 text-blue-200" />
            <span>Calculadora Usicorte ⚡</span>
          </button>

          <button 
            id="menu-ordem-servico"
            onClick={() => trocarTela('ordem_servico')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer w-full text-left ${
              currentScreen === 'ordem_servico'
                ? 'bg-red-600 text-white shadow-md shadow-red-600/30 font-bold'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <ClipboardList className="w-4 h-4 shrink-0 text-red-400" />
            <span>OS Diária (Expediente)</span>
          </button>

          <button 
            id="menu-vendas"
            onClick={() => trocarTela('vendas')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer w-full text-left ${
              currentScreen === 'vendas'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4 shrink-0" />
            <span>Força de Vendas / PDV</span>
          </button>

          <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-3 pt-4 pb-1">
            Gestão & Fiscal
          </div>

          <button 
            id="menu-relatorios"
            onClick={() => trocarTela('relatorios')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer w-full text-left ${
              currentScreen === 'relatorios'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Relatórios & Propostas</span>
          </button>

          <button 
            id="menu-php"
            onClick={() => trocarTela('php')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer w-full text-left ${
              currentScreen === 'php'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <FileCode className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Código PHP / MySQL</span>
          </button>

          {/* Quick System Badge */}
          <div className="mt-auto pt-4 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>Status Sistema:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                ONLINE
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              Banco Local & APIs Ativas
            </div>
          </div>

        </aside>

        {/* Área Central de Conteúdo */}
        <main className="flex-1 bg-slate-950 p-6 overflow-y-auto">
          
          {/* TELA 1: HOME / DASHBOARD */}
          {currentScreen === 'home' && (
            <div id="screen-home" className="space-y-8 max-w-6xl mx-auto">
              
              {/* Welcome Card / Header Principal */}
              <header className="header-principal rounded-3xl shadow-2xl relative overflow-hidden border border-slate-800">
                <div className="logo-container py-2 flex justify-center">
                  <Logo className="max-w-[340px] w-full h-auto" />
                </div>

                <div className="header-subtitle">
                  SISTEMA ERP DE GESTÃO DE COTAÇÕES E VENDAS
                </div>

                <p className="header-description">
                  Selecione um módulo abaixo para começar a trabalhar, calcular pesos com constantes metalúrgicas ou emitir relatórios comerciais:
                </p>

                {/* Grid de Atalhos Rápidos */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mt-6 sm:mt-8 relative z-10">
                  
                  {/* ATALHO DA CALCULADORA (DESTAQUE) */}
                  <button 
                    id="card-calc-shortcut"
                    onClick={() => setIsQuickCalcOpen(true)}
                    className="bg-[#0d1c38] border-2 border-blue-500 hover:bg-blue-600/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all group shadow-lg shadow-blue-500/10 col-span-2 sm:col-span-1 cursor-pointer hover:-translate-y-1"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/60 flex items-center justify-center text-blue-300 text-xl mb-2 group-hover:scale-110 transition-transform">
                      ⚡
                    </div>
                    <span className="text-xs font-bold text-blue-200">Calculadora Usicorte</span>
                    <span className="text-[10px] text-blue-400/80 mt-1 font-medium">Cálculo Rápido</span>
                  </button>

                  <div 
                    onClick={() => trocarTela('orcamento')}
                    className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 p-4 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-2 group hover:-translate-y-1 hover:shadow-xl shadow-slate-950/50"
                  >
                    <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors border border-blue-500/20">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-xs text-slate-100 block font-bold group-hover:text-blue-400 transition-colors">Novo Lançamento</strong>
                      <span className="text-[10px] text-slate-400">Cálculo por ENTER</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => trocarTela('ordem_servico')}
                    className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-red-500 p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3 group hover:-translate-y-1 hover:shadow-xl shadow-slate-950/50"
                  >
                    <div className="p-3 bg-red-500/10 text-red-400 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors border border-red-500/20">
                      <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                      <strong className="text-xs text-slate-100 block font-bold group-hover:text-red-400 transition-colors">OS Diária (POV)</strong>
                      <span className="text-[10px] text-slate-400">Fechar Expediente</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => trocarTela('clientes')}
                    className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3 group hover:-translate-y-1 hover:shadow-xl shadow-slate-950/50"
                  >
                    <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-indigo-500/20">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <strong className="text-xs text-slate-100 block font-bold group-hover:text-indigo-400 transition-colors">Clientes</strong>
                      <span className="text-[10px] text-slate-400">{clients.length} cadastrados</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => trocarTela('produtos')}
                    className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3 group hover:-translate-y-1 hover:shadow-xl shadow-slate-950/50"
                  >
                    <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors border border-purple-500/20">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <strong className="text-xs text-slate-100 block font-bold group-hover:text-purple-400 transition-colors">Produtos</strong>
                      <span className="text-[10px] text-slate-400">{MATERIAL_PROFILES.length} materiais</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => trocarTela('vendas')}
                    className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3 group hover:-translate-y-1 hover:shadow-xl shadow-slate-950/50"
                  >
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors border border-emerald-500/20">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                      <strong className="text-xs text-slate-100 block font-bold group-hover:text-emerald-400 transition-colors">Vendas & PDV</strong>
                      <span className="text-[10px] text-slate-400">Fechamento Rápido</span>
                    </div>
                  </div>

                  <div 
                    onClick={() => trocarTela('relatorios')}
                    className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 p-5 rounded-2xl cursor-pointer transition-all duration-200 flex flex-col items-center text-center gap-3 group hover:-translate-y-1 hover:shadow-xl shadow-slate-950/50"
                  >
                    <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors border border-amber-500/20">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <strong className="text-xs text-slate-100 block font-bold group-hover:text-amber-400 transition-colors">Relatórios</strong>
                      <span className="text-[10px] text-slate-400">Propostas A4 / PDF</span>
                    </div>
                  </div>

                </div>
              </header>

              {/* Live KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clientes Cadastrados</span>
                    <span className="text-2xl font-mono font-black text-slate-100 block">{clients.length}</span>
                    <span className="text-[10px] text-emerald-400 font-medium">{totalCnpjs} CNPJs • {totalCpfs} CPFs</span>
                  </div>
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Materiais no Catálogo</span>
                    <span className="text-2xl font-mono font-black text-purple-400 block">{MATERIAL_PROFILES.length}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Chapas, Maciços, Buchas</span>
                  </div>
                  <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl border border-purple-500/20">
                    <Package className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Itens na Cotação</span>
                    <span className="text-2xl font-mono font-black text-amber-400 block">{currentQuote.items.length}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Peso: {formatWeightKg(currentQuote.totalWeightKg || 0, 2)}</span>
                  </div>
                  <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                    <Scale className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Cotação Atual</span>
                    <span className="text-2xl font-mono font-black text-emerald-400 block">
                      {formatCurrency(currentQuote.totalAmount || currentQuote.grandTotal || 0)}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">{currentQuote.number || 'COT-2026-0001'}</span>
                  </div>
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TELA 2: CLIENTES */}
          {currentScreen === 'clientes' && (
            <div id="screen-clientes" className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    Cadastro de Clientes
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Gestão de clientes Pessoa Física (CPF) e Jurídica (CNPJ) com auto-preenchimento ViaCEP e Receita Federal.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportClients}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  >
                    Exportar JSON ({clients.length})
                  </button>
                </div>
              </div>

              {/* Grid Form + List */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8">
                  <ClientForm 
                    activeClient={activeClient}
                    onSave={handleSaveClient}
                    onDelete={handleDeleteClient}
                    onClear={() => setActiveClient(null)}
                  />
                </div>

                <div className="lg:col-span-4">
                  <ClientList 
                    clients={clients}
                    activeClientId={activeClient?.id}
                    onSelectClient={(c) => setActiveClient(c)}
                    onExportClients={handleExportClients}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TELA 3: PRODUTOS */}
          {currentScreen === 'produtos' && (
            <div id="screen-produtos" className="space-y-6">
              <ProductsModule 
                onSelectProductForQuote={handleLaunchProductIntoQuote}
              />
            </div>
          )}

          {/* TELA 4: LANÇAMENTO / ORÇAMENTO */}
          {currentScreen === 'orcamento' && (
            <div id="screen-orcamento" className="space-y-6">
              <SalesModule 
                clients={clients}
                selectedMaterial={selectedMaterialForQuote}
                onQuoteChange={(quote) => setCurrentQuote(quote)}
                onNavigateToClients={() => trocarTela('clientes')}
                onNavigateToReports={() => trocarTela('relatorios')}
              />
            </div>
          )}

          {/* TELA ORDEM DE SERVIÇO DIÁRIA (POV / EXPEDIENTE) */}
          {currentScreen === 'ordem_servico' && (
            <div id="screen-ordem-servico" className="space-y-6">
              <DailyOSModule 
                clients={clients}
                onNavigateToClients={() => trocarTela('clientes')}
              />
            </div>
          )}

          {/* TELA 5: VENDAS / PDV */}
          {currentScreen === 'vendas' && (
            <div id="screen-vendas" className="space-y-6">
              <SalesModule 
                clients={clients}
                onQuoteChange={(quote) => setCurrentQuote(quote)}
                onNavigateToClients={() => trocarTela('clientes')}
                onNavigateToReports={() => trocarTela('relatorios')}
              />
            </div>
          )}

          {/* TELA 6: RELATÓRIOS & PROPOSTAS */}
          {currentScreen === 'relatorios' && (
            <div id="screen-relatorios" className="space-y-6">
              <ReportsModule 
                currentQuote={currentQuote}
                clients={clients}
                onNavigateToQuote={() => trocarTela('orcamento')}
              />
            </div>
          )}

          {/* TELA 7: CÓDIGO PHP / MYSQL */}
          {currentScreen === 'php' && (
            <div id="screen-php" className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-emerald-400" />
                    Código PHP / MySQL & Backend
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Scripts PHP prontos para produção e schema SQL compatíveis com XAMPP, WampServer e servidores Apache/Nginx.
                  </p>
                </div>
              </div>
              <PhpCodeViewer />
            </div>
          )}

        </main>
      </div>

      {/* 3. BARRA DE STATUS INFERIOR (FOOTER / STATUSBAR) */}
      <footer className="statusbar no-print h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-5 text-[11px] text-slate-400 z-20 shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse"></div>
          <span>Empresa: <strong className="text-slate-200">USICORTE METAIS EIRELI</strong></span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[10px]">
          <span>Usuário: <strong className="text-slate-300">{currentUser || 'NÃO AUTENTICADO'}</strong></span>
          <span className="text-slate-600">|</span>
          <span>IP: <strong className="text-slate-300">192.168.1.115</strong></span>
          <span className="text-slate-600">|</span>
          <span>Versão: <strong className="text-slate-300">2026.1.0</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold">{currentTime}</span>
        </div>
      </footer>

      {/* 4. MÓDULO DE LOGIN E CADASTRO DE USUÁRIOS */}
      <LoginModule 
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsLoginOpen(false);
        }}
        currentUser={currentUser}
        onLogout={() => {
          sessionStorage.removeItem('usuario_logado');
          setCurrentUser(null);
          setIsLoginOpen(true);
        }}
      />

      {/* 5. MODAL CALCULADORA USICORTE RÁPIDA */}
      <UsicorteCalculatorModal
        isOpen={isQuickCalcOpen}
        onClose={() => setIsQuickCalcOpen(false)}
        onAddItemToQuote={(item) => handleAddItemFromQuickCalc(item)}
      />

    </div>
  );
}
