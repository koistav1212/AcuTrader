const fs = require('fs');
const path = require('path');

const backendDir = '/Users/koustavsarkar/Documents/mba_projects/AcuTrader-backend';

// 1. Update market.controller.js
const controllerPath = path.join(backendDir, 'src/modules/market/market.controller.js');
let controllerContent = fs.readFileSync(controllerPath, 'utf8');
controllerContent = controllerContent.replace(
  `    // Cap maximum data load to 5 years
    if (range && (range.toUpperCase() === '10Y' || range.toUpperCase() === 'MAX')) {
      range = '5Y';
    }`,
  `    // Cap maximum data load to 10 years instead of 5 years
    if (range && range.toUpperCase() === 'MAX') {
      range = '10Y';
    }`
);
fs.writeFileSync(controllerPath, controllerContent);

// 2. Update MarketDataService.js
const servicePath = path.join(backendDir, 'src/modules/market/MarketDataService.js');
let serviceContent = fs.readFileSync(servicePath, 'utf8');
const searchReplacement = `  async searchSymbol(query) {
    const cacheKey = \`search:\${query}\`;
    const ttl = 3600; // 1 hour

    return cacheService.getOrSet(cacheKey, async () => {
      // 1. Search local catalog first
      try {
        const { PrismaClient } = await import('@prisma/client');
        const prisma = new PrismaClient();
        const normalizedQuery = query.trim().toUpperCase();

        const results = await prisma.symbol_catalog.findMany({
          where: {
            OR: [
              { symbol: { startsWith: normalizedQuery, mode: 'insensitive' } },
              { name: { contains: query, mode: 'insensitive' } }
            ],
            is_active: true,
            exchange: { in: ['NASDAQ', 'NYSE'] }
          },
          take: 15
        });

        if (results.length > 0) {
          // Ranking logic: exact symbol > symbol startsWith > name startsWith > name contains
          const ranked = results.map(r => {
            let score = 0;
            const sym = r.symbol.toUpperCase();
            const n = r.name.toLowerCase();
            const q = query.toLowerCase();

            if (sym === normalizedQuery) score = 100;
            else if (sym.startsWith(normalizedQuery)) score = 90;
            else if (n.startsWith(q)) score = 80;
            else score = 70;

            return { ...r, _score: score };
          }).sort((a, b) => b._score - a._score);

          await prisma.$disconnect();

          return {
            data: ranked.map(r => ({
              symbol: r.symbol,
              name: r.name,
              exchange: r.exchange,
              type: r.type,
              country: r.country
            })),
            cached: false,
            updatedAt: new Date().toISOString(),
            source: 'local_catalog'
          };
        }
        await prisma.$disconnect();
      } catch (dbError) {
        console.warn("Local DB search failed, falling back to provider:", dbError.message);
      }

      // 2. Fallback to provider if local search yields no results or fails
      const result = await providerRouter.executeWithFallback('search', [query]);
      
      // Filter provider results to NASDAQ/NYSE and normalize
      if (result && result.data) {
        result.data = result.data.filter(s => 
          s.exchange === 'NASDAQ' || s.exchange === 'NYSE' || s.exchange === 'NMS' || s.exchange === 'NasdaqGS'
        ).map(s => ({
          symbol: s.symbol,
          name: s.instrument_name || s.shortName || s.longName,
          exchange: (s.exchange === 'NasdaqGS' || s.exchange === 'NMS') ? 'NASDAQ' : s.exchange,
          type: s.quoteType || 'EQUITY',
          country: 'US'
        })).slice(0, 15);
      }

      return { ...result, cached: false, updatedAt: new Date().toISOString() };
    }, ttl);
  }`;

serviceContent = serviceContent.replace(
  /  async searchSymbol\(query\) \{[\s\S]*?\}, ttl\);\n  \}/,
  searchReplacement
);
fs.writeFileSync(servicePath, serviceContent);

// 3. Write syncSymbolCatalog.js
const syncScript = `import { PrismaClient } from '@prisma/client';
import YahooFinance from 'yahoo-finance2';

const prisma = new PrismaClient();

async function syncSymbolCatalog() {
  console.log("Starting symbol catalog sync...");

  try {
    const symbolsToSync = [
      'AAPL', 'MSFT', 'NVDA', 'AMZN', 'META', 'GOOGL', 'TSLA', 'BRK.B', 'AVGO', 'JPM',
      'UNH', 'LLY', 'V', 'XOM', 'JNJ', 'MA', 'PG', 'HD', 'COST', 'ABBV',
      'MRK', 'CRM', 'CVX', 'AMD', 'NFLX', 'PEP', 'KO', 'BAC', 'ADBE', 'TMO',
      'WMT', 'MCD', 'DIS', 'ABT', 'CSCO', 'INTC', 'INTU', 'QCOM', 'TXN', 'IBM'
    ];

    console.log(\`Fetching data for \${symbolsToSync.length} symbols...\`);

    let newCount = 0;
    let updateCount = 0;

    for (const symbol of symbolsToSync) {
      try {
        const quote = await YahooFinance.quote(symbol);
        if (!quote) continue;

        const exchange = quote.exchange || (quote.exchangeName === 'NasdaqGS' ? 'NASDAQ' : quote.exchangeName);
        if (exchange !== 'NASDAQ' && exchange !== 'NYSE' && exchange !== 'NasdaqGS' && exchange !== 'NMS') {
           continue; 
        }

        const normalizedExchange = (exchange === 'NasdaqGS' || exchange === 'NMS' || exchange === 'NASDAQ') ? 'NASDAQ' : 'NYSE';

        await prisma.symbol_catalog.upsert({
          where: { symbol: quote.symbol },
          update: {
            name: quote.longName || quote.shortName || quote.symbol,
            exchange: normalizedExchange,
            type: quote.quoteType,
            country: 'US', 
            is_active: true,
            updated_at: new Date()
          },
          create: {
            symbol: quote.symbol,
            name: quote.longName || quote.shortName || quote.symbol,
            exchange: normalizedExchange,
            type: quote.quoteType,
            country: 'US',
            is_active: true,
            updated_at: new Date()
          }
        });
        updateCount++;
      } catch (err) {
        console.warn(\`Failed to sync \${symbol}: \${err.message}\`);
      }
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(\`Sync complete. Processed \${updateCount} symbols.\`);
  } catch (error) {
    console.error("Error syncing catalog:", error);
  } finally {
    await prisma.$disconnect();
  }
}

syncSymbolCatalog();
`;
const syncScriptPath = path.join(backendDir, 'scripts/syncSymbolCatalog.js');
fs.writeFileSync(syncScriptPath, syncScript);

console.log('Backend files updated successfully.');
