import Boom from '@hapi/boom';
import { db } from '../database.js';

export const getAllTransactionsRoute = {
    method: 'GET',
    path: '/api/transactions',
    handler: async (request, h) => {
        const { results } =  await db.query(`SELECT t.id
                                             ,      t.assetid
                                             ,      CONCAT(c.symbol, ' (', w.name, IF(ISNULL(ch.name), '', CONCAT(', ', ch.name)), ')') as assetinfo
                                             ,      t.deposit
                                             ,      t.available
                                             ,      t.staked
                                             ,      t.description
                                             ,      t.updatedAt
                                             FROM   transactions t
                                             INNER JOIN assets a
                                             ON     t.assetid = a.id
                                             INNER JOIN coins c
                                             ON a.coinid = c.id
                                             INNER JOIN wallets w
                                             ON a.walletid = w.id
                                             LEFT JOIN chains ch
                                             ON w.chainid = ch.id
                                             ORDER BY c.name`);
        return results;
    }
}

export const getAssetTransactionsRoute = {
    method: 'GET',
    path: '/api/transactions/asset/{id}',
    handler: async (request, h) => {
        if (isNaN(request.params.id)) {
            throw Boom.badRequest(`Invalid asset id '${request.params.id}'.`);
        }
        const id = parseInt(request.params.id);
                const { results } =  await db.query(`
                        SELECT
                            t.id,
                            t.assetid,
                            CONCAT(c.symbol, ' (', w.name, IF(ISNULL(ch.name), '', CONCAT(', ', ch.name)), ')') as assetinfo,
                            t.deposit,
                            t.available,
                            t.staked,
                            t.description,
                            t.updatedAt,
                            -- Calculated fields:
                            (t.deposit / NULLIF((t.available + t.staked), 0)) AS averagePrice,
                            (t.deposit / NULLIF((SELECT SUM(deposit) FROM transactions WHERE assetid = t.assetid), 0)) * 100 AS percPrice,
                            co.price AS currentPrice,
                            co.price * (t.available + t.staked) AS currentValue,
                            (co.price * (t.available + t.staked)) - t.deposit AS gains,
                            CASE WHEN t.deposit = 0 THEN 1 ELSE ((co.price * (t.available + t.staked)) - t.deposit) / t.deposit * 100 END AS percGains
                        FROM
                            transactions t
                            INNER JOIN assets a ON t.assetid = a.id
                            INNER JOIN coins c ON a.coinid = c.id
                            INNER JOIN wallets w ON a.walletid = w.id
                            LEFT JOIN chains ch ON w.chainid = ch.id
                            LEFT JOIN coins co ON a.coinid = co.id
                        WHERE
                            t.assetid = ?
                        ORDER BY t.id DESC
                `, [id]);
                return results;
    }
}

export const getTransactionRoute = {
    method: 'GET',
    path: '/api/transactions/{id}',
    handler: async (request, h) => {
        if (isNaN(request.params.id)) {
            throw Boom.badRequest(`Invalid transaction id '${request.params.id}'.`);
        }
        const id = parseInt(request.params.id);
        const { results } =  await db.query(`SELECT t.id
                                             ,      t.assetid
                                             ,      CONCAT(c.symbol, ' (', w.name, IF(ISNULL(ch.name), '', CONCAT(', ', ch.name)), ')') as assetinfo
                                             ,      t.deposit
                                             ,      t.available
                                             ,      t.staked
                                             ,      t.description
                                             ,      t.updatedAt
                                             FROM   transactions t
                                             INNER JOIN assets a
                                             ON     t.assetid = a.id
                                             INNER JOIN coins c
                                             ON a.coinid = c.id
                                             INNER JOIN wallets w
                                             ON a.walletid = w.id
                                             LEFT JOIN chains ch
                                             ON w.chainid = ch.id
                                             where t.id = ?`, [id]);
        if (!results || results.length === 0) {
            throw Boom.notFound(`Transaction does not exists with id '${id}'.`);
        }
        return results[0];
    }
}

export const createNewTransactionRoute = {
    method: 'POST',
    path: '/api/transactions',
    handler: async (request, h) => {
        const { assetid, deposit, available, staked, description } = request.payload;
        console.log(request.payload)

        if (assetid === undefined || assetid === null ||
            deposit === undefined || deposit === null || available === undefined || available === null ||
            staked === undefined || staked === null) {
            throw Boom.badRequest('Assetid, deposit, available, staked are required');
        }

        if (typeof deposit !== 'number' || typeof available !== 'number' || typeof staked !== 'number' ) {
            throw Boom.badRequest('Deposit, available, staked must be numbers');
        }

        // Additional validation could be added here

        const { results, error } =  await db.query('INSERT INTO transactions (assetid, deposit, available, staked, description) VALUES (?, ?, ?, ?, ?)',
            [assetid, deposit, available, staked, description]);

        if (error) {
            throw Boom.conflict(`Failed to create new transaction: ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            throw Boom.conflict('Failed to create new transaction.');
        }

        const id = results.insertId;
        console.log(`Created new transaction with id '${id}'.`);
        const { results: resultsNew } = await db.query(`SELECT t.id
                                                        ,      t.assetid
                                                        ,      CONCAT(c.symbol, ' (', w.name, IF(ISNULL(ch.name), '', CONCAT(', ', ch.name)), ')') as assetinfo
                                                        ,      t.deposit
                                                        ,      t.available
                                                        ,      t.staked
                                                        ,      t.description
                                                        ,      t.updatedAt
                                                        FROM   transactions t
                                                        INNER JOIN assets a
                                                        ON     t.assetid = a.id
                                                        INNER JOIN coins c
                                                        ON a.coinid = c.id
                                                        INNER JOIN wallets w
                                                        ON a.walletid = w.id
                                                        LEFT JOIN chains ch
                                                        ON w.chainid = ch.id
                                                        where t.id = ?`, [id]);
        if (!resultsNew || resultsNew.length === 0) {
            throw Boom.internal(`Failed to retrieve newly created transaction with id '${id}'.`);
        }
        return h.response(resultsNew[0]).code(201);
    }
}

export const updateTransactionRoute = {
    method: 'POST',
    path: '/api/transactions/{id}',
    handler: async (request, h) => {
        const id = parseInt(request.params.id);
        const { assetid, deposit, available, staked, description } = request.payload;

        if (isNaN(id)) {
            throw Boom.badRequest(`Invalid transaction id '${request.params.id}'.`);
        }

        if (assetid === undefined || assetid === null || deposit === undefined || deposit === null ||
            available === undefined || available === null || staked === undefined || staked === null) {
            throw Boom.badRequest('Assetid, deposit, available, staked are required');
        }

        if (typeof deposit !== 'number' || typeof available !== 'number' || typeof staked !== 'number') {
            throw Boom.badRequest('Deposit, available, staked must be numbers');
        }

        // Check if asset exists
        const { results: existing } = await db.query('SELECT id FROM transactions WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
            throw Boom.notFound(`Transaction with id '${id}' does not exist.`);
        }

        console.log('update :', request.payload);
        console.log('id :', id);

        const { results, error } =  await db.query(`
                UPDATE transactions
                SET    assetid = ?
                ,      deposit = ?
                ,      available = ?
                ,      staked = ?
                ,      description = ?
                WHERE  id = ?`,
            [assetid, deposit, available, staked, description, id]);
        if (error) {
            throw Boom.conflict(`Failed to update : ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            throw Boom.conflict('Failed to update transaction.');
        }

        const { results: resultsNew } = await db.query(`SELECT t.id
                                                        ,      t.assetid
                                                        ,      CONCAT(c.symbol, ' (', w.name, IF(ISNULL(ch.name), '', CONCAT(', ', ch.name)), ')') as assetinfo
                                                        ,      t.deposit
                                                        ,      t.available
                                                        ,      t.staked
                                                        ,      t.description
                                                        ,      t.updatedAt
                                                        FROM   transactions t
                                                        INNER JOIN assets a
                                                        ON     t.assetid = a.id
                                                        INNER JOIN coins c
                                                        ON a.coinid = c.id
                                                        INNER JOIN wallets w
                                                        ON a.walletid = w.id
                                                        LEFT JOIN chains ch
                                                        ON w.chainid = ch.id
                                                        where t.id = ?`, [id]);
        if (!resultsNew || resultsNew.length === 0) {
            throw Boom.internal(`Failed to retrieve updated transactions with id '${id}'.`);
        }
        return resultsNew[0];
    }
}

export const deleteTransactionRoute = {
    method: 'DELETE',
    path: '/api/transactions/{id}',
    handler: async (request, h) => {
        console.log('Received request to delete transaction with id:', request.params.id);
        const id = parseInt(request.params.id);
        const { results, error } =  await db.query(`DELETE FROM transactions WHERE  id = ?`, [id]);

        if (error) {
            console.log('Error deleting transaction:', error);
            throw Boom.conflict(`Failed to delete transaction with id '${id}' : ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            console.log('No transaction deleted, possibly invalid id:', id);
            throw Boom.conflict(`Failed to delete transaction with id '${id}'`);
        }

        return {
            message: `Transaction with ID ${id} deleted successfully`,
            affectedRows: results.affectedRows
        };
    }
}

