export interface Client {
  id: string; // Unique ID (for local storage)
  type: 'CNPJ' | 'CPF';
  document: string; // CNPJ or CPF formatted
  name: string; // Razão Social or Client Name
  fantasyName?: string; // Nome Fantasia (CNPJ only)
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  situation: string; // Ativa, Inativa, etc.
  contactPerson?: string;
  phone: string;
  email: string;
  enabled: boolean;
  registrationDate: string;
}

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export interface BrasilApiCnpjResponse {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  descricao_situacao_cadastral: string;
  cep: string;
  logradouro: string;
  bairro: string;
  municipio: string;
  uf: string;
  ddd_telefone_1: string;
  email: string;
}
