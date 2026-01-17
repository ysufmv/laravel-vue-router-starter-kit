<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/stores/auth';
import api from '@/lib/axios';

definePage({
    meta: {
        layout: 'auth',
        title: 'Two-Factor Authentication',
        description: 'Please enter your authentication code to continue.',
    },
});

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const useRecoveryCode = ref(false);
const form = reactive({
    code: '',
    recovery_code: '',
});

const errors = ref<Record<string, string>>({});
const processing = ref(false);

async function submit() {
    processing.value = true;
    errors.value = {};

    try {
        await api.post('/two-factor-challenge', {
            code: useRecoveryCode.value ? undefined : form.code,
            recovery_code: useRecoveryCode.value ? form.recovery_code : undefined,
        });

        // Fetch user after successful 2FA
        await authStore.fetchUser();

        const redirect = (route.query.redirect as string) || '/dashboard';
        router.push(redirect);
    } catch (error: any) {
        if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        } else if (error.response?.data?.message) {
            errors.value = { code: error.response.data.message };
        }
    } finally {
        processing.value = false;
    }
}

function toggleRecoveryCode() {
    useRecoveryCode.value = !useRecoveryCode.value;
    form.code = '';
    form.recovery_code = '';
    errors.value = {};
}
</script>

<template>
    <div>
        <form @submit.prevent="submit" class="flex flex-col gap-6">
            <div class="grid gap-6">
                <template v-if="!useRecoveryCode">
                    <div class="grid gap-2">
                        <p class="text-sm text-muted-foreground text-center mb-4">
                            Please enter the 6-digit code from your authenticator app.
                        </p>
                        <InputOTP
                            v-model="form.code"
                            :maxlength="6"
                            class="justify-center"
                        >
                            <InputOTPGroup>
                                <InputOTPSlot
                                    v-for="index in 6"
                                    :key="index"
                                    :index="index - 1"
                                />
                            </InputOTPGroup>
                        </InputOTP>
                        <InputError :message="errors.code" class="text-center" />
                    </div>
                </template>

                <template v-else>
                    <div class="grid gap-2">
                        <p class="text-sm text-muted-foreground text-center mb-4">
                            Please enter one of your recovery codes.
                        </p>
                        <input
                            id="recovery_code"
                            v-model="form.recovery_code"
                            type="text"
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="XXXX-XXXX"
                        />
                        <InputError :message="errors.recovery_code" class="text-center" />
                    </div>
                </template>

                <Button
                    type="submit"
                    class="w-full"
                    :disabled="processing"
                >
                    <Spinner v-if="processing" />
                    {{ useRecoveryCode ? 'Verify' : 'Verify' }}
                </Button>
            </div>

            <div class="text-center">
                <button
                    type="button"
                    @click="toggleRecoveryCode"
                    class="text-sm text-muted-foreground hover:underline"
                >
                    {{ useRecoveryCode ? 'Use authentication code' : 'Use a recovery code' }}
                </button>
            </div>
        </form>
    </div>
</template>
