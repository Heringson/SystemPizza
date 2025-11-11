"use strict";
// pizzaria_app_com_produtos.ts
// Versão estendida com cadastro/gerenciamento de produtos
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs_1 = require("fs");
var readline = require("readline");
var process_1 = require("process");
/* ------------------- Pastas/Arquivos ---------------- */
var ROOT = path.resolve('.');
var DIR = {
    ts: path.join(ROOT, 'ts'),
    js: path.join(ROOT, 'js'),
    csv: path.join(ROOT, 'csv'),
    json: path.join(ROOT, 'json'),
};
var ARQ = {
    entradas: path.join(DIR.csv, 'entradas.csv'),
    ativos: path.join(DIR.csv, 'ativos.csv'),
    historico: path.join(DIR.csv, 'historico.csv'),
    config: path.join(DIR.json, 'config.json'),
    lastId: path.join(DIR.json, 'last_id.json'),
    sabores: path.join(DIR.json, 'sabores.json'),
    sobremesas: path.join(DIR.json, 'sobremesas.json'),
    produtos: path.join(DIR.json, 'produtos.json'),
};
var CAB = {
    entradas: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento\n',
    ativos: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento\n',
    historico: 'idPedido,cliente,telefone,pedidoPizza,pedidoBebida,tamanhoPizza,quantidadePizza,bordaRecheada,quantidadeBebidas,sobremesa,quantidadeSobremesa,enderecoEntrega,horaPedido,formaPagamento,horaSaida,precoTotal\n'
};
var CONFIG_DEFAULT = {
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
var SABORES_DEFAULT = [
    "Margherita", "Calabresa", "Portuguesa", "Frango com Catupiry",
    "Quatro Queijos", "Vegetariana", "Pepperoni"
];
var SOBREMESAS_DEFAULT = [
    "Pudim de leite condensado",
    "Sorvete",
    "Brigadeiro de colher",
    "Brownie",
    "Bolo de chocolate"
];
var PRODUTOS_DEFAULT = [
    // Algumas entradas iniciais
    { id: 1, nome: 'Margherita', categoria: 'Pizza', precoPorTamanho: { Pequena: 30, "Média": 40, Grande: 50 }, ativo: true },
    { id: 2, nome: 'Calabresa', categoria: 'Pizza', precoPorTamanho: { Pequena: 32, "Média": 42, Grande: 52 }, ativo: true },
    { id: 3, nome: 'Coca-Cola 350ml', categoria: 'Bebida', preco: 6, ativo: true },
    { id: 4, nome: 'Sorvete', categoria: 'Sobremesa', preco: 8, ativo: true }
];
/* -------------- Prepara ambiente -------------- */
function preparaAmbiente() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, fs_1.promises.mkdir(DIR.ts, { recursive: true })];
                case 1:
                    _f.sent();
                    return [4 /*yield*/, fs_1.promises.mkdir(DIR.js, { recursive: true })];
                case 2:
                    _f.sent();
                    return [4 /*yield*/, fs_1.promises.mkdir(DIR.csv, { recursive: true })];
                case 3:
                    _f.sent();
                    return [4 /*yield*/, fs_1.promises.mkdir(DIR.json, { recursive: true })];
                case 4:
                    _f.sent();
                    return [4 /*yield*/, criaSeNaoExiste(ARQ.entradas, CAB.entradas)];
                case 5:
                    _f.sent();
                    return [4 /*yield*/, criaSeNaoExiste(ARQ.ativos, CAB.ativos)];
                case 6:
                    _f.sent();
                    return [4 /*yield*/, criaSeNaoExiste(ARQ.historico, CAB.historico)];
                case 7:
                    _f.sent();
                    _f.label = 8;
                case 8:
                    _f.trys.push([8, 10, , 12]);
                    return [4 /*yield*/, fs_1.promises.access(ARQ.config)];
                case 9:
                    _f.sent();
                    return [3 /*break*/, 12];
                case 10:
                    _a = _f.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.config, JSON.stringify(CONFIG_DEFAULT, null, 2), 'utf8')];
                case 11:
                    _f.sent();
                    return [3 /*break*/, 12];
                case 12:
                    _f.trys.push([12, 14, , 16]);
                    return [4 /*yield*/, fs_1.promises.access(ARQ.lastId)];
                case 13:
                    _f.sent();
                    return [3 /*break*/, 16];
                case 14:
                    _b = _f.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: 0 }, null, 2), 'utf8')];
                case 15:
                    _f.sent();
                    return [3 /*break*/, 16];
                case 16:
                    _f.trys.push([16, 18, , 20]);
                    return [4 /*yield*/, fs_1.promises.access(ARQ.sabores)];
                case 17:
                    _f.sent();
                    return [3 /*break*/, 20];
                case 18:
                    _c = _f.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.sabores, JSON.stringify(SABORES_DEFAULT, null, 2), 'utf8')];
                case 19:
                    _f.sent();
                    return [3 /*break*/, 20];
                case 20:
                    _f.trys.push([20, 22, , 24]);
                    return [4 /*yield*/, fs_1.promises.access(ARQ.sobremesas)];
                case 21:
                    _f.sent();
                    return [3 /*break*/, 24];
                case 22:
                    _d = _f.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.sobremesas, JSON.stringify(SOBREMESAS_DEFAULT, null, 2), 'utf8')];
                case 23:
                    _f.sent();
                    return [3 /*break*/, 24];
                case 24:
                    _f.trys.push([24, 26, , 28]);
                    return [4 /*yield*/, fs_1.promises.access(ARQ.produtos)];
                case 25:
                    _f.sent();
                    return [3 /*break*/, 28];
                case 26:
                    _e = _f.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.produtos, JSON.stringify(PRODUTOS_DEFAULT, null, 2), 'utf8')];
                case 27:
                    _f.sent();
                    return [3 /*break*/, 28];
                case 28: return [2 /*return*/];
            }
        });
    });
}
function criaSeNaoExiste(caminho_1) {
    return __awaiter(this, arguments, void 0, function (caminho, conteudo) {
        var _a;
        if (conteudo === void 0) { conteudo = ''; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 4]);
                    return [4 /*yield*/, fs_1.promises.access(caminho)];
                case 1:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 2:
                    _a = _b.sent();
                    return [4 /*yield*/, fs_1.promises.writeFile(caminho, conteudo, 'utf8')];
                case 3:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/* ------------------- CSV Helpers ------------------- */
function csvSafe(s) {
    var str = String(s !== null && s !== void 0 ? s : '');
    return (/,|"|\n/.test(str)) ? '"' + str.replace(/"/g, '""') + '"' : str;
}
function entradaToCsv(p) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return [
        (_a = p.idPedido) !== null && _a !== void 0 ? _a : '',
        (_b = p.cliente) !== null && _b !== void 0 ? _b : '',
        (_c = p.telefone) !== null && _c !== void 0 ? _c : '',
        (_d = p.pedidoPizza) !== null && _d !== void 0 ? _d : '',
        (_e = p.pedidoBebida) !== null && _e !== void 0 ? _e : '',
        (_f = p.tamanhoPizza) !== null && _f !== void 0 ? _f : '',
        (_g = p.quantidadePizza) !== null && _g !== void 0 ? _g : 0,
        (_h = p.bordaRecheada) !== null && _h !== void 0 ? _h : false,
        (_j = p.quantidadeBebidas) !== null && _j !== void 0 ? _j : 0,
        (_k = p.sobremesa) !== null && _k !== void 0 ? _k : '',
        (_l = p.quantidadeSobremesa) !== null && _l !== void 0 ? _l : 0,
        (_m = p.enderecoEntrega) !== null && _m !== void 0 ? _m : '',
        (_o = p.horaPedido) !== null && _o !== void 0 ? _o : '',
        (_p = p.formaPagamento) !== null && _p !== void 0 ? _p : '',
        (_q = p.horaSaida) !== null && _q !== void 0 ? _q : '',
        (_r = p.precoTotal) !== null && _r !== void 0 ? _r : ''
    ].map(csvSafe).join(',') + '\n';
}
function splitCsv(line) {
    var result = [];
    var cur = '', inQuotes = false;
    for (var i = 0; i < line.length; i++) {
        var ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (line[i + 1] === '"') {
                    cur += '"';
                    i++;
                }
                else
                    inQuotes = false;
            }
            else
                cur += ch;
        }
        else {
            if (ch === '"')
                inQuotes = true;
            else if (ch === ',') {
                result.push(cur);
                cur = '';
            }
            else
                cur += ch;
        }
    }
    result.push(cur);
    return result;
}
/* ------------------- ID e Config ------------------- */
function getNextId() {
    return __awaiter(this, void 0, void 0, function () {
        var raw, obj, next;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(ARQ.lastId, 'utf8')];
                case 1:
                    raw = _a.sent();
                    obj = JSON.parse(raw);
                    next = (obj.ultimoId || 0) + 1;
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: next }, null, 2), 'utf8')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, next];
            }
        });
    });
}
function loadConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(ARQ.config, 'utf8')];
                case 1:
                    raw = _a.sent();
                    return [2 /*return*/, JSON.parse(raw)];
            }
        });
    });
}
function loadSabores() {
    return __awaiter(this, void 0, void 0, function () {
        var raw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.readFile(ARQ.sabores, 'utf8')];
                case 1:
                    raw = _a.sent();
                    return [2 /*return*/, JSON.parse(raw)];
            }
        });
    });
}
function loadSobremesas() {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadConfig()];
                case 1:
                    config = _a.sent();
                    return [2 /*return*/, config.precoSobremesa];
            }
        });
    });
}
/* ------------------- Produtos (CRUD) ------------------- */
function loadProdutos() {
    return __awaiter(this, void 0, void 0, function () {
        var raw, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readFile(ARQ.produtos, 'utf8')];
                case 1:
                    raw = _b.sent();
                    return [2 /*return*/, JSON.parse(raw)];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function saveProdutos(list) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.writeFile(ARQ.produtos, JSON.stringify(list, null, 2), 'utf8')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function addProduto(p) {
    return __awaiter(this, void 0, void 0, function () {
        var list, id, np;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadProdutos()];
                case 1:
                    list = _a.sent();
                    id = (list.reduce(function (acc, cur) { return Math.max(acc, cur.id); }, 0) || 0) + 1;
                    np = __assign({ id: id }, p);
                    list.push(np);
                    return [4 /*yield*/, saveProdutos(list)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, np];
            }
        });
    });
}
function editProduto(id, patch) {
    return __awaiter(this, void 0, void 0, function () {
        var list, idx;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadProdutos()];
                case 1:
                    list = _a.sent();
                    idx = list.findIndex(function (x) { return x.id === id; });
                    if (idx < 0)
                        return [2 /*return*/, null];
                    list[idx] = __assign(__assign({}, list[idx]), patch);
                    return [4 /*yield*/, saveProdutos(list)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, list[idx]];
            }
        });
    });
}
function removeProduto(id) {
    return __awaiter(this, void 0, void 0, function () {
        var list, originalLen;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadProdutos()];
                case 1:
                    list = _a.sent();
                    originalLen = list.length;
                    list = list.filter(function (x) { return x.id !== id; });
                    return [4 /*yield*/, saveProdutos(list)];
                case 2:
                    _a.sent();
                    return [2 /*return*/, list.length < originalLen];
            }
        });
    });
}
function listProdutosPorCategoria() {
    return __awaiter(this, void 0, void 0, function () {
        var list, out, _i, list_1, p;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadProdutos()];
                case 1:
                    list = _a.sent();
                    out = {};
                    for (_i = 0, list_1 = list; _i < list_1.length; _i++) {
                        p = list_1[_i];
                        if (!out[p.categoria])
                            out[p.categoria] = [];
                        out[p.categoria].push(p);
                    }
                    return [2 /*return*/, out];
            }
        });
    });
}
/* ------------------- Calculo de preços ------------------- */
function calcularPrecoTotal(dados) {
    return __awaiter(this, void 0, void 0, function () {
        var config, total;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadConfig()];
                case 1:
                    config = _a.sent();
                    total = 0;
                    total += (config.precoPorTamanho[dados.tamanhoPizza] || 0) * dados.quantidadePizza;
                    if (dados.bordaRecheada)
                        total += config.precoBorda * dados.quantidadePizza;
                    total += (dados.quantidadeBebidas || 0) * config.precoBebida;
                    total += (dados.quantidadeSobremesa || 0) * (config.precoSobremesa[dados.sobremesa] || 0);
                    return [2 /*return*/, total];
            }
        });
    });
}
/* ------------------- Ler e escrever ativos ------------------- */
function lerAtivos() {
    return __awaiter(this, void 0, void 0, function () {
        var raw, linhas, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readFile(ARQ.ativos, 'utf8')];
                case 1:
                    raw = _b.sent();
                    linhas = raw.split(/\r?\n/).filter(function (l) { return l.trim().length > 0; });
                    if (linhas.length <= 1)
                        return [2 /*return*/, []];
                    return [2 /*return*/, linhas.slice(1).map(function (l) {
                            var _a = splitCsv(l), idPedido = _a[0], cliente = _a[1], telefone = _a[2], pedidoPizza = _a[3], pedidoBebida = _a[4], tamanhoPizza = _a[5], quantidadePizza = _a[6], bordaRecheada = _a[7], quantidadeBebidas = _a[8], sobremesa = _a[9], quantidadeSobremesa = _a[10], enderecoEntrega = _a[11], horaPedido = _a[12], formaPagamento = _a[13];
                            return {
                                idPedido: Number(idPedido) || 0,
                                cliente: cliente,
                                telefone: telefone,
                                pedidoPizza: pedidoPizza,
                                pedidoBebida: pedidoBebida,
                                tamanhoPizza: tamanhoPizza,
                                quantidadePizza: Number(quantidadePizza) || 0,
                                bordaRecheada: bordaRecheada.toLowerCase() === 'true',
                                quantidadeBebidas: Number(quantidadeBebidas) || 0,
                                sobremesa: sobremesa,
                                quantidadeSobremesa: Number(quantidadeSobremesa) || 0,
                                enderecoEntrega: enderecoEntrega,
                                horaPedido: horaPedido,
                                formaPagamento: formaPagamento
                            };
                        })];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function escreverAtivos(lista) {
    return __awaiter(this, void 0, void 0, function () {
        var corpo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    corpo = lista.map(entradaToCsv).join('');
                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.ativos, CAB.ativos + corpo, 'utf8')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function registrarEntrada(dados) {
    return __awaiter(this, void 0, void 0, function () {
        var id, reg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getNextId()];
                case 1:
                    id = _a.sent();
                    reg = __assign({ idPedido: id, horaPedido: new Date().toISOString() }, dados);
                    return [4 /*yield*/, fs_1.promises.appendFile(ARQ.ativos, entradaToCsv(reg), 'utf8')];
                case 2:
                    _a.sent();
                    return [2 /*return*/, reg];
            }
        });
    });
}
/* ------------------- Finalizar Pedido ------------------- */
function finalizarPedido(pedido, precoTotal) {
    return __awaiter(this, void 0, void 0, function () {
        var horaSaida, ativos, novosAtivos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    horaSaida = new Date().toISOString();
                    return [4 /*yield*/, fs_1.promises.appendFile(ARQ.historico, entradaToCsv(__assign(__assign({}, pedido), { horaSaida: horaSaida, precoTotal: precoTotal })), 'utf8')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, lerAtivos()];
                case 2:
                    ativos = _a.sent();
                    novosAtivos = ativos.filter(function (p) { return p.idPedido !== pedido.idPedido; });
                    return [4 /*yield*/, escreverAtivos(novosAtivos)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/* ------------------- Comprovante ------------------- */
function emitirComprovante(pedido, total) {
    return __awaiter(this, void 0, void 0, function () {
        var dateISO, caminho, conteudo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dateISO = new Date().toISOString().slice(0, 10);
                    caminho = path.join(DIR.csv, "comprovante_".concat(pedido.idPedido, "_").concat(dateISO, ".txt"));
                    conteudo = "\n=== COMPROVANTE DE COMPRA ===\nID Pedido: ".concat(pedido.idPedido, "\nCliente: ").concat(pedido.cliente, "\nTelefone: ").concat(pedido.telefone, "\nEndere\u00E7o: ").concat(pedido.enderecoEntrega, "\n\nPizza: ").concat(pedido.pedidoPizza, " (").concat(pedido.tamanhoPizza, ") x").concat(pedido.quantidadePizza, " ").concat(pedido.bordaRecheada ? 'Borda Recheada' : '', "\nBebida: ").concat(pedido.pedidoBebida, " x").concat(pedido.quantidadeBebidas, "\nSobremesa: ").concat(pedido.sobremesa, " x").concat(pedido.quantidadeSobremesa, "\n\nForma de Pagamento: ").concat(pedido.formaPagamento, "\n\nHora do Pedido: ").concat(pedido.horaPedido, "\nValor Total: R$ ").concat(total.toFixed(2), "\n\nObrigado pela prefer\u00EAncia!\n");
                    return [4 /*yield*/, fs_1.promises.writeFile(caminho, conteudo, 'utf8')];
                case 1:
                    _a.sent();
                    console.log("Comprovante gerado: ".concat(caminho));
                    return [2 /*return*/];
            }
        });
    });
}
/* ------------------- Relatório ------------------- */
function relatorioVendas() {
    return __awaiter(this, void 0, void 0, function () {
        var raw, linhas, vendasDiarias_1, vendasMensais_1, totalDiario_1, totalMensal_1, forma, forma, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs_1.promises.readFile(ARQ.historico, 'utf8')];
                case 1:
                    raw = _a.sent();
                    linhas = raw.split(/\r?\n/).filter(function (l) { return l.trim().length > 1; }).slice(1);
                    if (linhas.length === 0) {
                        console.log('Sem histórico de vendas.');
                        return [2 /*return*/];
                    }
                    vendasDiarias_1 = {};
                    vendasMensais_1 = {};
                    totalDiario_1 = 0;
                    totalMensal_1 = 0;
                    linhas.forEach(function (l) {
                        var campos = splitCsv(l);
                        var qtd = Number(campos[6]) || 0;
                        var total = parseFloat(campos[15]) || 0;
                        var forma = campos[13] || 'Não definido';
                        var data = campos[12].slice(0, 10);
                        var mes = campos[12].slice(0, 7);
                        if (!vendasDiarias_1[forma])
                            vendasDiarias_1[forma] = { qtd: 0, total: 0 };
                        vendasDiarias_1[forma].qtd += qtd;
                        vendasDiarias_1[forma].total += total;
                        totalDiario_1 += total;
                        if (!vendasMensais_1[forma])
                            vendasMensais_1[forma] = { qtd: 0, total: 0 };
                        vendasMensais_1[forma].qtd += qtd;
                        vendasMensais_1[forma].total += total;
                        totalMensal_1 += total;
                    });
                    console.log('\n=== RELATÓRIO DIÁRIO DE PIZZAS VENDIDAS ===');
                    for (forma in vendasDiarias_1) {
                        console.log("".concat(forma, ": ").concat(vendasDiarias_1[forma].qtd, " pizzas | Total: R$ ").concat(vendasDiarias_1[forma].total.toFixed(2)));
                    }
                    console.log("TOTAL DI\u00C1RIO: R$ ".concat(totalDiario_1.toFixed(2)));
                    console.log('\n=== RELATÓRIO MENSAL DE PIZZAS VENDIDAS ===');
                    for (forma in vendasMensais_1) {
                        console.log("".concat(forma, ": ").concat(vendasMensais_1[forma].qtd, " pizzas | Total: R$ ").concat(vendasMensais_1[forma].total.toFixed(2)));
                    }
                    console.log("TOTAL MENSAL: R$ ".concat(totalMensal_1.toFixed(2)));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.log('Erro ao gerar relatório:', err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/* ------------------- UI ------------------- */
var rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
function ask(q) { return new Promise(function (resolve) { return rl.question(q, resolve); }); }
function mostrarCardapio() {
    return __awaiter(this, void 0, void 0, function () {
        var produtosPorCat, config, cats, _i, cats_1, c, arr;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, listProdutosPorCategoria()];
                case 1:
                    produtosPorCat = _a.sent();
                    return [4 /*yield*/, loadConfig()];
                case 2:
                    config = _a.sent();
                    console.log('\n=== CARDÁPIO ===');
                    cats = ['Pizza', 'Bebida', 'Sobremesa', 'Outro'];
                    for (_i = 0, cats_1 = cats; _i < cats_1.length; _i++) {
                        c = cats_1[_i];
                        arr = produtosPorCat[c] || [];
                        if (arr.length === 0)
                            continue;
                        console.log("\n--- ".concat(c.toUpperCase(), " ---"));
                        arr.forEach(function (p) {
                            var _a, _b, _c, _d, _e;
                            if (p.categoria === 'Pizza') {
                                var pp = p.precoPorTamanho || {};
                                console.log("".concat(p.id, ") ").concat(p.nome, " - P: ").concat((_a = pp.Pequena) !== null && _a !== void 0 ? _a : '-', " | M: ").concat((_b = pp['Média']) !== null && _b !== void 0 ? _b : '-', " | G: ").concat((_c = pp.Grande) !== null && _c !== void 0 ? _c : '-', " ").concat(p.ativo ? '' : '(inativo)', " ").concat(p.descricao ? '- ' + p.descricao : ''));
                            }
                            else {
                                console.log("".concat(p.id, ") ").concat(p.nome, " - R$ ").concat((_e = (_d = p.preco) === null || _d === void 0 ? void 0 : _d.toFixed(2)) !== null && _e !== void 0 ? _e : '-', " ").concat(p.ativo ? '' : '(inativo)', " ").concat(p.descricao ? '- ' + p.descricao : ''));
                            }
                        });
                    }
                    console.log('\n=== PREÇOS PADRÃO (se necessário) ===');
                    console.log("Pequena: R$ ".concat(config.precoPorTamanho.Pequena));
                    console.log("M\u00E9dia:   R$ ".concat(config.precoPorTamanho['Média']));
                    console.log("Grande:  R$ ".concat(config.precoPorTamanho.Grande));
                    console.log("Borda Recheada: R$ ".concat(config.precoBorda));
                    console.log("Bebida (unit\u00E1rio): R$ ".concat(config.precoBebida));
                    return [2 /*return*/];
            }
        });
    });
}
/* ------------------- Gerenciador de Produtos (UI) ------------------- */
function menuProdutos() {
    return __awaiter(this, void 0, void 0, function () {
        var voltar, _loop_1;
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    voltar = false;
                    _loop_1 = function () {
                        var op, _o, list, nome, categoria, preco, precoPorTamanho, pP, _p, pM, _q, pG, _r, _s, descricao, novo, id_1, _t, prod, nome, ativo, preco, precoPorTamanho, pP, _u, pM, _v, pG, _w, _x, descricao, atualizado, id, _y, ok;
                        return __generator(this, function (_z) {
                            switch (_z.label) {
                                case 0:
                                    console.log('\n=== GERENCIAR PRODUTOS ===');
                                    console.log('1 - Listar produtos');
                                    console.log('2 - Adicionar produto');
                                    console.log('3 - Editar produto');
                                    console.log('4 - Remover produto');
                                    console.log('0 - Voltar');
                                    return [4 /*yield*/, ask('> ')];
                                case 1:
                                    op = _z.sent();
                                    _o = op;
                                    switch (_o) {
                                        case '1': return [3 /*break*/, 2];
                                        case '2': return [3 /*break*/, 4];
                                        case '3': return [3 /*break*/, 15];
                                        case '4': return [3 /*break*/, 28];
                                        case '0': return [3 /*break*/, 31];
                                    }
                                    return [3 /*break*/, 32];
                                case 2: return [4 /*yield*/, loadProdutos()];
                                case 3:
                                    list = _z.sent();
                                    if (list.length === 0) {
                                        console.log('Nenhum produto cadastrado.');
                                        return [3 /*break*/, 33];
                                    }
                                    console.log('\nProdutos cadastrados:');
                                    list.forEach(function (p) {
                                        console.log(JSON.stringify(p));
                                    });
                                    return [3 /*break*/, 33];
                                case 4: return [4 /*yield*/, ask('Nome: ')];
                                case 5:
                                    nome = _z.sent();
                                    return [4 /*yield*/, ask('Categoria (Pizza/Bebida/Sobremesa/Outro): ')];
                                case 6:
                                    categoria = (_z.sent());
                                    preco = undefined;
                                    precoPorTamanho = undefined;
                                    if (!(categoria === 'Pizza')) return [3 /*break*/, 10];
                                    _p = Number;
                                    return [4 /*yield*/, ask('Preço Pequena: ')];
                                case 7:
                                    pP = _p.apply(void 0, [_z.sent()]) || 0;
                                    _q = Number;
                                    return [4 /*yield*/, ask('Preço Média: ')];
                                case 8:
                                    pM = _q.apply(void 0, [_z.sent()]) || 0;
                                    _r = Number;
                                    return [4 /*yield*/, ask('Preço Grande: ')];
                                case 9:
                                    pG = _r.apply(void 0, [_z.sent()]) || 0;
                                    precoPorTamanho = { Pequena: pP, 'Média': pM, Grande: pG };
                                    return [3 /*break*/, 12];
                                case 10:
                                    _s = Number;
                                    return [4 /*yield*/, ask('Preço: ')];
                                case 11:
                                    preco = _s.apply(void 0, [_z.sent()]) || 0;
                                    _z.label = 12;
                                case 12: return [4 /*yield*/, ask('Descrição (opcional): ')];
                                case 13:
                                    descricao = _z.sent();
                                    return [4 /*yield*/, addProduto({ nome: nome, categoria: categoria, preco: preco, precoPorTamanho: precoPorTamanho, ativo: true, descricao: descricao || undefined })];
                                case 14:
                                    novo = _z.sent();
                                    console.log('Produto criado:', novo);
                                    return [3 /*break*/, 33];
                                case 15:
                                    _t = Number;
                                    return [4 /*yield*/, ask('ID do produto para editar: ')];
                                case 16:
                                    id_1 = _t.apply(void 0, [_z.sent()]);
                                    return [4 /*yield*/, loadProdutos()];
                                case 17:
                                    prod = (_z.sent()).find(function (p) { return p.id === id_1; });
                                    if (!prod) {
                                        console.log('Produto não encontrado.');
                                        return [3 /*break*/, 33];
                                    }
                                    return [4 /*yield*/, ask("Nome (".concat(prod.nome, "): "))];
                                case 18:
                                    nome = (_z.sent()) || prod.nome;
                                    return [4 /*yield*/, ask("Ativo (s/n) [".concat(prod.ativo ? 's' : 'n', "]: "))];
                                case 19:
                                    ativo = (_z.sent()).toLowerCase() === 's';
                                    preco = prod.preco;
                                    precoPorTamanho = prod.precoPorTamanho;
                                    if (!(prod.categoria === 'Pizza')) return [3 /*break*/, 23];
                                    _u = Number;
                                    return [4 /*yield*/, ask("Pre\u00E7o Pequena (".concat((_b = (_a = prod.precoPorTamanho) === null || _a === void 0 ? void 0 : _a.Pequena) !== null && _b !== void 0 ? _b : '-', "): "))];
                                case 20:
                                    pP = _u.apply(void 0, [_z.sent()]) || ((_c = prod.precoPorTamanho) === null || _c === void 0 ? void 0 : _c.Pequena);
                                    _v = Number;
                                    return [4 /*yield*/, ask("Pre\u00E7o M\u00E9dia (".concat((_e = (_d = prod.precoPorTamanho) === null || _d === void 0 ? void 0 : _d['Média']) !== null && _e !== void 0 ? _e : '-', "): "))];
                                case 21:
                                    pM = _v.apply(void 0, [_z.sent()]) || ((_f = prod.precoPorTamanho) === null || _f === void 0 ? void 0 : _f['Média']);
                                    _w = Number;
                                    return [4 /*yield*/, ask("Pre\u00E7o Grande (".concat((_h = (_g = prod.precoPorTamanho) === null || _g === void 0 ? void 0 : _g.Grande) !== null && _h !== void 0 ? _h : '-', "): "))];
                                case 22:
                                    pG = _w.apply(void 0, [_z.sent()]) || ((_j = prod.precoPorTamanho) === null || _j === void 0 ? void 0 : _j.Grande);
                                    precoPorTamanho = { Pequena: pP, 'Média': pM, Grande: pG };
                                    return [3 /*break*/, 25];
                                case 23:
                                    _x = Number;
                                    return [4 /*yield*/, ask("Pre\u00E7o (".concat((_k = prod.preco) !== null && _k !== void 0 ? _k : '-', "): "))];
                                case 24:
                                    preco = _x.apply(void 0, [_z.sent()]) || prod.preco;
                                    _z.label = 25;
                                case 25: return [4 /*yield*/, ask("Descri\u00E7\u00E3o (".concat((_l = prod.descricao) !== null && _l !== void 0 ? _l : '', "): "))];
                                case 26:
                                    descricao = (_z.sent()) || prod.descricao;
                                    return [4 /*yield*/, editProduto(id_1, { nome: nome, ativo: ativo, preco: preco, precoPorTamanho: precoPorTamanho, descricao: descricao })];
                                case 27:
                                    atualizado = _z.sent();
                                    console.log('Atualizado:', atualizado);
                                    return [3 /*break*/, 33];
                                case 28:
                                    _y = Number;
                                    return [4 /*yield*/, ask('ID do produto para remover: ')];
                                case 29:
                                    id = _y.apply(void 0, [_z.sent()]);
                                    return [4 /*yield*/, removeProduto(id)];
                                case 30:
                                    ok = _z.sent();
                                    console.log(ok ? 'Produto removido.' : 'Produto não encontrado.');
                                    return [3 /*break*/, 33];
                                case 31:
                                    voltar = true;
                                    return [3 /*break*/, 33];
                                case 32:
                                    console.log('Opção inválida.');
                                    _z.label = 33;
                                case 33: return [2 /*return*/];
                            }
                        });
                    };
                    _m.label = 1;
                case 1:
                    if (!!voltar) return [3 /*break*/, 3];
                    return [5 /*yield**/, _loop_1()];
                case 2:
                    _m.sent();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/* ------------------- MAIN ------------------- */
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var sair, _loop_2;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, preparaAmbiente()];
                case 1:
                    _a.sent();
                    console.log('=== Pizzaria App (com gerenciamento de produtos) ===');
                    process.on('SIGINT', function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        console.log('\nEncerrando...');
                        rl.close();
                        process.exit();
                        return [2 /*return*/];
                    }); }); });
                    sair = false;
                    _loop_2 = function () {
                        var opc, _b, cliente, telefone, pizza_1, bebida_1, tamanho, qtdPizza, _c, borda, qtdBebida, _d, sobremesa_1, qtdSobremesa, _e, endereco, formaPagamento, reg, total, produtos, pp, cfg, cfg, pb, cfg, ps, cfg, e_1, ativos, _i, ativos_1, p, total, id_2, _f, ativos, pedido, total;
                        return __generator(this, function (_g) {
                            switch (_g.label) {
                                case 0:
                                    console.log('\n=== MENU ===');
                                    console.log('1 - Registrar pedido');
                                    console.log('2 - Listar pedidos ativos com total por cliente');
                                    console.log('3 - Finalizar pedido');
                                    console.log('4 - Limpar pedidos ativos e reiniciar ID');
                                    console.log('5 - Relatório de vendas (diário/mensal)');
                                    console.log('6 - Gerenciar produtos');
                                    console.log('0 - Sair');
                                    return [4 /*yield*/, ask('> ')];
                                case 1:
                                    opc = _g.sent();
                                    _b = opc;
                                    switch (_b) {
                                        case '1': return [3 /*break*/, 2];
                                        case '2': return [3 /*break*/, 34];
                                        case '3': return [3 /*break*/, 40];
                                        case '4': return [3 /*break*/, 45];
                                        case '5': return [3 /*break*/, 48];
                                        case '6': return [3 /*break*/, 50];
                                        case '0': return [3 /*break*/, 52];
                                    }
                                    return [3 /*break*/, 53];
                                case 2: return [4 /*yield*/, mostrarCardapio()];
                                case 3:
                                    _g.sent();
                                    return [4 /*yield*/, ask('Cliente: ')];
                                case 4:
                                    cliente = _g.sent();
                                    return [4 /*yield*/, ask('Telefone: ')];
                                case 5:
                                    telefone = _g.sent();
                                    return [4 /*yield*/, ask('Pizza (nome ou ID): ')];
                                case 6:
                                    pizza_1 = _g.sent();
                                    return [4 /*yield*/, ask('Bebida (nome ou ID): ')];
                                case 7:
                                    bebida_1 = _g.sent();
                                    return [4 /*yield*/, ask('Tamanho (Pequena/Média/Grande): ')];
                                case 8:
                                    tamanho = (_g.sent());
                                    _c = Number;
                                    return [4 /*yield*/, ask('Qtde pizzas: ')];
                                case 9:
                                    qtdPizza = _c.apply(void 0, [_g.sent()]) || 1;
                                    return [4 /*yield*/, ask('Borda recheada (s/n): ')];
                                case 10:
                                    borda = (_g.sent()).toLowerCase() === 's';
                                    _d = Number;
                                    return [4 /*yield*/, ask('Qtde bebidas: ')];
                                case 11:
                                    qtdBebida = _d.apply(void 0, [_g.sent()]) || 0;
                                    return [4 /*yield*/, ask('Escolha a sobremesa (nome ou ID): ')];
                                case 12:
                                    sobremesa_1 = _g.sent();
                                    _e = Number;
                                    return [4 /*yield*/, ask('Qtde sobremesas: ')];
                                case 13:
                                    qtdSobremesa = _e.apply(void 0, [_g.sent()]) || 0;
                                    return [4 /*yield*/, ask('Endereço: ')];
                                case 14:
                                    endereco = _g.sent();
                                    return [4 /*yield*/, ask('Forma de pagamento (Dinheiro/Cartão/PIX): ')];
                                case 15:
                                    formaPagamento = (_g.sent());
                                    return [4 /*yield*/, registrarEntrada({
                                            cliente: cliente,
                                            telefone: telefone,
                                            pedidoPizza: pizza_1, pedidoBebida: bebida_1,
                                            tamanhoPizza: tamanho, quantidadePizza: qtdPizza, bordaRecheada: borda,
                                            quantidadeBebidas: qtdBebida,
                                            sobremesa: sobremesa_1,
                                            quantidadeSobremesa: qtdSobremesa,
                                            enderecoEntrega: endereco,
                                            formaPagamento: formaPagamento
                                        })];
                                case 16:
                                    reg = _g.sent();
                                    total = 0;
                                    _g.label = 17;
                                case 17:
                                    _g.trys.push([17, 30, , 32]);
                                    return [4 /*yield*/, loadProdutos()];
                                case 18:
                                    produtos = _g.sent();
                                    pp = produtos.find(function (p) { return p.id === Number(pizza_1) || p.nome.toLowerCase() === pizza_1.toLowerCase(); });
                                    if (!(pp && pp.categoria === 'Pizza' && pp.precoPorTamanho)) return [3 /*break*/, 19];
                                    total += (pp.precoPorTamanho[tamanho] || 0) * qtdPizza;
                                    return [3 /*break*/, 21];
                                case 19: return [4 /*yield*/, loadConfig()];
                                case 20:
                                    cfg = _g.sent();
                                    total += (cfg.precoPorTamanho[tamanho] || 0) * qtdPizza;
                                    _g.label = 21;
                                case 21:
                                    if (!borda) return [3 /*break*/, 23];
                                    return [4 /*yield*/, loadConfig()];
                                case 22:
                                    cfg = _g.sent();
                                    total += cfg.precoBorda * qtdPizza;
                                    _g.label = 23;
                                case 23:
                                    pb = produtos.find(function (p) { return p.id === Number(bebida_1) || p.nome.toLowerCase() === bebida_1.toLowerCase(); });
                                    if (!(pb && pb.preco)) return [3 /*break*/, 24];
                                    total += pb.preco * qtdBebida;
                                    return [3 /*break*/, 26];
                                case 24: return [4 /*yield*/, loadConfig()];
                                case 25:
                                    cfg = _g.sent();
                                    total += cfg.precoBebida * qtdBebida;
                                    _g.label = 26;
                                case 26:
                                    ps = produtos.find(function (p) { return p.id === Number(sobremesa_1) || p.nome.toLowerCase() === sobremesa_1.toLowerCase(); });
                                    if (!(ps && ps.preco)) return [3 /*break*/, 27];
                                    total += ps.preco * qtdSobremesa;
                                    return [3 /*break*/, 29];
                                case 27: return [4 /*yield*/, loadConfig()];
                                case 28:
                                    cfg = _g.sent();
                                    total += (cfg.precoSobremesa[sobremesa_1] || 0) * qtdSobremesa;
                                    _g.label = 29;
                                case 29: return [3 /*break*/, 32];
                                case 30:
                                    e_1 = _g.sent();
                                    return [4 /*yield*/, calcularPrecoTotal({ tamanhoPizza: tamanho, quantidadePizza: qtdPizza, bordaRecheada: borda, quantidadeBebidas: qtdBebida, sobremesa: sobremesa_1, quantidadeSobremesa: qtdSobremesa })];
                                case 31:
                                    total = _g.sent();
                                    return [3 /*break*/, 32];
                                case 32: return [4 /*yield*/, emitirComprovante(reg, total)];
                                case 33:
                                    _g.sent();
                                    console.log("Pedido registrado. Total: R$ ".concat(total.toFixed(2)));
                                    return [3 /*break*/, 54];
                                case 34: return [4 /*yield*/, lerAtivos()];
                                case 35:
                                    ativos = _g.sent();
                                    if (ativos.length === 0) {
                                        console.log('Sem pedidos ativos.');
                                        return [3 /*break*/, 54];
                                    }
                                    console.log('\n=== Pedidos ativos ===');
                                    _i = 0, ativos_1 = ativos;
                                    _g.label = 36;
                                case 36:
                                    if (!(_i < ativos_1.length)) return [3 /*break*/, 39];
                                    p = ativos_1[_i];
                                    return [4 /*yield*/, calcularPrecoTotal({
                                            tamanhoPizza: p.tamanhoPizza,
                                            quantidadePizza: p.quantidadePizza,
                                            bordaRecheada: p.bordaRecheada,
                                            quantidadeBebidas: p.quantidadeBebidas,
                                            sobremesa: p.sobremesa,
                                            quantidadeSobremesa: p.quantidadeSobremesa
                                        })];
                                case 37:
                                    total = _g.sent();
                                    console.log("ID:".concat(p.idPedido, " - Cliente:").concat(p.cliente, " - Total R$ ").concat(total.toFixed(2), " - Forma:").concat(p.formaPagamento));
                                    _g.label = 38;
                                case 38:
                                    _i++;
                                    return [3 /*break*/, 36];
                                case 39: return [3 /*break*/, 54];
                                case 40:
                                    _f = Number;
                                    return [4 /*yield*/, ask('ID do pedido para finalizar: ')];
                                case 41:
                                    id_2 = _f.apply(void 0, [_g.sent()]);
                                    return [4 /*yield*/, lerAtivos()];
                                case 42:
                                    ativos = _g.sent();
                                    pedido = ativos.find(function (p) { return p.idPedido === id_2; });
                                    if (!pedido) {
                                        console.log('Pedido não encontrado.');
                                        return [3 /*break*/, 54];
                                    }
                                    return [4 /*yield*/, calcularPrecoTotal({
                                            tamanhoPizza: pedido.tamanhoPizza,
                                            quantidadePizza: pedido.quantidadePizza,
                                            bordaRecheada: pedido.bordaRecheada,
                                            quantidadeBebidas: pedido.quantidadeBebidas,
                                            sobremesa: pedido.sobremesa,
                                            quantidadeSobremesa: pedido.quantidadeSobremesa
                                        })];
                                case 43:
                                    total = _g.sent();
                                    return [4 /*yield*/, finalizarPedido(pedido, total)];
                                case 44:
                                    _g.sent();
                                    console.log("Pedido finalizado. Total: R$ ".concat(total.toFixed(2)));
                                    return [3 /*break*/, 54];
                                case 45: return [4 /*yield*/, fs_1.promises.writeFile(ARQ.ativos, CAB.ativos, 'utf8')];
                                case 46:
                                    _g.sent();
                                    return [4 /*yield*/, fs_1.promises.writeFile(ARQ.lastId, JSON.stringify({ ultimoId: 0 }, null, 2), 'utf8')];
                                case 47:
                                    _g.sent();
                                    console.log('Pedidos ativos limpos e ID reiniciado.');
                                    return [3 /*break*/, 54];
                                case 48: return [4 /*yield*/, relatorioVendas()];
                                case 49:
                                    _g.sent();
                                    return [3 /*break*/, 54];
                                case 50: return [4 /*yield*/, menuProdutos()];
                                case 51:
                                    _g.sent();
                                    return [3 /*break*/, 54];
                                case 52:
                                    sair = true;
                                    return [3 /*break*/, 54];
                                case 53:
                                    console.log('Opção inválida.');
                                    _g.label = 54;
                                case 54: return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!!sair) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_2()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 4:
                    rl.close();
                    console.log('Aplicativo encerrado.');
                    return [2 /*return*/];
            }
        });
    });
}
main();
