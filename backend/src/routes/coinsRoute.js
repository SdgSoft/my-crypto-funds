import Boom from '@hapi/boom';
import { db } from '../database.js';
import { fetchPricesWithRetry } from '../utils/fetchPricesWithRetry.js';

export const getAllCoinsRoute = {
    method: 'GET',
    path: '/api/coins',
    handler: async (request, h) => {
        const { results } =  await db.query('SELECT id, name, symbol, slug, price, updatedAt FROM coins ORDER BY name');
        return results;
    }
}

export const getCoinRoute = {
    method: 'GET',
    path: '/api/coins/{id}',
    handler: async (request, h) => {
        if (isNaN(request.params.id)) {
            throw Boom.badRequest(`Invalid coin id '${request.params.id}'.`);
        }
        const id = parseInt(request.params.id);
        const { results } =  await db.query('SELECT id, name, symbol, slug, price, updatedAt FROM coins WHERE id = ?', [id]);
        if (!results || results.length === 0) {
            throw Boom.notFound(`Coin does not exists with id '${id}'.`);
        }
        return results[0];
    }
}

export const createNewCoinRoute = {
    method: 'POST',
    path: '/api/coins',
    handler: async (request, h) => {
        const { name, symbol, slug, price } = request.payload;

        if (!name || !symbol) {
            throw Boom.badRequest('Name and symbol are required');
        }

        // Check if name is unique
        const { results: existing } = await db.query('SELECT id FROM coins WHERE name = ?', [name]);
        if (existing && existing.length > 0) {
            throw Boom.conflict('Coin with this name already exists');
        }

        // Additional validation could be added here

        const { results, error } =  await db.query('INSERT INTO coins (name, symbol, slug, price) VALUES (?, ?, ?, ?)',
            [name, symbol, slug, price]);

        if (error) {
            throw Boom.conflict(`Failed to create new coin: ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            throw Boom.conflict('Failed to create new coin.');
        }

        const id = results.insertId;
        console.log(`Created new coin with id '${id}'.`);
        const { results: resultsNew } = await db.query('SELECT id, name, symbol, slug, price, updatedAt FROM coins WHERE id = ?', [id]);
        if (!resultsNew || resultsNew.length === 0) {
            throw Boom.internal(`Failed to retrieve newly created coin  with id '${id}'.`);
        }
        return h.response(resultsNew[0]).code(201);
    }
}

export const updateCoinRoute = {
    method: 'POST',
    path: '/api/coins/{id}',
    handler: async (request, h) => {
        const id = parseInt(request.params.id);
        const {name, symbol, slug, price } = request.payload;

        if (isNaN(id)) {
            throw Boom.badRequest(`Invalid coin id '${request.params.id}'.`);
        }

        if (!name || !symbol) {
            throw Boom.badRequest('Name and symbol are required');
        }

        if (isNaN(id)) {
            throw Boom.badRequest(`Invalid coin id '${request.params.id}'.`);
        }

        if (!name || !symbol) {
            throw Boom.badRequest('Name and symbol are required');
        }

        // Check if coin exists
        const { results: existing } = await db.query('SELECT id FROM coins WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
            throw Boom.notFound(`Coin with id '${id}' does not exist.`);
        }

        console.log('update :', request.payload);
        console.log('id :', id);

        const { results, error } =  await db.query(`
                UPDATE coins
                SET    name = ?
                ,      symbol = ?
                ,      slug = ?
                ,      price = ?
                ,      updatedAt = CURRENT_TIMESTAMP
                WHERE  id = ?`,
            [name, symbol, slug, price, id]);

        if (error) {
            throw Boom.conflict(`Failed to update : ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            throw Boom.conflict('Failed to update coin.');
        }

        const { results: resultsNew } = await db.query('SELECT id, name, symbol, slug, price, updatedAt FROM coins WHERE id = ?', [id]);
        if (!resultsNew || resultsNew.length === 0) {
            throw Boom.internal(`Failed to retrieve updated coin with id '${id}'.`);
        }
        return resultsNew[0];
    }
}

export const deleteCoinRoute = {
    method: 'DELETE',
    path: '/api/coins/{id}',
    handler: async (request, h) => {
        console.log('Received request to delete coin with id:', request.params.id);
        const id = parseInt(request.params.id);
        const { results, error } =  await db.query(`DELETE FROM coins WHERE  id = ?`, [id]);

        if (error) {
            console.log('Error deleting coin:', error);
            throw Boom.conflict(`Failed to delete coin with id '${id}' : ${error.message}`);
        }

        if (results && results.affectedRows === 0) {
            console.log('No coin deleted, possibly invalid id:', id);
            throw Boom.conflict(`Failed to delete coin with id '${id}'`);
        }

        return {
            message: `Coin with ID ${id} deleted successfully`,
            affectedRows: results.affectedRows
        };
    }
}

export const getCoinsPriceRoute = {
    method: 'GET',
    path: '/api/coins/current-price',
    handler: async (request, h) => {
        const cmcApiKey = process.env.CMC_API_KEY;
        if (!cmcApiKey) {
            throw Boom.internal('CMC API key not set in environment variables');
        }

        const cmcUrl = process.env.CMC_URL;
        if (!cmcUrl) {
            throw Boom.internal('CMC URL not set in environment variables');
        }

        // Fetch coins from database
        const { results: coinsResult, error: coinsError } = await db.query('SELECT id, name, symbol, slug, price FROM coins WHERE slug IS NOT NULL AND slug <> \'\' ORDER BY id');
        if (coinsError) {
            throw Boom.internal(`Failed to fetch coins: ${coinsError.message}`);
        }
        if (!coinsResult || coinsResult.length === 0) {
            throw Boom.notFound('No coins found in database');
        }

        const slugs = coinsResult.map(row => row.slug);

        let response;
        try {
            response = await fetchPricesWithRetry(slugs, cmcApiKey, cmcUrl);
        } catch (apiError) {
            throw Boom.badGateway(`Failed to fetch prices from CoinMarketCap: ${apiError.message}`);
        }

        // Merge database data with CMC prices
        const coinsWithPrices = coinsResult.map(coin => {
            const slug = coin.slug;
            const coinData = response.data[slug];
            const currentPrice = coinData && coinData.quote && coinData.quote.EUR ? coinData.quote.EUR.price : null;
            return {
                ...coin,
                currentPrice
            };
        });

        return coinsWithPrices;
    }
};

export const updateCoinsPriceRoute = {
    method: 'POST',
    path: '/api/coins/update-prices',
    handler: async (request, h) => {
        const cmcApiKey = process.env.CMC_API_KEY;
        if (!cmcApiKey) {
            throw Boom.internal('CMC API key not set in environment variables');
        }

        const cmcUrl = process.env.CMC_URL;
        if (!cmcUrl) {
            throw Boom.internal('CMC URL not set in environment variables');
        }

        const { results: slugsResult, error: slugsError } = await db.query('SELECT slug FROM coins WHERE slug is not null and slug <> \'\'');
        if (slugsError) {
            throw Boom.internal(`Failed to fetch slugs: ${slugsError.message}`);
        }
        if (!slugsResult || slugsResult.length === 0) {
            throw Boom.notFound('No coins found in database');
        }

        const slugs = slugsResult.map(row => row.slug);

        let response;
        try {
            response = await fetchPricesWithRetry(slugs, cmcApiKey, cmcUrl);
        } catch (apiError) {
            throw Boom.badGateway(`Failed to fetch prices from CoinMarketCap: ${apiError.message}`);
        }

        // Update each coin with the latest price
        let updatedCount = 0;
        for (const row of slugsResult) {
            const slug = row.slug;
            const coinData = response.data[slug];
            if (coinData && coinData.quote && coinData.quote.EUR) {
                const price = coinData.quote.EUR.price;
                const { error: updateError } = await db.query(
                    'UPDATE coins SET price = ?, updatedAt = CURRENT_TIMESTAMP WHERE slug = ?',
                    [price, slug]
                );
                if (updateError) {
                    console.error(`Failed to update price for ${slug}: ${updateError.message}`);
                } else {
                    updatedCount++;
                }
            } else {
                console.warn(`No price data found for slug: ${slug}, setting slug to null`);
                // Set slug to null since it's invalid
                const { error: nullifyError } = await db.query(
                    'UPDATE coins SET slug = NULL WHERE slug = ?',
                    [slug]
                );
                if (nullifyError) {
                    console.error(`Failed to nullify slug for ${slug}: ${nullifyError.message}`);
                }
            }
        }

        return { message: `Coin prices updated successfully for ${updatedCount} coins.` };
    }
};

