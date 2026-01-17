<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/stores/auth';

definePage({
    meta: {
        layout: 'auth',
        title: 'Forgot password',
        description: 'Enter your email to receive a password reset link',
        requiresGuest: true,
    },
});

const authStore = useAuthStore();

const form = reactive({
    email: '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);
const status = ref('');

async function submit() {
    processing.value = true;
    errors.value = {};
    status.value = '';

    try {
        await authStore.forgotPassword(form.email);
        status.value = 'We have emailed your password reset link.';
    } catch (error: any) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else if (error.response?.data?.message) {
            errors.value = { email: error.response.data.message };
        }
    } finally {
        processing.value = false;
    }
}
</script>

<template>
    <div>
        <div
            v-if="status"
            class="mb-4 text-center text-sm font-medium text-green-600"
        >
            {{ status }}
        </div>

        <div class="space-y-6">
            <form @submit.prevent="submit">
                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        v-model="form.email"
                        type="email"
                        autocomplete="off"
                        autofocus
                        placeholder="email@example.com"
                    />
                    <InputError :message="errors.email" />
                </div>

                <div class="my-6 flex items-center justify-start">
                    <Button
                        class="w-full"
                        :disabled="processing"
                        data-test="email-password-reset-link-button"
                    >
                        <Spinner v-if="processing" />
                        Email password reset link
                    </Button>
                </div>
            </form>

            <div class="space-x-1 text-center text-sm text-muted-foreground">
                <span>Or, return to</span>
                <TextLink to="/auth/login">log in</TextLink>
            </div>
        </div>
    </div>
</template>
