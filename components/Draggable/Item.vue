<template>
    <div class="draggable-item" ref="draggedItem" @mousedown="watchDrag">
        <slot class="draggable__item" />
    </div>
</template>

<script lang="ts" setup>

const drag = useDragNDrop();

const draggedItem = ref<HTMLElement | null>(null);

const movableObject = ref<HTMLElement | null>(null);

const dragOffset = ref<{ x: number, y: number }>({ x: 0, y: 0 });

const { contentData } = defineProps<{
    contentData?: any;
}>();

const emit = defineEmits<{
    (e: 'drop'): () => void;
    (e: 'drag-start'): () => void;
}>();

watch(dragOffset, (val) => {
    if (movableObject.value === null) return;
    movableObject.value.style.left = val.x + 'px';
    movableObject.value.style.top = val.y + 'px';
})

const cloneElement = () => {
    if (draggedItem.value === null || movableObject.value !== null) return

    const el = draggedItem.value.cloneNode(true) as HTMLElement;
    const rect = draggedItem.value.getBoundingClientRect();
    el.style.position = 'fixed';
    el.style.userSelect = 'none';
    el.style.pointerEvents = 'none';
    el.style.left = rect.x + 'px';
    el.style.top = rect.y + 'px';
    el.style.width = rect.width + 'px';
    el.style.height = rect.height + 'px';
    el.style.zIndex = '1000';

    document.body.style.cursor = 'grabbing';

    movableObject.value = el;

    dragOffset.value = {
        x: rect.x,
        y: rect.y,
    };
    window.addEventListener('mousemove', setDragOffset);
    document.body.appendChild(movableObject.value as HTMLElement);
}

const setDragOffset = (e: MouseEvent) => {
    if (movableObject.value === null) return;
    dragOffset.value = {
        x: e.clientX - movableObject.value.clientWidth / 2,
        y: e.clientY - movableObject.value.clientHeight / 2,
    };
};

const onDragEnd = (event: MouseEvent) => {
    drag.value.isDragging = false;
    window.removeEventListener('mousemove', setDragOffset);
    window.removeEventListener('mouseup', onDragEnd);
    document.body.removeChild(movableObject.value as HTMLElement);
    movableObject.value = null;
    document.body.style.cursor = 'initial';
    draggedItem.value ? draggedItem.value.style.opacity = '1' : null;
    emit('drop');
}

const onDragStart = (event: MouseEvent) => {
    if (draggedItem.value !== null && !drag.value.isDragging) {
        drag.value.isDragging = true;
        drag.value.draggedData = contentData;
        draggedItem.value.style.opacity = '0.5';
        cloneElement();
        emit('drag-start');
        window.addEventListener('mouseup', onDragEnd);
    }
}

const originalPointerPosition = ref<{ x: number, y: number }>({ x: 0, y: 0 });

const watchDrag = (e: MouseEvent) => {
    originalPointerPosition.value = {
        x: e.clientX,
        y: e.clientY,
    };

    const watchPointer = (e: MouseEvent) => {
        if (Math.abs(e.clientX - originalPointerPosition.value.x) > 10 || Math.abs(e.clientY - originalPointerPosition.value.y) > 10) {
            window.removeEventListener('mousemove', watchPointer);
            onDragStart(e);
        }
    }

    window.addEventListener('mousemove', watchPointer);
    window.addEventListener('mouseup', () => {
        window.removeEventListener('mousemove', watchPointer);
    });
}

</script>

<style scoped>
.draggable-item {
    user-select: none;
}
</style>
