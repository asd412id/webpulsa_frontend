import axios from "axios";
import "./app.postcss";
import App from "./App.svelte";

axios.defaults.baseURL = import.meta.env.VITE_APP_API || '/api/v1';
axios.defaults.withCredentials = true;

const app = new App({
  target: document.getElementById("app"),
});

export default app;
