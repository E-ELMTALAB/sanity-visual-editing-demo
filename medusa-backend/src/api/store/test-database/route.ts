import { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { 
  IProductModuleService,
  IRegionModuleService,
  ICustomerModuleService,
  IOrderModuleService,
  IStoreModuleService
} from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

/**
 * Test Database & Modules
 * GET /store/test-database
 * 
 * Tests database connectivity through various modules
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const testResults: any = {
    timestamp: new Date().toISOString(),
    database: {
      configured: !!process.env.DATABASE_URL,
      connection: "not tested"
    },
    modules: []
  };

  try {
    // Test Product Module
    try {
      const productService: IProductModuleService = req.scope.resolve(Modules.PRODUCT);
      const [products, count] = await productService.listAndCountProducts();
      testResults.modules.push({
        name: "Product Module",
        status: "✅ Working",
        totalRecords: count,
        sampleId: products[0]?.id || "none"
      });
    } catch (error: any) {
      testResults.modules.push({
        name: "Product Module",
        status: "❌ Failed",
        error: error.message
      });
    }

    // Test Region Module
    try {
      const regionService: IRegionModuleService = req.scope.resolve(Modules.REGION);
      const [regions, count] = await regionService.listAndCountRegions();
      testResults.modules.push({
        name: "Region Module",
        status: "✅ Working",
        totalRecords: count,
        sampleId: regions[0]?.id || "none"
      });
    } catch (error: any) {
      testResults.modules.push({
        name: "Region Module",
        status: "❌ Failed",
        error: error.message
      });
    }

    // Test Customer Module
    try {
      const customerService: ICustomerModuleService = req.scope.resolve(Modules.CUSTOMER);
      const [customers, count] = await customerService.listAndCountCustomers();
      testResults.modules.push({
        name: "Customer Module",
        status: "✅ Working",
        totalRecords: count,
        sampleId: customers[0]?.id || "none"
      });
    } catch (error: any) {
      testResults.modules.push({
        name: "Customer Module",
        status: "❌ Failed",
        error: error.message
      });
    }

    // Test Order Module
    try {
      const orderService: IOrderModuleService = req.scope.resolve(Modules.ORDER);
      const [orders, count] = await orderService.listAndCountOrders();
      testResults.modules.push({
        name: "Order Module",
        status: "✅ Working",
        totalRecords: count,
        sampleId: orders[0]?.id || "none"
      });
    } catch (error: any) {
      testResults.modules.push({
        name: "Order Module",
        status: "❌ Failed",
        error: error.message
      });
    }

    // Test Store Module
    try {
      const storeService: IStoreModuleService = req.scope.resolve(Modules.STORE);
      const [stores] = await storeService.listAndCountStores();
      testResults.modules.push({
        name: "Store Module",
        status: "✅ Working",
        totalRecords: stores.length,
        store: stores[0] ? {
          id: stores[0].id,
          name: stores[0].name,
          currencies: (stores[0] as any).supported_currency_codes || []
        } : "none"
      });
    } catch (error: any) {
      testResults.modules.push({
        name: "Store Module",
        status: "❌ Failed",
        error: error.message
      });
    }

    // Calculate success rate
    const successfulModules = testResults.modules.filter((m: any) => m.status.includes("✅")).length;
    const totalModules = testResults.modules.length;
    
    testResults.database.connection = "✅ Connected";
    testResults.summary = {
      successfulModules,
      totalModules,
      successRate: `${((successfulModules / totalModules) * 100).toFixed(0)}%`,
      status: successfulModules === totalModules ? "✅ All modules working" : "⚠️ Some modules failed"
    };

    res.status(200).json(testResults);

  } catch (error: any) {
    testResults.database.connection = "❌ Failed";
    testResults.error = error.message;
    testResults.stack = process.env.NODE_ENV === "development" ? error.stack : undefined;

    res.status(503).json(testResults);
  }
};

