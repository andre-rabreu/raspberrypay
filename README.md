# RaspberryPay - Máquina de Cartão Simplificada com RFID

1. [Conceito e descrição do projeto](#conceito-e-descrição-do-projeto)  
2. [Levantamento de requisitos do projeto](#levantamento-de-requisitos-do-projeto)  
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Demonstração](#demonstração)
5. [Autores](#autores)  

---  
<img src="https://i.imgur.com/Et2ayvO.jpeg" alt="Foto do projeto" width="512">

## Conceito e descrição do projeto
O **RaspberryPay** é um sistema embarcado que simula o funcionamento de uma máquina de cartão de crédito/débito simplificada. O projeto foi desenvolvido para a disciplina de Microcontroladores e Sistemas Embarcados do curso de Engenharia da Computaçnao do Instituto Mauá de Tecnologia, utilizando um Raspberry Pi 3 Model B+ como cérebro central.  
O sistema permite o cadastro de usuários associados a um cartão RFID físico. Em vez de usar o UID (Identificador Único) fixo do cartão, o sistema gera e grava um número de cartão virtual de 16 dígitos no cartão, aumentando a segurança e a flexibilidade.  
O Raspberry Pi gerencia um banco de dados local (MariaDB) que armazena as informações dos usuários, seus saldos e um histórico completo de transações. A interação do usuário e a lógica de backend são totalmente gerenciadas pelo Node-RED, que fornece um dashboard operacional local.  
Adicionalmente, o projeto expõe uma API RESTful (criada com Node.js e Express) que permite a uma interface de auditoria externa (um aplicativo React) consultar o banco de dados, visualizar usuários e filtrar históricos de transações por data, a partir de qualquer computador na mesma rede via HTTP.

## Levantamento de requisitos do projeto
A tabela abaixo detalha os requisitos funcionais e não funcionais que guiaram o desenvolvimento do sistema.

| Categoria | ID | Requisito | Descrição |
|---|---|---|---|
| Funcional | RF-001 | Cadastro de Usuário | O sistema deve permitir o cadastro de um novo usuário (nome) associado a um cartão RFID. |
| Funcional | RF-002 | Geração de Cartão Virtual | No cadastro o sistema deve gerar um número de cartão virtual aleatório de 16 dígitos e gravá-lo no cartão RFID. |
| Funcional | RF-003 | Leitura de Cartão | O sistema deve ser capaz de ler o número do cartão virtual armazenado no cartão RFID para identificar o usuário. |
| Funcional | RF-004 | Registro de Transação | O sistema deve permitir o registro de transações (débito/crédito) associadas a um usuário. |
| Funcional | RF-005 | Restrição de Saldo | O banco de dados deve impedir (via CHECK constraint) que o saldo de um usuário se torne negativo. |
| Funcional | RF-006 | Histórico de Transações | O sistema deve armazenar todas as transações (valor, data/hora) em uma tabela separada. |
| Funcional | RF-007 | Consulta de Saldo | O dashboard deve ser capaz de exibir o saldo atual do usuário. |
| Funcional | RF-008 | Exposição de API | O sistema deve prover uma API (HTTP GET) para consulta externa de dados. |
| Funcional | RF-009 | Filtro de Transações | A API deve permitir filtrar o histórico de transações por usuário e por intervalo de datas (data inicial/final). |
| Não Funcional | RNF-001 | Interface de Operação | Um dashboard local (Node-RED) deve servir como a interface principal para operadores (ex: cadastro, transações). |
| Não Funcional | RNF-002 | Interface de Auditoria | Uma interface web externa (React) deve permitir a visualização e filtragem do histórico. |
| Não Funcional | RNF-003 | Feedback ao Usuário | O dashboard deve fornecer feedback claro e bloqueante (pop-ups) durante operações como "Aproxime o cartão". |
| Não Funcional | RNF-004 | Interação com Hardware | A lógica de software (Node-RED) deve ser capaz de executar scripts Python para interagir com o leitor RFID. |

## Tecnologias Utilizadas
O projeto combina uma variedade de tecnologias de hardware e software para criar um sistema completo e robusto.

### Hardware
- **Raspberry Pi 3 Model B+:** O microcontrolador central que hospeda o servidor web, o banco de dados e a lógica de aplicação.
- **Leitor RFID RC522:** O sensor responsável pela comunicação por aproximação (NFC) com os cartões.
- **Cartões RFID (MIFARE Classic):** Mídia de armazenamento para o número do cartão virtual do usuário.

### Software (Core do Raspberry Pi)
- **Raspberry Pi OS (baseado em Debian):** Sistema operacional do Raspberry Pi.
- **Node.js:** Ambiente de execução JavaScript no lado do servidor, fundamental para o Node-RED e a API Express.
- **MariaDB:** O sistema de gerenciamento de banco de dados SQL (um fork do MySQL) usado para armazenar todos os dados.
- **Python 3:** Linguagem usada para os scripts de baixo nível que interagem diretamente com os pinos GPIO e o leitor RC522.
     - **Bibliotecas Python:** [mfrc522-python](https://pypi.org/project/mfrc522-python/), json, argparse.
- **Chromium:** O navegador web usado para exibir o dashboard.

### Software (Lógica e Aplicação)
- **Node-RED:** A ferramenta de programação visual (baseada em fluxos) que serve como o backend principal e o frontend (dashboard) da estação operacional.
- **Nós de Paleta (Node-RED):** node-red-dashboard, [node-red-node-mysql](https://www.npmjs.com/package/node-red-node-mysql), exec, function, ui_template (para o teclado virtual jkeyboard), ui_control (para pop-ups bloqueantes), [node-red-contrib-ui-spinner](https://flows.nodered.org/node/node-red-contrib-ui-spinner).

### Software (Interface de Auditoria Externa)
- **API (Backend):**
    - **Express.js:** Framework web para Node.js, usado para construir a API RESTful.
    - **Bibliotecas Node.js:** [mysql2](https://www.npmjs.com/package/mysql2) (cliente MariaDB/MySQL), cors (para permitir acesso da UI).
- **UI (Frontend):**
    - **React.js:** Biblioteca JavaScript para construir a interface de usuário.
    - [**PrimeReact:**](https://primereact.org/) Biblioteca de componentes de UI (usada para DataTable, Calendar, Button, etc.).

## Demonstração
Clique na imagem para acessar o vídeo.

### 1ª parte
<a href="https://youtube.com/shorts/hrR5Rx246qI" target="_blank" rel="noopener noreferrer" title="Link do YouTube">
<img src="https://i.imgur.com/4kavrtd.png" alt="Capa do vídeo" width="256">
</a>

### 2ª parte
<a href="https://youtu.be/Nk5gbdaDi9Q" target="_blank" rel="noopener noreferrer" title="Link do YouTube">
<img src="https://i.imgur.com/OXLRptS.png" alt="Capa do vídeo" width="512">
</a>

## Autores
André Renato Almeida Abreu  
[Github](https://github.com/andre-rabreu) | 
[LinkedIn](https://github.com/andre-rabreu)

<img src="https://i.imgur.com/s7CEaK1.jpeg" width="256">