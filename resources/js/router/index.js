import { createRouter, createWebHistory } from "vue-router";

import AddressBook from "../views/AddressBook.vue";
import Claim from "../views/Claim.vue";
import Connect from "../views/Connect.vue";
import Downline from "../views/Downline.vue";
import Home from "../views/Home.vue";
import Promo from "../views/Promo.vue";
import Swap from "../views/Swap.vue";
import Vault from "../views/Vault.vue";
import NotFound from "../views/NotFound.vue";

const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/claim",
        name: "Claim",
        component: Claim,
    },
    {
        path: "/swap",
        name: "Swap",
        component: Swap,
    },
    {
        path: "/vault",
        name: "Vault",
        component: Vault,
    },
    {
        path: "/downline",
        name: "Downline",
        component: Downline,
    },
    {
        path: "/promo",
        name: "Promo",
        component: Promo,
    },
    {
        path: "/addressbook",
        name: "AddressBook",
        component: AddressBook,
    },
    {
        path: "/connect",
        name: "Connect",
        component: Connect,
    },
    {
        path: "/:catchAll(.*)",
        component: NotFound,
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
