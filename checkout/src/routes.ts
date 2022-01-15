import {Router} from "express";
import {GetLink} from "./controller/link.controller";
import {ConfirmOrder, CreateOrder} from "./controller/order.controller";


export const routes = (router: Router) => {
    router.get('/', (req, res) => res.send('ok'));
    // Checkout
    router.get('/api/checkout/links/:code', GetLink);
    router.post('/api/checkout/orders', CreateOrder);
    router.post('/api/checkout/orders/confirm', ConfirmOrder);
}
