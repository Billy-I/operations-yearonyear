import { useState, useRef, useEffect } from 'react';
import { initialData } from '../data';
import { OperationsData, Operation, Template, FilterCombination, EntityAssignment } from '../types';
import OperationRow from '../components/OperationRow';
import Modal from '../components/Modal';
import { Plus, Save, X, RotateCcw } from 'lucide-react';
import AddOperationPanel from '../components/AddOperationPanel';
import TemplateManagement from '../components/TemplateManagement';
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
  // Clear localStorage for templates to start fresh
  useEffect(() => {
    localStorage.removeItem('operationsTemplates');
    localStorage.removeItem('lastUsedTemplate');
  }, []);

  // Template management state
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'yagro-default-readonly',
      name: 'Yagro baseline Read only',
      isDefault: true,
      isEditable: false,
      data: initialData,
      assignments: [
        {
          id: 'default-assignment-readonly',
          entityType: 'crop',
          entityId: 'All crops',
          entityName: 'All crops'
        }
      ],
      filterCombinations: [
        {
          id: 'default-combination-readonly',
          name: 'Default View',
          selectedCrop: 'All crops',
          selectedFilter: 'none',
          selectedSubFilters: []
        }
      ],
      activeFilterCombinationId: 'default-combination-readonly',
      activeAssignmentId: 'default-assignment-readonly'
    },
    {
      id: 'yagro-default-editable',
      name: 'Yagro baseline',
      isDefault: true,
      isEditable: true,
      data: initialData,
      assignments: [
        {
          id: 'default-assignment-editable',
          entityType: 'crop',
          entityId: 'All crops',
          entityName: 'All crops'
        }
      ],
      filterCombinations: [
        {
          id: 'default-combination-editable',
          name: 'Default View',
          selectedCrop: 'All crops',
          selectedFilter: 'none',
          selectedSubFilters: []
        }
      ],
      activeFilterCombinationId: 'default-combination-editable',
      activeAssignmentId: 'default-assignment-editable'
    }
  ]);
  
  // Always start with the editable Yagro baseline template
  const [currentTemplateId, setCurrentTemplateId] = useState<string>('yagro-default-editable');

  // Get the current template
  const currentTemplate = templates.find(t => t.id === currentTemplateId) || templates[0];
  
  // Get the active filter combination
  const getActiveFilterCombination = (template: Template) => {
    if (!template.activeFilterCombinationId || !template.filterCombinations.length) {
      return template.filterCombinations[0];
    }
    return template.filterCombinations.find(fc => fc.id === template.activeFilterCombinationId) ||
           template.filterCombinations[0];
  };
  
  const activeFilterCombination = currentTemplate ? getActiveFilterCombination(currentTemplate) : null;
  
  // Ensure we have valid data by using initialData as a fallback
  const [data, setData] = useState<OperationsData>(currentTemplate?.data || initialData);
  const [originalData, setOriginalData] = useState<OperationsData>(currentTemplate?.data || initialData);
  const [modifiedOperations, setModifiedOperations] = useState<{
    category: keyof OperationsData;
    index: number | null;
    originalValue: number;
  }[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [hasSavedChanges, setHasSavedChanges] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>(activeFilterCombination?.selectedCrop || 'All crops');
  const [originalSelectedCrop, setOriginalSelectedCrop] = useState<string>(activeFilterCombination?.selectedCrop || 'All crops');
  // New approach: track filters by category
  const [selectedFilters, setSelectedFilters] = useState<{[category: string]: string[]}>(() => {
    // Initialize from active filter combination
    if (activeFilterCombination?.selectedFilter && activeFilterCombination.selectedFilter !== 'none') {
      return {
        [activeFilterCombination.selectedFilter]: activeFilterCombination.selectedSubFilters || []
      };
    }
    return {};
  });
  
  const [originalFilters, setOriginalFilters] = useState<{[category: string]: string[]}>(() => {
    // Initialize from active filter combination
    if (activeFilterCombination?.selectedFilter && activeFilterCombination.selectedFilter !== 'none') {
      return {
        [activeFilterCombination.selectedFilter]: activeFilterCombination.selectedSubFilters || []
      };
    }
    return {};
  });
  
  // For backward compatibility
  const [selectedFilter, setSelectedFilter] = useState<string>(activeFilterCombination?.selectedFilter || 'none');
  const [originalFilter, setOriginalFilter] = useState<string>(activeFilterCombination?.selectedFilter || 'none');
  const [selectedSubFilters, setSelectedSubFilters] = useState<string[]>(activeFilterCombination?.selectedSubFilters || []);
  const [originalSubFilters, setOriginalSubFilters] = useState<string[]>(activeFilterCombination?.selectedSubFilters || []);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showResetOptions, setShowResetOptions] = useState(false);
  const [showResetFilterConfirmation, setShowResetFilterConfirmation] = useState(false);
  const [showResetTableConfirmation, setShowResetTableConfirmation] = useState(false);
  const [showSubFilters, setShowSubFilters] = useState((activeFilterCombination?.selectedFilter || 'none') !== 'none');
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

  // Save templates to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('operationsTemplates', JSON.stringify(templates));
  }, [templates]);

  // Save last used template
  useEffect(() => {
    localStorage.setItem('lastUsedTemplate', currentTemplateId);
  }, [currentTemplateId]);

  useEffect(() => {
    const hasDataChanged = JSON.stringify(data) !== JSON.stringify(originalData) ||
                          selectedCrop !== originalSelectedCrop ||
                          JSON.stringify(selectedFilters) !== JSON.stringify(originalFilters);
    setHasChanges(hasDataChanged);
  }, [data, originalData, selectedCrop, originalSelectedCrop, selectedFilters, originalFilters]);

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
    if (!currentTemplate) return;
    
    // Create or update the filter combination
    const newFilterCombination: FilterCombination = {
      id: uuidv4(),
      name: `Filter ${new Date().toLocaleDateString()}`,
      selectedCrop,
      selectedFilter,
      selectedSubFilters: [...selectedSubFilters]
    };
    
    // Check if there's a filter combination with the same settings
    const existingFilterCombination = currentTemplate.filterCombinations.find(fc =>
      fc.selectedCrop === selectedCrop &&
      fc.selectedFilter === selectedFilter &&
      JSON.stringify(fc.selectedSubFilters) === JSON.stringify(selectedSubFilters)
    );
    
    let updatedFilterCombinations;
    let activeFilterCombinationId;
    
    if (existingFilterCombination) {
      // Use the existing filter combination
      updatedFilterCombinations = currentTemplate.filterCombinations;
      activeFilterCombinationId = existingFilterCombination.id;
    } else {
      // Add a new filter combination
      updatedFilterCombinations = [...currentTemplate.filterCombinations, newFilterCombination];
      activeFilterCombinationId = newFilterCombination.id;
    }
    
    // Update the current template with the changes
    const updatedTemplate: Template = {
      ...currentTemplate,
      data: JSON.parse(JSON.stringify(data)),
      filterCombinations: updatedFilterCombinations,
      activeFilterCombinationId
    };
    
    // Update the templates array
    setTemplates(prev =>
      prev.map(t => t.id === currentTemplateId ? updatedTemplate : t)
    );
    
    // Update local state
    setOriginalData(data);
    setOriginalSelectedCrop(selectedCrop);
    setOriginalFilter(selectedFilter);
    setOriginalSubFilters([...selectedSubFilters]);
    setHasChanges(false);
    setHasSavedChanges(true);
  };

  const handleCancelChanges = () => {
    setShowCancelConfirmation(true);
  };

  const confirmCancelChanges = () => {
    setData(originalData);
    setSelectedCrop(originalSelectedCrop);
    setSelectedFilters(originalFilters);
    setSelectedFilter(originalFilter);
    setSelectedSubFilters(originalSubFilters);
    setHasChanges(false);
    setShowCancelConfirmation(false);
  };

  const handleCropChange = (newCrop: string) => {
    setSelectedCrop(newCrop);
    setOriginalSelectedCrop(newCrop);
    
    // Reset filters
    setSelectedFilters({});
    setOriginalFilters({});
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
    // Store original values for change tracking
    if (selectedFilter === 'none') {
      setOriginalFilter(value);
      setOriginalSubFilters([]);
    }
    
    // Update the selected filter
    setSelectedFilter(value);
    
    // In the new UI, we don't automatically clear subfilters when changing filter types
    // This makes the UI more intuitive when users can see all options at once
    
    // Special case for end_use_market - auto-select available filters if none are selected
    if (value === 'end_use_market' &&
        selectedSubFilters.length === 0 &&
        data.crops[selectedCrop]?.endUseMarket) {
      
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
      // For other filter types or when subfilters are already selected,
      // we keep the current subfilters but recalculate hectares
      
      // Calculate hectares based on current selection
      const filteredHectares = selectedSubFilters.length === 0
        ? data.crops[selectedCrop]?.hectares || 0
        : calculateFilteredHectares(selectedCrop, selectedSubFilters);
      
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
    }
    
    // Keep this for backward compatibility
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

  // Template management functions
  const handleSelectTemplate = (template: Template) => {
    // Update the templates array with the new template
    setTemplates(prev =>
      prev.map(t => t.id === template.id ? template : t)
    );
    
    setCurrentTemplateId(template.id);
    setData(template.data);
    setOriginalData(template.data);
    
    // Get the active filter combination
    const activeFilterCombination = getActiveFilterCombination(template);
    
    if (activeFilterCombination) {
      setSelectedCrop(activeFilterCombination.selectedCrop);
      setOriginalSelectedCrop(activeFilterCombination.selectedCrop);
      setSelectedFilter(activeFilterCombination.selectedFilter);
      setOriginalFilter(activeFilterCombination.selectedFilter);
      setSelectedSubFilters(activeFilterCombination.selectedSubFilters);
      setOriginalSubFilters(activeFilterCombination.selectedSubFilters);
      setShowSubFilters(activeFilterCombination.selectedFilter !== 'none');
      
      // Initialize selectedFilters from the active filter combination
      if (activeFilterCombination.selectedFilter !== 'none' && activeFilterCombination.selectedSubFilters.length > 0) {
        const newSelectedFilters = {
          [activeFilterCombination.selectedFilter]: [...activeFilterCombination.selectedSubFilters]
        };
        setSelectedFilters(newSelectedFilters);
        setOriginalFilters(newSelectedFilters);
      } else {
        setSelectedFilters({});
        setOriginalFilters({});
      }
    }
    
    setHasChanges(false);
    setHasSavedChanges(false);
  };
  
  // Template assignment management
  const handleAddAssignment = (assignment: Omit<EntityAssignment, 'id'>) => {
    if (!currentTemplate) return;
    
    // Create a new assignment with a unique ID
    const newAssignment: EntityAssignment = {
      ...assignment,
      id: uuidv4()
    };
    
    // Add the assignment to the current template
    const updatedTemplate: Template = {
      ...currentTemplate,
      assignments: [...currentTemplate.assignments, newAssignment],
      activeAssignmentId: newAssignment.id
    };
    
    // Update the templates array
    setTemplates(prev =>
      prev.map(t => t.id === currentTemplateId ? updatedTemplate : t)
    );
    
    // If the assignment is for a crop, update the selected crop
    if (assignment.entityType === 'crop') {
      setSelectedCrop(assignment.entityId);
      setOriginalSelectedCrop(assignment.entityId);
    }
  };
  
  const handleDeleteAssignment = (assignmentId: string) => {
    if (!currentTemplate) return;
    
    // Find the assignment to delete
    const assignmentToDelete = currentTemplate.assignments.find(a => a.id === assignmentId);
    if (!assignmentToDelete) return;
    
    // Create a new template without the assignment
    const updatedTemplate: Template = {
      ...currentTemplate,
      assignments: currentTemplate.assignments.filter(a => a.id !== assignmentId)
    };
    
    // If the active assignment is being deleted, set a new active assignment
    if (currentTemplate.activeAssignmentId === assignmentId && updatedTemplate.assignments.length > 0) {
      updatedTemplate.activeAssignmentId = updatedTemplate.assignments[0].id;
    } else if (updatedTemplate.assignments.length === 0) {
      updatedTemplate.activeAssignmentId = undefined;
    }
    
    // Update the templates array
    setTemplates(prev =>
      prev.map(t => t.id === currentTemplateId ? updatedTemplate : t)
    );
  };

  const handleSaveTemplate = (name: string, saveAsNew: boolean) => {
    // Create a new filter combination with current state
    const newFilterCombination: FilterCombination = {
      id: uuidv4(),
      name: `Filter ${new Date().toLocaleDateString()}`,
      selectedCrop,
      selectedFilter,
      selectedSubFilters: [...selectedSubFilters]
    };

    // Create or update the template
    let templateData: Template;
    
    if (saveAsNew) {
      // Create a new template
      templateData = {
        id: uuidv4(),
        name: name,
        isDefault: false,
        isEditable: true,
        data: JSON.parse(JSON.stringify(data)),
        assignments: [
          {
            id: uuidv4(),
            entityType: 'crop',
            entityId: selectedCrop,
            entityName: selectedCrop
          }
        ],
        filterCombinations: [newFilterCombination],
        activeFilterCombinationId: newFilterCombination.id,
        activeAssignmentId: uuidv4()
      };
      
      // Add new template
      setTemplates(prev => [...prev, templateData]);
      setCurrentTemplateId(templateData.id);
    } else {
      // Update existing template
      const existingTemplate = templates.find(t => t.id === currentTemplateId);
      if (!existingTemplate) return;
      
      // Check if there's a filter combination with the same settings
      const existingFilterCombination = existingTemplate.filterCombinations.find(fc =>
        fc.selectedCrop === selectedCrop &&
        fc.selectedFilter === selectedFilter &&
        JSON.stringify(fc.selectedSubFilters) === JSON.stringify(selectedSubFilters)
      );
      
      if (existingFilterCombination) {
        // Update the existing filter combination
        templateData = {
          ...existingTemplate,
          name: name,
          data: JSON.parse(JSON.stringify(data)),
          activeFilterCombinationId: existingFilterCombination.id
        };
      } else {
        // Add a new filter combination
        templateData = {
          ...existingTemplate,
          name: name,
          data: JSON.parse(JSON.stringify(data)),
          filterCombinations: [...existingTemplate.filterCombinations, newFilterCombination],
          activeFilterCombinationId: newFilterCombination.id
        };
      }
      
      // Update the template
      setTemplates(prev =>
        prev.map(t => t.id === currentTemplateId ? templateData : t)
      );
    }

    // Reset change tracking
    setOriginalData(data);
    setOriginalSelectedCrop(selectedCrop);
    setOriginalFilter(selectedFilter);
    setOriginalSubFilters([...selectedSubFilters]);
    setOriginalFilters({...selectedFilters});
    setHasChanges(false);
    setHasSavedChanges(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    // Don't allow deleting the default template
    const templateToDelete = templates.find(t => t.id === templateId);
    if (!templateToDelete || templateToDelete.isDefault) return;

    // Remove the template
    setTemplates(prev => prev.filter(t => t.id !== templateId));

    // If the current template is being deleted, switch to the default template
    if (currentTemplateId === templateId) {
      const defaultTemplate = templates.find(t => t.isDefault) || templates[0];
      handleSelectTemplate(defaultTemplate);
    }
  };

  const handleRenameTemplate = (templateId: string, newName: string) => {
    setTemplates(prev =>
      prev.map(t => t.id === templateId ? { ...t, name: newName } : t)
    );
  };

  const handleResetTemplate = (resetAllFilters: boolean) => {
    if (!currentTemplate || !currentTemplate.isEditable) return;
    
    // Find the default template to get baseline data
    const defaultTemplate = templates.find(t => t.isDefault);
    if (!defaultTemplate) return;
    
    // Get the current template
    const templateToUpdate = templates.find(t => t.id === currentTemplateId);
    if (!templateToUpdate) return;
    
    if (resetAllFilters) {
      // Reset all filter combinations to use the default template data
      const updatedTemplate = {
        ...templateToUpdate,
        data: JSON.parse(JSON.stringify(defaultTemplate.data))
      };
      
      // Update the templates array
      setTemplates(prev =>
        prev.map(t => t.id === currentTemplateId ? updatedTemplate : t)
      );
      
      // Update the current data
      setData(updatedTemplate.data);
      setOriginalData(updatedTemplate.data);
    } else {
      // Reset only the current filter combination
      // Create a new data object with the current filter's data reset to default
      const newData = JSON.parse(JSON.stringify(data));
      
      // Get the categories to reset
      const categories: (keyof OperationsData)[] = ['cultivation', 'drilling', 'application', 'harvesting', 'other'];
      
      // Reset each category's data for the current crop
      categories.forEach(category => {
        const defaultOperation = defaultTemplate.data[category] as Operation;
        const currentOperation = newData[category] as Operation;
        
        if (defaultOperation?.cropData?.[selectedCrop] && currentOperation) {
          // Reset the main category data
          currentOperation.cropData = {
            ...currentOperation.cropData,
            [selectedCrop]: JSON.parse(JSON.stringify(defaultOperation.cropData[selectedCrop]))
          };
          
          // Reset sub-operations if they exist
          if (defaultOperation.subOperations && currentOperation.subOperations) {
            currentOperation.subOperations = currentOperation.subOperations.map(subOp => {
              if (subOp.cropData?.[selectedCrop]) {
                const defaultSubOp = defaultOperation.subOperations?.find(op => op.name === subOp.name);
                if (defaultSubOp?.cropData?.[selectedCrop]) {
                  return {
                    ...subOp,
                    cropData: {
                      ...subOp.cropData,
                      [selectedCrop]: JSON.parse(JSON.stringify(defaultSubOp.cropData[selectedCrop]))
                    }
                  };
                }
              }
              return subOp;
            });
          }
        }
      });
      
      // Recalculate totals
      const totals = calculateTotalAverages(newData, selectedCrop);
      const finalData = {
        ...newData,
        totalAverageCost: totals.totalAverageCost,
        totalCost: totals.totalCost
      };
      
      // Update the current template with the reset data
      const updatedTemplate = {
        ...templateToUpdate,
        data: finalData
      };
      
      // Update the templates array
      setTemplates(prev =>
        prev.map(t => t.id === currentTemplateId ? updatedTemplate : t)
      );
      
      // Update the current data
      setData(finalData);
      setOriginalData(finalData);
    }
    
    // Reset modified operations tracking
    setModifiedOperations([]);
    setHasChanges(false);
    setHasSavedChanges(false);
  };

  const handleDeleteFilterCombination = (filterId: string) => {
    console.log("Attempting to delete filter ID:", filterId);
    
    // Basic validation
    if (!currentTemplate || !filterId) {
      console.error("Missing template or filter ID");
      return;
    }
    
    // Create a deep copy of the template to avoid unintended mutations
    const templateCopy = JSON.parse(JSON.stringify(currentTemplate));
    
    // Log all filter combinations before deletion
    console.log("Before deletion - All filters:", templateCopy.filterCombinations.map((fc: FilterCombination) => ({
      id: fc.id,
      crop: fc.selectedCrop,
      filter: fc.selectedFilter
    })));
    
    // Find the filter to delete by ID - be very explicit
    const filterToDelete = templateCopy.filterCombinations.find((fc: FilterCombination) => fc.id === filterId);
    if (!filterToDelete) {
      console.error("Filter not found with ID:", filterId);
      return;
    }
    
    console.log("Found filter to delete:", filterToDelete.selectedCrop, filterToDelete.selectedFilter);
    
    // Don't delete if it's the last filter combination
    if (templateCopy.filterCombinations.length <= 1) {
      console.error("Cannot delete the last filter");
      return;
    }
    
    // Only keep filters that don't match the exact ID we want to delete
    const remainingFilters = templateCopy.filterCombinations.filter((fc: FilterCombination) => fc.id !== filterId);
    
    console.log("After deletion - Remaining filters:", remainingFilters.map((fc: FilterCombination) => ({
      id: fc.id,
      crop: fc.selectedCrop,
      filter: fc.selectedFilter
    })));
    
    // Update active filter ID if needed
    let newActiveId = templateCopy.activeFilterCombinationId;
    if (newActiveId === filterId) {
      newActiveId = remainingFilters[0].id;
      console.log("Updated active filter ID to:", newActiveId);
    }
    
    // Create brand new template with the modified filters
    const updatedTemplate: Template = {
      ...templateCopy,
      filterCombinations: remainingFilters,
      activeFilterCombinationId: newActiveId
    };
    
    // Update the templates state with the new template object
    setTemplates(prevTemplates => {
      // Create a new array to avoid mutation
      return prevTemplates.map(template =>
        template.id === currentTemplate.id ? updatedTemplate : template
      );
    });
    
    // Update current view if we're on the affected template
    if (currentTemplateId === currentTemplate.id) {
      const newActiveFilter = remainingFilters.find((fc: FilterCombination) => fc.id === newActiveId);
      if (newActiveFilter) {
        console.log("Updating current view with new active filter:", newActiveFilter.selectedCrop, newActiveFilter.selectedFilter);
        
        // Update all related state
        setSelectedCrop(newActiveFilter.selectedCrop);
        setOriginalSelectedCrop(newActiveFilter.selectedCrop);
        setSelectedFilter(newActiveFilter.selectedFilter);
        setOriginalFilter(newActiveFilter.selectedFilter);
        setSelectedSubFilters([...newActiveFilter.selectedSubFilters]);
        setOriginalSubFilters([...newActiveFilter.selectedSubFilters]);
        setShowSubFilters(newActiveFilter.selectedFilter !== 'none');
      }
    }
  };

  const confirmDelete = (category: keyof OperationsData, index: number) => {
    if (!currentTemplate.isEditable) return;
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

  // This function is no longer needed as we use handleSelectTemplate instead

  const updateMainCategoryCost = (category: keyof OperationsData, newCost: number) => {
    if (!currentTemplate.isEditable) return;
    
    // Store original value if this is the first change
    const operation = data[category] as Operation;
    const currentValue = operation.cropData?.[selectedCrop]?.costPerHa || operation.costPerHa;
    if (!modifiedOperations.some(op => op.category === category && op.index === null)) {
      setModifiedOperations(prev => [...prev, {
        category,
        index: null,
        originalValue: currentValue
      }]);
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

  const updateSubOperationCost = (category: keyof OperationsData, index: number, newCost: number) => {
    if (!currentTemplate.isEditable) return;
    
    // Store original value if this is the first change
    const operation = data[category] as Operation;
    const subOp = operation.subOperations?.[index];
    const currentValue = subOp?.cropData?.[selectedCrop]?.costPerHa || subOp?.costPerHa || 0;
    
    if (!modifiedOperations.some(op => op.category === category && op.index === index)) {
      setModifiedOperations(prev => [...prev, {
        category,
        index,
        originalValue: currentValue
      }]);
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
    setSelectedFilters(originalFilters);
    setSelectedFilter(originalFilter);
    setSelectedSubFilters(originalSubFilters);
    
    // Keep this for backward compatibility
    setShowSubFilters(originalFilter !== 'none');
    
    // Close the confirmation modal
    setShowResetFilterConfirmation(false);
    
    // Reset the saved changes flag to hide the reset button
    setHasSavedChanges(false);
    
    // Display a temporary success message (optional)
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center';
    successMessage.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      Filter reset successfully
    `;
    document.body.appendChild(successMessage);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
  };

  const handleResetTable = () => {
    setShowResetTableConfirmation(true);
    setShowResetOptions(false);
  };

  const confirmResetTable = () => {
    // Find the default template
    const defaultTemplate = templates.find(t => t.isDefault) || templates[0];
    
    // Switch to the default template
    handleSelectTemplate(defaultTemplate);
    
    // Reset UI state
    setHasChanges(false);
    setHasSavedChanges(false);
    setShowResetTableConfirmation(false);
    
    // Display a temporary success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center';
    successMessage.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      Table reset to default values
    `;
    document.body.appendChild(successMessage);
    
    // Remove the message after 3 seconds
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage);
      }
    }, 3000);
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
          isEditable={currentTemplate.isEditable}
        />
        
        {expandedSections.includes(category) && (
          <>
            {displayOperation.subOperations?.map((op, i) => (
              <div key={i} className="bg-gray-50 pl-8">
                <OperationRow 
                  operation={op}
                  isSubOperation={true}
                  onDelete={currentTemplate.isEditable ? () => confirmDelete(category, i) : undefined}
                  onUpdateCost={(newCost) => updateSubOperationCost(category, i, newCost)}
                  isEditable={currentTemplate.isEditable}
                />
              </div>
            ))}
            {currentTemplate.isEditable && (
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
        </div>
      </div>

      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          {/* Two-panel layout: Template selection & Application */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left panel: Template selection */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Template Selection</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">View/Template</label>
                <TemplateManagement
                  templates={templates}
                  currentTemplate={currentTemplate}
                  onSelectTemplate={handleSelectTemplate}
                  onSaveTemplate={handleSaveTemplate}
                  onDeleteTemplate={handleDeleteTemplate}
                  onRenameTemplate={handleRenameTemplate}
                  onDeleteFilterCombination={handleDeleteFilterCombination}
                  onDeleteAssignment={handleDeleteAssignment}
                  onAddAssignment={handleAddAssignment}
                  onResetTemplate={handleResetTemplate}
                  onCancelChanges={handleCancelChanges}
                  hasChanges={hasChanges}
                  availableEntities={{
                    crops: Object.keys(data.crops),
                    varieties: ['Skyfall', 'Crusoe', 'KWS Extase'],
                    fields: ['Field 1', 'Field 2', 'Field 3']
                  }}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {!currentTemplate.isEditable
                    ? 'This template is read-only'
                    : 'You can edit costs in this template'}
                </p>
              </div>
              
              {/* Simple Reset Options */}
              <div className="mt-4">
                {hasSavedChanges && !hasChanges && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleResetFilter}
                      className="text-sm px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 flex items-center"
                    >
                      <RotateCcw size={14} className="mr-1.5" />
                      Reset Current View
                    </button>
                    <button
                      onClick={handleResetTable}
                      className="text-sm px-3 py-1.5 border border-red-200 text-red-700 rounded hover:bg-red-50 flex items-center"
                    >
                      <RotateCcw size={14} className="mr-1.5" />
                      Reset Entire Table
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right panel: Template Application */}
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Template Application</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Apply to Crop</label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={selectedCrop}
                    onChange={(e) => handleCropChange(e.target.value)}
                  >
                    {data && data.crops ? Object.keys(data.crops).map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    )) : null}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Apply to Fields</label>
                  <select className="w-full border border-gray-300 rounded-md p-2">
                    <option>All Fields</option>
                  </select>
                </div>
              </div>
              
              {/* Simplified filtering approach */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-600 mb-2">Filter by Characteristics</label>
                <div className="grid grid-cols-3 gap-3">
                  {filterOptions.filter(opt => opt.value !== 'none').map(option => (
                    <div key={option.value} className="border border-gray-200 rounded p-3">
                      <p className="font-medium text-sm mb-2">{option.label}</p>
                      <div className="space-y-1.5">
                        {option.subOptions?.map(subOption => (
                          <label key={subOption.value} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={(selectedFilters[option.value] || []).includes(subOption.value)}
                              onChange={() => {
                                // Create a new copy of the selectedFilters object
                                const newSelectedFilters = { ...selectedFilters };
                                
                                // Initialize the array for this filter category if it doesn't exist
                                if (!newSelectedFilters[option.value]) {
                                  newSelectedFilters[option.value] = [];
                                }
                                
                                // Toggle the subfilter value
                                const isSelected = newSelectedFilters[option.value].includes(subOption.value);
                                if (isSelected) {
                                  // Remove the value if it's already selected
                                  newSelectedFilters[option.value] = newSelectedFilters[option.value]
                                    .filter(val => val !== subOption.value);
                                  
                                  // Remove the category entirely if it's empty
                                  if (newSelectedFilters[option.value].length === 0) {
                                    delete newSelectedFilters[option.value];
                                  }
                                } else {
                                  // Add the value if it's not selected
                                  newSelectedFilters[option.value] = [
                                    ...newSelectedFilters[option.value],
                                    subOption.value
                                  ];
                                }
                                
                                // Update the state
                                setSelectedFilters(newSelectedFilters);
                                setOriginalFilters(newSelectedFilters);
                                
                                // For backward compatibility
                                if (Object.keys(newSelectedFilters).length > 0) {
                                  const lastCategory = Object.keys(newSelectedFilters)[0];
                                  setSelectedFilter(lastCategory);
                                  setSelectedSubFilters(newSelectedFilters[lastCategory] || []);
                                  
                                  // Add variety assignments when varieties are selected
                                  if (lastCategory === 'varieties' && currentTemplate && currentTemplate.isEditable) {
                                    // Add each selected variety as an assignment
                                    newSelectedFilters[lastCategory].forEach(varietyValue => {
                                      const varietyOption = filterOptions.find(opt => opt.value === 'varieties')?.subOptions?.find(sub => sub.value === varietyValue);
                                      if (varietyOption) {
                                        // Check if this variety is already assigned
                                        const existingAssignment = currentTemplate.assignments.find(
                                          a => a.entityType === 'variety' && a.entityId === varietyValue
                                        );
                                        
                                        // Only add if not already assigned
                                        if (!existingAssignment) {
                                          handleAddAssignment({
                                            entityType: 'variety',
                                            entityId: varietyValue,
                                            entityName: varietyOption.label
                                          });
                                        }
                                      }
                                    });
                                  }
                                } else {
                                  setSelectedFilter('none');
                                  setSelectedSubFilters([]);
                                }
                                
                                // Calculate hectares based on all selected filters
                                let allSelectedSubFilters: string[] = [];
                                Object.values(newSelectedFilters).forEach(filters => {
                                  allSelectedSubFilters = [...allSelectedSubFilters, ...filters];
                                });
                                
                                const filteredHectares = allSelectedSubFilters.length === 0
                                  ? data.crops[selectedCrop]?.hectares || 0
                                  : calculateFilteredHectares(selectedCrop, allSelectedSubFilters);
                                
                                const newData = updateDataWithFilteredHectares(data, selectedCrop, filteredHectares);
                                const totals = calculateTotalAverages(newData, selectedCrop);
                                const finalData = {
                                  ...newData,
                                  totalAverageCost: totals.totalAverageCost,
                                  totalCost: totals.totalCost
                                };
                                
                                // Update data
                                setData(finalData);
                                setOriginalData(finalData);
                              }}
                              className="mr-2"
                            />
                            {subOption.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Display active filters as tags */}
          {Object.keys(selectedFilters).length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-600 mr-2">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(selectedFilters).map(([category, filters]) => {
                    const categoryOption = filterOptions.find(opt => opt.value === category);
                    return filters.map(filter => {
                      const subOption = categoryOption?.subOptions?.find(sub => sub.value === filter);
                      return (
                        <span
                          key={`${category}-${filter}`}
                          className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                        >
                          <span className="font-medium mr-1">{categoryOption?.label}:</span> {subOption?.label}
                          <button
                            onClick={() => {
                              // Create a new copy of the selectedFilters object
                              const newSelectedFilters = { ...selectedFilters };
                              
                              // Remove this filter
                              newSelectedFilters[category] = newSelectedFilters[category].filter(f => f !== filter);
                              
                              // Remove the category if it's empty
                              if (newSelectedFilters[category].length === 0) {
                                delete newSelectedFilters[category];
                              }
                              
                              // Update the state
                              setSelectedFilters(newSelectedFilters);
                              setOriginalFilters(newSelectedFilters);
                              
                              // For backward compatibility
                              if (Object.keys(newSelectedFilters).length > 0) {
                                const lastCategory = Object.keys(newSelectedFilters)[0];
                                setSelectedFilter(lastCategory);
                                setSelectedSubFilters(newSelectedFilters[lastCategory] || []);
                                
                                // Add variety assignments when varieties are selected
                                if (lastCategory === 'varieties' && currentTemplate && currentTemplate.isEditable) {
                                  // Add each selected variety as an assignment
                                  newSelectedFilters[lastCategory].forEach(varietyValue => {
                                    const varietyOption = filterOptions.find(opt => opt.value === 'varieties')?.subOptions?.find(sub => sub.value === varietyValue);
                                    if (varietyOption) {
                                      // Check if this variety is already assigned
                                      const existingAssignment = currentTemplate.assignments.find(
                                        a => a.entityType === 'variety' && a.entityId === varietyValue
                                      );
                                      
                                      // Only add if not already assigned
                                      if (!existingAssignment) {
                                        handleAddAssignment({
                                          entityType: 'variety',
                                          entityId: varietyValue,
                                          entityName: varietyOption.label
                                        });
                                      }
                                    }
                                  });
                                }
                              } else {
                                setSelectedFilter('none');
                                setSelectedSubFilters([]);
                              }
                              
                              // Calculate hectares based on all selected filters
                              let allSelectedSubFilters: string[] = [];
                              Object.values(newSelectedFilters).forEach(filters => {
                                allSelectedSubFilters = [...allSelectedSubFilters, ...filters];
                              });
                              
                              const filteredHectares = allSelectedSubFilters.length === 0
                                ? data.crops[selectedCrop]?.hectares || 0
                                : calculateFilteredHectares(selectedCrop, allSelectedSubFilters);
                              
                              const newData = updateDataWithFilteredHectares(data, selectedCrop, filteredHectares);
                              const totals = calculateTotalAverages(newData, selectedCrop);
                              const finalData = {
                                ...newData,
                                totalAverageCost: totals.totalAverageCost,
                                totalCost: totals.totalCost
                              };
                              
                              // Update data
                              setData(finalData);
                              setOriginalData(finalData);
                            }}
                            className="ml-1 hover:text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      );
                    });
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 p-6">
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Hectares</div>
              <div className="text-2xl font-bold">{data && data.crops && data.crops[selectedCrop]?.hectares || 0}</div>
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