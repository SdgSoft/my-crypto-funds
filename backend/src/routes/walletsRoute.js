import Boom from '@hapi/boom';
import { db } from '../database.js';

export const getAllWalletsRoute = {
    method: 'GET',
    path: '/api/wallets',
    handler: async (request, h) => {
        const { results } =  await db.query(`SELECT w.id, w.name, w.adress, w.chainid, c.name as chainname
                                             FROM wallets w
                                             LEFT JOIN chains c
                                             ON w.chainid = c.id
                                             ORDER BY w.name`);
        return results;
    }
}

export const getWalletRoute = {
    method: 'GET',
    path: '/api/wallets/{id}',
    handler: async (request, h) => {
        if (isNaN(request.params.id)) {
            throw Boom.badRequest(`Invalid wallet id '${request.params.id}'.`);
        }
        const id = parseInt(request.params.id);
        const { results } =  await db.query(`SELECT w.id, w.name, w.adress, w.chainid
                                             FROM wallets w
                                             where w.id = ?`, [id]);
        if (!results || results.length === 0) {
            throw Boom.notFound(`Wallet does not exists with id '${id}'.`);
        }
        return results[0];
    }
}

export const createNewWalletRoute = {
    method: 'POST',
    path: '/api/wallets',
    handler: async (request, h) => {

        let { name, adress, chainid } = request.payload;

        // Convert empty string or undefined chainid to null
        if (chainid === '' || chainid === undefined) {
            chainid = null;
        }

        if (!name) {
            throw Boom.badRequest('Name is required');
        }

        // Check if name or symbol is unique
        const { results: existing } = await db.query('SELECT id FROM wallets WHERE name = ?', [name]);
        if (existing && existing.length > 0) {
            throw Boom.conflict('Wallet with this name already exists');
        }

        // Additional validation could be added here

        const { results, error } =  await db.query('INSERT INTO wallets (name, adress, chainid) VALUES (?, ?, ?)',
            [name, adress, chainid]);

        if (error) {
            throw Boom.conflict(`Failed to create new wallet: ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            throw Boom.conflict('Failed to create new wallet.');
        }

        const id = results.insertId;
        console.log(`Created new wallet with id '${id}'.`);
        const { results: resultsNew } = await db.query('SELECT id, name, adress, chainid FROM wallets WHERE id = ?', [id]);
        if (!resultsNew || resultsNew.length === 0) {
            throw Boom.internal(`Failed to retrieve newly created wallet with id '${id}'.`);
        }
        return h.response(resultsNew[0]).code(201);
    }
}

export const updateWalletRoute = {
    method: 'POST',
    path: '/api/wallets/{id}',
    handler: async (request, h) => {
        const id = parseInt(request.params.id);

        let { name, adress, chainid } = request.payload;

        // Convert empty string or undefined chainid to null
        if (chainid === '' || chainid === undefined) {
            chainid = null;
        }

        if (isNaN(id)) {
            throw Boom.badRequest(`Invalid wallet id '${request.params.id}'.`);
        }

        if (!name) {
            throw Boom.badRequest('Name is required');
        }

        // Check if wallet exists
        const { results: existing } = await db.query('SELECT id FROM wallets WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
            throw Boom.notFound(`Wallet with id '${id}' does not exist.`);
        }

        console.log('update :', request.payload);
        console.log('id :', id);

        const { results, error } =  await db.query(`
                UPDATE wallets
                SET    name = ?
                ,      adress = ?
                ,      chainid = ?
                WHERE  id = ?`,
            [name, adress, chainid, id]);

        if (error) {
            throw Boom.conflict(`Failed to update : ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            throw Boom.conflict('Failed to update wallet.');
        }

        const { results: resultsNew } = await db.query('SELECT id, name, adress, chainid FROM wallets WHERE id = ?', [id]);
        if (!resultsNew || resultsNew.length === 0) {
            throw Boom.internal(`Failed to retrieve updated wallet with id '${id}'.`);
        }
        return resultsNew[0];
    }
}

export const deleteWalletRoute = {
    method: 'DELETE',
    path: '/api/wallets/{id}',
    handler: async (request, h) => {
        console.log('Received request to delete wallet with id:', request.params.id);
        const id = parseInt(request.params.id);
        const { results, error } =  await db.query(`DELETE FROM wallets WHERE  id = ?`, [id]);

        if (error) {
            console.log('Error deleting wallet:', error);
            throw Boom.conflict(`Failed to delete wallet with id '${id}' : ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            console.log('No wallet deleted, possibly invalid id:', id);
            throw Boom.conflict(`Failed to delete wallet with id '${id}'`);
        }

        return {
            message: `Wallet with ID ${id} deleted successfully`,
            affectedRows: results.affectedRows
        };
    }
}

