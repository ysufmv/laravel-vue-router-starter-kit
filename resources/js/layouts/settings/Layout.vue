<script setup lang="ts">
import Heading from '@/components/Heading.vue';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type NavItem } from '@/types';
import { useRoute } from 'vue-router';

const route = useRoute();

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: '/settings/profile',
    },
    {
        title: 'Password',
        href: '/settings/password',
    },
    {
        title: 'Two-Factor Auth',
        href: '/settings/two-factor',
    },
    {
        title: 'Appearance',
        href: '/settings/appearance',
    },
];

const isActive = (href: string) => {
    return route.path === href || route.path.toLowerCase() === href.toLowerCase();
};
</script>

<template>
    <div class="px-4 py-6">
        <Heading
            title="Settings"
            description="Manage your profile and account settings"
        />

        <div class="flex flex-col lg:flex-row lg:space-x-12">
            <aside class="w-full max-w-xl lg:w-48">
                <nav
                    class="flex flex-col space-y-1 space-x-0"
                    aria-label="Settings"
                >
                    <Button
                        v-for="item in sidebarNavItems"
                        :key="item.href as string"
                        variant="ghost"
                        :class="[
                            'w-full justify-start',
                            { 'bg-muted': isActive(item.href as string) },
                        ]"
                        as-child
                    >
                        <RouterLink :to="item.href">
                            {{ item.title }}
                        </RouterLink>
                    </Button>
                </nav>
            </aside>

            <Separator class="my-6 lg:hidden" />

            <div class="flex-1 lg:max-w-2xl">
                <slot />
            </div>
        </div>
    </div>
</template>
