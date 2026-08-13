import React, { useState } from 'react';

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
  const [modalOpen, setModalOpen] = useState(false);

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
    <div className="bg-[#030712] text-white min-h-screen flex flex-col font-sans">
      <header className="h-14 bg-[#090d16] border-b border-gray-800 flex items-center justify-between px-4 z-20 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-gray-300 hover:text-white text-xl p-1">
            ☰
          </button>
          <span className="text-xs bg-red-950/80 border border-red-800 text-red-400 font-bold px-2 py-0.5 rounded">ERP</span>
          <h1 className="font-extrabold tracking-wide text-base md:text-lg">Metais</h1>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <button className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-gray-800 transition">📦 Produtos</button>
          <button className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-gray-800 transition">👥 Clientes</button>
          <button className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-gray-800 transition">📋 Lançamento</button>
          <button className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-gray-800 transition">🛒 Vendas</button>
          <button className="px-3 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-gray-800 transition">📊 Relatórios</button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">A</div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold leading-none">ADMINISTRADOR</p>
            <p className="text-[10px] text-gray-400 leading-tight">Administrador</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/70 z-30 md:hidden"></div>
        )}

        <aside className={`fixed md:static inset-y-0 left-0 w-64 bg-[#070b14] border-r border-gray-800/80 p-3 flex flex-col gap-4 z-40 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 h-full overflow-y-auto`}>
          <div className="flex justify-between items-center md:hidden pb-2 border-b border-gray-800">
            <span className="text-xs font-bold text-gray-400 uppercase">Menu</span>
            <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white text-lg p-1">✕</button>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 px-2">Navegação Principal</p>
            <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white flex items-center gap-2">
              🏠 Início / Dashboard
            </button>
          </div>

          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 px-2">Vendas & Lançamentos</p>
            <button onClick={() => { setModalOpen(true); setSidebarOpen(false); }} className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-blue-200 bg-blue-900/40 border border-blue-500/50 hover:bg-blue-600 hover:text-white transition flex items-center gap-2 mt-1">
              <span>🧮</span> Calculadora Usicorte ⚡
            </button>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-800 text-[10px] text-gray-400">
            <div className="flex justify-between items-center bg-gray-900/80 p-2 rounded-lg">
              <span>Status Sistema:</span>
              <span className="text-emerald-400 font-bold">● ONLINE</span>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#030712] space-y-4 sm:space-y-6 w-full">
          <div className="bg-[#070d1a] border border-gray-800 rounded-2xl p-4 sm:p-8 text-center relative overflow-hidden shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
              Usi<span className="text-red-500">corte</span> Metais
            </h2>
            <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sistema ERP de Gestão de Cotações e Vendas</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-6 sm:mt-8">
              <button onClick={() => setModalOpen(true)} className="bg-[#0d1c38] border-2 border-blue-500 hover:bg-blue-600/20 p-4 rounded-xl flex flex-col items-center justify-center transition col-span-2 sm:col-span-1">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400 flex items-center justify-center text-blue-300 text-xl mb-2">⚡</div>
                <span className="text-xs font-bold text-blue-200">Calculadora Usicorte</span>
                <span className="text-[10px] text-blue-400/80 mt-1">Cálculo Rápido</span>
              </button>
            </div>
          </div>
        </main>
      </div>

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
              <button type="button" onClick={() => { alert('Adicionado!'); resetForm(); }} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs sm:text-sm">
                🛍️ Adicionar ao Orçamento PDV
              </button>
              <button type="button" onClick={copiarResumo} className="w-full bg-[#131f37] border border-gray-700 text-gray-300 py-2 rounded-xl text-xs">
                📋 Copiar Resumo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
