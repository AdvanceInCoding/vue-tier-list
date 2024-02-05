<template>
    <div class="tier-list">
        <div class="available-tiers">
            <span>Available Tiers</span>
        </div>
        <div class="available-tiers__items">
            <div class="available-tiers__item" v-for="tier in availableTiers" :key="tier">
                <button @click="addRow(tier)">{{ tier }}</button>
            </div>
        </div>

        <div class="tier-list__header">
            <div class="tier-list__header__name">
                <span>{{ name }}</span>
            </div>
            <div class="tier-list__header__items">
                <span>Items</span>
            </div>
        </div>
        <div class="tier-list__rows">
            <TierListRow v-for="row in rows" :key="row.tier" :name="row.tier" :items="row.items" @drop="emitDrop"
                @remove-item="emitRemove" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import { type TierList, defaultTierList } from '~/shared/types';

const emit = defineEmits<{
    (e: 'drop', data: TierList.Item): void;
    (e: 'remove-item', data: TierList.Item): void;
}>();

const { name } = defineProps<{
    name: string;
}>();

const rows = ref<TierList.Row[]>([]);

const emitDrop = (data: TierList.Item) => {
    emit('drop', data);
}

const emitRemove = (data: TierList.Item) => {
    emit('remove-item', data);
}

const availableTiers = computed(() => {
    const currentTiers = rows.value.map(row => row.tier);
    return defaultTierList.filter(tier => !currentTiers.includes(tier));
});

const addRow = (tier: TierList.Tier) => {
    const current = [...rows.value];
    current.push({
        tier,
        items: []
    });

    rows.value = current.sort(
        (a, b) => defaultTierList.findIndex(tier => tier === a.tier)
            - defaultTierList.findIndex(tier => tier === b.tier)
    );
}

</script>
<style lang="scss" scoped>
.tier-list {
    height: fit-content;
    width: 50rem;
    min-height: 25rem;
    border: 1px solid #ccc;
}

.available-tiers__items {
    display: flex;

    button {
        margin: 0.1rem;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid #ccc;
        background-color: #fff;
        cursor: pointer;
        transition: all 0.2s ease-in-out;

        &:hover {
            background-color: #ccc;
        }
    }
}
</style>
