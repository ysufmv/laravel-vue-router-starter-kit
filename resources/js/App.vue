<script setup lang="ts">
import AppLayout from '@/layouts/app.vue';
import AuthLayout from '@/layouts/auth.vue';
import DefaultLayout from '@/layouts/default.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const layouts: Record<string, any> = {
    default: DefaultLayout,
    app: AppLayout,
    auth: AuthLayout,
};

const layout = computed(() => {
    const layoutName = (route.meta?.layout as string) || 'default';
    return layouts[layoutName] || DefaultLayout;
});
</script>

<template>
    <component :is="layout">
        <RouterView />
    </component>
</template>
