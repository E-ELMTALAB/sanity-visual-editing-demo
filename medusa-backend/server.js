const express = require("express");
const { getConfigFile } = require("medusa-core-utils");
const loaders = require("@medusajs/medusa/dist/loaders").default;
const { MigrationGenerator } = require("@medusajs/medusa");
const { DataSource } = require("typeorm");

const runMigrations = async (directory) => {
  console.log("Running database migrations...");
  const { configModule } = getConfigFile(directory, "medusa-config");
  
  const dataSource = new DataSource({
    type: "postgres",
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    migrations: [__dirname + "/node_modules/@medusajs/medusa/dist/migrations/*.js"],
  });

  try {
    await dataSource.initialize();
    await dataSource.runMigrations();
    await dataSource.destroy();
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
};

const seedDatabase = async (directory) => {
  console.log("Checking if database needs seeding...");
  const { configModule } = getConfigFile(directory, "medusa-config");
  
  const dataSource = new DataSource({
    type: "postgres",
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    entities: [__dirname + "/node_modules/@medusajs/medusa/dist/models/*.js"],
  });

  try {
    await dataSource.initialize();
    
    // Check if store exists
    const storeCount = await dataSource.query("SELECT COUNT(*) FROM store");
    
    if (parseInt(storeCount[0].count) === 0) {
      console.log("Creating default store...");
      
      // Insert default store
      await dataSource.query(`
        INSERT INTO store (id, name, default_currency_code, created_at, updated_at)
        VALUES ('store_01', 'Medusa Store', 'usd', NOW(), NOW())
      `);
      
      // Insert default currency
      await dataSource.query(`
        INSERT INTO currency (code, name, symbol, symbol_native)
        VALUES ('usd', 'US Dollar', '$', '$')
        ON CONFLICT (code) DO NOTHING
      `);
      
      // Insert default region
      await dataSource.query(`
        INSERT INTO region (id, name, currency_code, tax_rate, created_at, updated_at)
        VALUES ('reg_01', 'Default Region', 'usd', 0, NOW(), NOW())
      `);
      
      // Insert default country
      await dataSource.query(`
        INSERT INTO country (id, iso_2, iso_3, num_code, name, display_name, region_id)
        VALUES (840, 'US', 'USA', 840, 'UNITED STATES', 'United States', 'reg_01')
        ON CONFLICT (id) DO UPDATE SET region_id = 'reg_01'
      `);
      
      // Insert payment providers
      await dataSource.query(`
        INSERT INTO payment_provider (id, is_installed)
        VALUES ('manual', true)
        ON CONFLICT (id) DO NOTHING
      `);
      
      // Insert fulfillment providers
      await dataSource.query(`
        INSERT INTO fulfillment_provider (id, is_installed)
        VALUES ('manual', true)
        ON CONFLICT (id) DO NOTHING
      `);
      
      // Link payment provider to region
      await dataSource.query(`
        INSERT INTO region_payment_providers (region_id, provider_id)
        VALUES ('reg_01', 'manual')
        ON CONFLICT DO NOTHING
      `);
      
      // Link fulfillment provider to region
      await dataSource.query(`
        INSERT INTO region_fulfillment_providers (region_id, provider_id)
        VALUES ('reg_01', 'manual')
        ON CONFLICT DO NOTHING
      `);
      
      console.log("Database seeded successfully");
    } else {
      console.log("Store already exists, skipping seeding");
    }
    
    await dataSource.destroy();
  } catch (error) {
    console.error("Seeding error:", error.message);
    try { await dataSource.destroy(); } catch {}
  }
};

const start = async () => {
  const app = express();
  const directory = process.cwd();

  try {
    // Run migrations first
    await runMigrations(directory);
    
    // Seed database before initializing loaders
    await seedDatabase(directory);
    
    const { configModule } = getConfigFile(directory, "medusa-config");
    const { container } = await loaders({
      directory,
      expressApp: app,
      isTest: false,
    });

    const configModule_ = container.resolve("configModule");
    const port = configModule_.projectConfig.port ?? 9000;
    const host = configModule_.projectConfig.host ?? "0.0.0.0";

    const server = app.listen(port, host, (err) => {
      if (err) {
        console.error("Error starting server:", err);
        return;
      }
      console.log(`Server is ready on ${host}:${port}`);
    });

    // Handle graceful shutdown
    const gracefulShutdown = () => {
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (err) {
    console.error("Error during server initialization:", err);
    process.exit(1);
  }
};

start();

