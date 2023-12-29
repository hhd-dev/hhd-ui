import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  plugins: [react()],
});
