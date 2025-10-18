import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { 
  IProductModuleService,
  IRegionModuleService,
  ICurrencyModuleService,
  IStoreModuleService
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Comprehensive Backend Diagnostics Endpoint
 * GET /store/diagnostics
 * 
 * Tests:
 * - Database connectivity
 * - Module availability
 * - Configuration status
 * - Data samples
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    status: "running",
    environment: process.env.NODE_ENV || "development",
    tests: {},
    data: {},
    config: {},
    errors: []
  };

  try {
    // 1. Test Database Connection (via Product Module)
    try {
      const productModuleService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
      const [products] = await productModuleService.listAndCountProducts();
      
      diagnostics.tests.database = {
        status: "✅ Connected",
        productsCount: products.length,
        sample: products.slice(0, 3).map(p => ({
          id: p.id,
          title: p.title,
          status: p.status
        }))
      };
    } catch (error: any) {
      diagnostics.tests.database = {
        status: "❌ Failed",
        error: error.message
      };
      diagnostics.errors.push({ test: "database", error: error.message });
    }

    // 2. Test Region Module
    try {
      const regionModuleService: IRegionModuleService = req.scope.resolve(Modules.REGION);
      const [regions] = await regionModuleService.listAndCountRegions();
      
      diagnostics.tests.regions = {
        status: "✅ Available",
        count: regions.length,
        regions: regions.slice(0, 10).map(r => ({
          id: r.id,
          name: r.name,
          currency_code: r.currency_code,
          countries: r.countries?.length || 0
        }))
      };
    } catch (error: any) {
      diagnostics.tests.regions = {
        status: "❌ Failed",
        error: error.message
      };
      diagnostics.errors.push({ test: "regions", error: error.message });
    }

    // 3. Test Currency Module
    try {
      const currencyModuleService: ICurrencyModuleService = req.scope.resolve(Modules.CURRENCY);
      const [currencies] = await currencyModuleService.listAndCountCurrencies();
      
      diagnostics.tests.currencies = {
        status: "✅ Available",
        count: currencies.length,
        sample: currencies.slice(0, 5).map(c => ({
          code: c.code,
          name: c.name,
          symbol: c.symbol
        }))
      };
    } catch (error: any) {
      diagnostics.tests.currencies = {
        status: "⚠️ Not Available",
        error: error.message
      };
    }

    // 4. Test Store Module
    try {
      const storeModuleService: IStoreModuleService = req.scope.resolve(Modules.STORE);
      const [stores] = await storeModuleService.listAndCountStores();
      
      diagnostics.tests.store = {
        status: "✅ Available",
        count: stores.length,
        stores: stores.map(s => ({
          id: s.id,
          name: s.name,
          currencies: (s as any).supported_currency_codes || []
        }))
      };
    } catch (error: any) {
      diagnostics.tests.store = {
        status: "⚠️ Not Available",
        error: error.message
      };
    }

    // 5. Configuration Status (sanitized)
    diagnostics.config = {
      database: {
        configured: !!process.env.DATABASE_URL,
        host: process.env.DATABASE_URL ? "***configured***" : "missing"
      },
      redis: {
        configured: !!process.env.REDIS_URL,
        url: process.env.REDIS_URL ? "***configured***" : "missing"
      },
      cors: {
        admin: process.env.ADMIN_CORS || "not set",
        store: process.env.STORE_CORS || "not set"
      },
      jwt: {
        configured: !!process.env.JWT_SECRET
      },
      cookie: {
        configured: !!process.env.COOKIE_SECRET
      },
      minio: {
        configured: !!process.env.MINIO_ENDPOINT && !!process.env.MINIO_ACCESS_KEY,
        endpoint: process.env.MINIO_ENDPOINT || "not set"
      },
      resend: {
        configured: !!process.env.RESEND_API_KEY,
        fromEmail: process.env.RESEND_FROM || "not set"
      },
      stripe: {
        configured: !!process.env.STRIPE_API_KEY
      },
      meilisearch: {
        configured: !!process.env.MEILISEARCH_HOST
      }
    };

    // 6. Available Modules
    diagnostics.data.availableModules = [
      Modules.PRODUCT,
      Modules.PRICING,
      Modules.INVENTORY,
      Modules.STOCK_LOCATION,
      Modules.REGION,
      Modules.CUSTOMER,
      Modules.CART,
      Modules.ORDER,
      Modules.PAYMENT,
      Modules.FULFILLMENT,
      Modules.STORE,
      Modules.CURRENCY,
      Modules.API_KEY,
      Modules.USER,
      Modules.AUTH
    ];

    // Calculate overall health
    const failedTests = diagnostics.errors.length;
    if (failedTests === 0) {
      diagnostics.status = "✅ All Systems Operational";
    } else if (failedTests <= 2) {
      diagnostics.status = "⚠️ Some Issues Detected";
    } else {
      diagnostics.status = "❌ Multiple Failures";
    }

  } catch (error: any) {
    diagnostics.status = "❌ Critical Error";
    diagnostics.errors.push({
      test: "general",
      error: error.message,
      stack: error.stack
    });
  }

  res.status(200).json(diagnostics);
};

