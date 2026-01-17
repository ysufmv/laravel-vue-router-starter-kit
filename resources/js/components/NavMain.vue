<script setup lang="ts">
import { RouterLink } from 'vue-router';

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';

defineProps<{
    items: NavItem[];
}>();

const route = useRoute();

function isActive(href: string | object): boolean {
    if (typeof href === 'string') {
        return route.path === href;
    }
    return false;
}
</script>

<template>
    <SidebarGroup class="px-2 py-0">
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
                <SidebarMenuButton
                    as-child
                    :is-active="isActive(item.href)"
                    :tooltip="item.title"
                >
                    <RouterLink :to="item.href">
                        <component :is="item.icon" />
                        <span>{{ item.title }}</span>
                    </RouterLink>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarGroup>
</template>
