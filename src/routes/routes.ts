import { Router } from "express";
import { ProductRoutes } from "../modules/Prouducts/product.routes";
import { AuthRoutes } from "../modules/auth/auth.routes";

const router = Router()
const moduleRoutes = [
    {
        path: "/products",
        element: ProductRoutes,
    },
    {
        path: "/auth",
        element: AuthRoutes,
    },

    // Add more routes here...
];


moduleRoutes.forEach((route) => {
    router.use(route.path, route.element);
});

export const routes = router


