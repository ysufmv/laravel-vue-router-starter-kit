<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/stores/auth';

definePage({
    meta: {
        layout: 'auth',
        title: 'Log in to your account',
        description: 'Enter your email and password below to log in',
        requiresGuest: true,
    },
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const form = reactive({
    email: '',
    password: '',
    remember: false,
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);
const status = ref((route.query.status as string) || '');

async function submit() {
    processing.value = true;
    errors.value = {};

    try {
        const result = await authStore.login({
            email: form.email,
            password: form.password,
            remember: form.remember,
        });

        // Check if two-factor authentication is required
        if (result?.twoFactor) {
            const redirect = (route.query.redirect as string) || '/dashboard';
            router.push({ path: '/auth/two-factor-challenge', query: { redirect } });
            return;
        }

        const redirect = (route.query.redirect as string) || '/dashboard';
        router.push(redirect);
    } catch (error: any) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else if (error.response?.data?.message) {
            errors.value = { email: error.response.data.message };
        }
        form.password = '';
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

        <form @submit.prevent="submit" class="flex flex-col gap-6">
            <div class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        v-model="form.email"
                        type="email"
                        required
                        autofocus
                        :tabindex="1"
                        autocomplete="email"
                        placeholder="email@example.com"
                    />
                    <InputError :message="errors.email" />
                </div>

                <div class="grid gap-2">
                    <div class="flex items-center justify-between">
                        <Label for="password">Password</Label>
                        <TextLink
                            to="/auth/forgot-password"
                            class="text-sm"
                            :tabindex="5"
                        >
                            Forgot password?
                        </TextLink>
                    </div>
                    <Input
                        id="password"
                        v-model="form.password"
                        type="password"
                        required
                        :tabindex="2"
                        autocomplete="current-password"
                        placeholder="Password"
                    />
                    <InputError :message="errors.password" />
                </div>

                <div class="flex items-center justify-between">
                    <Label for="remember" class="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            v-model:checked="form.remember"
                            :tabindex="3"
                        />
                        <span>Remember me</span>
                    </Label>
                </div>

                <Button
                    type="submit"
                    class="mt-4 w-full"
                    :tabindex="4"
                    :disabled="processing"
                    data-test="login-button"
                >
                    <Spinner v-if="processing" />
                    Log in
                </Button>
            </div>

            <div class="text-center text-sm text-muted-foreground">
                Don't have an account?
                <TextLink to="/auth/register" :tabindex="5">Sign up</TextLink>
            </div>
        </form>
    </div>
</template>
