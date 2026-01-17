<script setup lang="ts">
import HeadingSmall from '@/components/HeadingSmall.vue';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import SettingsLayout from '@/components/settings/SettingsLayout.vue';
import { useAppearance } from '@/composables/useAppearance';

definePage({
    meta: {
        layout: 'app',
        requiresAuth: true,
        breadcrumbs: [
            { title: 'Appearance settings', href: '/settings/appearance' },
        ],
    },
});

const { appearance, updateAppearance } = useAppearance();

const tabs = [
    { value: 'light', label: 'Light', icon: 'sun' },
    { value: 'dark', label: 'Dark', icon: 'moon' },
    { value: 'system', label: 'System', icon: 'monitor' },
] as const;
</script>

<template>
    <h1 class="sr-only">Appearance Settings</h1>

    <SettingsLayout>
        <div class="flex flex-col space-y-6">
            <HeadingSmall
                title="Appearance settings"
                description="Update the appearance of the application"
            />

            <div class="grid gap-2">
                <Label for="appearance">Theme</Label>
                <Select
                    :model-value="appearance"
                    @update:model-value="(value) => updateAppearance(value as 'light' | 'dark' | 'system')"
                >
                    <SelectTrigger id="appearance" class="w-[180px]">
                        <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem
                            v-for="tab in tabs"
                            :key="tab.value"
                            :value="tab.value"
                        >
                            {{ tab.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    </SettingsLayout>
</template>
