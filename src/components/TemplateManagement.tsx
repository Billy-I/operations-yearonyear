import { useState, useEffect } from 'react';
import { Template, FilterCombination, EntityAssignment } from '../types';
import { Save, Plus, Trash2, Edit, Filter, X, RotateCcw, Tag, Layers } from 'lucide-react';

interface TemplateManagementProps {
  templates: Template[];
  currentTemplate: Template | null;
  onSelectTemplate: (template: Template) => void;
  onSaveTemplate: (name: string, saveAsNew: boolean) => void;
  onDeleteTemplate: (templateId: string) => void;
  onRenameTemplate: (templateId: string, newName: string) => void;
  onDeleteFilterCombination?: (filterId: string) => void;
  onDeleteAssignment?: (assignmentId: string) => void;
  onAddAssignment?: (assignment: Omit<EntityAssignment, 'id'>) => void;
  onResetTemplate?: (resetAllFilters: boolean) => void;
  onCancelChanges?: () => void;
  hasChanges: boolean;
  availableEntities?: {
    crops: string[];
    varieties: string[];
    fields: string[];
  };
}

export default function TemplateManagement({
  templates,
  currentTemplate,
  onSelectTemplate,
  onSaveTemplate,
  onDeleteTemplate,
  onRenameTemplate,
  onDeleteFilterCombination,
  onDeleteAssignment,
  onAddAssignment,
  onResetTemplate,
  onCancelChanges,
  hasChanges,
  availableEntities = {
    crops: ['All crops', 'Wheat', 'Barley', 'Oilseed Rape'],
    varieties: ['Skyfall', 'Crusoe', 'KWS Extase'],
    fields: ['Field 1', 'Field 2', 'Field 3']
  }
}: TemplateManagementProps) {
  const [showTemplateOptions, setShowTemplateOptions] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showDeleteFilterConfirmation, setShowDeleteFilterConfirmation] = useState(false);
  const [showDeleteAssignmentConfirmation, setShowDeleteAssignmentConfirmation] = useState(false);
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [resetAllFilters, setResetAllFilters] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [templateToRename, setTemplateToRename] = useState<string | null>(null);
  const [filterToDelete, setFilterToDelete] = useState<string | null>(null);
  const [assignmentToDelete, setAssignmentToDelete] = useState<string | null>(null);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [saveAsNew, setSaveAsNew] = useState(false);
  const [newAssignment, setNewAssignment] = useState<{
    entityType: 'crop' | 'variety' | 'field';
    entityId: string;
    entityName: string;
  }>({
    entityType: 'crop',
    entityId: '',
    entityName: ''
  });
  const [showAssignmentPanel, setShowAssignmentPanel] = useState(false);

  // Reset new template name when the save modal is opened
  useEffect(() => {
    if (showSaveModal) {
      // If we're creating a new template, start with an empty name
      // If we're saving an existing template, use its name
      if (saveAsNew) {
        setNewTemplateName('');
      } else {
        setNewTemplateName(currentTemplate?.name || '');
      }
    }
  }, [showSaveModal, currentTemplate, saveAsNew]);

  const handleSaveTemplate = () => {
    if (newTemplateName.trim()) {
      onSaveTemplate(newTemplateName.trim(), saveAsNew);
      setShowSaveModal(false);
      setNewTemplateName('');
    }
  };

  const handleSaveCurrentTemplate = () => {
    if (currentTemplate) {
      onSaveTemplate(currentTemplate.name, false);
      setShowSaveOptions(false);
      // Show notification
      setShowSaveNotification(true);
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowSaveNotification(false);
      }, 3000);
    }
  };

  const handleDeleteTemplate = () => {
    if (templateToDelete) {
      onDeleteTemplate(templateToDelete);
      setShowDeleteConfirmation(false);
      setTemplateToDelete(null);
    }
  };

  const handleRenameTemplate = () => {
    if (templateToRename && newTemplateName.trim()) {
      onRenameTemplate(templateToRename, newTemplateName.trim());
      setShowRenameModal(false);
      setTemplateToRename(null);
      setNewTemplateName('');
    }
  };

  const confirmDelete = (templateId: string) => {
    setTemplateToDelete(templateId);
    setShowDeleteConfirmation(true);
    setShowTemplateOptions(false);
  };

  const confirmDeleteFilter = (filterId: string) => {
    if (!currentTemplate || !filterId) return;
    
    // Store the ID of the filter to delete
    setFilterToDelete(filterId);
    setShowDeleteFilterConfirmation(true);
  };

  const handleDeleteFilter = () => {
    // Make sure we have all required data
    if (!filterToDelete || !onDeleteFilterCombination || !currentTemplate) {
      setShowDeleteFilterConfirmation(false);
      setFilterToDelete(null);
      return;
    }

    // Call the delete function with the specific filter ID
    onDeleteFilterCombination(filterToDelete);
    
    // Reset states
    setShowDeleteFilterConfirmation(false);
    setFilterToDelete(null);
  };

  const confirmDeleteAssignment = (assignmentId: string) => {
    if (!currentTemplate || !assignmentId) return;
    
    // Store the ID of the assignment to delete
    setAssignmentToDelete(assignmentId);
    setShowDeleteAssignmentConfirmation(true);
  };

  const handleDeleteAssignment = () => {
    // Make sure we have all required data
    if (!assignmentToDelete || !onDeleteAssignment || !currentTemplate) {
      setShowDeleteAssignmentConfirmation(false);
      setAssignmentToDelete(null);
      return;
    }

    // Call the delete function with the specific assignment ID
    onDeleteAssignment(assignmentToDelete);
    
    // Reset states
    setShowDeleteAssignmentConfirmation(false);
    setAssignmentToDelete(null);
  };
  
  const handleAddAssignment = () => {
    if (!onAddAssignment || !newAssignment.entityId) return;
    
    // Find the entity name based on the selected ID
    let entityName = newAssignment.entityId;
    if (newAssignment.entityType === 'crop') {
      entityName = availableEntities.crops.find(c => c === newAssignment.entityId) || newAssignment.entityId;
    } else if (newAssignment.entityType === 'variety') {
      entityName = availableEntities.varieties.find(v => v === newAssignment.entityId) || newAssignment.entityId;
    } else if (newAssignment.entityType === 'field') {
      entityName = availableEntities.fields.find(f => f === newAssignment.entityId) || newAssignment.entityId;
    }
    
    // Call the add function with the new assignment
    onAddAssignment({
      entityType: newAssignment.entityType,
      entityId: newAssignment.entityId,
      entityName: entityName
    });
    
    // Reset the form
    setNewAssignment({
      entityType: 'crop',
      entityId: '',
      entityName: ''
    });
    
    // Close the modal
    setShowAddAssignmentModal(false);
  };

  const confirmReset = (allFilters: boolean) => {
    setResetAllFilters(allFilters);
    setShowResetConfirmation(true);
  };

  const handleResetTemplate = () => {
    if (onResetTemplate) {
      onResetTemplate(resetAllFilters);
      setShowResetConfirmation(false);
    }
  };

  const startRename = (template: Template) => {
    setTemplateToRename(template.id);
    setNewTemplateName(template.name);
    setShowRenameModal(true);
    setShowTemplateOptions(false);
  };

  return (
    <div className="relative">
      <div className="flex flex-col w-full">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={currentTemplate?.id || ''}
              onChange={(e) => {
                const selectedTemplate = templates.find(t => t.id === e.target.value);
                if (selectedTemplate) {
                  onSelectTemplate(selectedTemplate);
                }
              }}
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                  {template.isDefault ? ' (Default)' : ''}
                  {!template.isEditable ? ' (Read-only)' : ''}
                  {template.filterCombinations.length > 1 ? ` (${template.filterCombinations.length} filters)` : ''}
                </option>
              ))}
            </select>
            
            {/* Template action buttons */}
            <div className="absolute right-10 top-2 flex gap-2">
              {/* Reset buttons */}
              {currentTemplate && currentTemplate.isEditable && onResetTemplate && (
                <div className="relative group">
                  <button
                    onClick={() => confirmReset(false)}
                    className="text-gray-500 hover:text-blue-600"
                    title="Reset active filter to Yagro baseline"
                  >
                    <RotateCcw size={16} />
                  </button>
                  
                  {/* Reset options on hover */}
                  <div className="absolute right-0 top-full hidden group-hover:block mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                    <button
                      onClick={() => confirmReset(false)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-200"
                    >
                      Reset Active Filter
                    </button>
                    <button
                      onClick={() => confirmReset(true)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              )}
              
              {/* Delete template button */}
              {currentTemplate && !currentTemplate.isDefault && currentTemplate.isEditable && (
                <button
                  onClick={() => confirmDelete(currentTemplate.id)}
                  className="text-gray-500 hover:text-red-600"
                  title="Delete template"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex gap-1">
            <div className="relative">
              <button
                onClick={() => setShowSaveOptions(!showSaveOptions)}
                disabled={!currentTemplate?.isEditable}
                className={`p-2 rounded-md ${currentTemplate?.isEditable ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                title={currentTemplate?.isEditable ? 'Save template options' : 'This template is not editable'}
              >
                <Save size={16} />
              </button>
              
              {/* Save options dropdown */}
              {showSaveOptions && currentTemplate?.isEditable && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                  {/* Only show "Save in current template" for non-default templates */}
                  {currentTemplate && !currentTemplate.isDefault && (
                    <button
                      onClick={handleSaveCurrentTemplate}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-200"
                    >
                      Save in current template
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setNewTemplateName('');
                      setSaveAsNew(true);
                      setShowSaveModal(true);
                      setShowSaveOptions(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    Save as new template
                  </button>
                </div>
              )}
            </div>
            
            {hasChanges && currentTemplate?.isEditable && (
              <button
                onClick={onCancelChanges}
                className="p-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                title="Cancel changes"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {/* Template Assignments Section */}
        {currentTemplate && (
          <div className="mt-4 border-t pt-3 border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Template Assignments</h3>
              {currentTemplate.isEditable && onAddAssignment && (
                <button
                  onClick={() => setShowAddAssignmentModal(true)}
                  className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded flex items-center"
                >
                  <Plus size={12} className="mr-1" />
                  Add Assignment
                </button>
              )}
            </div>
            
            {/* Assignment tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {currentTemplate.assignments && currentTemplate.assignments.length > 0 ? (
                currentTemplate.assignments.map(assignment => (
                  <div key={assignment.id} className="inline-flex items-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      <Tag size={10} className="mr-1" />
                      <span className="font-medium mr-1">{assignment.entityType}:</span>
                      {assignment.entityName}
                      {currentTemplate.isEditable && onDeleteAssignment && (
                        <button
                          onClick={() => confirmDeleteAssignment(assignment.id)}
                          className="ml-1 text-green-700 hover:text-red-600"
                          title="Remove assignment"
                        >
                          <X size={10} />
                        </button>
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500 italic">No assignments yet. Add one to specify where this template applies.</p>
              )}
            </div>
            
            {/* Visual allocation map */}
            <div className="bg-gray-50 p-2 rounded-md mb-3">
              <div className="text-xs font-medium text-gray-600 mb-1 flex items-center">
                <Layers size={12} className="mr-1" />
                Template Usage Map
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-xs">
                  <div className="font-medium mb-1">Crops</div>
                  <ul className="list-disc list-inside">
                    {currentTemplate.assignments
                      .filter(a => a.entityType === 'crop')
                      .map(a => (
                        <li key={a.id} className="text-gray-700">{a.entityName}</li>
                      ))}
                  </ul>
                </div>
                <div className="text-xs">
                  <div className="font-medium mb-1">Varieties</div>
                  <ul className="list-disc list-inside">
                    {currentTemplate.assignments
                      .filter(a => a.entityType === 'variety')
                      .map(a => (
                        <li key={a.id} className="text-gray-700">{a.entityName}</li>
                      ))}
                  </ul>
                </div>
                <div className="text-xs">
                  <div className="font-medium mb-1">Fields</div>
                  <ul className="list-disc list-inside">
                    {currentTemplate.assignments
                      .filter(a => a.entityType === 'field')
                      .map(a => (
                        <li key={a.id} className="text-gray-700">{a.entityName}</li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Legacy Filter Combinations - kept for backward compatibility */}
        {currentTemplate && currentTemplate.filterCombinations.length > 1 && (
          <div className="mt-2 border-t pt-3 border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Legacy Filters</div>
            <div className="flex flex-wrap gap-2">
              {currentTemplate.filterCombinations.map((filter, index) => {
                const isActive = currentTemplate.activeFilterCombinationId === filter.id;
                return (
                  <div key={filter.id} className="inline-flex items-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300 cursor-pointer'
                      }`}
                      onClick={() => {
                        const updatedTemplate = {
                          ...currentTemplate,
                          activeFilterCombinationId: filter.id
                        };
                        onSelectTemplate(updatedTemplate);
                      }}
                    >
                      <Filter size={12} className="mr-1" />
                      {filter.selectedCrop}
                      {filter.selectedFilter !== 'none' && ` • ${filter.selectedFilter}`}
                    </span>
                    <div className="flex ml-1">
                      {/* Reset button for this specific filter */}
                      {currentTemplate.isEditable && onResetTemplate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isActive) {
                              const updatedTemplate = {
                                ...currentTemplate,
                                activeFilterCombinationId: filter.id
                              };
                              onSelectTemplate(updatedTemplate);
                              setTimeout(() => confirmReset(false), 100);
                            } else {
                              confirmReset(false);
                            }
                          }}
                          className="text-gray-500 hover:text-blue-600 mr-1"
                          title="Reset this filter to Yagro baseline"
                        >
                          <RotateCcw size={12} />
                        </button>
                      )}
                      
                      {/* Show delete button if there's more than one filter */}
                      {currentTemplate.filterCombinations.length > 1 &&
                       onDeleteFilterCombination && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            const filterToDeleteId = filter.id;
                            // Ensure we're only deleting this specific filter
                            if (filterToDeleteId) {
                              confirmDeleteFilter(filterToDeleteId);
                            }
                          }}
                          className="text-gray-500 hover:text-red-600"
                          title="Delete filter"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Save Template Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {saveAsNew ? 'Save as New Template' : 'Save Template'}
            </h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Template Name</label>
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter template name"
                autoFocus
              />
            </div>
            
            {/* We no longer need the checkbox since we have separate buttons for save options */}
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                disabled={!newTemplateName.trim()}
                className={`px-4 py-2 text-white rounded-md ${newTemplateName.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this template? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTemplate}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Notification */}
      {showSaveNotification && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg z-50 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Template saved successfully
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Reset</h2>
            <p className="mb-6">
              {resetAllFilters
                ? "Are you sure you want to reset all filters to Yagro baseline? This action cannot be undone."
                : "Are you sure you want to reset the current filter to Yagro baseline? This action cannot be undone."}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowResetConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResetTemplate}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Filter Confirmation Modal */}
      {showDeleteFilterConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete Filter</h2>
            <p className="mb-6">Are you sure you want to delete this filter? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteFilterConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFilter}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Template Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Rename Template</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">New Template Name</label>
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter new template name"
                autoFocus
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRenameTemplate}
                disabled={!newTemplateName.trim()}
                className={`px-4 py-2 text-white rounded-md ${newTemplateName.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Add Template Assignment</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Entity Type</label>
              <select
                value={newAssignment.entityType}
                onChange={(e) => setNewAssignment({
                  ...newAssignment,
                  entityType: e.target.value as 'crop' | 'variety' | 'field',
                  entityId: ''
                })}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="crop">Crop</option>
                <option value="variety">Variety</option>
                <option value="field">Field</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {newAssignment.entityType === 'crop' ? 'Crop' :
                 newAssignment.entityType === 'variety' ? 'Variety' : 'Field'}
              </label>
              <select
                value={newAssignment.entityId}
                onChange={(e) => setNewAssignment({
                  ...newAssignment,
                  entityId: e.target.value
                })}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select {newAssignment.entityType}</option>
                {newAssignment.entityType === 'crop' &&
                  availableEntities.crops.map(crop => (
                    <option key={crop} value={crop}>{crop}</option>
                  ))
                }
                {newAssignment.entityType === 'variety' &&
                  availableEntities.varieties.map(variety => (
                    <option key={variety} value={variety}>{variety}</option>
                  ))
                }
                {newAssignment.entityType === 'field' &&
                  availableEntities.fields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))
                }
              </select>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddAssignmentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAssignment}
                disabled={!newAssignment.entityId}
                className={`px-4 py-2 text-white rounded-md ${newAssignment.entityId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              >
                Add Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Assignment Confirmation Modal */}
      {showDeleteAssignmentConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete Assignment</h2>
            <p className="mb-6">Are you sure you want to remove this assignment? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteAssignmentConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAssignment}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}