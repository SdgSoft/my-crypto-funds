import Boom from '@hapi/boom';
import { db } from '../database.js';

export const getAllAssetsRoute = {
    method: 'GET',
    path: '/api/assets',
    handler: async (request, h) => {
        const { results } =  await db.query(`SELECT a.id
                                             ,      a.coinid
                                             ,      c.name as coinname
                                             ,      a.walletid
                                             ,      w.name as walletname
                                             ,      ch.name as chainname
                                             ,      a.deposit
                                             ,      a.available
                                             ,      a.staked
                                             ,      a.updatedAt
                                             FROM   assets a
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

export const getAssetRoute = {
    method: 'GET',
    path: '/api/assets/{id}',
    handler: async (request, h) => {
        if (isNaN(request.params.id)) {
            throw Boom.badRequest(`Invalid asset id '${request.params.id}'.`);
        }
        const id = parseInt(request.params.id);
        const { results } =  await db.query(`SELECT a.id, a.coinid, a.walletid, a.deposit, a.available, a.staked, a.updatedAt
                                             FROM assets a
                                             where a.id = ?`, [id]);
        if (!results || results.length === 0) {
            throw Boom.notFound(`Asset does not exists with id '${id}'.`);
        }
        return results[0];
    }
}

export const createNewAssetRoute = {
    method: 'POST',
    path: '/api/assets',
    handler: async (request, h) => {
        const { coinid, walletid, deposit, available, staked } = request.payload;
        console.log(request.payload)

        if (coinid === undefined || coinid === null || walletid === undefined || walletid === null ||
            deposit === undefined || deposit === null || available === undefined || available === null ||
            staked === undefined || staked === null) {
            throw Boom.badRequest('Coinid, walletid, deposit, available, staked are required');
        }

        if (typeof deposit !== 'number' || deposit < 0 ||
            typeof available !== 'number' || available < 0 ||
            typeof staked !== 'number' || staked < 0) {
            throw Boom.badRequest('Deposit, available, staked must be numbers >= 0');
        }

        // Check if name or symbol is unique
        const { results: existing } = await db.query('SELECT id FROM assets WHERE coinid = ? and walletid = ?', [coinid, walletid]);
        if (existing && existing.length > 0) {
            throw Boom.conflict('Asset with coin and wallet already exists');
        }

        // Additional validation could be added here

        const { results, error } =  await db.query('INSERT INTO assets (coinid, walletid, deposit, available, staked) VALUES (?, ?, ?, ?, ?)',
            [coinid, walletid, deposit, available, staked]);

        if (error) {
            throw Boom.conflict(`Failed to create new asset: ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            throw Boom.conflict('Failed to create new asset.');
        }

        const id = results.insertId;
        console.log(`Created new asset with id '${id}'.`);
        const { results: resultsNew } = await db.query(`SELECT a.id, a.coinid, a.walletid, a.deposit, a.available, a.staked, a.updatedAt
                                                        FROM assets a
                                                        where a.id = ?`, [id]);
        if (!resultsNew || resultsNew.length === 0) {
            throw Boom.internal(`Failed to retrieve newly created asset with id '${id}'.`);
        }
        return h.response(resultsNew[0]).code(201);
    }
}

export const updateAssetRoute = {
    method: 'POST',
    path: '/api/assets/{id}',
    handler: async (request, h) => {
        const id = parseInt(request.params.id);
        const { coinid, walletid, deposit, available, staked } = request.payload;

        if (isNaN(id)) {
            throw Boom.badRequest(`Invalid asset id '${request.params.id}'.`);
        }

        if (coinid === undefined || coinid === null || walletid === undefined || walletid === null ||
            deposit === undefined || deposit === null || available === undefined || available === null ||
            staked === undefined || staked === null) {
            throw Boom.badRequest('Coinid, walletid, deposit, available, staked are required');
        }

        if (typeof deposit !== 'number' || deposit < 0 ||
            typeof available !== 'number' || available < 0 ||
            typeof staked !== 'number' || staked < 0) {
            throw Boom.badRequest('Deposit, available, staked must be numbers >= 0');
        }

        // Check if asset exists
        const { results: existing } = await db.query('SELECT id FROM assets WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
            throw Boom.notFound(`Asset with id '${id}' does not exist.`);
        }

        console.log('update :', request.payload);
        console.log('id :', id);

        const { results, error } =  await db.query(`
                UPDATE assets
                SET    coinid = ?
                ,      walletid = ?
                ,      deposit = ?
                ,      available = ?
                ,      staked = ?
                WHERE  id = ?`,
            [coinid, walletid, deposit, available, staked, id]);

        if (error) {
            throw Boom.conflict(`Failed to update : ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            throw Boom.conflict('Failed to update asset.');
        }

        const { results: resultsNew } = await db.query(`SELECT a.id, a.coinid, a.walletid, a.deposit, a.available, a.staked, a.updatedAt
                                                        FROM assets a
                                                        where a.id = ?`, [id]);
        if (!resultsNew || resultsNew.length === 0) {
            throw Boom.internal(`Failed to retrieve updated assets with id '${id}'.`);
        }
        return resultsNew[0];
    }
}

export const deleteAssetRoute = {
    method: 'DELETE',
    path: '/api/assets/{id}',
    handler: async (request, h) => {
        console.log('Received request to delete asset with id:', request.params.id);
        const id = parseInt(request.params.id);
        const { results, error } =  await db.query(`DELETE FROM assets WHERE  id = ?`, [id]);

        if (error) {
            console.log('Error deleting asset:', error);
            throw Boom.conflict(`Failed to delete asset with id '${id}' : ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            console.log('No asset deleted, possibly invalid id:', id);
            throw Boom.conflict(`Failed to delete asset with id '${id}'`);
        }

        return {
            message: `Asset with ID ${id} deleted successfully`,
            affectedRows: results.affectedRows
        };
    }
}

