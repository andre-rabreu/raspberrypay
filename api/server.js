// server.js - API para interface visual (somente GETs)

// 1. Importação dos Módulos
const express = require('express');
const mysql = require('mysql2/promise'); // Usando a versão com Promises
const cors = require('cors'); // Adicionado para permitir requisições de diferentes origens (para UI)

// 2. Configuração do Express
const app = express();
const PORT = 3000;
// app.use(express.json()); // Não é estritamente necessário para GETs, mas não faz mal manter.
app.use(cors()); // Permite que sua interface web (rodando em outro domínio/porta) acesse esta API

// 3. Configuração da Conexão com o Banco de Dados
// **ATENÇÃO:** Substitua pelas suas credenciais do MariaDB!
const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'nodered-user',
    password: '6474',
    database: 'raspberrypay_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================================
// 4. Definição dos Endpoints da API (Somente GETs)
// ==========================================================

// --- ROTAS DE USUÁRIOS (Users) ---

/**
 * @route   GET /api/users
 * @desc    Retorna todos os usuários (sem filtro)
 * @query   ?card_number=XXXX para filtrar por número de cartão específico
 * ou apenas /api/users para retornar todos.
 */
app.get('/api/users', async (req, res) => {
    try {
        const { card_number } = req.query; // Pega o card_number da query string (?card_number=...)

        let sql = 'SELECT card_number, user_name, balance FROM Users';
        let params = [];

        if (card_number) {
            sql += ' WHERE card_number = ?';
            params.push(card_number);
        }

        const [rows] = await dbPool.execute(sql, params);

        if (rows.length === 0 && card_number) {
            return res.status(404).json({ error: 'Usuário não encontrado para o card_number fornecido.' });
        }

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar usuários.' });
    }
});

// --- ROTAS DE TRANSAÇÕES (Transactions) ---

/**
 * @route   GET /api/transactions/:cardNumber
 * @desc    Busca o histórico de transações de um usuário específico.
 * Obrigatório especificar o número do cartão.
 * Pode ser filtrado por data inicial e/ou final via query parameters.
 * @query   ?startDate=YYYY-MM-DD
 * @query   ?endDate=YYYY-MM-DD
 */
app.get('/api/transactions/:cardNumber', async (req, res) => {
    try {
        const { cardNumber } = req.params;
        const { startDate, endDate } = req.query; // Pega startDate e endDate da query string

        if (!cardNumber) {
            return res.status(400).json({ error: 'Número do cartão é obrigatório para consultar transações.' });
        }

        let sql = 'SELECT transaction_id, amount, timestamp, card_number_fk FROM Transactions WHERE card_number_fk = ?';
        let params = [cardNumber];

        // Adiciona filtro por data inicial, se fornecida
        if (startDate) {
            sql += ' AND timestamp >= ?';
            params.push(startDate + ' 00:00:00'); // Garante o início do dia
        }

        // Adiciona filtro por data final, se fornecida
        if (endDate) {
            sql += ' AND timestamp <= ?';
            params.push(endDate + ' 23:59:59'); // Garante o fim do dia
        }

        sql += ' ORDER BY timestamp DESC'; // Ordena as transações, as mais recentes primeiro

        const [rows] = await dbPool.execute(sql, params);

        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar transações com filtro de data:', error);
        res.status(500).json({ error: 'Erro interno do servidor ao buscar transações.' });
    }
});

// 5. Inicialização do Servidor
app.listen(PORT, () => {
    console.log(`Servidor da API RaspberryPay (GETs only) rodando na porta ${PORT}`);
});
