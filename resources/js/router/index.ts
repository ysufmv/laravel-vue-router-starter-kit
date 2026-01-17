import { createRouter, createWebHistory, type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router';
import { routes } from 'vue-router/auto-routes';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation guards
router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const { useAuthStore } = await import('@/stores/auth');
    const authStore = useAuthStore();

    // Check if route requires authentication
    const requiresAuth = to.meta.requiresAuth ?? false;
    const requiresGuest = to.meta.requiresGuest ?? false;

    // Skip auth check for two-factor challenge page (user is in partial auth state)
    if (to.path === '/auth/two-factor-challenge') {
        next();
        return;
    }

    // Fetch user if not already loaded
    if (!authStore.checked) {
        await authStore.fetchUser();
    }

    if (requiresAuth && !authStore.isAuthenticated) {
        // Redirect to login if not authenticated
        next({ path: '/auth/login', query: { redirect: to.fullPath } });
    } else if (requiresGuest && authStore.isAuthenticated) {
        // Redirect to dashboard if already authenticated
        next({ path: '/dashboard' });
    } else {
        next();
    }
});

export default router;