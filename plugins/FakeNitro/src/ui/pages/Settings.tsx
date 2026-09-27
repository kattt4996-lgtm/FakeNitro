import { storage } from "@vendetta/plugin";
import { useProxy } from "@vendetta/storage";
import React from "react";
import { ScrollView } from "react-native";

import { FormRadioRow, FormRow, FormSection, FormSwitchRow } from "@ui/components/forms";

const PREMIUM_TYPE_OPTIONS: { label: string; value: number }[] = [
    { label: "Off (use real premium type)", value: -1 },
    { label: "None", value: 0 },
    { label: "Nitro Classic", value: 1 },
    { label: "Nitro", value: 2 },
    { label: "Nitro Basic", value: 3 }
];

export function Settings() {
    useProxy(storage);

    return (
        <ScrollView>
            <FormSection title="Settings">
                <FormRow label="Source to prioritize" />
                <FormRadioRow
                    label="Nitro"
                    selected={!!storage.prioritizeNitro}
                    onPress={() => { storage.prioritizeNitro = true; }}
                />
                <FormRadioRow
                    label="About Me"
                    selected={!storage.prioritizeNitro}
                    onPress={() => { storage.prioritizeNitro = false; }}
                />
                <FormSwitchRow
                    label="Hide Builder"
                    subLabel="Hide the FPTE Builder in the User Profile and Server Profiles settings pages"
                    value={!!storage.hideBuilder}
                    onValueChange={value => { storage.hideBuilder = value; }}
                />
                <FormSwitchRow
                    label="Force fallback effect picker"
                    value={!!storage.forceFallbackEffectPicker}
                    onValueChange={value => { storage.forceFallbackEffectPicker = value; }}
                />
            </FormSection>
            <FormSection title="Nitro Bypass (client-side only, cosmetic)">
                <FormSwitchRow
                    label="Unlock Emojis"
                    subLabel="Treat filtered/disabled/premium-locked emojis as usable"
                    value={!!storage.unlockEmojis}
                    onValueChange={value => { storage.unlockEmojis = value; }}
                />
                <FormSwitchRow
                    label="Unlock Stickers"
                    subLabel="Treat non-boosted/premium stickers as sendable"
                    value={!!storage.unlockStickers}
                    onValueChange={value => { storage.unlockStickers = value; }}
                />
                <FormRow label="Premium type override" />
                {PREMIUM_TYPE_OPTIONS.map(option => (
                    <FormRadioRow
                        key={option.value}
                        label={option.label}
                        selected={(storage.premiumTypeOverride ?? -1) === option.value}
                        onPress={() => { storage.premiumTypeOverride = option.value; }}
                    />
                ))}
            </FormSection>
        </ScrollView>
    );
}
