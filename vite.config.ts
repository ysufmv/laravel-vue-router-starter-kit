import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import VueRouter from 'unplugin-vue-router/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        // VueRouter must be placed before Vue
        VueRouter({
            routesFolder: 'resources/js/pages',
            dts: 'resources/js/typed-router.d.ts',
        }),
        laravel({
            input: ['resources/js/app.ts'],
            refresh: true,
        }),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        AutoImport({
            imports: [
                'vue',
                'vue-router',
                '@vueuse/core',
                'pinia',
                {
                    'unplugin-vue-router/runtime': ['definePage'],
                },
            ],
            dts: 'resources/js/auto-imports.d.ts',
            dirs: [
                'resources/js/composables',
                'resources/js/stores',
            ],
            vueTemplate: true,
        }),
        Components({
            dirs: ['resources/js/components'],
            dts: 'resources/js/components.d.ts',
            resolvers: [],
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./resources/js', import.meta.url)),
        },
    },
});
