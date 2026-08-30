import express from "express";
import { logger } from "./middleware/logger.js";
import router from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middleware/error.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(router);

app.get("/health", (req, res): void => {
  res.status(200).json({
    "success": true,
    "data": { "status": "ok" },
    "error": null
  });
});

app.get('/test-error', (req, res) => {
  throw new Error('Test error');
});

app.use(notFoundHandler);
app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});