import { defineConfig } from "vite";
import restart from "vite-plugin-restart";
import mkcert from "vite-plugin-mkcert";

export default defineConfig(({ command }) => {
	const isDev = command === "serve";

	return {
		plugins: [
			...(isDev
				? [
						mkcert(),
						restart({
							restart: ["vite.config.js", "./public/**/*"],
						}),
					]
				: []),
		],
		build: {
			outDir: "dist",
			emptyOutDir: true,
			minify: true,
			cssMinify: true,
			modulePreload: {
				polyfill: false,
			},
			rolldownOptions: {
				output: {
					entryFileNames: (chunkInfo) => {
						return chunkInfo.name === "index"
							? "[name].js"
							: "chunks/[name].chunk-[hash].js";
					},
					chunkFileNames: "chunks/[name].chunk-[hash].js",
					codeSplitting: {
						minSize: 25000,
						groups: [
							{
								name: "three-vendor",
								test: /node_modules[\/]three/,
								minSize: 15000,
								maxSize: 200000,
								priority: 15,
							},
							{
								name: "large-libs",
								test: /node_modules/,
								minSize: 15000,
								maxSize: 200000,
								priority: 10,
							},
						],
					},
					assetFileNames: (assetInfo) => {
						const name = assetInfo.name || "";
						if (/\.css$/i.test(name)) {
							return "assets/css/[name][extname]";
						}
						if (/\.(png|jpe?g|gif|svg|webp|ico)$/i.test(name)) {
							return "assets/img/[name]-[hash][extname]";
						}
						if (/\.(woff2?|eot|ttf|otf)$/i.test(name)) {
							return "assets/fonts/[name][extname]";
						}
						if (/\.(glb|gltf)$/i.test(name)) {
							return "assets/models/[name]-[hash][extname]";
						}
						return "assets/misc/[name][extname]";
					},
				},
			},
		},
		server: {
			https: true,
			host: true,
			port: 5173,
			cors: true,
		},
		preview: {
			https: true,
			host: true,
			port: 4173,
			cors: true,
		},
	};
});
