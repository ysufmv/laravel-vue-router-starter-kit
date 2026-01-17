<script setup lang="ts">
import { RouterLink } from 'vue-router';

import DeleteUser from '@/components/DeleteUser.vue';
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import SettingsLayout from '@/components/settings/SettingsLayout.vue';
import { useAuthStore } from '@/stores/auth';

definePage({
    meta: {
        layout: 'app',
        requiresAuth: true,
        breadcrumbs: [
            { title: 'Profile settings', href: '/settings/profile' },
        ],
    },
});

const authStore = useAuthStore();

const form = reactive({
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);
const recentlySuccessful = ref(false);

async function submit() {
    processing.value = true;
    errors.value = {};
    recentlySuccessful.value = false;

    try {
        await authStore.updateProfile({
            name: form.name,
            email: form.email,
        });
        recentlySuccessful.value = true;
        setTimeout(() => {
            recentlySuccessful.value = false;
        }, 3000);
    } catch (error: any) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        }
    } finally {
        processing.value = false;
    }
}

// Watch for user changes
watch(
    () => authStore.user,
    (user) => {
        if (user) {
            form.name = user.name;
            form.email = user.email;
        }
    },
    { immediate: true }
);
</script>

<template>
    <h1 class="sr-only">Profile Settings</h1>

    <SettingsLayout>
        <div class="flex flex-col space-y-6">
            <HeadingSmall
                title="Profile information"
                description="Update your name and email address"
            />

            <form @submit.prevent="submit" class="space-y-6">
                <div class="grid gap-2">
                    <Label for="name">Name</Label>
                    <Input
                        id="name"
                        v-model="form.name"
                        class="mt-1 block w-full"
                        required
                        autocomplete="name"
                        placeholder="Full name"
                    />
                    <InputError class="mt-2" :message="errors.name" />
                </div>

                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input
                        id="email"
                        v-model="form.email"
                        type="email"
                        class="mt-1 block w-full"
                        required
                        autocomplete="username"
                        placeholder="Email address"
                    />
                    <InputError class="mt-2" :message="errors.email" />
                </div>

                <div
                    v-if="authStore.user && !authStore.isEmailVerified"
                    class="text-sm text-muted-foreground"
                >
                    Your email address is unverified.
                    <RouterLink
                        to="/auth/verify-email"
                        class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                    >
                        Click here to re-send the verification email.
                    </RouterLink>
                </div>

                <div class="flex items-center gap-4">
                    <Button :disabled="processing">
                        <Spinner v-if="processing" />
                        Save
                    </Button>

                    <p
                        v-show="recentlySuccessful"
                        class="text-sm text-neutral-600"
                    >
                        Saved.
                    </p>
                </div>
            </form>

            <DeleteUser />
        </div>
    </SettingsLayout>
</template>
