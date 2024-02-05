<template>
    <DraggableItem :content-data="item" @drag-start="emitSelect" @drop="emitDrop">
        <div class="tier-list-item" :class="{
            'dragging-over': isSelected
        }">
            <div class="item__content" :style="{
                backgroundImage: `url(${item.img})`
            }" />
        </div>
    </DraggableItem>
</template>

<script setup lang='ts'>
import type { TierList } from '~/shared/types';

const emit = defineEmits<{
    (e: 'drop', data: TierList.Item): void;
    (e: 'select', data: TierList.Item): void;
}>();

const isSelected = ref(false);

const emitSelect = () => {
    isSelected.value = true;
    emit('select', item);
}

const emitDrop = () => {
    isSelected.value = false;
    emit('drop', item);
}

const { item } = defineProps<{
    item: TierList.Item;
}>()
</script>

<style lang="scss" scoped>
.dragging-over {
    opacity: 0.5;
}

.tier-list-item {
    .item__content {
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
    }

    width: 5rem;
    height: 5rem;
    border: 1px solid #ccc;
}
</style>
