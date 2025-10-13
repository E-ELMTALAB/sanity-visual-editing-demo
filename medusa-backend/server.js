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

const seedDatabase = async (container) => {
  const storeService = container.resolve("storeService");
  const userService = container.resolve("userService");
  const regionService = container.resolve("regionService");
  const currencyService = container.resolve("currencyService");
  
  console.log("Checking if database needs seeding...");
  
  try {
    // Check if store exists
    const store = await storeService.retrieve().catch(() => null);
    
    if (!store) {
      console.log("Creating default store...");
      await storeService.create();
      
      // Create default region
      console.log("Creating default region...");
      await regionService.create({
        name: "Default Region",
        currency_code: "usd",
        tax_rate: 0,
        payment_providers: ["manual"],
        fulfillment_providers: ["manual"],
        countries: ["us"],
      });
      
      console.log("Database seeded successfully");
    }
  } catch (error) {
    console.log("Seeding skipped or already complete:", error.message);
  }
};

const start = async () => {
  const app = express();
  const directory = process.cwd();

  try {
    // Run migrations first
    await runMigrations(directory);
    
    const { configModule } = getConfigFile(directory, "medusa-config");
    const { container } = await loaders({
      directory,
      expressApp: app,
      isTest: false,
    });
    
    // Seed database if needed
    await seedDatabase(container);

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

