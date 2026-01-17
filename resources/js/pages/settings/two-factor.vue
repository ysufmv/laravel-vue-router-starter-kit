<script setup lang="ts">
import HeadingSmall from '@/components/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import SettingsLayout from '@/components/settings/SettingsLayout.vue';
import api from '@/lib/axios';

definePage({
    meta: {
        layout: 'app',
        requiresAuth: true,
        breadcrumbs: [
            { title: 'Two-Factor Authentication', href: '/settings/two-factor' },
        ],
    },
});

const twoFactorEnabled = ref(false);
const qrCode = ref('');
const recoveryCodes = ref<string[]>([]);
const confirmationCode = ref('');
const password = ref('');
const processing = ref(false);
const showPasswordConfirm = ref(false);
const showConfirmation = ref(false);
const showRecoveryCodes = ref(false);
const errors = ref<Record<string, string>>({});
const pendingAction = ref<'enable' | 'disable' | 'regenerate' | null>(null);

onMounted(async () => {
    await checkTwoFactorStatus();
});

async function checkTwoFactorStatus() {
    try {
        const response = await api.get('/api/user');
        twoFactorEnabled.value = response.data.two_factor_enabled || false;
    } catch (error) {
        console.error('Failed to check 2FA status', error);
    }
}

async function confirmPassword() {
    processing.value = true;
    errors.value = {};

    try {
        await api.post('/user/confirm-password', { password: password.value });
        showPasswordConfirm.value = false;
        password.value = '';
        
        // Execute the pending action
        if (pendingAction.value === 'enable') {
            await doEnableTwoFactor();
        } else if (pendingAction.value === 'disable') {
            await doDisableTwoFactor();
        } else if (pendingAction.value === 'regenerate') {
            await doRegenerateRecoveryCodes();
        }
        pendingAction.value = null;
    } catch (error: any) {
        if (error.response?.status === 422) {
            errors.value = { password: 'The password is incorrect.' };
        }
    } finally {
        processing.value = false;
    }
}

async function enableTwoFactor() {
    pendingAction.value = 'enable';
    showPasswordConfirm.value = true;
}

async function doEnableTwoFactor() {
    processing.value = true;
    errors.value = {};

    try {
        await api.post('/user/two-factor-authentication');
        
        // Get QR code
        const qrResponse = await api.get('/user/two-factor-qr-code');
        qrCode.value = qrResponse.data.svg;
        
        showConfirmation.value = true;
    } catch (error: any) {
        if (error.response?.status === 423) {
            // Password confirmation required
            showPasswordConfirm.value = true;
            pendingAction.value = 'enable';
        } else if (error.response?.data?.errors) {
            errors.value = error.response.data.errors;
        }
    } finally {
        processing.value = false;
    }
}

async function confirmTwoFactor() {
    processing.value = true;
    errors.value = {};

    try {
        await api.post('/user/confirmed-two-factor-authentication', {
            code: confirmationCode.value,
        });

        // Get recovery codes
        const codesResponse = await api.get('/user/two-factor-recovery-codes');
        recoveryCodes.value = codesResponse.data;
        
        twoFactorEnabled.value = true;
        showConfirmation.value = false;
        showRecoveryCodes.value = true;
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

async function disableTwoFactor() {
    pendingAction.value = 'disable';
    showPasswordConfirm.value = true;
}

async function doDisableTwoFactor() {
    processing.value = true;

    try {
        await api.delete('/user/two-factor-authentication');
        twoFactorEnabled.value = false;
        qrCode.value = '';
        recoveryCodes.value = [];
        showRecoveryCodes.value = false;
    } catch (error: any) {
        if (error.response?.status === 423) {
            showPasswordConfirm.value = true;
            pendingAction.value = 'disable';
        } else {
            console.error('Failed to disable 2FA', error);
        }
    } finally {
        processing.value = false;
    }
}

async function regenerateRecoveryCodes() {
    pendingAction.value = 'regenerate';
    showPasswordConfirm.value = true;
}

async function doRegenerateRecoveryCodes() {
    processing.value = true;

    try {
        await api.post('/user/two-factor-recovery-codes');
        const codesResponse = await api.get('/user/two-factor-recovery-codes');
        recoveryCodes.value = codesResponse.data;
        showRecoveryCodes.value = true;
    } catch (error: any) {
        if (error.response?.status === 423) {
            showPasswordConfirm.value = true;
            pendingAction.value = 'regenerate';
        } else {
            console.error('Failed to regenerate recovery codes', error);
        }
    } finally {
        processing.value = false;
    }
}

function cancelPasswordConfirm() {
    showPasswordConfirm.value = false;
    password.value = '';
    pendingAction.value = null;
    errors.value = {};
}
</script>

<template>
    <h1 class="sr-only">Two-Factor Authentication</h1>

    <SettingsLayout>
        <div class="flex flex-col space-y-6">
            <HeadingSmall
                title="Two-Factor Authentication"
                description="Add additional security to your account using two factor authentication"
            />

            <!-- Password Confirmation Dialog -->
            <template v-if="showPasswordConfirm">
                <div class="p-4 border rounded-md bg-muted/50">
                    <p class="text-sm font-medium mb-4">
                        Please confirm your password to continue.
                    </p>
                    <div class="grid gap-4 max-w-xs">
                        <div class="grid gap-2">
                            <Label for="password">Password</Label>
                            <Input
                                id="password"
                                v-model="password"
                                type="password"
                                placeholder="Enter your password"
                                @keyup.enter="confirmPassword"
                            />
                            <p v-if="errors.password" class="text-sm text-red-500">{{ errors.password }}</p>
                        </div>
                        <div class="flex gap-2">
                            <Button @click="confirmPassword" :disabled="processing">
                                <Spinner v-if="processing" />
                                Confirm
                            </Button>
                            <Button variant="outline" @click="cancelPasswordConfirm">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </template>

            <!-- 2FA Not Enabled -->
            <template v-if="!twoFactorEnabled && !showConfirmation && !showPasswordConfirm">
                <p class="text-sm text-muted-foreground">
                    When two factor authentication is enabled, you will be prompted for a secure, random token during authentication. 
                    You may retrieve this token from your phone's Google Authenticator application.
                </p>

                <Button @click="enableTwoFactor" :disabled="processing">
                    <Spinner v-if="processing" />
                    Enable Two-Factor Authentication
                </Button>
            </template>

            <!-- QR Code Confirmation -->
            <template v-if="showConfirmation && !showPasswordConfirm">
                <p class="text-sm text-muted-foreground">
                    To finish enabling two factor authentication, scan the following QR code using your phone's authenticator application or enter the setup key and provide the generated OTP code.
                </p>

                <div v-if="qrCode" v-html="qrCode" class="p-4 bg-white inline-block rounded"></div>

                <div class="grid gap-2 max-w-xs">
                    <label for="code" class="text-sm font-medium">Verification Code</label>
                    <input
                        id="code"
                        v-model="confirmationCode"
                        type="text"
                        inputmode="numeric"
                        class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        placeholder="Enter 6-digit code"
                    />
                    <p v-if="errors.code" class="text-sm text-red-500">{{ errors.code }}</p>
                </div>

                <div class="flex gap-2">
                    <Button @click="confirmTwoFactor" :disabled="processing">
                        <Spinner v-if="processing" />
                        Confirm
                    </Button>
                    <Button variant="outline" @click="showConfirmation = false; qrCode = ''">
                        Cancel
                    </Button>
                </div>
            </template>

            <!-- 2FA Enabled -->
            <template v-if="twoFactorEnabled && !showConfirmation && !showPasswordConfirm">
                <p class="text-sm text-green-600">
                    ✓ Two factor authentication is now enabled.
                </p>

                <!-- Recovery Codes -->
                <template v-if="showRecoveryCodes && recoveryCodes.length">
                    <div class="p-4 bg-muted rounded-md">
                        <p class="text-sm font-medium mb-2">Recovery Codes</p>
                        <p class="text-sm text-muted-foreground mb-4">
                            Store these recovery codes in a secure password manager. They can be used to recover access to your account if your two factor authentication device is lost.
                        </p>
                        <div class="grid grid-cols-2 gap-2 font-mono text-sm">
                            <div v-for="code in recoveryCodes" :key="code">{{ code }}</div>
                        </div>
                    </div>
                </template>

                <div class="flex gap-2">
                    <Button variant="outline" @click="regenerateRecoveryCodes" :disabled="processing">
                        <Spinner v-if="processing" />
                        Regenerate Recovery Codes
                    </Button>
                    <Button variant="destructive" @click="disableTwoFactor" :disabled="processing">
                        <Spinner v-if="processing" />
                        Disable Two-Factor
                    </Button>
                </div>
            </template>
        </div>
    </SettingsLayout>
</template>
