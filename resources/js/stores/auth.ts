import api from '@/lib/axios';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const checked = ref(false);
    const loading = ref(false);

    const isAuthenticated = computed(() => !!user.value);
    const isEmailVerified = computed(() => !!user.value?.email_verified_at);

    async function fetchUser() {
        if (loading.value) return;

        loading.value = true;
        try {
            const response = await api.get('/api/user');
            user.value = response.data;
        } catch {
            user.value = null;
        } finally {
            checked.value = true;
            loading.value = false;
        }
    }

    async function login(credentials: { email: string; password: string; remember?: boolean }) {
        // Get CSRF cookie first
        await api.get('/sanctum/csrf-cookie');

        const response = await api.post('/login', credentials);
        
        // Check if two-factor authentication is required
        if (response.data?.two_factor) {
            return { twoFactor: true };
        }
        
        await fetchUser();
        return { twoFactor: false };
    }

    async function register(data: { name: string; email: string; password: string; password_confirmation: string }) {
        await api.get('/sanctum/csrf-cookie');
        await api.post('/register', data);
        await fetchUser();
    }

    async function logout() {
        try {
            await api.post('/logout');
        } catch {
            // Ignore errors - we want to clear state regardless
        }
        user.value = null;
        checked.value = false;
    }

    async function forgotPassword(email: string) {
        await api.get('/sanctum/csrf-cookie');
        return api.post('/forgot-password', { email });
    }

    async function resetPassword(data: {
        token: string;
        email: string;
        password: string;
        password_confirmation: string;
    }) {
        await api.get('/sanctum/csrf-cookie');
        return api.post('/reset-password', data);
    }

    async function resendEmailVerification() {
        return api.post('/email/verification-notification');
    }

    async function updatePassword(data: {
        current_password: string;
        password: string;
        password_confirmation: string;
    }) {
        return api.put('/user/password', data);
    }

    async function updateProfile(data: { name: string; email: string }) {
        const response = await api.put('/user/profile-information', data);
        await fetchUser();
        return response;
    }

    async function deleteAccount(password: string) {
        await api.delete('/user', { data: { password } });
        user.value = null;
    }

    function $reset() {
        user.value = null;
        checked.value = false;
        loading.value = false;
    }

    return {
        user,
        checked,
        loading,
        isAuthenticated,
        isEmailVerified,
        fetchUser,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        resendEmailVerification,
        updatePassword,
        updateProfile,
        deleteAccount,
        $reset,
    };
});
