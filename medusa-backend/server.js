const express = require("express");
const { getConfigFile } = require("medusa-core-utils");
const loaders = require("@medusajs/medusa/dist/loaders").default;

const start = async () => {
  const app = express();
  const directory = process.cwd();

  try {
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

