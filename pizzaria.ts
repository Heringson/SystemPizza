// pizzaria_app_com_produtos.ts
// Versão estendida com cadastro/gerenciamento de produtos

import * as path from 'path';
import { promises as fs } from 'fs';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

/* ---------------------- Tipos ---------------------- */
type Tamanho = "Pequena" | "Média" | "Grande";
type FormaPagamento = "Dinheiro" | "Cartão" | "PIX";

type CategoriaProduto = 'Pizza' | 'Bebida' | 'Sobremesa' | 'Outro';

interface ProdutoBase {
  id: number;
  nome: string;
  categoria: CategoriaProduto;
  // preço único (para bebidas, sobremesas, outros)
  preco?: number;
  // preços por tamanho (para pizzas)
  precoPorTamanho?: { Pequena?: number; "Média"?: number; Grande?: number };
  ativo?: boolean;
  descricao?: string;
}

interface PizzariaEntrada {
  idPedido: number;
  pedidoPizza: string;
  pedidoBebida: string;
  tamanhoPizza: Tamanho;
  quantidadePizza: number;
  bordaRecheada: boolean;
  quantidadeBebidas: number;
  sobremesa: string;
  quantidadeSobremesa: number;
  enderecoEntrega: string;
  cliente: string;
  telefone: string;
  horaPedido: string;
  formaPagamento?: FormaPagamento;
}

/* ------------------- Pastas/Arquivos ---------------- */
const ROOT = path.resolve('.');
const DIR = {
  ts: path.join(ROOT, 'ts'),
  js: path.join(ROOT, 'js'),
  csv: path.join(ROOT, 'csv'),
  json: path.join(ROOT, 'json'),
};

const ARQ = {
  entradas: path.join(DIR.csv, 'entradas.csv'),
  ativos: path.join(DIR.csv, 'ativos.csv'),
  historico: path.join(DIR.csv, 'historico.csv'),
  config: path.join(DIR.json, 'config.json'),
  lastId: path.join(DIR.json, 'last_id.json'),
  sabores: path.join(DIR.json, 'sabores.json'),
  sobremesas: path.join(DIR.json, 'sobremesas.json'),
  produtos: path.join(DIR.json, 'produtos.json'),
};

const CAB = {
  entradas: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento\n',
  ativos: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento\n',
  historico: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento,horaSaida,precoTotal\n'
};

/* ------------------- Config padrão ------------------- */
interface PriceConfig {
  precoPorTamanho: { Pequena: number; "Média": number; Grande: number };
  precoBorda: number;
  precoBebida: number;
  precoSobremesa: { [key: string]: number };
}

const CONFIG_DEFAULT: PriceConfig = {
  precoPorTamanho: { Pequena: 30, "Média": 40, Grande: 50 },
  precoBorda: 5,
  precoBebida: 8,
  precoSobremesa: {
    "Pudim de leite condensado": 10,
    "Sorvete": 8,
    "Brigadeiro de colher": 6,
    "Brownie": 7,
    "Bolo de chocolate": 9
  }
};

const SABORES_DEFAULT = [
  "Margherita", "Calabresa", "Portuguesa", "Frango com Catupiry",
  "Quatro Queijos", "Vegetariana", "Pepperoni"
];

const SOBREMESAS_DEFAULT = [
  "Pudim de leite condensado",
  "Sorvete",
  "Brigadeiro de colher",
  "Brownie",
  "Bolo de chocolate"
];

const PRODUTOS_DEFAULT: ProdutoBase[] = [
  // Algumas entradas iniciais
  { id: 1, nome: 'Margherita', categoria: 'Pizza', precoPorTamanho: { Pequena: 30, "Média": 40, Grande: 50 }, ativo: true },
  { id: 2, nome: 'Calabresa', categoria: 'Pizza', precoPorTamanho: { Pequena: 32, "Média": 42, Grande: 52 }, ativo: true },
  { id: 3, nome: 'Coca-Cola 350ml', categoria: 'Bebida', preco: 6, ativo: true },
  { id: 4, nome: 'Sorvete', categoria: 'Sobremesa', preco: 8, ativo: true }
];

/* -------------- Prepara ambiente -------------- */
async function preparaAmbiente(): Promise<void> {
  await fs.mkdir(DIR.ts, { recursive: true });
  await fs.mkdir(DIR.js, { recursive: true });
  await fs.mkdir(DIR.csv, { recursive: true });
  await fs.mkdir(DIR.json, { recursive: true });
  await criaSeNaoExiste(ARQ.entradas, CAB.entradas);
  await criaSeNaoExiste(ARQ.ativos, CAB.ativos);
  await criaSeNaoExiste(ARQ.historico, CAB.historico);

  try { await fs.access(ARQ.config); } catch { await fs.writeFile(ARQ.config, JSON.stringify(CONFIG_DEFAULT, null, 2), 'utf8'); }
  try { await fs.access(ARQ.lastId); } catch { await fs.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: 0 }, null, 2), 'utf8'); }
  try { await fs.access(ARQ.sabores); } catch { await fs.writeFile(ARQ.sabores, JSON.stringify(SABORES_DEFAULT, null, 2), 'utf8'); }
  try { await fs.access(ARQ.sobremesas); } catch { await fs.writeFile(ARQ.sobremesas, JSON.stringify(SOBREMESAS_DEFAULT, null, 2), 'utf8'); }
  try { await fs.access(ARQ.produtos); } catch { await fs.writeFile(ARQ.produtos, JSON.stringify(PRODUTOS_DEFAULT, null, 2), 'utf8'); }
}

async function criaSeNaoExiste(caminho: string, conteudo: string = ''): Promise<void> {
  try { await fs.access(caminho); } catch { await fs.writeFile(caminho, conteudo, 'utf8'); }
}

/* ------------------- CSV Helpers ------------------- */
function csvSafe(s: string | number | boolean): string {
  const str = String(s ?? '');
  return (/,|"|\n/.test(str)) ? '"' + str.replace(/"/g, '""') + '"' : str;
}

function entradaToCsv(p: PizzariaEntrada & { horaSaida?: string, precoTotal?: number }): string {
  return [
    p.idPedido ?? '',
    p.cliente ?? '',
    p.telefone ?? '',
    p.pedidoPizza ?? '',
    p.pedidoBebida ?? '',
    p.tamanhoPizza ?? '',
    p.quantidadePizza ?? 0,
    p.bordaRecheada ?? false,
    p.quantidadeBebidas ?? 0,
    p.sobremesa ?? '',
    p.quantidadeSobremesa ?? 0,
    p.enderecoEntrega ?? '',
    p.horaPedido ?? '',
    p.formaPagamento ?? '',
    p.horaSaida ?? '',
    p.precoTotal ?? ''
  ].map(csvSafe).join(',') + '\n';
}

function splitCsv(line: string): string[] {
  const result: string[] = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') { if (line[i+1]==='"'){ cur+='"'; i++; } else inQuotes=false; }
      else cur += ch;
    } else {
      if (ch === '"') inQuotes=true;
      else if (ch===',') { result.push(cur); cur=''; }
      else cur+=ch;
    }
  }
  result.push(cur);
  return result;
}

/* ------------------- ID e Config ------------------- */
async function getNextId(): Promise<number> {
  const raw = await fs.readFile(ARQ.lastId, 'utf8');
  const obj = JSON.parse(raw) as { ultimoId?: number };
  const next = (obj.ultimoId || 0) + 1;
  await fs.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: next }, null, 2), 'utf8');
  return next;
}

async function loadConfig(): Promise<PriceConfig> {
  const raw = await fs.readFile(ARQ.config, 'utf8');
  return JSON.parse(raw) as PriceConfig;
}

async function loadSabores(): Promise<string[]> {
  const raw = await fs.readFile(ARQ.sabores, 'utf8');
  return JSON.parse(raw) as string[];
}

async function loadSobremesas(): Promise<{ [key: string]: number }> {
  const config = await loadConfig();
  return config.precoSobremesa;
}

/* ------------------- Produtos (CRUD) ------------------- */
async function loadProdutos(): Promise<ProdutoBase[]> {
  try {
    const raw = await fs.readFile(ARQ.produtos, 'utf8');
    return JSON.parse(raw) as ProdutoBase[];
  } catch { return []; }
}

async function saveProdutos(list: ProdutoBase[]): Promise<void> {
  await fs.writeFile(ARQ.produtos, JSON.stringify(list, null, 2), 'utf8');
}

async function addProduto(p: Omit<ProdutoBase,'id'>): Promise<ProdutoBase> {
  const list = await loadProdutos();
  const id = (list.reduce((acc,cur)=>Math.max(acc,cur.id),0) || 0) + 1;
  const np: ProdutoBase = { id, ...p };
  list.push(np);
  await saveProdutos(list);
  return np;
}

async function editProduto(id: number, patch: Partial<ProdutoBase>): Promise<ProdutoBase | null> {
  const list = await loadProdutos();
  const idx = list.findIndex(x=>x.id===id);
  if(idx<0) return null;
  list[idx] = { ...list[idx], ...patch };
  await saveProdutos(list);
  return list[idx];
}

async function removeProduto(id: number): Promise<boolean> {
  let list = await loadProdutos();
  const originalLen = list.length;
  list = list.filter(x=>x.id!==id);
  await saveProdutos(list);
  return list.length < originalLen;
}

async function listProdutosPorCategoria(): Promise<{ [k in CategoriaProduto]?: ProdutoBase[] }> {
  const list = await loadProdutos();
  const out: { [k in CategoriaProduto]?: ProdutoBase[] } = {};
  for (const p of list) {
    if (!out[p.categoria]) out[p.categoria] = [];
    out[p.categoria]!.push(p);
  }
  return out;
}

/* ------------------- Calculo de preços ------------------- */
async function calcularPrecoTotal(dados: {
  tamanhoPizza: Tamanho;
  quantidadePizza: number;
  bordaRecheada: boolean;
  quantidadeBebidas: number;
  sobremesa: string;
  quantidadeSobremesa: number;
}): Promise<number> {
  const config = await loadConfig();
  let total = 0;
  total += (config.precoPorTamanho[dados.tamanhoPizza] || 0) * dados.quantidadePizza;
  if(dados.bordaRecheada) total += config.precoBorda*dados.quantidadePizza;
  total += (dados.quantidadeBebidas || 0)*config.precoBebida;
  total += (dados.quantidadeSobremesa || 0)*(config.precoSobremesa[dados.sobremesa]||0);
  return total;
}

/* ------------------- Ler e escrever ativos ------------------- */
async function lerAtivos(): Promise<PizzariaEntrada[]> {
  try {
    const raw = await fs.readFile(ARQ.ativos,'utf8');
    const linhas = raw.split(/\r?\n/).filter(l=>l.trim().length>0);
    if(linhas.length<=1) return [];
    return linhas.slice(1).map(l=>{
      const [idPedido, cliente, telefone, pedidoPizza, pedidoBebida, tamanhoPizza, quantidadePizza, bordaRecheada, quantidadeBebidas, sobremesa, quantidadeSobremesa, enderecoEntrega, horaPedido, formaPagamento] = splitCsv(l);
      return {
        idPedido: Number(idPedido)||0,
        cliente, telefone, pedidoPizza, pedidoBebida,
        tamanhoPizza: tamanhoPizza as Tamanho,
        quantidadePizza: Number(quantidadePizza)||0,
        bordaRecheada: bordaRecheada.toLowerCase() === 'true',
        quantidadeBebidas: Number(quantidadeBebidas)||0,
        sobremesa,
        quantidadeSobremesa: Number(quantidadeSobremesa)||0,
        enderecoEntrega,
        horaPedido,
        formaPagamento: formaPagamento as FormaPagamento
      } as PizzariaEntrada;
    });
  } catch { return []; }
}

async function escreverAtivos(lista: PizzariaEntrada[]): Promise<void> {
  const corpo = lista.map(entradaToCsv).join('');
  await fs.writeFile(ARQ.ativos, CAB.ativos+corpo, 'utf8');
}

async function registrarEntrada(dados: Omit<PizzariaEntrada,'idPedido'|'horaPedido'>): Promise<PizzariaEntrada>{
  const id = await getNextId();
  const reg:PizzariaEntrada = {idPedido:id, horaPedido:new Date().toISOString(), ...dados};
  await fs.appendFile(ARQ.ativos, entradaToCsv(reg),'utf8');
  return reg;
}

/* ------------------- Finalizar Pedido ------------------- */
async function finalizarPedido(pedido: PizzariaEntrada, precoTotal: number){
  const horaSaida = new Date().toISOString();
  await fs.appendFile(ARQ.historico, entradaToCsv({...pedido,horaSaida,precoTotal}),'utf8');

  const ativos = await lerAtivos();
  const novosAtivos = ativos.filter(p=>p.idPedido!==pedido.idPedido);
  await escreverAtivos(novosAtivos);
}

/* ------------------- Comprovante ------------------- */
async function emitirComprovante(pedido: PizzariaEntrada, total: number){
  const dateISO = new Date().toISOString().slice(0,10);
  const caminho = path.join(DIR.csv, `comprovante_${pedido.idPedido}_${dateISO}.txt`);
  const conteudo = `\n=== COMPROVANTE DE COMPRA ===\nID Pedido: ${pedido.idPedido}\nCliente: ${pedido.cliente}\nTelefone: ${pedido.telefone}\nEndereço: ${pedido.enderecoEntrega}\n\nPizza: ${pedido.pedidoPizza} (${pedido.tamanhoPizza}) x${pedido.quantidadePizza} ${pedido.bordaRecheada?'Borda Recheada':''}\nBebida: ${pedido.pedidoBebida} x${pedido.quantidadeBebidas}\nSobremesa: ${pedido.sobremesa} x${pedido.quantidadeSobremesa}\n\nForma de Pagamento: ${pedido.formaPagamento}\n\nHora do Pedido: ${pedido.horaPedido}\nValor Total: R$ ${total.toFixed(2)}\n\nObrigado pela preferência!\n`;
  await fs.writeFile(caminho, conteudo,'utf8');
  console.log(`Comprovante gerado: ${caminho}`);
}

/* ------------------- Relatório ------------------- */
async function relatorioVendas() {
  try {
    const raw = await fs.readFile(ARQ.historico, 'utf8');
    const linhas = raw.split(/\r?\n/).filter(l => l.trim().length > 1).slice(1);

    if (linhas.length === 0) {
      console.log('Sem histórico de vendas.');
      return;
    }

    const vendasDiarias: { [forma: string]: { qtd: number, total: number } } = {};
    const vendasMensais: { [forma: string]: { qtd: number, total: number } } = {};
    let totalDiario = 0;
    let totalMensal = 0;

    linhas.forEach(l => {
      const campos = splitCsv(l);
      const qtd = Number(campos[6]) || 0;
      const total = parseFloat(campos[15]) || 0;
      const forma = campos[13] || 'Não definido';
      const data = campos[12].slice(0, 10);
      const mes = campos[12].slice(0, 7);

      if (!vendasDiarias[forma]) vendasDiarias[forma] = { qtd: 0, total: 0 };
      vendasDiarias[forma].qtd += qtd;
      vendasDiarias[forma].total += total;
      totalDiario += total;

      if (!vendasMensais[forma]) vendasMensais[forma] = { qtd: 0, total: 0 };
      vendasMensais[forma].qtd += qtd;
      vendasMensais[forma].total += total;
      totalMensal += total;
    });

    console.log('\n=== RELATÓRIO DIÁRIO DE PIZZAS VENDIDAS ===');
    for (const forma in vendasDiarias) {
      console.log(`${forma}: ${vendasDiarias[forma].qtd} pizzas | Total: R$ ${vendasDiarias[forma].total.toFixed(2)}`);
    }
    console.log(`TOTAL DIÁRIO: R$ ${totalDiario.toFixed(2)}`);

    console.log('\n=== RELATÓRIO MENSAL DE PIZZAS VENDIDAS ===');
    for (const forma in vendasMensais) {
      console.log(`${forma}: ${vendasMensais[forma].qtd} pizzas | Total: R$ ${vendasMensais[forma].total.toFixed(2)}`);
    }
    console.log(`TOTAL MENSAL: R$ ${totalMensal.toFixed(2)}`);

  } catch (err) {
    console.log('Erro ao gerar relatório:', err);
  }
}

/* ------------------- UI ------------------- */
const rl = readline.createInterface({input,output});
function ask(q:string):Promise<string>{return new Promise(resolve=>rl.question(q,resolve));}

async function mostrarCardapio():Promise<void>{
  const produtosPorCat = await listProdutosPorCategoria();
  const config = await loadConfig();

  console.log('\n=== CARDÁPIO ===');
  const cats: CategoriaProduto[] = ['Pizza','Bebida','Sobremesa','Outro'];
  for (const c of cats) {
    const arr = produtosPorCat[c] || [];
    if (arr.length === 0) continue;
    console.log(`\n--- ${c.toUpperCase()} ---`);
    arr.forEach(p=>{
      if (p.categoria === 'Pizza') {
        const pp = p.precoPorTamanho || {};
        console.log(`${p.id}) ${p.nome} - P: ${pp.Pequena ?? '-'} | M: ${pp['Média'] ?? '-'} | G: ${pp.Grande ?? '-'} ${p.ativo? '':'(inativo)'} ${p.descricao?'- '+p.descricao:''}`);
      } else {
        console.log(`${p.id}) ${p.nome} - R$ ${p.preco?.toFixed(2) ?? '-'} ${p.ativo? '':'(inativo)'} ${p.descricao?'- '+p.descricao:''}`);
      }
    });
  }

  console.log('\n=== PREÇOS PADRÃO (se necessário) ===');
  console.log(`Pequena: R$ ${config.precoPorTamanho.Pequena}`);
  console.log(`Média:   R$ ${config.precoPorTamanho['Média']}`);
  console.log(`Grande:  R$ ${config.precoPorTamanho.Grande}`);
  console.log(`Borda Recheada: R$ ${config.precoBorda}`);
  console.log(`Bebida (unitário): R$ ${config.precoBebida}`);
}

/* ------------------- Gerenciador de Produtos (UI) ------------------- */
async function menuProdutos(): Promise<void> {
  let voltar = false;
  while(!voltar) {
    console.log('\n=== GERENCIAR PRODUTOS ===');
    console.log('1 - Listar produtos');
    console.log('2 - Adicionar produto');
    console.log('3 - Editar produto');
    console.log('4 - Remover produto');
    console.log('0 - Voltar');
    const op = await ask('> ');
    switch(op) {
      case '1':{
        const list = await loadProdutos();
        if(list.length===0){ console.log('Nenhum produto cadastrado.'); break; }
        console.log('\nProdutos cadastrados:');
        list.forEach(p=>{
          console.log(JSON.stringify(p));
        });
      } break;

      case '2':{
        const nome = await ask('Nome: ');
        const categoria = (await ask('Categoria (Pizza/Bebida/Sobremesa/Outro): ')) as CategoriaProduto;
        let preco: number | undefined = undefined;
        let precoPorTamanho: ProdutoBase['precoPorTamanho'] | undefined = undefined;
        if(categoria === 'Pizza'){
          const pP = Number(await ask('Preço Pequena: '))||0;
          const pM = Number(await ask('Preço Média: '))||0;
          const pG = Number(await ask('Preço Grande: '))||0;
          precoPorTamanho = { Pequena: pP, 'Média': pM, Grande: pG };
        } else {
          preco = Number(await ask('Preço: '))||0;
        }
        const descricao = await ask('Descrição (opcional): ');
        const novo = await addProduto({ nome, categoria, preco, precoPorTamanho, ativo: true, descricao: descricao || undefined });
        console.log('Produto criado:', novo);
      } break;

      case '3':{
        const id = Number(await ask('ID do produto para editar: '));
        const prod = (await loadProdutos()).find(p=>p.id===id);
        if(!prod){ console.log('Produto não encontrado.'); break; }
        const nome = await ask(`Nome (${prod.nome}): `) || prod.nome;
        const ativo = (await ask(`Ativo (s/n) [${prod.ativo? 's':'n'}]: `)).toLowerCase() === 's';
        let preco = prod.preco;
        let precoPorTamanho = prod.precoPorTamanho;
        if(prod.categoria === 'Pizza'){
          const pP = Number(await ask(`Preço Pequena (${prod.precoPorTamanho?.Pequena ?? '-' }): `))||prod.precoPorTamanho?.Pequena;
          const pM = Number(await ask(`Preço Média (${prod.precoPorTamanho?.['Média'] ?? '-' }): `))||prod.precoPorTamanho?.['Média'];
          const pG = Number(await ask(`Preço Grande (${prod.precoPorTamanho?.Grande ?? '-' }): `))||prod.precoPorTamanho?.Grande;
          precoPorTamanho = { Pequena: pP, 'Média': pM, Grande: pG };
        } else {
          preco = Number(await ask(`Preço (${prod.preco ?? '-' }): `))||prod.preco;
        }
        const descricao = await ask(`Descrição (${prod.descricao ?? ''}): `) || prod.descricao;
        const atualizado = await editProduto(id, { nome, ativo, preco, precoPorTamanho, descricao });
        console.log('Atualizado:', atualizado);
      } break;

      case '4':{
        const id = Number(await ask('ID do produto para remover: '));
        const ok = await removeProduto(id);
        console.log(ok? 'Produto removido.':'Produto não encontrado.');
      } break;

      case '0': voltar = true; break;
      default: console.log('Opção inválida.');
    }
  }
}

/* ------------------- MAIN ------------------- */
async function main():Promise<void>{
  await preparaAmbiente();
  console.log('=== Pizzaria App (com gerenciamento de produtos) ===');

  process.on('SIGINT',async()=>{ console.log('\nEncerrando...'); rl.close(); process.exit(); });

  let sair=false;
  while(!sair){
    console.log('\n=== MENU ===');
    console.log('1 - Registrar pedido');
    console.log('2 - Listar pedidos ativos com total por cliente');
    console.log('3 - Finalizar pedido');
    console.log('4 - Limpar pedidos ativos e reiniciar ID');
    console.log('5 - Relatório de vendas (diário/mensal)');
    console.log('6 - Gerenciar produtos');
    console.log('0 - Sair');

    const opc=await ask('> ');

    switch(opc){
      case '1':{
        await mostrarCardapio();
        const cliente = await ask('Cliente: ');
        const telefone = await ask('Telefone: ');
        // Permitir escolher o nome da pizza/bebida/sobremesa pelo usuário livremente
        const pizza = await ask('Pizza (nome ou ID): ');
        const bebida = await ask('Bebida (nome ou ID): ');
        const tamanho = (await ask('Tamanho (Pequena/Média/Grande): ')) as Tamanho;
        const qtdPizza = Number(await ask('Qtde pizzas: '))||1;
        const borda = (await ask('Borda recheada (s/n): ')).toLowerCase()==='s';
        const qtdBebida = Number(await ask('Qtde bebidas: '))||0;
        const sobremesa = await ask('Escolha a sobremesa (nome ou ID): ');
        const qtdSobremesa = Number(await ask('Qtde sobremesas: '))||0;
        const endereco = await ask('Endereço: ');
        const formaPagamento = (await ask('Forma de pagamento (Dinheiro/Cartão/PIX): ')) as FormaPagamento;

        const reg = await registrarEntrada({
          cliente, telefone, pedidoPizza: pizza, pedidoBebida: bebida,
          tamanhoPizza: tamanho, quantidadePizza: qtdPizza, bordaRecheada: borda,
          quantidadeBebidas: qtdBebida, sobremesa, quantidadeSobremesa: qtdSobremesa,
          enderecoEntrega: endereco, formaPagamento
        });

        // cálculo de preço tenta utilizar produto cadastrado quando possível
        let total = 0;
        try {
          const produtos = await loadProdutos();
          // pizza
          const pp = produtos.find(p=>p.id===Number(pizza) || p.nome.toLowerCase()===pizza.toLowerCase());
          if(pp && pp.categoria==='Pizza' && pp.precoPorTamanho){
            total += (pp.precoPorTamanho[tamanho] || 0) * qtdPizza;
          } else {
            const cfg = await loadConfig();
            total += (cfg.precoPorTamanho[tamanho] || 0) * qtdPizza;
          }
          if(borda) {
            const cfg = await loadConfig();
            total += cfg.precoBorda * qtdPizza;
          }
          // bebida
          const pb = produtos.find(p=>p.id===Number(bebida) || p.nome.toLowerCase()===bebida.toLowerCase());
          if(pb && pb.preco) total += pb.preco * qtdBebida; else { const cfg = await loadConfig(); total += cfg.precoBebida * qtdBebida; }
          // sobremesa
          const ps = produtos.find(p=>p.id===Number(sobremesa) || p.nome.toLowerCase()===sobremesa.toLowerCase());
          if(ps && ps.preco) total += ps.preco * qtdSobremesa; else { const cfg = await loadConfig(); total += (cfg.precoSobremesa[sobremesa]||0) * qtdSobremesa; }
        } catch(e){
          total = await calcularPrecoTotal({ tamanhoPizza: tamanho, quantidadePizza: qtdPizza, bordaRecheada: borda, quantidadeBebidas: qtdBebida, sobremesa, quantidadeSobremesa: qtdSobremesa });
        }

        await emitirComprovante(reg,total);
        console.log(`Pedido registrado. Total: R$ ${total.toFixed(2)}`);
      } break;

      case '2':{
        const ativos = await lerAtivos();
        if(ativos.length===0){ console.log('Sem pedidos ativos.'); break; }
        console.log('\n=== Pedidos ativos ===');
        for(const p of ativos){
          const total = await calcularPrecoTotal({
            tamanhoPizza: p.tamanhoPizza,
            quantidadePizza: p.quantidadePizza,
            bordaRecheada: p.bordaRecheada,
            quantidadeBebidas: p.quantidadeBebidas,
            sobremesa: p.sobremesa,
            quantidadeSobremesa: p.quantidadeSobremesa
          });
          console.log(`ID:${p.idPedido} - Cliente:${p.cliente} - Total R$ ${total.toFixed(2)} - Forma:${p.formaPagamento}`);
        }
      } break;

      case '3':{
        const id = Number(await ask('ID do pedido para finalizar: '));
        const ativos = await lerAtivos();
        const pedido = ativos.find(p=>p.idPedido===id);
        if(!pedido){ console.log('Pedido não encontrado.'); break; }
        const total = await calcularPrecoTotal({
          tamanhoPizza: pedido.tamanhoPizza,
          quantidadePizza: pedido.quantidadePizza,
          bordaRecheada: pedido.bordaRecheada,
          quantidadeBebidas: pedido.quantidadeBebidas,
          sobremesa: pedido.sobremesa,
          quantidadeSobremesa: pedido.quantidadeSobremesa
        });
        await finalizarPedido(pedido,total);
        console.log(`Pedido finalizado. Total: R$ ${total.toFixed(2)}`);
      } break;

      case '4':{
        await fs.writeFile(ARQ.ativos,CAB.ativos,'utf8');
        await fs.writeFile(ARQ.lastId,JSON.stringify({ultimoId:0},null,2),'utf8');
        console.log('Pedidos ativos limpos e ID reiniciado.');
      } break;

      case '5':{
        await relatorioVendas();
      } break;

      case '6':{
        await menuProdutos();
      } break;

      case '0': sair=true; break;
      default: console.log('Opção inválida.');
    }
  }

  rl.close();
  console.log('Aplicativo encerrado.');
}

main();
