import {Router} from "express";
import {AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword} from "./controller/auth.controller";
import {AuthMiddleware} from "./middleware/auth.middleware";
import {Rankings} from "./controller/user.controller";
import {
    ProductsBackend,
    ProductsFrontend
} from "./controller/product.controller";
import {CreateLink, Stats} from "./controller/link.controller";


export const routes = (router: Router) => {
    router.get('/', (req, res) => res.send('ok'));

    // Ambassador
    router.post('/api/ambassador/register', Register);
    router.post('/api/ambassador/login', Login);
    router.get('/api/ambassador/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/ambassador/logout', AuthMiddleware, Logout);
    router.put('/api/ambassador/users/info', AuthMiddleware, UpdateInfo);
    router.put('/api/ambassador/users/password', AuthMiddleware, UpdatePassword);

    router.get('/api/ambassador/products/frontend', ProductsFrontend);
    router.get('/api/ambassador/products/backend', ProductsBackend);
    router.post('/api/ambassador/links', AuthMiddleware, CreateLink);
    router.get('/api/ambassador/stats', AuthMiddleware, Stats);
    router.get('/api/ambassador/rankings', AuthMiddleware, Rankings);
}
