import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from "~/components/Index";
import Page1 from "~/components/Page1";


Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Index,
        },
        {
            path: '/cal',
            component: Page1,
        }
    ]
});
export default router
