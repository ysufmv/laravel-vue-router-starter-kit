<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import api from '@/lib/axios';

definePage({
    meta: {
        layout: 'auth',
        title: 'Confirm password',
        description: 'This is a secure area. Please confirm your password before continuing.',
        requiresAuth: true,
    },
});

const router = useRouter();
const route = useRoute();

const form = reactive({
    password: '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);

async function submit() {
    processing.value = true;
    errors.value = {};

    try {
        await api.post('/user/confirm-password', {
            password: form.password,
        });

        const redirect = (route.query.redirect as string) || '/dashboard';
        router.push(redirect);
    } catch (error: any) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else if (error.response?.data?.message) {
            errors.value = { password: error.response.data.message };
        }
        form.password = '';
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
                    <Label for="password">Password</Label>
                    <Input
                        id="password"
                        v-model="form.password"
                        type="password"
                        required
                        autofocus
                        autocomplete="current-password"
                        placeholder="Password"
                    />
                    <InputError :message="errors.password" />
                </div>

                <Button
                    type="submit"
                    class="w-full"
                    :disabled="processing"
                >
                    <Spinner v-if="processing" />
                    Confirm
                </Button>
            </div>
        </form>
    </div>
</template>
