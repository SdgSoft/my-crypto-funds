import Boom from '@hapi/boom';
import { db } from '../database.js';

export const getAllChainsRoute = {
    method: 'GET',
    path: '/api/chains',
    handler: async (request, h) => {
        const { results } =  await db.query('SELECT id, name FROM chains ORDER BY name');
        return results;
    }
}

export const getChainRoute = {
    method: 'GET',
    path: '/api/chains/{id}',
    handler: async (request, h) => {
        if (isNaN(request.params.id)) {
            throw Boom.badRequest(`Invalid chain id '${request.params.id}'.`);
        }
        const id = parseInt(request.params.id);
        const { results } =  await db.query('SELECT id, name FROM chains WHERE id = ?', [id]);
        if (!results || results.length === 0) {
            throw Boom.notFound(`Chain does not exists with id '${id}'.`);
        }
        return results[0];
    }
}

export const createNewChainRoute = {
    method: 'POST',
    path: '/api/chains',
    handler: async (request, h) => {
        const { name } = request.payload;

        if (!name) {
            throw Boom.badRequest('Name is required');
        }

        // Check if name is unique
        const { results: existing } = await db.query('SELECT id FROM chains WHERE name = ?', [name]);
        if (existing && existing.length > 0) {
            throw Boom.conflict('Chain with this name already exists');
        }

        // Additional validation could be added here

        const { results, error } =  await db.query('INSERT INTO chains (name) VALUES (?)',
            [name]);

        if (error) {
            throw Boom.conflict(`Failed to create new chain: ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            throw Boom.conflict('Failed to create new chain.');
        }

        const id = results.insertId;
        console.log(`Created new chain with id '${id}'.`);
        const { results: resultsNew } = await db.query('SELECT id, name FROM chains WHERE id = ?', [id]);
        if (!resultsNew || resultsNew.length === 0) {
            throw Boom.internal(`Failed to retrieve newly created chain with id '${id}'.`);
        }
        return h.response(resultsNew[0]).code(201);
    }
}

export const updateChainRoute = {
    method: 'POST',
    path: '/api/chains/{id}',
    handler: async (request, h) => {
        const id = parseInt(request.params.id);
        const {name} = request.payload;

        if (isNaN(id)) {
            throw Boom.badRequest(`Invalid chain id '${request.params.id}'.`);
        }

        if (!name) {
            throw Boom.badRequest('Name is required');
        }

        // Check if chain exists
        const { results: existing } = await db.query('SELECT id FROM chains WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
            throw Boom.notFound(`Chain with id '${id}' does not exist.`);
        }

        console.log('update :', request.payload);
        console.log('id :', id);

        const { results, error } =  await db.query(`
                UPDATE chains
                SET    name = ?
                WHERE  id = ?`,
            [name, id]);

        if (error) {
            throw Boom.conflict(`Failed to update : ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            throw Boom.conflict('Failed to update chain.');
        }

        const { results: resultsNew } = await db.query('SELECT id, name FROM chains WHERE id = ?', [id]);
        if (!resultsNew || resultsNew.length === 0) {
            throw Boom.internal(`Failed to retrieve updated chain  with id '${id}'.`);
        }
        return resultsNew[0];
    }
}

export const deleteChainRoute = {
    method: 'DELETE',
    path: '/api/chains/{id}',
    handler: async (request, h) => {
        console.log('Received request to delete chain with id:', request.params.id);
        const id = parseInt(request.params.id);
        const { results, error } =  await db.query(`DELETE FROM chains WHERE  id = ?`, [id]);

        if (error) {
            console.log('Error deleting chain:', error);
            throw Boom.conflict(`Failed to delete chain with id '${id}' : ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            console.log('No chain deleted, possibly invalid id:', id);
            throw Boom.conflict(`Failed to delete chain with id '${id}'`);
        }

        return {
            message: `Chain with ID ${id} deleted successfully`,
            affectedRows: results.affectedRows
        };
    }
}

