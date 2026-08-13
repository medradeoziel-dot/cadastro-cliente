import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Quote, QuoteItem, Client } from '../types';
import Logo from './Logo';
import { 
  formatCurrency, 
  formatWeightKg, 
  formatarMedidasLimpa 
} from '../utils/calculator';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  Building, 
  User, 
  Scale, 
  DollarSign, 
  Layers, 
  FileSpreadsheet,
  Scissors,
  Tag,
  Image as ImageIcon,
  Upload,
  Trash2,
  Eye,
  CheckCircle2,
  Search,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';

interface ReportsModuleProps {
  currentQuote: Quote;
  clients?: Client[];
  onNavigateToQuote?: () => void;
}

type PrintModelType = 'A4-inteiro' | 'A4-2vias' | 'etiqueta-80';

export interface ConsultaItem {
  idVer: number;
  data: string;
  empresa: string;
  contato: string;
  produto: string;
  medida: string;
  descricao: string;
  valor: string;
  qtd: number;
  unitario: number;
  valorGeral: number;
  cotacao: string;
}

// Dados de exemplo para o módulo de consulta
const DADOS_CONSULTA_EXEMPLO: ConsultaItem[] = [
  { idVer: 13942, data: '12/08/2026', empresa: 'DPROJECTS', contato: 'Marcos', produto: 'NYLON REDONDO', medida: '60 x 780', descricao: 'NYLON', valor: 'R$ 90,00', qtd: 1, unitario: 238, valorGeral: 238, cotacao: '' },
  { idVer: 13940, data: '12/08/2026', empresa: 'DPROJECTS', contato: 'Marcos', produto: 'QUADRADO', medida: '1 1/4 x 110', descricao: 'TREFILADO SAE 1045', valor: 'R$ 35,00', qtd: 1, unitario: 30, valorGeral: 30, cotacao: '' },
  { idVer: 13930, data: '12/08/2026', empresa: 'VCI METAIS', contato: 'Carlos', produto: 'CHAPA', medida: '1 1/2 x 79 x 155', descricao: 'RETANGULO', valor: 'R$ 22,00', qtd: 1, unitario: 81, valorGeral: 81, cotacao: '' },
  { idVer: 13911, data: '12/08/2026', empresa: 'PORTEX', contato: 'Roberto', produto: 'AÇO REDONDO', medida: '4"1/2 x 40', descricao: 'LAMINADO SAE 4140', valor: 'R$ 28,00', qtd: 1, unitario: 90, valorGeral: 90, cotacao: 'COT 127' },
  { idVer: 13897, data: '12/08/2026', empresa: 'IRMÃOS VICENTE', contato: 'João', produto: 'AÇO REDONDO', medida: '5" x 43', descricao: 'LAMINADO SAE 1045', valor: 'R$ 21,00', qtd: 1, unitario: 90, valorGeral: 90, cotacao: '' }
];

// Sample technical blueprint drawing in base64 SVG
const SAMPLE_DRAWING_BASE64 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="100%" height="100%"><rect width="200" height="200" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><circle cx="100" cy="100" r="60" fill="none" stroke="%232563eb" stroke-width="2" stroke-dasharray="4,2"/><circle cx="100" cy="100" r="35" fill="%23dbeafe" stroke="%231e40af" stroke-width="2.5"/><line x1="20" y1="100" x2="180" y2="100" stroke="%23ef4444" stroke-width="1" stroke-dasharray="3,3"/><line x1="100" y1="20" x2="100" y2="180" stroke="%23ef4444" stroke-width="1" stroke-dasharray="3,3"/><circle cx="100" cy="100" r="3" fill="%23ef4444"/><text x="100" y="32" font-family="monospace" font-size="10" text-anchor="middle" font-weight="bold" fill="%231e293b">Ø 120 ±0.05</text><text x="100" y="104" font-family="monospace" font-size="9" text-anchor="middle" font-weight="bold" fill="%231e40af">Ø 70 mm</text><text x="100" y="188" font-family="sans-serif" font-size="8" text-anchor="middle" fill="%2364748b">CORTE / USINAGEM CNC</text></svg>`;

export default function ReportsModule({ currentQuote, clients = [], onNavigateToQuote }: ReportsModuleProps) {
  // Navigation tab: 'propostas' | 'consulta'
  const [activeTab, setActiveTab] = useState<'propostas' | 'consulta'>('propostas');

  // Active document preview / print mode
  const [activeModel, setActiveModel] = useState<PrintModelType>('A4-inteiro');
  
  // Selected client for report (prioritizing Nome Fantasia)
  const [selectedClientName, setSelectedClientName] = useState<string>(() => currentQuote.clientName || 'CLIENTE BALCÃO');
  
  // Selected saved order/file
  const [selectedOrderKey, setSelectedOrderKey] = useState<string>('CURRENT');
  
  // Drawing photo for item/label
  const [drawingPhoto, setDrawingPhoto] = useState<string>(SAMPLE_DRAWING_BASE64);
  
  // Selected item index for individual label printing
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);

  // Status message for Ctrl+V paste area
  const [pasteSuccess, setPasteSuccess] = useState<boolean>(false);

  // States for Consulta Module
  const [tipoFiltro, setTipoFiltro] = useState<'empresa' | 'cotacao' | 'contato' | 'produto' | 'codigo'>('empresa');
  const [inputBusca, setInputBusca] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteAreaRef = useRef<HTMLDivElement>(null);

  // Combine current quote items with sample database entries
  const allConsultaItems: ConsultaItem[] = useMemo(() => {
    const currentItems: ConsultaItem[] = (currentQuote?.items || []).map((it, idx) => ({
      idVer: 14000 + idx,
      data: new Date().toLocaleDateString('pt-BR'),
      empresa: selectedClientName || currentQuote.clientName || 'CLIENTE BALCÃO',
      contato: currentQuote.contactPerson || 'Marcos',
      produto: it.constanteNome || it.material || 'MATERIAL',
      medida: formatarMedidasLimpa(it),
      descricao: it.descricao || it.description || 'PEÇA USICORTE',
      valor: formatCurrency(it.unitPrice || 0),
      qtd: it.qtd || it.quantity || 1,
      unitario: it.unitPrice || 0,
      valorGeral: (it.unitPrice || 0) * (it.qtd || it.quantity || 1),
      cotacao: currentQuote.quoteNumber || 'COT-00124'
    }));

    return [...currentItems, ...DADOS_CONSULTA_EXEMPLO];
  }, [currentQuote, selectedClientName]);

  // Filter consulta data based on radio category and search term
  const filteredConsultaItems = useMemo(() => {
    const term = inputBusca.toLowerCase().trim();
    if (!term) return allConsultaItems;

    return allConsultaItems.filter(item => {
      if (tipoFiltro === 'empresa') return item.empresa.toLowerCase().includes(term);
      if (tipoFiltro === 'cotacao') return item.cotacao.toLowerCase().includes(term);
      if (tipoFiltro === 'contato') return item.contato.toLowerCase().includes(term);
      if (tipoFiltro === 'produto') return item.produto.toLowerCase().includes(term) || item.descricao.toLowerCase().includes(term);
      if (tipoFiltro === 'codigo') return item.idVer.toString().includes(term);
      return true;
    });
  }, [allConsultaItems, inputBusca, tipoFiltro]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredConsultaItems.map(item => item.idVer));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (idVer: number) => {
    setSelectedIds(prev => 
      prev.includes(idVer) ? prev.filter(id => id !== idVer) : [...prev, idVer]
    );
  };

  const imprimirRelatorioGeral = (tipoRelatorio: string) => {
    if (selectedIds.length === 0) {
      alert(`Por favor, selecione ao menos um item da tabela para gerar o relatório de ${tipoRelatorio}.`);
      return;
    }

    if (tipoRelatorio === 'ETIQUETAS') {
      document.body.style.width = '80mm';
    } else {
      document.body.style.width = '100%';
    }

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.style.width = '100%';
      }, 1000);
    }, 150);
  };

  // Sync client name if quote updates
  useEffect(() => {
    if (currentQuote.clientName && selectedOrderKey === 'CURRENT') {
      setSelectedClientName(currentQuote.clientName);
    }
  }, [currentQuote.clientName, selectedOrderKey]);

  // Handle clipboard paste (Ctrl + V / PrintScreen / Win+Shift+S)
  const processClipboardItems = (clipboardData: DataTransfer | null) => {
    if (!clipboardData) return;
    const items = clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const base64 = e.target?.result as string;
            setDrawingPhoto(base64);
            setPasteSuccess(true);
            setTimeout(() => setPasteSuccess(false), 4000);
          };
          reader.readAsDataURL(blob);
        }
        break;
      }
    }
  };

  const handlePasteEvent = (e: React.ClipboardEvent) => {
    processClipboardItems(e.clipboardData);
  };

  // Handle saved file / order switcher
  const handleOrderChange = (key: string) => {
    setSelectedOrderKey(key);
    if (key === 'PED-00124') {
      setSelectedClientName('USICORTE USINAGEM LTDA');
      setDrawingPhoto(SAMPLE_DRAWING_BASE64);
    } else if (key === 'PED-00125') {
      setSelectedClientName('INDÚSTRIA METALÚRGICA SP');
      setDrawingPhoto('');
    } else {
      setSelectedClientName(currentQuote.clientName || 'CLIENTE BALCÃO');
      setDrawingPhoto(currentQuote.drawingImage || SAMPLE_DRAWING_BASE64);
    }
  };

  // Handle drawing photo upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setDrawingPhoto(base64);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 4000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Alterna entre os modelos e ativa a caixa de impressão do navegador
  const gerarEImprimir = (tipoProposta: PrintModelType) => {
    setActiveModel(tipoProposta);

    // Ajusta a largura se for a etiqueta de 80mm
    if (tipoProposta === 'etiqueta-80') {
      document.body.style.width = '80mm';
    } else {
      document.body.style.width = '100%';
    }

    // Give state a tick to render active model DOM, then trigger print
    setTimeout(() => {
      window.print();
      
      // Restaura o tamanho do corpo do documento
      setTimeout(() => {
        document.body.style.width = '100%';
      }, 1000);
    }, 150);
  };

  const totalItems = currentQuote.items.length;
  const totalWeight = currentQuote.totalWeightKg || currentQuote.items.reduce((acc, item) => acc + (item.totalWeightKg || item.pesoTotal || 0), 0);
  const subtotalValue = currentQuote.subtotalTotal || currentQuote.items.reduce((acc, item) => acc + (item.subtotal || (item.unitPrice * item.quantity)), 0);
  const discountVal = currentQuote.discount || 0;
  const shippingVal = currentQuote.shipping || 0;
  const grandTotal = currentQuote.grandTotal || (subtotalValue - discountVal + shippingVal);

  const activeItem = currentQuote.items[selectedItemIndex] || currentQuote.items[0] || {
    material: 'BRONZE TM-23 REDONDO',
    constanteNome: 'BRONZE TM-23 REDONDO',
    measure: 'Ø 50 × 200 mm',
    widthLength: '200 mm',
    quantity: 1,
    qtd: 1,
    unitPrice: 185.00,
    totalWeightKg: 3.450
  };

  const handleExportJSON = () => {
    const dataToExport = {
      ...currentQuote,
      clientName: selectedClientName,
      drawingPhoto: drawingPhoto || null,
      exportedAt: new Date().toISOString()
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataToExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `proposta_${currentQuote.quoteNumber || 'cotacao'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    const headers = ["Material", "Medidas", "Descricao", "Informacoes", "Valor_Unitario", "Qtd", "Peso_Total_Kg", "Subtotal"];
    const rows = currentQuote.items.map(item => [
      `"${(item.constanteNome || item.constantName || item.material || 'MATERIAL').replace(/"/g, '""')}"`,
      `"${formatarMedidasLimpa(item).replace(/"/g, '""')}"`,
      `"${(item.descricao || item.description || '-').replace(/"/g, '""')}"`,
      `"${(item.observacao || item.notes || item.info || '-').replace(/"/g, '""')}"`,
      (item.valorUnitario !== undefined ? item.valorUnitario : item.unitPrice).toFixed(2),
      item.qtd || item.quantity || 1,
      (item.pesoTotal !== undefined ? item.pesoTotal : (item.totalWeightKg || 0)).toFixed(3),
      (item.subtotal || ((item.unitPrice || 0) * (item.quantity || 1))).toFixed(2)
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_itens_${currentQuote.quoteNumber || 'cotacao'}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div id="screen-relatorios" className="space-y-6">
      
      {/* TAB NAVIGATION: PROPOSTAS vs CONSULTA */}
      <div className="btn-no-print flex items-center justify-between border-b border-slate-800 pb-3 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('propostas')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'propostas'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4 text-blue-300" />
            <span>📄 Emissão de Propostas & Etiquetas</span>
          </button>

          <button
            onClick={() => setActiveTab('consulta')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'consulta'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-400" />
            <span>🔍 Consulta & Relatório Geral</span>
          </button>
        </div>

        {onNavigateToQuote && (
          <button
            onClick={onNavigateToQuote}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Voltar para Calculadora de Cotações</span>
          </button>
        )}
      </div>

      {/* ===================================================
           MÓDULO DE CONSULTA E IMPRESSÃO DE RELATÓRIOS
           =================================================== */}
      {activeTab === 'consulta' && (
        <div id="screen-consulta" className="space-y-4">
          
          {/* BARRA SUPERIOR COM BOTÕES E CAMPOS DE BUSCA */}
          <div className="filtros-bar btn-no-print">
            
            {/* Botões de Impressão */}
            <div className="botoes-impressao">
              <button className="btn-print" onClick={() => imprimirRelatorioGeral('GERAL')}>
                <span>🖨️</span> GERAL
              </button>
              <button className="btn-print" onClick={() => imprimirRelatorioGeral('EMPRESA')}>
                <span>🏢</span> EMPRESA
              </button>
              <button className="btn-print" onClick={() => imprimirRelatorioGeral('PEDIDO')}>
                <span>📋</span> PEDIDO
              </button>
              <button className="btn-print" onClick={() => imprimirRelatorioGeral('ETIQUETAS')}>
                <span>🏷️</span> ETIQUETAS
              </button>
              <button className="btn-print" onClick={() => imprimirRelatorioGeral('CORTE')}>
                <span>✂️</span> CORTE
              </button>
            </div>

            {/* Filtros por Categoria e Campo de Texto */}
            <div className="opcoes-pesquisa">
              <label>
                <input 
                  type="radio" 
                  name="tipoFiltro" 
                  value="empresa" 
                  checked={tipoFiltro === 'empresa'} 
                  onChange={() => setTipoFiltro('empresa')} 
                /> EMPRESA
              </label>
              <label>
                <input 
                  type="radio" 
                  name="tipoFiltro" 
                  value="cotacao" 
                  checked={tipoFiltro === 'cotacao'} 
                  onChange={() => setTipoFiltro('cotacao')} 
                /> COTAÇÃO
              </label>
              <label>
                <input 
                  type="radio" 
                  name="tipoFiltro" 
                  value="contato" 
                  checked={tipoFiltro === 'contato'} 
                  onChange={() => setTipoFiltro('contato')} 
                /> CONTATO
              </label>
              <label>
                <input 
                  type="radio" 
                  name="tipoFiltro" 
                  value="produto" 
                  checked={tipoFiltro === 'produto'} 
                  onChange={() => setTipoFiltro('produto')} 
                /> PRODUTO / DESCRIÇÃO
              </label>
              <label>
                <input 
                  type="radio" 
                  name="tipoFiltro" 
                  value="codigo" 
                  checked={tipoFiltro === 'codigo'} 
                  onChange={() => setTipoFiltro('codigo')} 
                /> CÓDIGO / ID
              </label>

              <input 
                type="text" 
                id="inputBusca" 
                className="input-busca-avancada" 
                placeholder="Digite para pesquisar..." 
                value={inputBusca} 
                onChange={(e) => setInputBusca(e.target.value)} 
              />
            </div>

          </div>

          {/* TABELA COM DADOS TÉCNICOS */}
          <div className="tabela-container shadow-2xl">
            <table className="tabela-consulta" id="tabelaDados">
              <thead>
                <tr>
                  <th style={{ width: '30px', textAlign: 'center' }}>
                    <input 
                      type="checkbox" 
                      id="checkTodos" 
                      checked={filteredConsultaItems.length > 0 && selectedIds.length === filteredConsultaItems.length}
                      onChange={(e) => handleSelectAll(e.target.checked)} 
                    />
                  </th>
                  <th>IdVer</th>
                  <th>Data</th>
                  <th>Cliente / Empresa</th>
                  <th>Contato</th>
                  <th>Produto</th>
                  <th>Medida</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Qtd</th>
                  <th>Unitário</th>
                  <th>Valor Geral</th>
                  <th>Cotação</th>
                </tr>
              </thead>
              <tbody id="tbodyConsulta">
                {filteredConsultaItems.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-6 text-slate-500 font-medium">
                      Nenhum registro encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredConsultaItems.map((item) => {
                    const isSelected = selectedIds.includes(item.idVer);
                    return (
                      <tr 
                        key={item.idVer} 
                        className={isSelected ? 'linha-selecionada' : ''}
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.tagName !== 'INPUT') {
                            handleToggleSelect(item.idVer);
                          }
                        }}
                      >
                        <td style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            className="chk-item" 
                            value={item.idVer} 
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.idVer)} 
                          />
                        </td>
                        <td><strong>{item.idVer}</strong></td>
                        <td>{item.data}</td>
                        <td><strong>{item.empresa}</strong></td>
                        <td>{item.contato || '-'}</td>
                        <td>{item.produto}</td>
                        <td>{item.medida}</td>
                        <td>{item.descricao}</td>
                        <td>{item.valor}</td>
                        <td>{item.qtd}</td>
                        <td>R$ {item.unitario.toFixed(2)}</td>
                        <td><strong>R$ {item.valorGeral.toFixed(2)}</strong></td>
                        <td>{item.cotacao || '-'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="btn-no-print text-xs text-slate-400 flex items-center justify-between pt-2">
            <span>Mostrando {filteredConsultaItems.length} de {allConsultaItems.length} itens</span>
            <span>{selectedIds.length} item(ns) selecionado(s) para impressão</span>
          </div>

        </div>
      )}

      {/* ===================================================
           ABA 1: EMISSÃO DE PROPOSTAS & ETIQUETAS (PADRÃO)
           =================================================== */}
      {activeTab === 'propostas' && (
        <>
          {/* PAINEL DE CONTROLE E FILTROS (NÃO SAI NA IMPRESSÃO) */}
          <div className="screen-header btn-no-print flex flex-col gap-5 bg-slate-900 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-xl">
        
        {/* Top Header with title and 3 direct Print Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              Relatório e Emissão de Propostas
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Gere propostas oficiais completas em A4, pedidos de produção em 2 vias com linha de corte, ou etiquetas técnicas 80x80mm.
            </p>
          </div>

          {/* BOTÕES DAS PROPOSTAS DE IMPRESSÃO */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => gerarEImprimir('A4-inteiro')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                activeModel === 'A4-inteiro'
                  ? 'bg-blue-600 text-white shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>📄 Proposta A4 (Inteiro)</span>
            </button>

            <button
              onClick={() => gerarEImprimir('A4-2vias')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                activeModel === 'A4-2vias'
                  ? 'bg-blue-600 text-white shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Scissors className="w-4 h-4 text-amber-400" />
              <span>✂️ Pedido A4 (2 Vias / Meio)</span>
            </button>

            <button
              onClick={() => gerarEImprimir('etiqueta-80')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                activeModel === 'etiqueta-80'
                  ? 'bg-blue-600 text-white shadow-blue-600/30 ring-2 ring-blue-400/40'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <Tag className="w-4 h-4 text-emerald-400" />
              <span>🏷️ Etiqueta 80x80mm (c/ Desenho)</span>
            </button>
          </div>
        </div>

        {/* SELEÇÃO DE EMPRESA E ARQUIVO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800 items-end">
          
          {/* SELEÇÃO DE CLIENTE COM NOME FANTASIA (Ponto 3) */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-400" />
              Selecione o Cliente (Nome Fantasia):
            </label>
            <select 
              id="select-relatorio-cliente"
              value={selectedClientName}
              onChange={(e) => setSelectedClientName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 text-slate-100 border border-slate-700 rounded-lg text-xs focus:outline-hidden focus:border-blue-500 font-medium"
            >
              <option value="">-- SELECIONE O CLIENTE --</option>
              <option value="CLIENTE BALCÃO">CLIENTE BALCÃO</option>
              <option value="IGREJA PRIMOGÊNITOS" data-razao="IGREJA EVANGELICA IRMAOS PRIMOGENITOS">IGREJA PRIMOGÊNITOS (Fantasia)</option>
              <option value="USICORTE METAIS" data-razao="USICORTE USINAGEM E MANUTENCAO EIRELI">USICORTE METAIS (Fantasia)</option>
              {clients.map((c) => (
                <option key={c.id} value={c.fantasyName || c.name} data-razao={c.name}>
                  {c.fantasyName ? `${c.fantasyName} (Fantasia)` : `${c.name} (${c.type})`}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Puxar Arquivo / Pedido Salvo */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              Selecione o Pedido Salvo:
            </label>
            <select 
              id="select-relatorio-arquivo"
              value={selectedOrderKey}
              onChange={(e) => handleOrderChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 text-slate-100 border border-slate-700 rounded-lg text-xs focus:outline-hidden focus:border-blue-500 font-mono"
            >
              <option value="CURRENT">{currentQuote.quoteNumber || 'COT-2026-0001'} (Cotação Atual)</option>
              <option value="PED-00124">Pedido #00124 - 11/08/2026</option>
              <option value="PED-00125">Pedido #00125 - 11/08/2026 (Sem Foto)</option>
            </select>
          </div>

        </div>

        {/* ÁREA PARA COLAR O PRINT SCREEN COM CTRL + V (Ponto 1) */}
        <div className="pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              📸 Desenho Técnico (Copie o print com Win+Shift+S ou PrintScreen e cole abaixo):
            </label>
            {drawingPhoto && (
              <button
                type="button"
                onClick={() => {
                  setDrawingPhoto('');
                  setPasteSuccess(false);
                }}
                className="text-[11px] text-red-400 hover:text-red-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
                title="Remover Desenho"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remover Foto (Exibir SEM DESENHO)</span>
              </button>
            )}
          </div>

          <div
            id="paste-area"
            ref={pasteAreaRef}
            tabIndex={0}
            onPaste={handlePasteEvent}
            onClick={() => pasteAreaRef.current?.focus()}
            className={`p-3.5 border-2 border-dashed rounded-xl text-center cursor-pointer outline-hidden transition-all flex flex-col sm:flex-row items-center justify-between gap-3 ${
              pasteSuccess
                ? 'border-emerald-500 bg-emerald-950/20 text-emerald-300'
                : 'border-blue-500/70 hover:border-blue-400 bg-blue-950/10 focus:bg-blue-950/20 text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5 text-xs text-left">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <span id="paste-msg" className="block font-medium">
                  {pasteSuccess ? (
                    <strong className="text-emerald-400 font-bold">✅ Foto do print colada com sucesso!</strong>
                  ) : (
                    <>Clique aqui e pressione <strong className="text-blue-400 font-bold bg-blue-950 px-1.5 py-0.5 rounded border border-blue-800/60">Ctrl + V</strong> para colar a foto do print</>
                  )}
                </span>
                <span className="text-[11px] text-slate-400">
                  Ou clique em "Carregar Arquivo" para selecionar uma imagem do computador
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>{drawingPhoto ? 'Alterar Arquivo' : 'Carregar Arquivo'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action toolbar with visual model switchers and export buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">Visualizar na tela:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveModel('A4-inteiro')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeModel === 'A4-inteiro' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                A4 Inteiro
              </button>
              <button
                onClick={() => setActiveModel('A4-2vias')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeModel === 'A4-2vias' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                A4 2 Vias
              </button>
              <button
                onClick={() => setActiveModel('etiqueta-80')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  activeModel === 'etiqueta-80' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Etiqueta 80x80
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>

      </div>

      {/* ===================================================
           CONTAINER DE IMPRESSÃO (O QUE SAI NA IMPRESSORA E NA PRÉVIA)
           =================================================== */}
      <div id="container-impressao" className="bg-slate-900/60 p-4 sm:p-6 rounded-2xl border border-slate-800">
        
        {/* ===================================================
             PROPOSTA 1: RELATÓRIO A4 INTEIRO
             =================================================== */}
        <div 
          id="doc-A4-inteiro" 
          className={`documento-modelo bg-white text-slate-900 p-8 rounded-xl shadow-2xl font-sans max-w-4xl mx-auto ${
            activeModel === 'A4-inteiro' ? 'block' : 'hidden print:hidden'
          }`}
          style={{ minHeight: '800px' }}
        >
          {/* Header */}
          <div className="border-b-2 border-black pb-3 mb-4 flex justify-between items-center">
            <div>
              <div className="logo-impressao mb-2" style={{ width: '180px' }}>
                <Logo variant="light" className="w-[180px] h-auto" />
              </div>
              <p className="m-0 text-xs font-semibold text-slate-600 tracking-wide uppercase">Relatório / Proposta Comercial</p>
            </div>
            <div className="text-right text-xs space-y-0.5">
              <div><strong>PROPOSTA Nº:</strong> <span className="rel-numero font-mono font-bold text-blue-800">{currentQuote.quoteNumber || '00124'}</span></div>
              <div><strong>DATA:</strong> <span className="rel-data font-mono">{currentQuote.date || new Date().toLocaleDateString('pt-BR')}</span></div>
            </div>
          </div>

          {/* Client box */}
          <div className="bg-slate-100 border border-slate-300 p-3 rounded-md mb-4 text-xs flex justify-between items-center">
            <div>
              <span className="font-bold text-slate-700">EMPRESA / CLIENTE:</span>{' '}
              <strong className="lbl-cliente-nome text-slate-900 text-sm font-black uppercase">{selectedClientName}</strong>
            </div>
            <div className="text-slate-600 font-mono">
              Condições: <strong>{currentQuote.paymentTerms || 'À Vista / Pix'}</strong>
            </div>
          </div>

          {/* 8-Column Table */}
          <table className="w-full border-collapse text-xs mb-6" border={1} cellPadding={6}>
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold uppercase text-[11px] border-b border-black">
                <th className="text-left p-2">PRODUTO / MATERIAL</th>
                <th className="text-center p-2">MEDIDAS</th>
                <th className="text-left p-2">DESCRIÇÃO</th>
                <th className="text-left p-2">INFORMAÇÕES</th>
                <th className="text-right p-2">UNITÁRIO</th>
                <th className="text-center p-2 w-12">QTD</th>
                <th className="text-right p-2">PESO TOTAL</th>
                <th className="text-right p-2">SUBTOTAL</th>
              </tr>
            </thead>
            <tbody id="tbody-a4-inteiro" className="divide-y divide-slate-300">
              {currentQuote.items.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    Nenhum item na cotação para exibição.
                  </td>
                </tr>
              ) : (
                currentQuote.items.map((item, idx) => {
                  const produtoMaterial = item.constanteNome || item.constantName || item.material || 'MATERIAL';
                  const medidasFormatadas = formatarMedidasLimpa(item);
                  const descricaoItem = item.descricao || item.description || '-';
                  const informacoesObs = item.observacao || item.notes || item.info || '-';
                  const valorUnitario = Number(item.valorUnitario !== undefined ? item.valorUnitario : (item.unitPrice || 0));
                  const qtd = Number(item.qtd !== undefined ? item.qtd : (item.quantity || 1));
                  const pesoTotal = Number(item.pesoTotal !== undefined ? item.pesoTotal : (item.totalWeightKg || 0));
                  const subtotal = Number(item.subtotal !== undefined ? item.subtotal : (valorUnitario * qtd));

                  return (
                    <tr key={item.id || idx} className="hover:bg-slate-50">
                      <td className="text-left font-bold text-slate-900 p-2">{produtoMaterial}</td>
                      <td className="text-center font-mono text-[11px] p-2">{medidasFormatadas}</td>
                      <td className="text-left p-2 text-slate-800">{descricaoItem}</td>
                      <td className="text-left p-2 text-slate-600 italic text-[10px]">{informacoesObs}</td>
                      <td className="text-right font-mono p-2">{formatCurrency(valorUnitario)}</td>
                      <td className="text-center font-bold font-mono p-2">{qtd}</td>
                      <td className="text-right font-mono font-bold p-2 text-slate-900">{formatWeightKg(pesoTotal, 3)}</td>
                      <td className="text-right font-mono font-bold p-2 text-slate-950">{formatCurrency(subtotal)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Totals & Notes footer */}
          <div className="border-t-2 border-black pt-4 flex justify-between items-end text-xs">
            <div className="space-y-1 text-slate-600 max-w-md">
              <p>• Validade da proposta: <strong>{currentQuote.validityDays || 10} dias</strong></p>
              <p>• Prazo de entrega: <strong>A combinar após aprovação</strong></p>
              {currentQuote.observations && <p>• Obs: {currentQuote.observations}</p>}
            </div>

            <div className="text-right space-y-1 min-w-[220px]">
              <div className="flex justify-between text-slate-700">
                <span>Peso Total Estimado:</span>
                <strong className="font-mono">{formatWeightKg(totalWeight, 3)}</strong>
              </div>
              {discountVal > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Desconto:</span>
                  <strong className="font-mono">- {formatCurrency(discountVal)}</strong>
                </div>
              )}
              {shippingVal > 0 && (
                <div className="flex justify-between text-slate-700">
                  <span>Frete:</span>
                  <strong className="font-mono">+ {formatCurrency(shippingVal)}</strong>
                </div>
              )}
              <div className="flex justify-between text-base font-black border-t border-black pt-2 text-slate-950">
                <span>VALOR TOTAL:</span>
                <span className="font-mono text-blue-900">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
             PROPOSTA 2: PEDIDO A4 DIVIDIDO AO MEIO (2 VIAS)
             =================================================== */}
        <div 
          id="doc-A4-2vias" 
          className={`documento-modelo modelo-duas-vias bg-white text-slate-900 p-6 rounded-xl shadow-2xl max-w-4xl mx-auto font-sans ${
            activeModel === 'A4-2vias' ? 'block' : 'hidden print:hidden'
          }`}
          style={{ minHeight: '850px' }}
        >
          
          {/* VIA 1: CLIENTE */}
          <div className="via-pedido border border-black p-4 rounded bg-white flex flex-col justify-between" style={{ minHeight: '380px' }}>
            <div>
              <div className="flex justify-between items-center border-b border-black pb-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="logo-impressao" style={{ width: '130px' }}>
                    <Logo variant="light" className="w-[130px] h-auto" />
                  </div>
                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">VIA DO CLIENTE</span>
                </div>
                <span className="text-xs">
                  <strong>PEDIDO Nº:</strong> <span className="rel-numero font-mono font-bold">{currentQuote.quoteNumber || '00124'}</span>
                </span>
              </div>

              <div className="text-xs mb-3 text-slate-700 flex justify-between">
                <div><strong>Cliente:</strong> <span className="lbl-cliente-nome font-bold uppercase">{selectedClientName}</span></div>
                <div><strong>Data:</strong> <span className="rel-data font-mono">{currentQuote.date || new Date().toLocaleDateString('pt-BR')}</span></div>
              </div>

              <table className="w-full text-xs border-collapse mb-3" border={1} cellPadding={4}>
                <thead>
                  <tr className="bg-slate-100 font-bold text-[10px] uppercase">
                    <th className="text-left p-1.5">MATERIAL</th>
                    <th className="text-center p-1.5">MEDIDAS</th>
                    <th className="text-center p-1.5 w-12">QTD</th>
                    <th className="text-right p-1.5">PESO TOTAL</th>
                    <th className="text-right p-1.5">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="tbody-resumido divide-y divide-slate-200">
                  {currentQuote.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5 font-bold text-slate-900">{item.constanteNome || item.material || 'MATERIAL'}</td>
                      <td className="p-1.5 text-center font-mono text-[10px]">{formatarMedidasLimpa(item)}</td>
                      <td className="p-1.5 text-center font-mono font-bold">{item.qtd || item.quantity || 1}</td>
                      <td className="p-1.5 text-right font-mono">{formatWeightKg(item.pesoTotal || item.totalWeightKg || 0, 3)}</td>
                      <td className="p-1.5 text-right font-mono font-bold">{formatCurrency(item.subtotal || ((item.unitPrice || 0) * (item.quantity || 1)))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-black pt-2 mt-2">
              <span className="text-slate-600">Assinatura Cliente: ___________________________________</span>
              <strong className="text-sm font-mono text-slate-950">TOTAL: <span className="lbl-valor-total">{formatCurrency(grandTotal)}</span></strong>
            </div>
          </div>

          {/* LINHA DE CORTE */}
          <div className="linha-corte my-6 border-t-2 border-dashed border-black text-center relative">
            <span className="bg-white px-3 text-[11px] font-bold text-slate-900 relative -top-3">
              ✂️ CORTE AQUI
            </span>
          </div>

          {/* VIA 2: EMPRESA / PRODUÇÃO */}
          <div className="via-pedido border border-black p-4 rounded bg-white flex flex-col justify-between" style={{ minHeight: '380px' }}>
            <div>
              <div className="flex justify-between items-center border-b border-black pb-2 mb-3">
                <div>
                  <strong className="text-sm tracking-tight text-slate-900 font-black">USICORTE METAIS</strong>
                  <span className="text-xs ml-2 px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold">VIA DA EMPRESA / PRODUÇÃO</span>
                </div>
                <span className="text-xs">
                  <strong>PEDIDO Nº:</strong> <span className="rel-numero font-mono font-bold">{currentQuote.quoteNumber || '00124'}</span>
                </span>
              </div>

              <div className="text-xs mb-3 text-slate-700 flex justify-between">
                <div><strong>Cliente:</strong> <span className="lbl-cliente-nome font-bold uppercase">{selectedClientName}</span></div>
                <div><strong>Data:</strong> <span className="rel-data font-mono">{currentQuote.date || new Date().toLocaleDateString('pt-BR')}</span></div>
              </div>

              <table className="w-full text-xs border-collapse mb-3" border={1} cellPadding={4}>
                <thead>
                  <tr className="bg-slate-100 font-bold text-[10px] uppercase">
                    <th className="text-left p-1.5">MATERIAL</th>
                    <th className="text-center p-1.5">MEDIDAS</th>
                    <th className="text-center p-1.5 w-12">QTD</th>
                    <th className="text-right p-1.5">PESO TOTAL</th>
                    <th className="text-right p-1.5">TOTAL</th>
                  </tr>
                </thead>
                <tbody className="tbody-resumido divide-y divide-slate-200">
                  {currentQuote.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-1.5 font-bold text-slate-900">{item.constanteNome || item.material || 'MATERIAL'}</td>
                      <td className="p-1.5 text-center font-mono text-[10px]">{formatarMedidasLimpa(item)}</td>
                      <td className="p-1.5 text-center font-mono font-bold">{item.qtd || item.quantity || 1}</td>
                      <td className="p-1.5 text-right font-mono">{formatWeightKg(item.pesoTotal || item.totalWeightKg || 0, 3)}</td>
                      <td className="p-1.5 text-right font-mono font-bold">{formatCurrency(item.subtotal || ((item.unitPrice || 0) * (item.quantity || 1)))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-black pt-2 mt-2">
              <span className="text-slate-600">Vendedor / Produção: ___________________________________</span>
              <strong className="text-sm font-mono text-slate-950">TOTAL: <span className="lbl-valor-total">{formatCurrency(grandTotal)}</span></strong>
            </div>
          </div>

        </div>

        {/* ===================================================
             PROPOSTA 3: ETIQUETA CUPOM 80x80mm COM/SEM FOTO
             =================================================== */}
        <div 
          id="doc-etiqueta-80" 
          className={`documento-modelo modelo-etiqueta-80 bg-white text-slate-900 rounded-lg shadow-2xl mx-auto border border-black font-sans ${
            activeModel === 'etiqueta-80' ? 'block' : 'hidden print:hidden'
          }`}
          style={{ width: '300px', height: '300px', padding: '12px' }}
        >
          {/* Header */}
          <div className="etiqueta-header border-b border-black pb-1.5 text-center">
            <strong style={{ fontSize: '9pt' }} className="font-black text-slate-950 tracking-wider block">USICORTE METAIS</strong>
            <span style={{ fontSize: '7.5pt' }} className="font-mono text-slate-700 font-semibold">
              PEDIDO Nº: <span className="rel-numero font-bold text-blue-900">{currentQuote.quoteNumber || '00124'}</span>
            </span>
          </div>

          {/* Corpo com Dados e Foto do Desenho */}
          <div className="etiqueta-corpo flex gap-2 my-2 items-center justify-between flex-1">
            
            {/* Dados da peça com Trava e Quebra de Texto */}
            <div className="etiqueta-dados text-xs flex-1">
              <p style={{ margin: '1px 0' }}>
                <strong className="text-[9px] text-slate-500 uppercase block font-bold">EMPRESA:</strong>
                <span className="lbl-cliente-nome font-bold text-slate-900 leading-tight block uppercase">
                  {selectedClientName || 'CLIENTE BALCÃO'}
                </span>
              </p>

              <p style={{ margin: '1px 0' }}>
                <strong className="text-[9px] text-slate-500 uppercase block font-bold">MATERIAL:</strong>
                <span id="etiq-material" className="font-extrabold text-blue-950 block text-xs truncate">
                  {activeItem.constanteNome || activeItem.material || 'BRONZE'}
                </span>
              </p>

              <p style={{ margin: '1px 0' }}>
                <strong className="text-[9px] text-slate-500 uppercase block font-bold">MEDIDA:</strong>
                <span id="etiq-medida" className="font-mono font-bold text-slate-800 block text-xs">
                  {formatarMedidasLimpa(activeItem)}
                </span>
              </p>

              <p style={{ margin: '1px 0' }}>
                <strong className="text-[9px] text-slate-500 uppercase block font-bold">QTD:</strong>
                <span id="etiq-qtd" className="font-mono font-black text-xs text-slate-900">
                  {activeItem.qtd || activeItem.quantity || 1} PÇ
                </span>
              </p>
            </div>

            {/* QUADRO INTELIGENTE DA FOTO DO DESENHO */}
            <div 
              className="etiqueta-foto-box w-28 h-28 border border-dashed border-black rounded flex items-center justify-center bg-slate-50 overflow-hidden shrink-0 shadow-inner"
              id="box-foto-etiqueta"
            >
              {drawingPhoto ? (
                <img 
                  id="img-desenho-etiqueta" 
                  src={drawingPhoto} 
                  alt="Desenho Técnico" 
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <span id="sem-foto-msg" style={{ fontSize: '6.5pt', color: '#888' }} className="font-bold tracking-wider text-center p-1">
                  SEM DESENHO
                </span>
              )}
            </div>

          </div>

          {/* Item selector pills if quote has multiple items */}
          {currentQuote.items.length > 1 && (
            <div className="btn-no-print pt-1 pb-1 flex items-center gap-1 overflow-x-auto">
              <span className="text-[9px] text-slate-400">Peça:</span>
              {currentQuote.items.map((it, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedItemIndex(idx)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold cursor-pointer ${
                    selectedItemIndex === idx ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{ borderTop: '1px solid #000', fontSize: '6.5pt', textAlign: 'center', paddingTop: '2px' }} className="font-bold tracking-wider text-slate-700 uppercase">
            Identificação de Peça / Usicorte Metais
          </div>
        </div>

      </div>
        </>
      )}

    </div>
  );
}
