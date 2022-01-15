import {Router} from "express";
import {AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword} from "./controller/auth.controller";
import {AuthMiddleware} from "./middleware/auth.middleware";
import {GetUser, Users} from "./controller/user.controller";


export const routes = (router: Router) => {
    router.get('/', (req,res) => res.send('ok'));
    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user/:scope', AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout', AuthMiddleware, Logout);
    router.put('/api/users/info', AuthMiddleware, UpdateInfo);
    router.put('/api/users/password', AuthMiddleware, UpdatePassword);
    router.get('/api/users', Users);
    router.get('/api/users/:id', GetUser);
}
