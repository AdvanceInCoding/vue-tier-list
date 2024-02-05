export const useDragNDrop = () => useState('drag-n-drop', () => ({
    draggingElement: null,
    isDragging: false,
    draggingOverRow: '',
    draggedData: null,
}))
