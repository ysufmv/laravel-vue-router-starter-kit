<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

definePage({
    meta: {
        layout: 'default',
    },
});

const authStore = useAuthStore();
</script>

<template>
    <div
        class="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]"
    >
        <header
            class="mb-6 w-full max-w-[335px] text-sm lg:max-w-4xl"
        >
            <nav class="flex items-center justify-end gap-4">
                <RouterLink
                    v-if="authStore.isAuthenticated"
                    to="/dashboard"
                    class="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                >
                    Dashboard
                </RouterLink>
                <template v-else>
                    <RouterLink
                        to="/auth/login"
                        class="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                    >
                        Log in
                    </RouterLink>
                    <RouterLink
                        to="/auth/register"
                        class="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                    >
                        Register
                    </RouterLink>
                </template>
            </nav>
        </header>
        <div
            class="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0"
        >
            <main
                class="flex w-full max-w-[335px] flex-col-reverse overflow-hidden rounded-lg lg:max-w-4xl lg:flex-row"
            >
                <div
                    class="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]"
                >
                    <h1 class="mb-1 font-medium">Let's get started</h1>
                    <p class="mb-2 text-[#706f6c] dark:text-[#A1A09A]">
                        Laravel has an incredibly rich ecosystem. <br />We
                        suggest starting with the following.
                    </p>
                    <ul class="mb-4 flex flex-col lg:mb-6">
                        <li
                            class="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]"
                        >
                            <span
                                class="relative bg-white py-1 dark:bg-[#161615]"
                            >
                                <span
                                    class="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]"
                                >
                                    <span
                                        class="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]"
                                    />
                                </span>
                            </span>
                            <span>
                                Read the
                                <a
                                    href="https://laravel.com/docs"
                                    target="_blank"
                                    class="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                >
                                    <span>Documentation</span>
                                </a>
                            </span>
                        </li>
                        <li
                            class="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-[#e3e3e0] dark:before:border-[#3E3E3A]"
                        >
                            <span
                                class="relative bg-white py-1 dark:bg-[#161615]"
                            >
                                <span
                                    class="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]"
                                >
                                    <span
                                        class="h-1.5 w-1.5 rounded-full bg-[#dbdbd7] dark:bg-[#3E3E3A]"
                                    />
                                </span>
                            </span>
                            <span>
                                Watch
                                <a
                                    href="https://laracasts.com"
                                    target="_blank"
                                    class="ml-1 inline-flex items-center space-x-1 font-medium text-[#f53003] underline underline-offset-4 dark:text-[#FF4433]"
                                >
                                    <span>Laracasts</span>
                                </a>
                            </span>
                        </li>
                    </ul>
                    <p class="text-[#706f6c] dark:text-[#A1A09A]">
                        This app uses Vue Router with file-based routing. Your pages are in
                        <code class="rounded bg-[#FDFDFC] px-1 py-0.5 font-mono text-[#f53003] dark:bg-[#1a1a19] dark:text-[#FF4433]">resources/js/pages</code>.
                    </p>
                </div>
                <div
                    class="relative aspect-[335/376] w-full shrink-0 overflow-hidden rounded-tr-lg rounded-tl-lg bg-[#1b1b18] lg:aspect-auto lg:w-[438px] lg:rounded-tr-lg lg:rounded-br-lg lg:rounded-tl-none"
                >
                    <div class="flex h-full items-center justify-center text-white">
                        <div class="text-center">
                            <h2 class="text-2xl font-bold mb-2">Vue SPA</h2>
                            <p class="text-gray-400">Powered by Vue Router</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>
