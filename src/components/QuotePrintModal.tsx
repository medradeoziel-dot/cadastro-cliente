import React from 'react';
import { Quote } from '../types';
import { formatCurrency, formatWeightKg, formatarMedidasLimpa } from '../utils/calculator';
import { Printer, X, Download, Building2, CheckCircle, Calendar, Phone, Mail, MapPin, Scale } from 'lucide-react';

interface QuotePrintModalProps {
  quote: Quote;
  onClose: () => void;
}

export default function QuotePrintModal({ quote, onClose }: QuotePrintModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const totalUnits = quote.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const totalWeightKg = quote.totalWeightKg ?? quote.items.reduce((sum, item) => sum + (Number(item.totalWeightKg) || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full">
        
        {/* Header Actions (hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between print:hidden border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Visualização de Proposta Comercial</h3>
              <p className="text-xs text-slate-400">Pronto para impressão ou salvar em PDF (Ctrl+P / Command+P)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              Imprimir / Salvar PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Content Area */}
        <div id="printable-quote" className="p-8 sm:p-10 overflow-y-auto space-y-6 text-slate-800 print:p-0 print:overflow-visible font-sans">
          
          {/* Company Branding & Quote Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b-2 border-indigo-600 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xl tracking-wider shadow-xs">
                  UC
                </div>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">UsiCorte</h1>
                  <p className="text-[11px] font-semibold text-indigo-600 uppercase tracking-widest">Soluções em Cortes & Usinagem Industrial</p>
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm pt-1">
                Cortes em Plasma CNC, Oxicorte, Dobra, Torno e Serviços Metalúrgicos de Alta Precisão.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-right min-w-[220px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Orçamento / Cotação</span>
              <span className="text-lg font-black text-indigo-700 font-mono block">{quote.quoteNumber || 'ORC-2026-001'}</span>
              <div className="text-xs text-slate-600 mt-1 flex justify-end gap-2">
                <span><b>Data:</b> {quote.date}</span>
                <span>•</span>
                <span><b>Validade:</b> {quote.validityDays} dias</span>
              </div>
            </div>
          </div>

          {/* Client Details Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Dados do Cliente / Solicitante</span>
              <p className="text-sm font-bold text-slate-900">{quote.clientName || 'Cliente Balcão / Não Identificado'}</p>
              {quote.clientDocument && (
                <p className="text-xs text-slate-600 font-mono mt-0.5"><b>CNPJ/CPF:</b> {quote.clientDocument}</p>
              )}
              {quote.contactPerson && (
                <p className="text-xs text-slate-600 mt-0.5"><b>Contato:</b> {quote.contactPerson}</p>
              )}
            </div>

            <div className="text-xs text-slate-600 space-y-1 md:border-l md:border-slate-200 md:pl-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Contato & Localização</span>
              {quote.clientPhone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{quote.clientPhone}</span>
                </p>
              )}
              {quote.clientEmail && (
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{quote.clientEmail}</span>
                </p>
              )}
              {(quote.clientCity || quote.clientState) && (
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{quote.clientCity} - {quote.clientState}</span>
                </p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Itens e Serviços Discriminados</h4>
              <span className="text-xs text-slate-500 font-medium">{quote.items.length} item(ns) cadastrado(s)</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/80 text-slate-700 uppercase font-semibold text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 text-left">Material</th>
                    <th className="py-2.5 px-3 text-center">Medidas</th>
                    <th className="py-2.5 px-3 text-left">Descrição</th>
                    <th className="py-2.5 px-3 text-left">Informações</th>
                    <th className="py-2.5 px-3 text-right">Unitário (R$)</th>
                    <th className="py-2.5 px-3 text-center w-14">Qtd</th>
                    <th className="py-2.5 px-3 text-right font-semibold text-emerald-800">Peso Total (Kg)</th>
                    <th className="py-2.5 px-3 text-right font-bold w-28">Subtotal (R$)</th>
                  </tr>
                </thead>
                <tbody id="tbody-relatorio" className="divide-y divide-slate-100">
                  {quote.items.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-6 text-center text-slate-400 italic">
                        Nenhum item lançado nesta cotação.
                      </td>
                    </tr>
                  ) : (
                    quote.items.map((item, idx) => {
                      const produtoMaterial = item.constanteNome || item.constantName || item.material || 'MATERIAL';
                      const medidasFormatadas = formatarMedidasLimpa(item);
                      const descricaoItem = item.descricao || item.description || '-';
                      const informacoesObs = item.observacao || item.notes || item.info || '-';
                      const valorUnitario = Number(item.valorUnitario !== undefined ? item.valorUnitario : (item.unitPrice || 0));
                      const qtd = Number(item.qtd !== undefined ? item.qtd : (item.quantity || 1));
                      const pesoTotal = Number(item.pesoTotal !== undefined ? item.pesoTotal : (item.totalWeightKg || 0));
                      const subtotal = Number(item.subtotal !== undefined ? item.subtotal : (valorUnitario * qtd));

                      return (
                        <tr key={item.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                          <td className="py-2.5 px-3 text-left font-bold text-slate-900">
                            {produtoMaterial}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-[11px] text-slate-700">
                            {medidasFormatadas}
                          </td>
                          <td className="py-2.5 px-3 text-left text-slate-700">
                            {descricaoItem}
                          </td>
                          <td className="py-2.5 px-3 text-left text-slate-500 italic text-[11px]">
                            {informacoesObs}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                            R$ {valorUnitario.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900">
                            {qtd}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">
                            {pesoTotal.toFixed(3)} Kg
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals and Observations Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            
            {/* Payment terms & Observations */}
            <div className="md:col-span-7 space-y-3">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                <span className="font-bold text-slate-700 block">Condições Comerciais:</span>
                <p className="text-slate-600"><b>Condição de Pagamento:</b> {quote.paymentTerms || 'À Vista / Transferência Pix'}</p>
                <p className="text-slate-600"><b>Prazo de Entrega:</b> 3 a 5 dias úteis após aprovação</p>
                <p className="text-slate-600"><b>Validade da Proposta:</b> {quote.validityDays} dias a contar da data de emissão</p>
              </div>

              {quote.observations && (
                <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-[11px] text-amber-900">
                  <b>Observações:</b> {quote.observations}
                </div>
              )}
            </div>

            {/* Price Breakdown & Final Grand Total */}
            <div className="md:col-span-5 space-y-2">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalUnits} peças):</span>
                  <span className="font-mono font-semibold">{formatCurrency(quote.subtotalTotal)}</span>
                </div>

                <div className="flex justify-between items-center text-emerald-900 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-emerald-600" />
                    Peso Total do Pedido:
                  </span>
                  <span className="font-mono font-black">{formatWeightKg(totalWeightKg, 3)}</span>
                </div>

                {quote.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Desconto Aplicado:</span>
                    <span className="font-mono font-semibold">- {formatCurrency(quote.discount)}</span>
                  </div>
                )}

                {quote.shipping > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Frete / Transporte:</span>
                    <span className="font-mono font-semibold">+ {formatCurrency(quote.shipping)}</span>
                  </div>
                )}

                <div className="border-t border-slate-300 pt-2.5 mt-2 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-900 uppercase">VALOR TOTAL:</span>
                  <span className="text-xl font-black text-indigo-700 font-mono">
                    {formatCurrency(quote.grandTotal)}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Signatures & Footer Note */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs text-slate-500">
            <div className="pt-8 border-t border-slate-300">
              <p className="font-bold text-slate-800">UsiCorte Metalúrgica</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Departamento Comercial & Orçamentos</p>
            </div>
            <div className="pt-8 border-t border-slate-300">
              <p className="font-bold text-slate-800">{quote.clientName || 'Aceite do Cliente'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Assinatura / Carimbo de Aprovação</p>
            </div>
          </div>

          <div className="text-center pt-2 text-[10px] text-slate-400">
            UsiCorte • CNPJ 00.000.000/0001-00 • Contato: comercial@usicorte.ind.br • Sistema Gerador de Orçamentos
          </div>

        </div>

      </div>
    </div>
  );
}
