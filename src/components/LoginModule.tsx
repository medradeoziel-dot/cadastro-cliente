import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserPlus, LogIn, Lock, User, X } from 'lucide-react';
import Logo from './Logo';

export interface Usuario {
  nome: string;
  senha: string;
}

interface LoginModuleProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (nomeUsuario: string) => void;
  currentUser?: string | null;
  onLogout?: () => void;
}

// Configuração padrão do Administrador
const SENHA_ADMIN_PADRAO = "1234";

// Carrega os usuários salvos no LocalStorage
export function obterUsuariosCadastrados(): Usuario[] {
  const usuariosSalvos = localStorage.getItem('usicorte_usuarios');
  return usuariosSalvos ? JSON.parse(usuariosSalvos) : [];
}

export default function LoginModule({
  isOpen,
  onClose,
  onLoginSuccess,
  currentUser,
  onLogout
}: LoginModuleProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<string>('');
  const [senhaDigitada, setSenhaDigitada] = useState<string>('');
  
  // Modal Novo Usuário State
  const [isModalNovoUsuarioOpen, setIsModalNovoUsuarioOpen] = useState<boolean>(false);
  const [novoNome, setNovoNome] = useState<string>('');
  const [novaSenha, setNovaSenha] = useState<string>('');
  const [senhaAdminAuth, setSenhaAdminAuth] = useState<string>('');

  // Carrega lista de usuários no mount e sempre que o modal abre
  useEffect(() => {
    carregarListaUsuarios();
  }, [isOpen]);

  const carregarListaUsuarios = () => {
    const list = obterUsuariosCadastrados();
    setUsuarios(list);
  };

  // 1. AUTENTICAÇÃO DE LOGIN
  const autenticarUsuario = (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioSelecionado) {
      alert("Por favor, selecione seu nome de usuário!");
      return;
    }

    if (usuarioSelecionado === "ADMIN") {
      if (senhaDigitada === SENHA_ADMIN_PADRAO) {
        concluirLogin("ADMINISTRADOR");
      } else {
        alert("Senha de Administrador incorreta!");
      }
      return;
    }

    // Validação para funcionários comuns
    const list = obterUsuariosCadastrados();
    const usuarioEncontrado = list.find(u => u.nome === usuarioSelecionado);

    if (usuarioEncontrado && usuarioEncontrado.senha === senhaDigitada) {
      concluirLogin(usuarioEncontrado.nome);
    } else {
      alert("Senha incorreta para o usuário selecionado!");
    }
  };

  const concluirLogin = (nomeUsuario: string) => {
    alert(`Bem-vindo(a), ${nomeUsuario}!`);
    
    // Salva a sessão ativa temporária
    sessionStorage.setItem('usuario_logado', nomeUsuario);
    setSenhaDigitada('');
    onLoginSuccess(nomeUsuario);
    if (onClose) onClose();
  };

  // 2. MODAL DE CADASTRO DE NOVO USUÁRIO
  const abrirModalNovoUsuario = () => {
    setIsModalNovoUsuarioOpen(true);
  };

  const fecharModalNovoUsuario = () => {
    setIsModalNovoUsuarioOpen(false);
    setNovoNome('');
    setNovaSenha('');
    setSenhaAdminAuth('');
  };

  // 3. SALVAR NOVO FUNCIONÁRIO (AUTORIZADO PELO ADMIN)
  const salvarNovoUsuario = (e: React.FormEvent) => {
    e.preventDefault();

    const nomeTrim = novoNome.trim();

    // Valida a autorização do Admin
    if (senhaAdminAuth !== SENHA_ADMIN_PADRAO) {
      alert("Senha de Administrador incorreta! Autorização negada.");
      return;
    }

    const list = obterUsuariosCadastrados();

    // Verifica se o funcionário já existe
    if (list.some(u => u.nome.toLowerCase() === nomeTrim.toLowerCase()) || nomeTrim.toUpperCase() === "ADMIN") {
      alert("Já existe um funcionário cadastrado com este nome!");
      return;
    }

    // Adiciona o novo funcionário
    const novaLista = [...list, { nome: nomeTrim, senha: novaSenha }];
    localStorage.setItem('usicorte_usuarios', JSON.stringify(novaLista));

    alert(`Funcionário ${nomeTrim} cadastrado com sucesso!`);
    fecharModalNovoUsuario();
    carregarListaUsuarios();
    setUsuarioSelecionado(nomeTrim);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* TELA DE LOGIN (SOBREPOSTA) */}
      <div id="modal-login" className="login-overlay">
        <div className="login-card relative">
          
          {onClose && currentUser && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* Container da Logo em SVG */}
          <div style={{ width: '100%', textAlign: 'center', marginBottom: '20px' }}>
            <Logo className="max-w-[280px] w-full h-auto mx-auto block" />
            
            <div style={{ fontSize: '0.75rem', color: '#a0a5b5', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginTop: '14px' }}>
              SISTEMA INTEGRADO DE GESTÃO
            </div>
          </div>

          {/* FORMULÁRIO DE LOGIN */}
          <form id="formLogin" onSubmit={autenticarUsuario}>
            <div className="form-group">
              <label htmlFor="selectUsuario">Funcionário / Usuário:</label>
              <select
                id="selectUsuario"
                className="form-control"
                value={usuarioSelecionado}
                onChange={(e) => setUsuarioSelecionado(e.target.value)}
                required
              >
                <option value="">-- SELECIONE SEU NOME --</option>
                <option value="ADMIN">ADMINISTRADOR</option>
                {usuarios.map((u, idx) => (
                  <option key={idx} value={u.nome}>
                    {u.nome.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="inputSenha">Senha de Acesso:</label>
              <input
                type="password"
                id="inputSenha"
                className="form-control"
                placeholder="Digite sua senha"
                value={senhaDigitada}
                onChange={(e) => setSenhaDigitada(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-login flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" />
              <span>Entrar no Sistema</span>
            </button>
          </form>

          <button type="button" className="btn-admin-opt flex items-center justify-center gap-2" onClick={abrirModalNovoUsuario}>
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span>⚙️ Cadastrar Novo Funcionário (Admin)</span>
          </button>

          {currentUser && onLogout && (
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>Logado como: <strong className="text-emerald-400">{currentUser}</strong></span>
              <button 
                onClick={onLogout}
                className="text-rose-400 hover:text-rose-300 font-semibold cursor-pointer"
              >
                Encerrar Sessão
              </button>
            </div>
          )}

        </div>
      </div>

      {/* MODAL DE CADASTRO DE NOVO USUÁRIO (ACESSO RESTRITO) */}
      {isModalNovoUsuarioOpen && (
        <div id="modal-novo-usuario" className="login-overlay">
          <div className="login-card">
            <div className="login-title">Cadastrar Novo Funcionário</div>
            <div className="login-subtitle">Requer validação com Senha de Administrador</div>

            <form id="formCadastroUsuario" onSubmit={salvarNovoUsuario}>
              <div className="form-group">
                <label>Nome do Funcionário:</label>
                <input
                  type="text"
                  id="novoNome"
                  className="form-control"
                  placeholder="Ex: João Silva"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Criar Senha para o Funcionário:</label>
                <input
                  type="password"
                  id="novaSenha"
                  className="form-control"
                  placeholder="Senha do funcionário"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ borderTop: '1px dashed #3f3f5e', paddingTop: '12px', marginTop: '15px' }}>
                <label style={{ color: '#ff5555' }}>
                  <strong>Senha de Autorização (ADMIN):</strong>
                </label>
                <input
                  type="password"
                  id="senhaAdminAutorizacao"
                  className="form-control"
                  placeholder="Digite a senha do ADMIN"
                  value={senhaAdminAuth}
                  onChange={(e) => setSenhaAdminAuth(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button
                  type="button"
                  className="btn-admin-opt"
                  style={{ marginTop: 0 }}
                  onClick={fecharModalNovoUsuario}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-login"
                  style={{ marginTop: 0 }}
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
