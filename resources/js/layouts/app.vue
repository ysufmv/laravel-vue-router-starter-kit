<script setup lang="ts">
import AppContent from '@/components/AppContent.vue';
import AppShell from '@/components/AppShell.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import AppSidebarHeader from '@/components/AppSidebarHeader.vue';
import type { BreadcrumbItemType } from '@/types';

const route = useRoute();

// Get breadcrumbs from route meta
const breadcrumbs = computed<BreadcrumbItemType[]>(() => {
    return (route.meta.breadcrumbs as BreadcrumbItemType[]) || [];
});
</script>

<template>
    <AppShell variant="sidebar">
        <AppSidebar />
        <AppContent variant="sidebar" class="overflow-x-hidden">
            <AppSidebarHeader :breadcrumbs="breadcrumbs" />
            <RouterView />
        </AppContent>
    </AppShell>
</template>
