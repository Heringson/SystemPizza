    ..:: Nomes dos integrante da P1 ::..    
    Gabriel Caire Nomura 2501980   
    Heitor Matos da Silva 2520912   
    Heringson Lima 2404307   
    Rafael Ienne Manoel 2519853   
    Wesley da Silva Santos 2522594    

____________________________________________________________________________



<img width="1265" height="741" alt="Diagrama sem nome drawio" src="https://github.com/user-attachments/assets/fd6cb626-4552-466b-ae7c-845b20d356a3" />


____________________________________________________________________________


    📂⬇️
    pizzaria_app/
    │
    ├── ts/                     # Código fonte TypeScript
    │   └── pizzaria_app.ts     # Arquivo principal da aplicação
    │
    ├── js/                     # Código compilado JavaScript (após tsc)
    │   └── pizzaria_app.js
    │
    ├── csv/                    # Armazenamento de dados em CSV
    │   ├── entradas.csv        # Registro de todas as entradas/pedidos
    │   ├── ativos.csv          # Pedidos em aberto
    │   ├── historico.csv       # Pedidos finalizados (histórico)
    │   └── comprovante_ID_DATA.txt # Comprovantes gerados
    │
    ├── json/                   # Armazenamento de dados em JSON
    │   ├── config.json         # Configurações de preços
    │   ├── last_id.json        # Último ID de pedido usado
    │   ├── sabores.json        # Lista de sabores de pizza
    │   └── sobremesas.json     # Lista de sobremesas e seus preços
    │
    ├── package.json            # Gerenciador de dependências Node.js
    ├── package-lock.json       # Lock das versões instaladas
    └── tsconfig.json           # Configuração do TypeScript
    📂
    
    JSON para configuração, sabores, sobremesas e controle de IDs.
    CSV para entradas, ativos e histórico de vendas.
    TS/JS para rodar e carregar os dados.
____________________________________________________________________________
..:: Extensões no VS Code ::..⬇️
    
    CSV Viewer → abrir e editar seus .csv de forma organizada.
    JSON Tools → validar e formatar JSON.
____________________________________________________________________________
 dependencias.txt⬇️
 
    //*TypeScript
    npm install typescript --save-dev
    
    //ts-node
    npm install ts-node --save-dev
    
    //*@types/node
    npm install @types/node --save-dev
    
    //*CSV parser (para ler e salvar nos seus arquivos .csv):
    npm install csv-parser
    npm install fast-csv
    
    //*readline-sync (caso queira entrada de dados pelo terminal, tipo escolher sabor e forma de pagamento):
    npm install readline-sync
____________________________________________________________________________
Arquivos-chave e função⬇️

    | Arquivo/Pasta           | Função                                                              |
    | ----------------------- | ------------------------------------------------------------------- |
    | `ts/pizzaria_app.ts`    | Código principal da aplicação, menu e lógica de pedidos             |
    | `js/pizzaria_app.js`    | Código compilado para execução com Node.js                          |
    | `csv/entradas.csv`      | Guarda todos os pedidos registrados, incluindo ativos e finalizados |
    | `csv/ativos.csv`        | Pedidos ainda não finalizados                                       |
    | `csv/historico.csv`     | Pedidos finalizados com horaSaida e preçoTotal                      |
    | `csv/comprovante_*.txt` | Comprovante de cada pedido gerado automaticamente                   |
    | `json/config.json`      | Configuração de preços de pizzas, bebidas e sobremesas              |
    | `json/last_id.json`     | Armazena o último ID usado para gerar novos pedidos                 |
    | `json/sabores.json`     | Lista de sabores disponíveis                                        |
    | `json/sobremesas.json`  | Lista de sobremesas e seus preços                                   |
  ____________________________________________________________________________
  Aqui está o Manual de Ultilização em formato DOCX (world)
  [Manual de ultilização Pizzaria .docx](https://github.com/user-attachments/files/22454816/Manual.de.ultilizacao.Pizzaria.docx)


