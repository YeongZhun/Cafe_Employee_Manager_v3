import { defineConfig, loadEnv, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    // const env = loadEnv(mode, process.cwd());

    return {
        base: "/",
        plugins: [
            {
                name: "load+transform-js-files-as-jsx",
                async transform(code, id) {
                    if (!id.match(/src\/.*\.js$/)) {
                        return null;
                    }

                    // Use the exposed transform from vite, instead of directly
                    // transforming with esbuild
                    return transformWithEsbuild(code, id, {
                        loader: "jsx",
                        jsx: "automatic",
                    });
                },
            },
            react(), // Use the React plugin for JSX handling
        ],
        // define: {
        //     "process.env": env,
        //     VITE_API_URL: process.env.VITE_API_URL,
        // },
        esbuild: {
            loader: "jsx",
        },
        optimizeDeps: {
            force: true,
            esbuildOptions: {
                loader: {
                    ".js": "jsx", // Ensure .js files are treated as JSX
                },
            },
        },
        preview: {
            port: 8080,
            strictPort: true,
        },
        server: {
            port: 8080,
            strictPort: true,
            host: true,
            origin: "http://0.0.0.0:8080",
        },
    };
});
