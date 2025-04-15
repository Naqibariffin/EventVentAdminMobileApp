import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { IonicVue } from "@ionic/vue";
import "./style.css";

/* ✅ Core & Essential Ionic CSS */
import "@ionic/vue/css/core.css";
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* ✅ Optional Ionic Utilities */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";
import '@ionic/vue/css/ionic.bundle.css';

/* ✅ Dark Mode Support */
import "@ionic/vue/css/palettes/dark.system.css";

/* ✅ Firebase Initialization */
import "./firebase"; // Ensure Firebase is imported correctly

/* ✅ Create App Instance */
const app = createApp(App);

/* ✅ Register Plugins */
app.use(IonicVue);
app.use(router);

/* ✅ Wait for Router & Mount App */
router.isReady().then(() => {
  app.mount("#app");
});
