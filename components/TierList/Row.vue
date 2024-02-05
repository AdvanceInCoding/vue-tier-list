<template>
    <div class="tier-list-row" @mouseenter="setDraggingOverRow" @mouseleave="resetDraggingOverRow" @mouseup="getDrop">
        <div class="row__name">
            <span>{{ name }}</span>
        </div>
        <div class="row__items">
            <TierListItem v-for="(item, idx) in showingItems" :key="item.img" :item="item" @select="selectColumn"
                @drop="removeAndGetDrop" />
        </div>
    </div>
</template>

<script setup lang='ts'>
import type { TierList } from '~/shared/types';

const drag = useDragNDrop();

const emit = defineEmits<{
    (e: 'drop', data: TierList.Item): void;
    (e: 'remove-item', data: TierList.Item): void;
}>();

const { name, items } = defineProps<{
    name: string;
    items: TierList.Item[]
}>()

const showingItems = ref(items);

const setDraggingOverRow = () => {
    if (!drag.value.isDragging) return;
    drag.value.draggingOverRow = name;
}

const resetDraggingOverRow = () => {
    if (!drag.value.isDragging) return;
    drag.value.draggingOverRow = '';
}

const checkItemExists = (item: TierList.Item) => {
    return showingItems.value.find(i => i.img === item.img);
}

const getDrop = () => {
    if (
        !drag.value.isDragging ||
        !drag.value.draggedData ||
        drag.value.draggingOverRow !== name ||
        checkItemExists(drag.value.draggedData)
    ) return;

    showingItems.value.push(drag.value.draggedData);
    emit('drop', drag.value.draggedData);
    drag.value.draggedData = null;
}

const selectColumn = () => {
    drag.value.draggingOverRow = name;
}

const removeAndGetDrop = (item: TierList.Item) => {
    if (drag.value.draggingOverRow !== name) {
        removeFromList(item);
        getDrop();
    }
}

const removeFromList = (item: TierList.Item) => {
    const current = [...showingItems.value];
    const idx = current.findIndex(i => i.img === item.img);

    if (idx === -1) return;
    current.splice(idx, 1);
    showingItems.value = current;
    emit('remove-item', item);
}

</script>

<style lang="scss" scoped>
.dragging-over {
    opacity: 0.5
}

.tier-list-row {
    user-select: none;
    display: flex;
    min-height: 5rem;
    border: 1px solid #ccc;
    align-items: self-start;
    justify-content: flex-start;
    width: 100%;
    height: fit-content;

    .row__name {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 5rem;
        min-height: inherit;
        height: inherit;
        margin: auto 0;
        background-color: #f5f5f5;
        border: 1px solid #ccc;
    }

    .row__items {
        margin-left: 0.5rem;
        display: flex;
        gap: 0.25rem;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
    }
}
</style>
