import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
var routes = [{
        path: '/',
        name: 'home',
        component: HomePage,
    },];
export var router = createRouter({
    history: createWebHistory('/'),
    routes: routes,
});
