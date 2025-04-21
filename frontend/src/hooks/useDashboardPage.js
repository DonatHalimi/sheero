import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { exportToCSV, exportToExcel, exportToJSON } from '../assets/DataExport';
import { getApiEndpoint } from '../utils/getApiEndpoint';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';

/**
 * A hook that provides all the necessary state and functions to manage the 
 * items on a dashboard page, including keyboard shortcuts for navigation and selection.
 * @param {object} props 
 * @param {function} props.fetchAction - A function that fetches the data for the page
 * @param {string} props.entityName - The name of the entity
 * @param {number} [props.itemsPerPage=100] - The number of items per page
 * @returns {object}
 */
const useDashboardPage = ({
  fetchAction,
  entityName,
  itemsPerPage = 100,
  showEditButton = true,
  showAddButton = true
}) => {
  const dispatch = useDispatch();
  const apiEndpoint = getApiEndpoint(entityName);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletionContext, setDeletionContext] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [focusedItemIndex, setFocusedItemIndex] = useState(-1);
  const itemsRef = useRef([]);

  useEffect(() => {
    dispatch(fetchAction());
  }, [dispatch, fetchAction]);

  const setItems = (items) => {
    itemsRef.current = items;
  };

  const toggleItemSelection = (item) => {
    if (!item) return;

    setSelectedItems(prev => {
      const itemId = item._id;
      const isSelected = prev.includes(itemId);

      if (isSelected) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const openAddForm = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setFormModalOpen(true);
  };

  const openEditForm = (item) => {
    setSelectedItem(item);
    setIsEditing(true);
    setFormModalOpen(true);
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    setViewDetailsOpen(true);
  };

  const closeDrawer = () => {
    setViewDetailsOpen(false);
    setSelectedItem(null);
  };

  const handleEditFromDrawer = (item) => {
    setViewDetailsOpen(false);
    openEditForm(item);
  };

  const handleDeleteFromDrawer = (item) => {
    setViewDetailsOpen(false);
    handleSingleDelete(item);
  };

  const handleSelectItems = (newSelection) => {
    setSelectedItems(newSelection);
  };

  const handleFormSuccess = () => {
    dispatch(fetchAction());
  };

  const handleDeleteSuccess = () => {
    dispatch(fetchAction());
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length > 0) {
      setDeletionContext({
        endpoint: `${apiEndpoint}/delete-bulk`,
        data: { ids: selectedItems },
      });
      setDeleteModalOpen(true);
    }
  };

  const handleSingleDelete = (item) => {
    setDeletionContext({
      endpoint: `${apiEndpoint}/delete/${item._id}`,
      data: null,
    });
    setDeleteModalOpen(true);
  };

  const createExportHandler = (fileName, transformFunction) => {
    return (data, format) => {
      const flattenedData = transformFunction
        ? data.map(transformFunction)
        : data;

      switch (format) {
        case 'excel':
          return exportToExcel(flattenedData, fileName);
        case 'csv':
          return exportToCSV(flattenedData, fileName);
        default:
          return exportToJSON(data, fileName);
      }
    };
  };

  useKeyboardShortcuts({
    // Props
    itemsRef,
    focusedItemIndex,
    selectedItems,
    formModalOpen,
    deleteModalOpen,
    showAddButton,
    showEditButton,

    // Setters
    setSelectedItems,
    setFocusedItemIndex,
    openAddForm,
    openEditForm,
    handleBulkDelete,
    handleViewDetails,
    toggleItemSelection,
    setFormModalOpen,
    setViewDetailsOpen,
  });

  return {
    // State
    selectedItem,
    selectedItems,
    formModalOpen,
    isEditing,
    deleteModalOpen,
    deletionContext,
    currentPage,
    viewDetailsOpen,
    itemsPerPage,
    apiEndpoint,
    focusedItemIndex,

    // Setters
    setCurrentPage,
    setFormModalOpen,
    setDeleteModalOpen,
    setFocusedItemIndex,
    setItems,

    // Handlers
    openAddForm,
    openEditForm,
    handleSelectItems,
    handleEditFromDrawer,
    handleDeleteFromDrawer,
    handleFormSuccess,
    handleDeleteSuccess,
    handleViewDetails,
    closeDrawer,
    handleBulkDelete,
    handleSingleDelete,
    createExportHandler,
    toggleItemSelection,
  };
};

export default useDashboardPage;