import express, { Request, Response } from "express";
import globalError from "./middlewares/globalError";
import { routes } from "./routes/routes";
import cors from "cors"
import cookieParser from "cookie-parser"
import authGuard from "./middlewares/authGuard";

const app = express();

const corsOptions = {
    origin: "https://gadget-e-commerce-fronted-2024.vercel.app",
    credentials: true,
    // methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(express.json());
app.use(cookieParser())
app.use(cors(corsOptions));
app.use("/api", routes)

app.get("/api/testing", authGuard(), async (req: Request, res: Response) => {
    console.log("hi");

    res.send({
        data: "i am private route"
    })
})
// testing route
app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});


//  global error
app.use(globalError);
// not found route

export default app;
