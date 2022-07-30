import cors from "cors";
import express from "express";
import "express-async-errors";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware.js";
import recommendationRouter from "./routers/recommendationRouter.js";
import { recommendationRepository } from "./repositories/recommendationRepository.js";

const app = express();
app.use(cors());
app.use(express.json());

if (process.env.MODE === "DEV") {

    console.log("DEV MODE");
    app.delete('/recommendations', async (req, res) => {
        await recommendationRepository.cleandb();
        res.sendStatus(200);
    });
}

app.use("/recommendations", recommendationRouter);
app.use(errorHandlerMiddleware);

export default app;
