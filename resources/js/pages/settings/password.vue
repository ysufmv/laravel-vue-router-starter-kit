<script setup lang="ts">
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
            { title: 'Password settings', href: '/settings/password' },
        ],
    },
});

const authStore = useAuthStore();

const form = reactive({
    current_password: '',
    password: '',
    password_confirmation: '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);
const recentlySuccessful = ref(false);

async function submit() {
    processing.value = true;
    errors.value = {};
    recentlySuccessful.value = false;

    try {
        await authStore.updatePassword({
            current_password: form.current_password,
            password: form.password,
            password_confirmation: form.password_confirmation,
        });
        
        // Reset form
        form.current_password = '';
        form.password = '';
        form.password_confirmation = '';
        
        recentlySuccessful.value = true;
        setTimeout(() => {
            recentlySuccessful.value = false;
        }, 3000);
    } catch (error: any) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else if (error.response?.data?.message) {
            errors.value = { current_password: error.response.data.message };
        }
    } finally {
        processing.value = false;
    }
}
</script>

<template>
    <h1 class="sr-only">Password Settings</h1>

    <SettingsLayout>
        <div class="flex flex-col space-y-6">
            <HeadingSmall
                title="Update password"
                description="Ensure your account is using a long, random password to stay secure"
            />

            <form @submit.prevent="submit" class="space-y-6">
                <div class="grid gap-2">
                    <Label for="current_password">Current password</Label>
                    <Input
                        id="current_password"
                        v-model="form.current_password"
                        type="password"
                        class="mt-1 block w-full"
                        autocomplete="current-password"
                        placeholder="Current password"
                    />
                    <InputError :message="errors.current_password" />
                </div>

                <div class="grid gap-2">
                    <Label for="password">New password</Label>
                    <Input
                        id="password"
                        v-model="form.password"
                        type="password"
                        class="mt-1 block w-full"
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
                        class="mt-1 block w-full"
                        autocomplete="new-password"
                        placeholder="Confirm password"
                    />
                    <InputError :message="errors.password_confirmation" />
                </div>

                <div class="flex items-center gap-4">
                    <Button :disabled="processing">
                        <Spinner v-if="processing" />
                        Save password
                    </Button>

                    <p
                        v-show="recentlySuccessful"
                        class="text-sm text-neutral-600"
                    >
                        Saved.
                    </p>
                </div>
            </form>
        </div>
    </SettingsLayout>
</template>
