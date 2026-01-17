<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/axios';
import { useAuthStore } from '@/stores/auth';

definePage({
    meta: {
        layout: 'auth',
        title: 'Reset password',
        description: 'Enter your new password below',
        requiresGuest: true,
    },
});

const router = useRouter();
const route = useRoute('/auth/reset-password/[token]');
const authStore = useAuthStore();

const form = reactive({
    token: route.params.token || '',
    email: (route.query.email as string) || '',
    password: '',
    password_confirmation: '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);

async function submit() {
    processing.value = true;
    errors.value = {};

    try {
        await authStore.resetPassword({
            token: form.token,
            email: form.email,
            password: form.password,
            password_confirmation: form.password_confirmation,
        });

        router.push('/auth/login?status=Password has been reset successfully');
    } catch (error: any) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else if (error.response?.data?.message) {
            errors.value = { email: error.response.data.message };
        }
        form.password = '';
        form.password_confirmation = '';
    } finally {
        processing.value = false;
    }
}
</script>

<template>
    <div>
        <form @submit.prevent="submit" class="flex flex-col gap-6">
            <div class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        v-model="form.email"
                        type="email"
                        required
                        autocomplete="email"
                        placeholder="email@example.com"
                    />
                    <InputError :message="errors.email" />
                </div>

                <div class="grid gap-2">
                    <Label for="password">New password</Label>
                    <Input
                        id="password"
                        v-model="form.password"
                        type="password"
                        required
                        autofocus
                        autocomplete="new-password"
                        placeholder="New password"
                    />
                    <InputError :message="errors.password" />
                </div>

                <div class="grid gap-2">
                    <Label for="password_confirmation">Confirm password</Label>
                    <Input
                        id="password_confirmation"
                        v-model="form.password_confirmation"
                        type="password"
                        required
                        autocomplete="new-password"
                        placeholder="Confirm password"
                    />
                    <InputError :message="errors.password_confirmation" />
                </div>

                <Button
                    type="submit"
                    class="mt-2 w-full"
                    :disabled="processing"
                >
                    <Spinner v-if="processing" />
                    Reset password
                </Button>
            </div>

            <div class="text-center text-sm text-muted-foreground">
                <TextLink to="/auth/login">Back to login</TextLink>
            </div>
        </form>
    </div>
</template>
