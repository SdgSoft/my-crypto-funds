const https = require('https');

export const fetchPricesWithRetry = async (slugs, apiKey, cmcUrl) => {
    let remainingSlugs = [...slugs];
    let accumulatedData = {};

    while (remainingSlugs.length > 0) {
        const slugsStr = remainingSlugs.join(',');
        const url = `${cmcUrl}?convert=EUR&slug=${slugsStr}`;

        let response;
        try {
            response = await new Promise((resolve, reject) => {
                // Add a User-Agent header to mimic a standard browser
                const headers = {
                    'X-CMC_PRO_API_KEY': apiKey,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
                };

                https.get(url, { headers: headers }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try {
                            const json = JSON.parse(data);
                            resolve(json);
                        } catch (e) {
                            reject(new Error(`Failed to parse JSON. Received data starts with: ${data.substring(0, 100)}`));
                        }
                    });
                }).on('error', reject);
            });
        } catch (apiError) {
            throw new Error(`Failed to fetch prices: ${apiError.message}`);
        }

        if (response.status && response.status.error_code !== 0) {
            const errorMessage = response.status.error_message;
            const invalidSlugMatch = errorMessage.match(/Invalid value for "slug": "([^"]+)"/);
            if (invalidSlugMatch) {
                const invalidSlug = invalidSlugMatch[1];
                console.warn(`Invalid slug detected: ${invalidSlug}, excluding and retrying.`);
                remainingSlugs = remainingSlugs.filter(s => s !== invalidSlug);
                continue;
            } else {
                throw new Error(`CoinMarketCap API error: ${errorMessage}`);
            }
        }

        if (!response.data) {
            throw new Error('Invalid response from CoinMarketCap API');
        }

        // Accumulate data for slugs that have it
        const slugsWithData = Object.values(response.data).map(c => c.slug).filter(s => remainingSlugs.includes(s));
        for (const slug of slugsWithData) {
            const key = Object.keys(response.data).find(k => response.data[k].slug === slug);
            if (key) {
                accumulatedData[slug] = response.data[key];
            }
            remainingSlugs = remainingSlugs.filter(s => s !== slug);
        }

        // If no slugs had data in this attempt, stop
        if (slugsWithData.length === 0) {
            break;
        }
    }

    return { data: accumulatedData, status: { error_code: 0 } };
};