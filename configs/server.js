"use strict"

import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import { dbConnection } from "./mongo.js"
import {defaultAdmin} from "./defaultAdmin.js"
import {defaultCategory} from "./defaultCategory.js"
import apiLimiter from "../src/middlewares/rate-limit-validators.js"
import authRoutes from "../src/auth/auth.router.js"
import categoryRoutes from "../src/category/category.router.js"
import userRoutes from "../src/user/user.router.js"
import productRoutes from "../src/product/product.routes.js"
import shoppingCartRoutes from "../src/shoppingCart/shoppingCart.router.js"
import billRoutes from "../src/bill/bill.routes.js"

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false}))
    app.use(express.json())
    app.use(cors())
    app.use(helmet())
    app.use(morgan("dev"))
    app.use(apiLimiter)
}

const routes = (app) => {
    app.use("/storeManagement/v1/auth", authRoutes)
    app.use("/storeManagement/v1/category", categoryRoutes)
    app.use("/storeManagement/v1/user", userRoutes)
    app.use("/storeManagement/v1/product", productRoutes)
    app.use("/storeManagement/v1/shoppingCart" ,shoppingCartRoutes)
    app.use("/storeManagement/v1/bill", billRoutes)
}

const conectarDB = async () => {
    try {
        await dbConnection();
    } catch (err) {
        console.log(`Database connection failed: ${err}`)
        process.exit(1);
    }
}

export const initServer = () =>{
    const app = express();
    try {
        middlewares(app);
        conectarDB();
        routes(app);
        defaultAdmin();
        defaultCategory();
        const port = process.env.PORT || 3001;
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        })
        
    } catch (err) {
        console.log(`Server init failed: ${err}`)
    }
}