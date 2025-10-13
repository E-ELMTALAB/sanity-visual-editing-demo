const express = require("express");
const { getConfigFile } = require("medusa-core-utils");
const loaders = require("@medusajs/medusa/dist/loaders").default;
const { DataSource } = require("typeorm");
const fs = require("fs");

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
  console.log("Forcing complete database reseed...");
  const { configModule } = getConfigFile(directory, "medusa-config");
  
  const dataSource = new DataSource({
    type: "postgres",
    url: configModule.projectConfig.database_url,
    extra: configModule.projectConfig.database_extra || {},
    entities: [__dirname + "/node_modules/@medusajs/medusa/dist/models/*.js"],
  });

  try {
    await dataSource.initialize();
    
    console.log("Dropping all existing data...");
    
    // Disable foreign key checks temporarily
    await dataSource.query("SET session_replication_role = 'replica';");
    
    // Get all table names
    const tables = await dataSource.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public' 
      AND tablename NOT LIKE 'migrations%'
    `);
    
    // Truncate all tables
    for (const { tablename } of tables) {
      try {
        await dataSource.query(`TRUNCATE TABLE "${tablename}" CASCADE;`);
        console.log(`Cleared table: ${tablename}`);
      } catch (err) {
        console.log(`Skipping table ${tablename}: ${err.message}`);
      }
    }
    
    // Re-enable foreign key checks
    await dataSource.query("SET session_replication_role = 'origin';");
    
    await dataSource.destroy();
    
    console.log("All data cleared. Running SQL-based seed...");
    
    // Re-initialize connection for seeding
    await dataSource.initialize();
    
    // Read and execute SQL seed file
    const seedSQL = fs.readFileSync("/app/seed-data.sql", "utf8");
    await dataSource.query(seedSQL);
    
    await dataSource.destroy();
    
    console.log("Database seeded successfully with SQL seed data");
  } catch (error) {
    console.error("Seeding error:", error.message);
    console.error("Full error:", error);
    try { await dataSource.destroy(); } catch {}
    throw error;
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

