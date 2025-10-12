import { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";

export default (rootDirectory: string): Router | Router[] => {
  const router = Router();

  // CORS configuration
  const storeCorsOptions = {
    origin: process.env.STORE_CORS?.split(",") || "http://localhost:3000",
    credentials: true,
  };

  router.use(cors(storeCorsOptions));
  router.use(bodyParser.json());

  // Health check endpoint
  router.get("/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  });

  return router;
};

