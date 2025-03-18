import { useState, useRef, useEffect } from 'react';
import { initialData } from '../data';
import { OperationsData, Operation } from '../types';
import OperationRow from '../components/OperationRow';
import Modal from '../components/Modal';
import { Plus, Save, X, RotateCcw } from 'lucide-react';
import AddOperationPanel from '../components/AddOperationPanel';
import ChangeLog, { ChangeLogEntry } from '../components/ChangeLog';
import CustomizationsOverview from '../components/CustomizationsOverview';
import { v4 as uuidv4 } from 'uuid';

interface FilterOption {
  label: string;
  value: string;
  subOptions?: { label: string; value: string; }[];
}

const filterOptions: FilterOption[] = [
  { label: 'None', value: 'none' },
  {
    label: 'End use group',
    value: 'end_use_group',
    subOptions: [
      { label: 'Food', value: 'food' },
      { label: 'Feed', value: 'feed' },
      { label: 'Industrial', value: 'industrial' }
    ]
  },
  {
    label: 'End use market',
    value: 'end_use_market',
    subOptions: [
      { label: 'Milling', value: 'milling' },
      { label: 'Feed', value: 'feed' }
    ]
  },
  {
    label: 'Varieties',
    value: 'varieties',
    subOptions: [
      { label: 'Skyfall', value: 'skyfall' },
      { label: 'Crusoe', value: 'crusoe' },
      { label: 'KWS Extase', value: 'kws_extase' }
    ]
  }
];

export default function OperationsCenter() {
  const [data, setData] = useState<OperationsData>(initialData);
  const [originalData, setOriginalData] = useState<OperationsData>(initialData);
  const [modifiedOperations, setModifiedOperations] = useState<{
    category: keyof OperationsData;
    index: number | null;
    originalValue: number;
    crop: string; // Add crop information to track which crop was modified
  }[]>([]);
  
  // Change log to track all modifications
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasSavedChanges, setHasSavedChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<'yagro' | 'custom'>('custom');
  const [selectedCrop, setSelectedCrop] = useState<string>('All crops');
  const [originalSelectedCrop, setOriginalSelectedCrop] = useState<string>('All crops');
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const [originalFilter, setOriginalFilter] = useState<string>('none');
  const [selectedSubFilters, setSelectedSubFilters] = useState<string[]>([]);
  const [originalSubFilters, setOriginalSubFilters] = useState<string[]>([]);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showResetOptions, setShowResetOptions] = useState(false);
  const [showResetFilterConfirmation, setShowResetFilterConfirmation] = useState(false);
  const [showResetTableConfirmation, setShowResetTableConfirmation] = useState(false);
  const [showSubFilters, setShowSubFilters] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const [addOperationPanel, setAddOperationPanel] = useState<{
    isOpen: boolean;
    category: keyof OperationsData;
  }>({
    isOpen: false,
    category: 'cultivation'
  });
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: keyof OperationsData;
    index: number | null;
  }>({
    isOpen: false,
    category: 'cultivation',
    index: null,
  });

  useEffect(() => {
    // Load saved data from localStorage on page load
    const savedData = localStorage.getItem('operationsData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setData(parsedData);
        setOriginalData(parsedData);
        setHasSavedChanges(true);
      } catch (error) {
        console.error('Error parsing saved operations data:', error);
        // Fallback to initial data if there's an error
        setData(initialData);
        setOriginalData(initialData);
      }
    }
  }, []);
  useEffect(() => {
    // Check if data has changed from the original data
    const hasDataChanged = JSON.stringify(data) !== JSON.stringify(originalData);
    
    // Also check if the selected crop has changed
    const hasCropChanged = selectedCrop !== originalSelectedCrop;
    
    // Update the hasChanges state based on both conditions
    setHasChanges(hasDataChanged || hasCropChanged);
  }, [data, originalData, selectedCrop, originalSelectedCrop]);

  useEffect(() => {
    localStorage.setItem('operationsData', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowSubFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSaveChanges = () => {
    // Save the current data to localStorage
    localStorage.setItem('operationsData', JSON.stringify(data));
    
    // Update state to reflect saved changes
    setOriginalData(data);
    setOriginalSelectedCrop(selectedCrop);
    setHasChanges(false);
    setHasSavedChanges(true);
    
    // Clear the change log
    setChangeLog([]);
    
    // Update modifiedOperations to reflect the current state compared to initialData
    // This ensures the CustomizationsOverview shows the correct customizations
    const newModifiedOperations = findModifiedOperations(data, initialData);
    setModifiedOperations(newModifiedOperations);
  };

  const handleCancelChanges = () => {
    setShowCancelConfirmation(true);
  };

  const confirmCancelChanges = () => {
    setData(originalData);
    setSelectedCrop(originalSelectedCrop);
    setHasChanges(false);
    setShowCancelConfirmation(false);
    
    // Clear the change log
    setChangeLog([]);
    
    // We need to restore the modifiedOperations to match the original data
    // This ensures that the CustomizationsOverview panel shows the correct customizations
    // after canceling changes
    const newModifiedOperations = findModifiedOperations(originalData, initialData);
    setModifiedOperations(newModifiedOperations);
  };
  
  // Helper function to find modified operations by comparing with initial data
  const findModifiedOperations = (currentData: OperationsData, baseData: OperationsData) => {
    const modified: {
      category: keyof OperationsData;
      index: number | null;
      originalValue: number;
      crop: string;
    }[] = [];
    
    const categories: (keyof OperationsData)[] = ['cultivation', 'drilling', 'application', 'harvesting', 'other'];
    
    // Check all crops
    Object.keys(currentData.crops).forEach(cropName => {
      // Check each operation category
      categories.forEach(category => {
        const currentOperation = currentData[category] as Operation;
        const baseOperation = baseData[category] as Operation;
        
        // Skip if operation doesn't exist
        if (!currentOperation || !baseOperation) return;
        
        // Check main operation
        if (currentOperation.cropData?.[cropName] && baseOperation.cropData?.[cropName]) {
          const currentValue = currentOperation.cropData[cropName].costPerHa;
          const baseValue = baseOperation.cropData[cropName].costPerHa;
          
          // Use a small epsilon for floating point comparison
          const epsilon = 0.001;
          if (Math.abs(currentValue - baseValue) > epsilon) {
            modified.push({
              category,
              index: null,
              originalValue: baseValue,
              crop: cropName
            });
          }
        }
        
        // Check sub-operations
        if (currentOperation.subOperations && baseOperation.subOperations) {
          currentOperation.subOperations.forEach((subOp, index) => {
            if (subOp.cropData?.[cropName]) {
              // Find matching sub-operation in base data
              const baseSubOp = baseOperation.subOperations?.find(op => op.name === subOp.name);
              
              if (baseSubOp?.cropData?.[cropName]) {
                const currentValue = subOp.cropData[cropName].costPerHa;
                const baseValue = baseSubOp.cropData[cropName].costPerHa;
                
                // Use a small epsilon for floating point comparison
                const epsilon = 0.001;
                if (Math.abs(currentValue - baseValue) > epsilon) {
                  modified.push({
                    category,
                    index,
                    originalValue: baseValue,
                    crop: cropName
                  });
                }
              }
            }
          });
        }
      });
    });
    
    return modified;
  };

  const handleCropChange = (newCrop: string) => {
    setSelectedCrop(newCrop);
    setOriginalSelectedCrop(newCrop);
    
    // Reset filters
    setSelectedFilter('none');
    setSelectedSubFilters([]);
    setShowSubFilters(false);
    
    // Reset to full hectares for the new crop
    const fullHectares = data.crops[newCrop]?.hectares || 0;
    const newData = updateDataWithFilteredHectares(data, newCrop, fullHectares);
    const totals = calculateTotalAverages(newData, newCrop);
    
    const finalData = {
      ...newData,
      totalAverageCost: totals.totalAverageCost,
      totalCost: totals.totalCost
    };
    
    setData(finalData);
    setOriginalData(finalData);
  };

  const handleFilterChange = (value: string) => {
    if (selectedFilter === 'none') {
      setOriginalFilter(value);
      setOriginalSubFilters([]);
    }
    setSelectedFilter(value);
    
    // Automatically select all applicable sub-filters for the current crop
    if (value === 'end_use_market' && data.crops[selectedCrop]?.endUseMarket) {
      const availableFilters = Object.keys(data.crops[selectedCrop].endUseMarket);
      setSelectedSubFilters(availableFilters);
      
      // Calculate initial filtered hectares
      const filteredHectares = calculateFilteredHectares(selectedCrop, availableFilters);
      const newData = updateDataWithFilteredHectares(data, selectedCrop, filteredHectares);
      const totals = calculateTotalAverages(newData, selectedCrop);
      const finalData = {
        ...newData,
        totalAverageCost: totals.totalAverageCost,
        totalCost: totals.totalCost
      };
      
      // Update both current and original data
      setData(finalData);
      setOriginalData(finalData);
    } else {
      setSelectedSubFilters([]);
      
      // Reset to full hectares if changing away from end_use_market
      if (value !== 'end_use_market') {
        const fullHectares = data.crops[selectedCrop]?.hectares || 0;
        const newData = updateDataWithFilteredHectares(data, selectedCrop, fullHectares);
        const totals = calculateTotalAverages(newData, selectedCrop);
        const finalData = {
          ...newData,
          totalAverageCost: totals.totalAverageCost,
          totalCost: totals.totalCost
        };
        
        // Update both current and original data
        setData(finalData);
        setOriginalData(finalData);
      }
    }
    
    setShowSubFilters(value !== 'none');
  };

  const calculateFilteredHectares = (cropName: string, selectedFilters: string[]) => {
    const crop = data.crops[cropName];
    if (!crop?.endUseMarket || selectedFilters.length === 0) {
      return crop?.hectares || 0;
    }

    return selectedFilters.reduce((total, filter) => {
      return total + (crop.endUseMarket?.[filter]?.hectares || 0);
    }, 0);
  };

  const updateDataWithFilteredHectares = (
    currentData: OperationsData,
    cropName: string,
    filteredHectares: number
  ) => {
    const categories: (keyof OperationsData)[] = ['cultivation', 'drilling', 'application', 'harvesting', 'other'];
    const newData = { ...currentData };

    categories.forEach(category => {
      const operation = newData[category] as Operation;
      if (operation.cropData?.[cropName]) {
        const costPerHa = operation.cropData[cropName].costPerHa;
        operation.cropData[cropName] = {
          hectares: filteredHectares,
          costPerHa: costPerHa,
          totalCost: costPerHa * filteredHectares
        };

        // Update sub-operations
        operation.subOperations?.forEach(subOp => {
          if (subOp.cropData?.[cropName]) {
            const subCostPerHa = subOp.cropData[cropName].costPerHa;
            subOp.cropData[cropName] = {
              hectares: filteredHectares,
              costPerHa: subCostPerHa,
              totalCost: subCostPerHa * filteredHectares
            };
          }
        });
      }
    });

    return newData;
  };

  const handleSubFilterChange = (value: string) => {
    setSelectedSubFilters(prev => {
      const isSelected = prev.includes(value);
      const newSubFilters = isSelected
        ? prev.filter(v => v !== value)
        : [...prev, value];

      // Calculate new hectares based on selected filters
      const filteredHectares = newSubFilters.length === 0 ? 0 : calculateFilteredHectares(selectedCrop, newSubFilters);
      
      // Update data with new hectares
      const newData = updateDataWithFilteredHectares(data, selectedCrop, filteredHectares);
      
      // Recalculate totals
      const totals = calculateTotalAverages(newData, selectedCrop);
      const finalData = {
        ...newData,
        totalAverageCost: totals.totalAverageCost,
        totalCost: totals.totalCost
      };

      // Update both current and original data to prevent save/cancel buttons
      setData(finalData);
      setOriginalData(finalData);
      
      return newSubFilters;
    });
  };

  const handleAddOperation = (category: keyof OperationsData, newOperation: Omit<Operation, 'totalCost'>) => {
    setData(prev => {
      const operation = prev[category] as Operation;
      const hectares = prev.crops[selectedCrop]?.hectares || 0;
      const totalCost = newOperation.costPerHa * hectares;

      const operationWithCropData = {
        ...newOperation,
        totalCost,
        cropData: {
          [selectedCrop]: {
            hectares,
            costPerHa: newOperation.costPerHa,
            totalCost
          }
        }
      };

      const updatedOperation = {
        ...operation,
        subOperations: [
          ...(operation.subOperations || []),
          operationWithCropData
        ]
      };

      if (updatedOperation.subOperations) {
        const newAvg = calculateCategoryAverage(updatedOperation.subOperations);
        updatedOperation.cropData = {
          ...updatedOperation.cropData,
          [selectedCrop]: {
            hectares,
            costPerHa: newAvg,
            totalCost: newAvg * hectares
          }
        };
      }

      const newData = {
        ...prev,
        [category]: updatedOperation
      };

      const totals = calculateTotalAverages(newData, selectedCrop);
      return {
        ...newData,
        totalAverageCost: totals.totalAverageCost,
        totalCost: totals.totalCost
      };
    });
  };

  const calculateTotalAverages = (newData: OperationsData, cropOverride?: string) => {
    const categories: (keyof OperationsData)[] = ['cultivation', 'drilling', 'application', 'harvesting', 'other'];
    const currentCrop = cropOverride || selectedCrop;
    
    if (currentCrop === 'All crops') {
      // For "All crops", calculate weighted average across all crops
      let allCropsTotal = 0;
      let totalHectares = 0;
      
      Object.entries(newData.crops).forEach(([crop, data]) => {
        if (crop !== 'All crops') {
          let cropTotal = 0;
          categories.forEach(category => {
            const operation = newData[category] as Operation;
            if (operation?.cropData?.[crop]) {
              cropTotal += operation.cropData[crop].totalCost;
            }
          });
          allCropsTotal += cropTotal;
          totalHectares += data.hectares;
        }
      });
      
      const totalAverageCost = totalHectares > 0 ? allCropsTotal / totalHectares : 0;
      
      return {
        totalAverageCost,
        totalCost: allCropsTotal
      };
    } else {
      // For specific crops
      let totalCost = 0;
      let sumCostPerHa = 0;
      
      // Sum up the category costs for the specific crop
      categories.forEach(category => {
        const operation = newData[category] as Operation;
        if (operation && typeof operation === 'object' && operation.cropData?.[currentCrop]) {
          const cropData = operation.cropData[currentCrop];
          sumCostPerHa += cropData.costPerHa;
          totalCost += cropData.totalCost;
        }
      });
      
      return {
        totalAverageCost: sumCostPerHa,
        totalCost
      };
    }
  };

  const calculateCategoryAverage = (subOperations: Operation[]) => {
    const cropOperations = subOperations.filter(op => op.cropData?.[selectedCrop]);
    if (cropOperations.length === 0) return 0;
    
    const totalCostPerHa = cropOperations.reduce((sum, op) => {
      const cropData = op.cropData?.[selectedCrop];
      return sum + (cropData?.costPerHa || 0);
    }, 0);

    return totalCostPerHa;
  };

  const toggleSection = (section: keyof OperationsData) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const confirmDelete = (category: keyof OperationsData, index: number) => {
    if (selectedTemplate === 'yagro') return;
    setDeleteModal({ isOpen: true, category, index });
  };

  const handleDelete = () => {
    const index = deleteModal.index;
    if (index === null || !deleteModal.category) return;
    
    setData(prev => {
      const category = deleteModal.category;
      const operation = prev[category] as Operation;
      
      if (!operation?.subOperations) return prev;
      
      const operationsForCurrentCrop = operation.subOperations.filter(op =>
        op.cropData?.[selectedCrop]
      );
      
      if (index >= operationsForCurrentCrop.length) return prev;
      
      const operationToDelete = operationsForCurrentCrop[index];
      
      const updatedSubOperations = operation.subOperations?.reduce<Operation[]>((acc, op) => {
        if (op === operationToDelete) {
          // Create a new cropData object without the selected crop
          const newCropData = { ...op.cropData };
          if (newCropData && selectedCrop in newCropData) {
            delete newCropData[selectedCrop];
          }
          // Only add to accumulator if there are remaining crop data entries
          if (Object.keys(newCropData || {}).length > 0) {
            acc.push({
              ...op,
              cropData: newCropData
            });
          }
        } else {
          acc.push(op);
        }
        return acc;
      }, []);
      
      const remainingOperations = updatedSubOperations?.filter(op => 
        op.cropData?.[selectedCrop]
      ) || [];
      
      const newAvg = remainingOperations.length > 0
        ? remainingOperations.reduce((sum, op) => {
            const cropData = op.cropData?.[selectedCrop];
            return sum + (cropData?.costPerHa || 0);
          }, 0)
        : 0;
      
      const hectares = prev.crops[selectedCrop]?.hectares || 0;
      
      const updatedOperation = {
        ...operation,
        subOperations: updatedSubOperations,
        cropData: operation.cropData ? {
          ...operation.cropData,
          [selectedCrop]: {
            hectares,
            costPerHa: newAvg,
            totalCost: newAvg * hectares
          }
        } : {
          [selectedCrop]: {
            hectares,
            costPerHa: newAvg,
            totalCost: newAvg * hectares
          }
        }
      };
      
      const newData = {
        ...prev,
        [category]: updatedOperation
      };
      
      const totals = calculateTotalAverages(newData, selectedCrop);
      
      return {
        ...newData,
        totalAverageCost: totals.totalAverageCost,
        totalCost: totals.totalCost
      };
    });
    
    setDeleteModal({ isOpen: false, category: 'cultivation', index: null });
  };

  const handleTemplateChange = (template: 'yagro' | 'custom') => {
    setSelectedTemplate(template);
    if (template === 'yagro') {
      setData(initialData);
      // Clear localStorage when switching to Yagro template
      localStorage.removeItem('operationsData');
      // Clear modified operations tracking
      setModifiedOperations([]);
      setChangeLog([]);
    }
  };

  // Function to add an entry to the change log
  const addToChangeLog = (
    category: keyof OperationsData,
    index: number | null,
    oldValue: number,
    newValue: number
  ) => {
    const operation = data[category] as Operation;
    let operationName = operation.name;
    
    // If it's a sub-operation, get its name
    if (index !== null && operation.subOperations && operation.subOperations[index]) {
      operationName = operation.subOperations[index].name;
    }
    
    const entry: ChangeLogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      category: operation.name,
      operationName,
      oldValue,
      newValue,
      isSubOperation: index !== null
    };
    
    setChangeLog(prev => [entry, ...prev]);
  };
  
  // Function to undo a specific change
  const handleUndoChange = (changeId: string) => {
    const change = changeLog.find(c => c.id === changeId);
    if (!change) return;
    
    // Find the category and index
    const categoryKey = Object.keys(data).find(key => {
      const op = data[key as keyof OperationsData] as Operation;
      return op.name === change.category;
    }) as keyof OperationsData | undefined;
    
    if (!categoryKey) return;
    
    if (change.isSubOperation) {
      // Find the sub-operation index
      const operation = data[categoryKey] as Operation;
      const subOpIndex = operation.subOperations?.findIndex(op => op.name === change.operationName) ?? -1;
      
      if (subOpIndex >= 0) {
        updateSubOperationCost(categoryKey, subOpIndex, change.oldValue, changeId);
      }
    } else {
      updateMainCategoryCost(categoryKey, change.oldValue, changeId);
    }
    
    // Remove this change from the log
    setChangeLog(prev => prev.filter(c => c.id !== changeId));
  };
  
  // Function to clear all changes
  const handleClearChanges = () => {
    // Reset to original data
    setData(originalData);
    setChangeLog([]);
    setModifiedOperations([]);
  };
  
  // Function to reset a specific customization
  const handleResetCustomization = (
    categoryName: string,
    operationName: string,
    cropName: string,
    isSubOperation: boolean
  ) => {
    // Use initialData as the default data source
    const defaultData = initialData;
    
    // Find the category key based on the category name
    const categoryKey = Object.keys(data).find(key => {
      const op = data[key as keyof OperationsData] as Operation;
      return op?.name === categoryName;
    }) as keyof OperationsData | undefined;
    
    if (!categoryKey) return;
    
    // Store the current data state before making changes
    // This allows us to restore it if the user cancels
    const currentDataState = JSON.parse(JSON.stringify(data));
    
    // Create a new data object with the reset values
    setData(prev => {
      const newData = { ...prev };
      const operation = newData[categoryKey] as Operation;
      const defaultOperation = initialData[categoryKey] as Operation;
      
      if (isSubOperation) {
        // Reset a sub-operation
        if (operation.subOperations) {
          const subOpIndex = operation.subOperations.findIndex(op => op.name === operationName);
          
          if (subOpIndex >= 0 && operation.subOperations[subOpIndex].cropData?.[cropName]) {
            const defaultSubOp = defaultOperation.subOperations?.find(op => op.name === operationName);
            
            if (defaultSubOp?.cropData?.[cropName]) {
              const defaultValue = defaultSubOp.cropData[cropName].costPerHa;
              const hectares = prev.crops[cropName]?.hectares || 0;
              
              // Update the sub-operation with the default value
              operation.subOperations[subOpIndex].cropData = {
                ...operation.subOperations[subOpIndex].cropData,
                [cropName]: {
                  hectares,
                  costPerHa: defaultValue,
                  totalCost: defaultValue * hectares
                }
              };
              
              // Recalculate the category average
              const newCategoryTotal = calculateCategoryAverage(operation.subOperations);
              operation.cropData = {
                ...operation.cropData,
                [cropName]: {
                  hectares,
                  costPerHa: newCategoryTotal,
                  totalCost: newCategoryTotal * hectares
                }
              };
            }
          }
        }
      } else {
        // Reset a main operation
        if (operation.cropData?.[cropName] && defaultOperation.cropData?.[cropName]) {
          const defaultValue = defaultOperation.cropData[cropName].costPerHa;
          const hectares = prev.crops[cropName]?.hectares || 0;
          
          // Update the operation with the default value
          operation.cropData[cropName] = {
            hectares,
            costPerHa: defaultValue,
            totalCost: defaultValue * hectares
          };
          
          // If there are sub-operations, reset them to their original baseline values
          if (operation.subOperations && defaultOperation.subOperations) {
            operation.subOperations = operation.subOperations.map(subOp => {
              // Find the matching sub-operation in the default data
              const defaultSubOp = defaultOperation.subOperations?.find(op => op.name === subOp.name);
              
              if (defaultSubOp?.cropData?.[cropName] && subOp.cropData) {
                const defaultSubValue = defaultSubOp.cropData[cropName].costPerHa;
                
                return {
                  ...subOp,
                  cropData: {
                    ...subOp.cropData,
                    [cropName]: {
                      hectares,
                      costPerHa: defaultSubValue,
                      totalCost: defaultSubValue * hectares
                    }
                  }
                };
              }
              return subOp;
            });
          }
        }
      }
      
      // Recalculate totals
      const totals = calculateTotalAverages(newData, cropName);
      return {
        ...newData,
        totalAverageCost: totals.totalAverageCost,
        totalCost: totals.totalCost
      };
    });
    
    // Update modifiedOperations to remove the reset operation and all related operations
    setModifiedOperations(prev => {
      // If resetting a sub-operation, only remove that specific sub-operation
      if (isSubOperation) {
        return prev.filter(op => {
          // Keep everything except the specific sub-operation being reset
          // Get the operation and check if the sub-operation name matches
          const operation = data[op.category] as Operation;
          const subOpName = op.index !== null &&
                           operation.subOperations &&
                           op.index < operation.subOperations.length ?
                           operation.subOperations[op.index].name : '';
          
          return !(op.category === categoryKey &&
                  op.index !== null &&
                  op.crop === cropName &&
                  subOpName === operationName);
        });
      }
      // If resetting a main operation, remove the main operation and all its sub-operations
      else {
        return prev.filter(op => {
          // Keep everything except operations for this category and crop
          return !(op.category === categoryKey && op.crop === cropName);
        });
      }
    });
    
    // Set hasChanges to true so the user can save or cancel
    setHasChanges(true);
    
    // Store the original data so it can be restored if the user cancels
    setOriginalData(currentDataState);
    
    // Add a message to the change log
    const currentOp = data[categoryKey as keyof OperationsData] as Operation;
    const defaultOp = defaultData[categoryKey as keyof OperationsData] as Operation;
    let subOpIndex: number | null = null;
    let currentValue = 0;
    let defaultValue = 0;
    
    if (isSubOperation && currentOp.subOperations) {
      subOpIndex = currentOp.subOperations.findIndex(op => op.name === operationName);
      if (subOpIndex >= 0) {
        // Get the current value
        currentValue = currentOp.subOperations[subOpIndex].cropData?.[cropName]?.costPerHa || 0;
        
        // Find the default value
        const defaultSubOp = defaultOp.subOperations?.find(op => op.name === operationName);
        defaultValue = defaultSubOp?.cropData?.[cropName]?.costPerHa || 0;
      }
    } else {
      // For main operations
      currentValue = currentOp.cropData?.[cropName]?.costPerHa || 0;
      defaultValue = defaultOp.cropData?.[cropName]?.costPerHa || 0;
    }
    
    addToChangeLog(
      categoryKey as keyof OperationsData,
      subOpIndex,
      currentValue, // Current value before reset
      defaultValue  // Default value to reset to
    );
  };
  const updateMainCategoryCost = (
    category: keyof OperationsData,
    newCost: number,
    changeIdToSkip?: string
  ) => {
    if (selectedTemplate === 'yagro') return;
    
    // Store original value if this is the first change
    const operation = data[category] as Operation;
    const currentValue = operation.cropData?.[selectedCrop]?.costPerHa || operation.costPerHa;
    
    // Skip if the value hasn't changed
    if (Math.abs(currentValue - newCost) < 0.001) return;
    
    // Only track the modification if it's not already tracked
    if (!modifiedOperations.some(op => op.category === category && op.index === null && op.crop === selectedCrop)) {
      setModifiedOperations(prev => [...prev, {
        category,
        index: null,
        originalValue: currentValue,
        crop: selectedCrop
      }]);
      
      // Add to change log if it's not an undo operation
      if (!changeIdToSkip) {
        addToChangeLog(category, null, currentValue, newCost);
      }
    }
    
    setData(prev => {
      const newData = { ...prev };
      const operation = newData[category] as Operation;
      const hectares = prev.crops[selectedCrop]?.hectares || 0;
      const totalCost = newCost * hectares;

      operation.cropData = {
        ...operation.cropData,
        [selectedCrop]: {
          hectares,
          costPerHa: newCost,
          totalCost: totalCost
        }
      };

      if (operation.subOperations) {
        const numSubOperations = operation.subOperations.length;
        const costPerOperation = newCost / numSubOperations;
        
        operation.subOperations = operation.subOperations.map(subOp => ({
          ...subOp,
          cropData: {
            ...subOp.cropData,
            [selectedCrop]: {
              hectares,
              costPerHa: costPerOperation,
              totalCost: costPerOperation * hectares
            }
          }
        }));
      }

      const totals = calculateTotalAverages(newData, selectedCrop);
      return {
        ...newData,
        totalAverageCost: totals.totalAverageCost,
        totalCost: totals.totalCost
      };
    });
  };

  const updateSubOperationCost = (
    category: keyof OperationsData,
    index: number,
    newCost: number,
    changeIdToSkip?: string
  ) => {
    if (selectedTemplate === 'yagro') return;
    
    // Store original value if this is the first change
    const operation = data[category] as Operation;
    const subOp = operation.subOperations?.[index];
    const currentValue = subOp?.cropData?.[selectedCrop]?.costPerHa || subOp?.costPerHa || 0;
    
    // Skip if the value hasn't changed
    if (Math.abs(currentValue - newCost) < 0.001) return;
    
    if (!modifiedOperations.some(op => op.category === category && op.index === index && op.crop === selectedCrop)) {
      setModifiedOperations(prev => [...prev, {
        category,
        index,
        originalValue: currentValue,
        crop: selectedCrop
      }]);
      
      // Add to change log if it's not an undo operation
      if (!changeIdToSkip && subOp) {
        addToChangeLog(category, index, currentValue, newCost);
      }
    }
    
    setData(prev => {
      const newData = { ...prev };
      const operation = newData[category] as Operation;
      const hectares = prev.crops[selectedCrop]?.hectares || 0;

      if (operation.subOperations) {
        operation.subOperations = operation.subOperations.map((op, i) => {
          if (i === index) {
            return {
              ...op,
              cropData: {
                ...op.cropData,
                [selectedCrop]: {
                  hectares,
                  costPerHa: newCost,
                  totalCost: newCost * hectares
                }
              }
            };
          }
          return op;
        });

        const newCategoryTotal = calculateCategoryAverage(operation.subOperations);
        operation.cropData = {
          ...operation.cropData,
          [selectedCrop]: {
            hectares,
            costPerHa: newCategoryTotal,
            totalCost: newCategoryTotal * hectares
          }
        };
      }

      const totals = calculateTotalAverages(newData, selectedCrop);
      return {
        ...newData,
        totalAverageCost: totals.totalAverageCost,
        totalCost: totals.totalCost
      };
    });
  };

  const handleResetFilter = () => {
    setShowResetFilterConfirmation(true);
    setShowResetOptions(false);
  };

  const confirmResetFilter = () => {
    // Reset modified operations to their original values
    const updatedData = { ...data };
    
    // Restore all modified operations for the current crop
    modifiedOperations.forEach(({ category, index, originalValue }) => {
      const operation = updatedData[category] as Operation;
      const hectares = data.crops[selectedCrop]?.hectares || 0;

      if (index === null) {
        // Reset main category
        if (operation.cropData) {
          operation.cropData[selectedCrop] = {
            hectares,
            costPerHa: originalValue,
            totalCost: originalValue * hectares
          };
        }
      } else if (operation.subOperations && operation.subOperations[index]) {
        // Reset sub-operation
        const subOp = operation.subOperations[index];
        if (subOp.cropData) {
          subOp.cropData[selectedCrop] = {
            hectares,
            costPerHa: originalValue,
            totalCost: originalValue * hectares
          };
        }
      }
    });

    // Recalculate totals
    const totals = calculateTotalAverages(updatedData, selectedCrop);
    const finalData = {
      ...updatedData,
      totalAverageCost: totals.totalAverageCost,
      totalCost: totals.totalCost
    };

    // Update both current and original data to prevent save/cancel buttons from appearing
    setData(finalData);
    setOriginalData(finalData);
    
    // Clear the modified operations tracking
    setModifiedOperations([]);
    
    // Reset filter UI state
    setSelectedFilter(originalFilter);
    setSelectedSubFilters(originalSubFilters);
    setShowSubFilters(originalFilter !== 'none');
    setShowResetFilterConfirmation(false);
    // Reset the saved changes flag to hide the reset button
    setHasSavedChanges(false);
  };

  const handleResetTable = () => {
    setShowResetTableConfirmation(true);
    setShowResetOptions(false);
  };

  const confirmResetTable = () => {
    // Clear localStorage to ensure we start fresh
    localStorage.removeItem('operationsData');
    
    setData(initialData);
    setOriginalData(initialData);
    setSelectedCrop('All crops');
    setOriginalSelectedCrop('All crops');
    setSelectedFilter('none');
    setSelectedSubFilters([]);
    setHasChanges(false);
    setHasSavedChanges(false);
    setShowResetTableConfirmation(false);
    
    // Clear the change log and modified operations tracking
    setChangeLog([]);
    setModifiedOperations([]);
  };

  const renderOperationCategory = (category: keyof OperationsData) => {
    const operation = data[category] as Operation;
    if (!operation || typeof operation === 'number') return null;

    const cropSpecificData = operation.cropData?.[selectedCrop] || {
      costPerHa: operation.costPerHa,
      totalCost: operation.totalCost
    };

    const displayOperation = {
      ...operation,
      costPerHa: cropSpecificData.costPerHa,
      totalCost: cropSpecificData.totalCost,
      subOperations: operation.subOperations?.filter(op => op.cropData?.[selectedCrop]).map(subOp => ({
        ...subOp,
        costPerHa: subOp.cropData?.[selectedCrop]?.costPerHa || subOp.costPerHa,
        totalCost: subOp.cropData?.[selectedCrop]?.totalCost || subOp.totalCost
      }))
    };

    return (
      <>
        <OperationRow
          operation={displayOperation}
          isExpanded={expandedSections.includes(category)}
          onToggle={() => toggleSection(category)}
          isExpandable={!!displayOperation.subOperations?.length}
          onUpdateCost={(newCost) => updateMainCategoryCost(category, newCost)}
          isEditable={selectedTemplate === 'custom'}
          isModified={modifiedOperations.some(op => op.category === category && op.index === null && op.crop === selectedCrop)}
          initialValue={modifiedOperations.find(op => op.category === category && op.index === null && op.crop === selectedCrop)?.originalValue}
        />
        
        {expandedSections.includes(category) && (
          <>
            {displayOperation.subOperations?.map((op, i) => (
              <div key={i} className="bg-gray-50 pl-8">
                <OperationRow
                  operation={op}
                  isSubOperation={true}
                  onDelete={selectedTemplate === 'custom' ? () => confirmDelete(category, i) : undefined}
                  onUpdateCost={(newCost) => updateSubOperationCost(category, i, newCost)}
                  isEditable={selectedTemplate === 'custom'}
                  isModified={modifiedOperations.some(mod => mod.category === category && mod.index === i && mod.crop === selectedCrop)}
                  initialValue={modifiedOperations.find(mod => mod.category === category && mod.index === i && mod.crop === selectedCrop)?.originalValue}
                />
              </div>
            ))}
            {selectedTemplate === 'custom' && (
              <div className="bg-gray-50 pl-8 pr-4 py-2 border-b border-gray-200">
                <button
                  onClick={() => setAddOperationPanel({ isOpen: true, category })}
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Plus size={16} className="mr-1" />
                  Add operation
                </button>
              </div>
            )}
          </>
        )}
      </>
    );
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">Operations Centre</h1>
        </div>
        <div className="flex items-center gap-4">
          <select className="border border-gray-300 rounded-md p-2">
            <option>2024</option>
          </select>
          <div className="flex gap-2">
            {hasChanges && selectedTemplate === 'custom' && (
              <>
                <button
                  onClick={handleCancelChanges}
                  className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  <Save size={16} className="mr-2" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Changes Made Panel */}
      {changeLog.length > 0 && (
        <ChangeLog
          changes={changeLog}
          onUndoChange={handleUndoChange}
          onClearChanges={handleClearChanges}
        />
      )}
      
      {/* Customizations Overview Panel - always visible */}
      <CustomizationsOverview
        data={data}
        defaultData={initialData}
        onResetCustomization={handleResetCustomization}
      />

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">View/Template</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2"
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value as 'yagro' | 'custom')}
              >
                <option value="custom">Custom Baseline (Editable)</option>
                <option value="yagro">Yagro Baseline (Read-only)</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {selectedTemplate === 'yagro' 
                  ? 'This template is read-only' 
                  : 'You can edit costs in this template'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Crops</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2"
                value={selectedCrop}
                onChange={(e) => handleCropChange(e.target.value)}
              >
                {Object.keys(data.crops).map(crop => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
              </select>
            </div>
            <div className="relative" ref={filterDropdownRef}>
              <label className="block text-sm font-medium text-gray-600 mb-1">Filter by</label>
              <div className="relative">
                <select 
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={selectedFilter}
                  onChange={(e) => handleFilterChange(e.target.value)}
                >
                  {filterOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {showSubFilters && (
                  <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {filterOptions
                      .find(opt => opt.value === selectedFilter)
                      ?.subOptions?.map(subOption => (
                        <label
                          key={subOption.value}
                          className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedSubFilters.includes(subOption.value)}
                            onChange={() => handleSubFilterChange(subOption.value)}
                            className="mr-2"
                          />
                          {subOption.label}
                        </label>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-600 mb-1">Fields</label>
              <div className="flex gap-2">
                <select className="flex-1 border border-gray-300 rounded-md p-2">
                  <option>All</option>
                </select>
                {hasSavedChanges && !hasChanges && (
                  <button
                    onClick={() => setShowResetOptions(!showResetOptions)}
                    className="flex items-center px-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <RotateCcw size={16} />
                  </button>
                )}
                {showResetOptions && (
                  <div className="absolute right-0 mt-10 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <button
                      onClick={handleResetFilter}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-200"
                    >
                      Reset Current Filter
                    </button>
                    <button
                      onClick={handleResetTable}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                    >
                      Reset Entire Table
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          {selectedSubFilters.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSubFilters.map(filter => {
                const subOption = filterOptions
                  .find(opt => opt.value === selectedFilter)
                  ?.subOptions?.find(sub => sub.value === filter);
                return (
                  <span
                    key={filter}
                    className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {subOption?.label}
                    <button
                      onClick={() => handleSubFilterChange(filter)}
                      className="ml-1 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Hectares</div>
              <div className="text-2xl font-bold">{data.crops[selectedCrop]?.hectares || 0}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Cost (£/ha)</div>
              <div className="text-2xl font-bold">£{data.totalAverageCost.toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Total Cost (£)</div>
              <div className="text-2xl font-bold">£{data.totalCost.toLocaleString('en-GB', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4 px-4">
            <div className="flex items-center">
              <div className="flex-1">Operation Category</div>
              <div className="w-48 text-right pr-12">Cost (£/ha)</div>
              <div className="w-48 text-right pr-12">Total Cost (£)</div>
              <div className="w-10"></div>
            </div>
          </div>

          <div className="border rounded-lg">
            {renderOperationCategory('cultivation')}
            {renderOperationCategory('drilling')}
            {renderOperationCategory('application')}
            {renderOperationCategory('harvesting')}
            {renderOperationCategory('other')}
          </div>
        </div>
      </div>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, category: 'cultivation', index: null })}
        onConfirm={handleDelete}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this operation? This action cannot be undone.</p>
      </Modal>

      <Modal
        isOpen={showCancelConfirmation}
        onClose={() => setShowCancelConfirmation(false)}
        onConfirm={confirmCancelChanges}
        title="Confirm Cancel Changes"
      >
        <p>Are you sure you want to cancel all changes? All modifications will be lost.</p>
      </Modal>

      {Object.keys(data).map(category => {
        const isValidCategory = (cat: string): cat is keyof OperationsData => {
          return ['cultivation', 'drilling', 'application', 'harvesting', 'other'].includes(cat);
        };

        if (isValidCategory(category) && typeof data[category] === 'object' && !Array.isArray(data[category]) && category !== 'crops') {
          const operation = data[category] as Operation;
          const existingOperations = operation.subOperations
            ?.filter(op => op.cropData?.[selectedCrop])
            ?.map(op => op.name) || [];
          
          return (
            <AddOperationPanel
              key={category}
              isOpen={addOperationPanel.isOpen && addOperationPanel.category === category}
              onClose={() => setAddOperationPanel({ isOpen: false, category: 'cultivation' })}
              onAdd={(operation) => handleAddOperation(category, operation)}
              categoryName={operation.name}
              existingOperations={existingOperations}
            />
          );
        }
        return null;
      })}

      <Modal
        isOpen={showResetFilterConfirmation}
        onClose={() => setShowResetFilterConfirmation(false)}
        onConfirm={confirmResetFilter}
        title="Confirm Reset Filter"
      >
        <p>Are you sure you want to reset the current filter? This will clear all filter selections.</p>
      </Modal>

      <Modal
        isOpen={showResetTableConfirmation}
        onClose={() => setShowResetTableConfirmation(false)}
        onConfirm={confirmResetTable}
        title="Confirm Reset Table"
      >
        <p>Are you sure you want to reset the entire table? This will reset all data to default values and cannot be undone.</p>
      </Modal>
    </div>
  );
}