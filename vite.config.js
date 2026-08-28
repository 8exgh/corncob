import { defineConfig } from "vite";
export default defineConfig({
  server: { proxy: { "/api": "http://localhost:3057", "/multiplayer": { target: "ws://localhost:3057", ws: true } } }
});
