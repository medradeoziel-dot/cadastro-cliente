import React, { useState } from 'react';

// --- TABELA DE CONSTANTES E MATERIAIS ---
const tabelaConstantes = [
  { nome: "BRONZE TM 620", k: 0.0072, precoKg: 200, tipo: "macico" },
  { nome: "BRONZE TM 23", k: 0.0072, precoKg: 150, tipo: "macico" },
  { nome: "NYLON REDONDO", k: 0.00094, precoKg: 90, tipo: "macico" },
  { nome: "ALUMINIO REDONDO", k: 0.00214, precoKg: 75, tipo: "macico" },
  { nome: "FFNODULAR REDONDO", k: 0.00567, precoKg: 26, tipo: "macico" },
  { nome: "AÇO VC REDONDO", k: 0.00617, precoKg: 80, tipo: "macico" },
  { nome: "SEXTAVADO AÇO", k: 0.0068, precoKg: 35, tipo: "macico" },
  { nome: "SEXTAVADO LATÃO", k: 0.00791, precoKg: 115, tipo: "macico" },
  { nome: "RETALHO", k: 0, precoKg: 15, tipo: "chapa" },
  { nome: "QUADRADO", k: 0.00785, precoKg: 35, tipo: "macico" },
  { nome: "P.U REDONDO", k: 0.00094, precoKg: 205, tipo: "macico" },
  { nome: "BUCHA REDONDO", k: 0.00617, precoKg: 45, tipo: "bucha" },
  { nome: "BARRA CHATA", k: 0.00785, precoKg: 18, tipo: "chapa" },
  { nome: "CHAVETA", k: 0.00785, precoKg: 205, tipo: "chapa" },
  { nome: "QUADRADO ALUMINIO", k: 0.0027, precoKg: 75, tipo: "macico" },
  { nome: "QUADRADO NYLON", k: 0.0013, precoKg: 100, tipo: "macico" },
  { nome: "LATAO REDONDO", k: 0.0069, precoKg: 115, tipo: "macico" },
  { nome: "POLIURETANO REDONDO", k: 0.0009, precoKg: 205, tipo: "macico" },
  { nome: "CHAPA ASTM A36", k: 0.00785, precoKg: 22, tipo: "chapa" },
  { nome: "LASER CHAPA ASTM A36", k: 0.00785, precoKg: 22, tipo: "chapa" },
  { nome: "SEXTAVADO INOX", k: 0.00617, precoKg: 75, tipo: "macico" },
  { nome: "PAGAMENTO", k: 0, precoKg: 0, tipo: "chapa" },
  { nome: "MÃO DE OBRA", k: 0, precoKg: 0, tipo: "chapa" },
  { nome: "AÇO REDONDO SAE 1045", k: 0.00617, precoKg: 22, tipo: "macico" },
  { nome: "AÇO REDONDO SAE 4140", k: 0.00617, precoKg: 28, tipo: "macico" },
  { nome: "AÇO REDONDO SAE 8620", k: 0.00617, precoKg: 28, tipo: "macico" },
  { nome: "AÇO REDONDO SAE 4340", k: 0.00617, precoKg: 35, tipo: "macico" },
  { nome: "AÇO REDONDO SAE 1020", k: 0.00617, precoKg: 22, tipo: "macico" }
];

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(false);

  // Estados da Calculadora
  const [matIndex, setMatIndex] = useState('');
  const [diametro, setDiametro] = useState('');
  const [espessura, setEspessura] = useState('');
  const [largura, setLargura] = useState('');
  const [comprimento, setComprimento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [observacao, setObservacao] = useState('');
  const [qtd, setQtd] = useState(1);
  const [precoKg, setPrecoKg] = useState('');

  const matSelecionado = matIndex !== '' ? tabelaConstantes[Number(matIndex)] : null;

  const handleMaterialChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setMatIndex(val);
    if (val === '') {
      setPrecoKg('');
      setDescricao('');
      return;
    }
    const mat = tabelaConstantes[Number(val)];
    setPrecoKg(String(Math.ceil(mat.precoKg)));
    setDescricao(mat.nome);
  };

  const aplicarDimensao = (larg: number, comp: number) => {
    setLargura(String(larg));
    setComprimento(String(comp));
  };

  let pesoUnitario = 0;
  if (matSelecionado) {
    const dExt = parseFloat(diametro) || 0;
    const dInt = parseFloat(espessura) || 0;
    const esp = parseFloat(espessura) || 0;
    const larg = parseFloat(largura) || 0;
    const comp = parseFloat(comprimento) || 0;
    const k = matSelecionado.k;

    if (matSelecionado.tipo === 'chapa') {
      pesoUnitario = (esp * larg * comp * k) / 1000;
    } else if (matSelecionado.tipo === 'macico') {
      const d = dExt || esp;
      pesoUnitario = (d * d * comp * k) / 1000;
    } else if (matSelecionado.tipo === 'bucha') {
      if (dExt > dInt && dInt > 0) {
        const pesoBruto = (dExt * dExt * comp * k) / 1000;
        const pesoFuro = (dInt * dInt * comp * k) / 1000;
        pesoUnitario = pesoBruto - pesoFuro;
      } else {
        pesoUnitario = (dExt * dExt * comp * k) / 1000;
      }
    }
  }

  const pKg = parseFloat(precoKg) || 0;
  const q = parseFloat(String(qtd)) || 1;

  const valorUnitarioCalculado = pesoUnitario * pKg;
  const valorUnitarioArredondado = Math.ceil(valorUnitarioCalculado);
  const valorTotalCalculado = valorUnitarioArredondado * q;
  const valorTotalArredondado = Math.ceil(valorTotalCalculado);
  const pesoTotal = pesoUnitario * q;

  const resetForm = () => {
    setMatIndex('');
    setDiametro('');
    setEspessura('');
    setLargura('');
    setComprimento('');
    setDescricao('');
    setObservacao('');
    setQtd(1);
    setPrecoKg('');
  };

  const copiarResumo = () => {
    const desc = descricao || (matSelecionado ? matSelecionado.nome : '');
    const pesoTxt = pesoTotal.toFixed(3).replace('.', ',') + ' KG';
    const totalTxt = 'R$ ' + valorTotalArredondado.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    const resumo = `[Usicorte] ${desc} | Qtd: ${qtd} | Peso: ${pesoTxt} | Total: ${totalTxt}${observacao ? ' | Obs: ' + observacao : ''}`;
    navigator.clipboard.writeText(resumo);
    alert('Resumo copiado!');
  };

  return (
    <div className="bg-[#030712] text-white min-h-screen flex flex-col font-sans select-none">
      {/* HEADER SUPERIOR */}
      <header className="h-14 bg-[#070b14] border-b border-gray-800 flex items-center justify-between px-4 z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-300 hover:text-white text-xl p-1">
            ☰
          </button>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-lg tracking-wider">
              Usi<span className="text-red-500">corte</span> <span className="font-light text-gray-300">Metais</span>
            </h1>
            <span className="text-[10px] bg-red-950/80 border border-red-800 text-red-400 font-bold px-1.5 py-0.5 rounded">ERP</span>
          </div>
        </div>

        {/* NAVEGAÇÃO SUPERIOR */}
        <div className="hidden md:flex items-center gap-1 text-xs text-gray-400 font-semibold">
          <button onClick={() => setActiveTab('produtos')} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white hover:bg-gray-800/60 transition ${activeTab === 'produtos' ? 'bg-gray-800 text-white' : ''}`}>
            <span>📦</span> Produtos
          </button>
          <button onClick={() => setActiveTab('clientes')} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white hover:bg-gray-800/60 transition ${activeTab === 'clientes' ? 'bg-gray-800 text-white' : ''}`}>
            <span>👥</span> Clientes
          </button>
          <button onClick={() => setActiveTab('lancamento')} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white hover:bg-gray-800/60 transition ${activeTab === 'lancamento' ? 'bg-gray-800 text-white' : ''}`}>
            <span>📋</span> Lançamento
          </button>
          <button onClick={() => setActiveTab('vendas')} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white hover:bg-gray-800/60 transition ${activeTab === 'vendas' ? 'bg-gray-800 text-white' : ''}`}>
            <span>🛒</span> Vendas
          </button>
          <button onClick={() => setActiveTab('relatorios')} className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:text-white hover:bg-gray-800/60 transition ${activeTab === 'relatorios' ? 'bg-gray-800 text-white' : ''}`}>
            <span>📊</span> Relatórios
          </button>
        </div>

        {/* USUÁRIO */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs shadow-md shadow-blue-600/30">A</div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-none tracking-wide">ADMINISTRADOR</p>
            <p className="text-[10px] text-gray-400 leading-tight">Administrador</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/70 z-30 md:hidden"></div>
        )}

        {/* SIDEBAR LATERAL COMPLETA */}
        <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-[#050811] border-r border-gray-800/80 p-3 flex flex-col gap-5 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 h-full overflow-y-auto`}>
          <div className="flex justify-between items-center md:hidden pb-2 border-b border-gray-800">
            <span className="text-xs font-bold text-gray-400 uppercase">Menu Principal</span>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white text-lg p-1">✕</button>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">NAVEGAÇÃO PRINCIPAL</p>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20' : 'text-gray-400 hover:text-white hover:bg-gray-800/40'}`}>
                <span className="flex items-center gap-2">🏠 Início / Dashboard</span>
              </button>
              <button onClick={() => setActiveTab('clientes')} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${activeTab === 'clientes' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800/40'}`}>
                <span className="flex items-center gap-2">👥 Cadastro de Clientes</span>
                <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">3</span>
              </button>
              <button onClick={() => setActiveTab('produtos')} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition ${activeTab === 'produtos' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800/40'}`}>
                <span className="flex items-center gap-2">📦 Cadastro de Produtos</span>
                <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">28</span>
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">VENDAS & LANÇAMENTOS</p>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('lancamento')} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${activeTab === 'lancamento' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800/40'}`}>
                📋 Lançamento / Orçamento
              </button>
              <button onClick={() => { setModalOpen(true); setSidebarOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-300 bg-blue-950/40 border border-blue-500/40 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 mt-1 shadow-md">
                ⚡ Calculadora Usicorte ⚡
              </button>
              <button onClick={() => setActiveTab('os')} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${activeTab === 'os' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800/40'}`}>
                📑 OS Diária (Expediente)
              </button>
              <button onClick={() => setActiveTab('vendas')} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${activeTab === 'vendas' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800/40'}`}>
                🛒 Força de Vendas / PDV
              </button>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">GESTÃO & FISCAL</p>
            <div className="space-y-1">
              <button onClick={() => setActiveTab('relatorios')} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${activeTab === 'relatorios' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800/40'}`}>
                📊 Relatórios & Propostas
              </button>
              <button onClick={() => setActiveTab('php')} className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition ${activeTab === 'php' ? 'bg-blue-600 text-white font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800/40'}`}>
                💻 Código PHP / MySQL
              </button>
            </div>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-800/80 text-[10px] text-gray-400">
            <div className="flex flex-col gap-1 bg-gray-900/60 p-2.5 rounded-xl border border-gray-800">
              <div className="flex justify-between items-center">
                <span>Status Sistema:</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">● ONLINE</span>
              </div>
              <span className="text-[9px] text-gray-500">Banco Local & APIs Ativas</span>
            </div>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL / DASHBOARD COMPLETO */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#030712] space-y-6 w-full">
          {/* PAINEL PRINCIPAL HEADER */}
          <div className="bg-[#070c18] border border-gray-800 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
              Usi<span className="text-red-500">corte</span> Metais
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              SISTEMA ERP DE GESTÃO DE COTAÇÕES E VENDAS
            </p>
            <p className="text-xs text-gray-500 max-w-xl mx-auto -mt-4 mb-6 hidden sm:block">
              Selecione um módulo abaixo para começar a trabalhar, calcular pesos com constantes metalúrgicas ou emitir relatórios comerciais:
            </p>

            {/* GRID DE BOTÕES RÁPIDOS */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <button onClick={() => setModalOpen(true)} className="bg-[#0b162b] border-2 border-blue-500 hover:bg-blue-600/20 p-3.5 rounded-xl flex flex-col items-center justify-center transition shadow-lg group">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 text-lg mb-2 group-hover:scale-110 transition">⚡</div>
                <span className="text-xs font-bold text-blue-200">Calculadora Usicorte</span>
                <span className="text-[9px] text-blue-400/80 mt-0.5">Cálculo Rápido</span>
              </button>

              <button onClick={() => setActiveTab('lancamento')} className="bg-[#090f1d] border border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 p-3.5 rounded-xl flex flex-col items-center justify-center transition group">
                <div className="w-9 h-9 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-300 text-lg mb-2 group-hover:scale-110 transition">🧮</div>
                <span className="text-xs font-bold text-gray-200">Novo Lançamento</span>
                <span className="text-[9px] text-gray-500 mt-0.5">Cálculo por ENTER</span>
              </button>

              <button onClick={() => setActiveTab('os')} className="bg-[#090f1d] border border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 p-3.5 rounded-xl flex flex-col items-center justify-center transition group">
                <div className="w-9 h-9 rounded-lg bg-red-950/40 border border-red-800/50 flex items-center justify-center text-red-400 text-lg mb-2 group-hover:scale-110 transition">📋</div>
                <span className="text-xs font-bold text-gray-200">OS Diária (POV)</span>
                <span className="text-[9px] text-gray-500 mt-0.5">Fechar Expediente</span>
              </button>

              <button onClick={() => setActiveTab('clientes')} className="bg-[#090f1d] border border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 p-3.5 rounded-xl flex flex-col items-center justify-center transition group">
                <div className="w-9 h-9 rounded-lg bg-blue-950/40 border border-blue-800/50 flex items-center justify-center text-blue-400 text-lg mb-2 group-hover:scale-110 transition">👥</div>
                <span className="text-xs font-bold text-gray-200">Clientes</span>
                <span className="text-[9px] text-gray-500 mt-0.5">3 cadastrados</span>
              </button>

              <button onClick={() => setActiveTab('produtos')} className="bg-[#090f1d] border border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 p-3.5 rounded-xl flex flex-col items-center justify-center transition group">
                <div className="w-9 h-9 rounded-lg bg-purple-950/40 border border-purple-800/50 flex items-center justify-center text-purple-400 text-lg mb-2 group-hover:scale-110 transition">📦</div>
                <span className="text-xs font-bold text-gray-200">Produtos</span>
                <span className="text-[9px] text-gray-500 mt-0.5">28 materiais</span>
              </button>

              <button onClick={() => setActiveTab('vendas')} className="bg-[#090f1d] border border-gray-800 hover:border-gray-700 hover:bg-gray-800/40 p-3.5 rounded-xl flex flex-col items-center justify-center transition group">
                <div className="w-9 h-9 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-center text-emerald-400 text-lg mb-2 group-hover:scale-110 transition">🛒</div>
                <span className="text-xs font-bold text-gray-200">Vendas & PDV</span>
                <span className="text-[9px] text-gray-500 mt-0.5">Fechamento Rápido</span>
              </button>
            </div>
          </div>

          {/* METRICAS DO DASHBOARD */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#070c18] border border-gray-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CLIENTES CADASTRADOS</p>
                <p className="text-2xl font-black text-white mt-1">3</p>
                <p className="text-[10px] text-emerald-400 mt-1">2 CNPJs • 1 CPFs</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl">
                👥
              </div>
            </div>

            <div className="bg-[#070c18] border border-gray-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">MATERIAIS NO CATÁLOGO</p>
                <p className="text-2xl font-black text-white mt-1">28</p>
                <p className="text-[10px] text-purple-400 mt-1">Chapas, Maciços, Buchas</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xl">
                📦
              </div>
            </div>

            <div className="bg-[#070c18] border border-gray-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ITENS NA COTAÇÃO</p>
                <p className="text-2xl font-black text-white mt-1">2</p>
                <p className="text-[10px] text-amber-400 mt-1">Peso: 717,79 Kg</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl">
                ⚖️
              </div>
            </div>

            <div className="bg-[#070c18] border border-gray-800/80 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TOTAL COTAÇÃO ATUAL</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">R$ 15.238,42</p>
                <p className="text-[10px] text-gray-500 mt-1">COT-2026-0001</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">
                📈
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL CALCULADORA USICORTE */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#0b1329] border border-gray-800 rounded-2xl w-full max-w-2xl p-4 sm:p-6 shadow-2xl relative text-sm max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800 sticky top-0 bg-[#0b1329] z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600/20 border border-blue-500/40 rounded-lg flex items-center justify-center text-blue-400 font-bold">U</div>
                <h2 className="text-sm sm:text-base font-bold text-blue-400">Calculadora Usicorte Metais</h2>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white text-xl font-bold px-2">✕</button>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Constante / Material</label>
                <select value={matIndex} onChange={handleMaterialChange} className="w-full bg-[#131f37] border border-gray-700 rounded-lg p-2.5 text-white text-xs sm:text-sm">
                  <option value="">Selecione o perfil/material...</option>
                  {tabelaConstantes.map((mat, idx) => (
                    <option key={idx} value={idx}>{mat.nome} (k: {mat.k} | R$ {Math.ceil(mat.precoKg)}/kg)</option>
                  ))}
                </select>
              </div>

              <div className="bg-[#081226]/50 border border-gray-800 rounded-xl p-3">
                <span className="text-xs text-gray-400 block mb-2">Dimensões padrão</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button onClick={() => aplicarDimensao(1200, 3000)} className="bg-[#131f37] border border-blue-500/50 text-blue-300 font-bold py-1.5 rounded text-xs">1200x3000</button>
                  <button onClick={() => aplicarDimensao(1250, 3000)} className="bg-[#131f37] border border-gray-700 text-gray-300 font-bold py-1.5 rounded text-xs">1250x3000</button>
                  <button onClick={() => aplicarDimensao(1500, 3000)} className="bg-[#131f37] border border-gray-700 text-gray-300 font-bold py-1.5 rounded text-xs">1500x3000</button>
                  <button onClick={() => aplicarDimensao(1500, 6000)} className="bg-[#131f37] border border-gray-700 text-gray-300 font-bold py-1.5 rounded text-xs">1500x6000</button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Diâmetro (Ø)</label>
                  <input type="number" value={diametro} onChange={(e) => setDiametro(e.target.value)} disabled={matSelecionado?.tipo === 'chapa'} className="w-full bg-[#131f37] border border-gray-700 rounded-lg p-2.5 text-white disabled:opacity-30" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Espessura</label>
                  <input type="number" value={espessura} onChange={(e) => setEspessura(e.target.value)} disabled={matSelecionado?.tipo === 'macico'} className="w-full bg-[#131f37] border border-gray-700 rounded-lg p-2.5 text-white disabled:opacity-30" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Largura (mm)</label>
                  <input type="number" value={largura} onChange={(e) => setLargura(e.target.value)} disabled={matSelecionado?.tipo !== 'chapa'} className="w-full bg-[#131f37] border border-gray-700 rounded-lg p-2.5 text-white disabled:opacity-30" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Comprimento</label>
                  <input type="number" value={comprimento} onChange={(e) => setComprimento(e.target.value)} className="w-full bg-[#131f37] border border-gray-700 rounded-lg p-2.5 text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Descrição</label>
                <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full bg-[#131f37] border border-gray-700 rounded-lg p-2.5 text-white text-xs sm:text-sm" />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Observação</label>
                <input type="text" value={observacao} onChange={(e) => setObservacao(e.target.value)} className="w-full bg-[#131f37] border border-gray-700 rounded-lg p-2.5 text-white text-xs sm:text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Qtd (Peças)</label>
                <input type="number" value={qtd} onChange={(e) => setQtd(Number(e.target.value))} className="w-full bg-[#131f37] border border-gray-700 rounded-lg p-2.5 text-white font-bold" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Preço / Kg (R$)</label>
                <input type="number" value={precoKg} onChange={(e) => setPrecoKg(e.target.value)} className="w-full bg-[#131f37] border border-gray-700 rounded-lg p-2.5 text-white font-bold" />
              </div>
            </div>

            <div className="bg-[#081226] border border-blue-600/40 rounded-xl p-3 sm:p-4 mb-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <span className="block text-[11px] text-gray-400">Valor Unitário</span>
                <span className="font-bold text-base text-blue-300">R$ {valorUnitarioArredondado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="block text-[11px] text-gray-400">Valor Total</span>
                <span className="font-extrabold text-lg text-emerald-400">R$ {valorTotalArredondado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div>
                <span className="block text-[11px] text-gray-400">Peso Estimado</span>
                <span className="font-bold text-base text-blue-400">{pesoTotal.toFixed(3).replace('.', ',')} KG</span>
              </div>
            </div>

            <div className="space-y-2">
              <button type="button" onClick={() => { alert('Adicionado!'); resetForm(); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/20">
                🛍️ Adicionar ao Orçamento PDV
              </button>
              <button type="button" onClick={copiarResumo} className="w-full bg-[#131f37] border border-gray-700 text-gray-300 py-2 rounded-xl text-xs hover:bg-gray-800 transition">
                📋 Copiar Resumo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
