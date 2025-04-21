import { useHotkeys } from 'react-hotkeys-hook';

export const useKeyboardShortcuts = ({
    itemsRef,
    focusedItemIndex,
    selectedItems,
    setSelectedItems,
    setFocusedItemIndex,
    openAddForm,
    openEditForm,
    handleBulkDelete,
    handleViewDetails,
    toggleItemSelection,
    setFormModalOpen,
    setViewDetailsOpen,
    formModalOpen,
    deleteModalOpen,
    viewDetailsOpen,
    showAddButton = true,
    showEditButton = true,
}) => {
    const canNavigate = !formModalOpen && !deleteModalOpen && !viewDetailsOpen;
    const isValidIndex = focusedItemIndex >= 0 && itemsRef.current?.[focusedItemIndex];

    useHotkeys('alt+a', (e) => {
        e.preventDefault();
        showAddButton && openAddForm();
    });

    useHotkeys('alt+e', (e) => {
        e.preventDefault();
        if (!showEditButton) return;

        setViewDetailsOpen(false);

        if (focusedItemIndex >= 0 && itemsRef.current?.[focusedItemIndex]) {
            openEditForm(itemsRef.current[focusedItemIndex]);
            document.getElementById('dashboard-root').focus();
        } else if (selectedItems.length === 1) {
            const selectedItem = itemsRef.current?.find(item => item._id === selectedItems[0]);
            if (selectedItem) {
                openEditForm(selectedItem);
                document.getElementById('dashboard-root').focus();
            }
        }
    }, [showEditButton, focusedItemIndex, selectedItems, itemsRef]);

    useHotkeys('alt+d', (e) => {
        e.preventDefault();
        if (selectedItems.length > 0) {
            handleBulkDelete();
        }
    });

    useHotkeys('ctrl+shift+a', (e) => {
        e.preventDefault();
        if (itemsRef.current && itemsRef.current.length > 0) {
            const allIds = itemsRef.current.map(item => item._id);
            setSelectedItems(allIds);
        }
    });

    useHotkeys('escape', () => {
        setFormModalOpen(false);
        setViewDetailsOpen(false);

        if (selectedItems.length > 0) {
            setSelectedItems([]);
        } else if (focusedItemIndex >= 0) {
            setFocusedItemIndex(-1);
        }
    });

    useHotkeys('up', (e) => {
        if (!canNavigate) return;
        e.preventDefault();
        if (focusedItemIndex > 0) {
            setFocusedItemIndex(focusedItemIndex - 1);
        }
    }, [canNavigate, focusedItemIndex]);

    useHotkeys('down', (e) => {
        if (!canNavigate) return;
        e.preventDefault();
        if (itemsRef.current && focusedItemIndex < itemsRef.current.length - 1) {
            setFocusedItemIndex(focusedItemIndex + 1);
        }
    }, [canNavigate, focusedItemIndex, itemsRef]);

    useHotkeys('shift+up', (e) => {
        if (!canNavigate) return;
        e.preventDefault();
        if (focusedItemIndex > 0) {
            const newIndex = focusedItemIndex - 1;
            setFocusedItemIndex(newIndex);
            toggleItemSelection(itemsRef.current[newIndex]);
        }
    }, [canNavigate, focusedItemIndex, itemsRef]);

    useHotkeys('shift+down', (e) => {
        if (!canNavigate) return;
        e.preventDefault();
        if (itemsRef.current && focusedItemIndex < itemsRef.current.length - 1) {
            const newIndex = focusedItemIndex + 1;
            setFocusedItemIndex(newIndex);
            toggleItemSelection(itemsRef.current[newIndex]);
        }
    }, [canNavigate, focusedItemIndex, itemsRef]);

    useHotkeys('space,shift+enter', (e) => {
        if (!canNavigate) return;
        e.preventDefault();

        if (isValidIndex) {
            toggleItemSelection(itemsRef.current[focusedItemIndex]);
        } else if (selectedItems.length === 1) {
            const selectedItem = itemsRef.current?.find(item => item._id === selectedItems[0]);
            if (selectedItem) {
                toggleItemSelection(selectedItem);
            }
        }
    }, [canNavigate, isValidIndex, selectedItems, itemsRef, focusedItemIndex, toggleItemSelection]);

    useHotkeys('enter', (e) => {
        e.preventDefault();
        if (!canNavigate) return;

        if (isValidIndex && selectedItems.length <= 1) {
            handleViewDetails(itemsRef.current[focusedItemIndex]);
        } else if (selectedItems.length === 1) {
            const selectedItem = itemsRef.current?.find(item => item._id === selectedItems[0]);
            if (selectedItem) {
                handleViewDetails(selectedItem);
            }
        }
    }, [canNavigate, isValidIndex, selectedItems, itemsRef, focusedItemIndex, handleViewDetails]);
};