<script setup lang="ts">
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/stores/auth';

definePage({
    meta: {
        layout: 'auth',
        title: 'Verify email',
        description: 'Please verify your email address by clicking on the link we just emailed to you.',
        requiresAuth: true,
    },
});

const router = useRouter();
const authStore = useAuthStore();

const processing = ref(false);
const status = ref('');

async function resendVerification() {
    processing.value = true;
    status.value = '';

    try {
        await authStore.resendEmailVerification();
        status.value = 'verification-link-sent';
    } catch (error) {
        console.error('Failed to resend verification email', error);
    } finally {
        processing.value = false;
    }
}

async function logout() {
    await authStore.logout();
    router.push('/');
}
</script>

<template>
    <div>
        <div
            v-if="status === 'verification-link-sent'"
            class="mb-4 text-center text-sm font-medium text-green-600"
        >
            A new verification link has been sent to the email address you
            provided during registration.
        </div>

        <div class="space-y-6 text-center">
            <Button
                @click="resendVerification"
                :disabled="processing"
                variant="secondary"
            >
                <Spinner v-if="processing" />
                Resend verification email
            </Button>

            <button
                @click="logout"
                class="mx-auto block text-sm text-muted-foreground hover:underline"
            >
                Log out
            </button>
        </div>
    </div>
</template>
