import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import "@/access";
// @ts-ignore
import { createPinia } from "pinia";
const pinia = createPinia();
const app = createApp(App);
createApp(App).use(pinia).use(ArcoVue).use(router).mount("#app");
