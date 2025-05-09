import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { UserFieldGroup, FmsFieldGroup } from '../types';
import { FieldData } from '../data/fieldData';
import * as fieldGroupService from '../services/fieldGroupService';
import FieldGroupListItem from '../components/fieldGroups/FieldGroupListItem';
import FieldGroupPanel from '../components/fieldGroups/FieldGroupPanel';
import ViewFieldGroupPanel from '../components/fieldGroups/ViewFieldGroupPanel';

const FieldGroupsPage: React.FC = () => {
  const [userGroups, setUserGroups] = useState<UserFieldGroup[]>([]);
  const [fmsGroups, setFmsGroups] = useState<FmsFieldGroup[]>([]);
  const [allFields, setAllFields] = useState<FieldData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState<boolean>(false);
  const [editingGroup, setEditingGroup] = useState<Partial<UserFieldGroup> | null>(null);
  const [isViewPanelOpen, setIsViewPanelOpen] = useState<boolean>(false);
  const [viewingGroup, setViewingGroup] = useState<UserFieldGroup | FmsFieldGroup | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIsLoading(true);
    setError(null);
    try {
      setUserGroups(fieldGroupService.getUserFieldGroups());
      setFmsGroups(fieldGroupService.getFmsFieldGroups());
      setAllFields(fieldGroupService.getAllFields());
    } catch (err) {
      console.error("Error loading field group data:", err);
      setError("Failed to load field group data. Please try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsEditPanelOpen(true);
  };

  const handleEditGroup = (group: UserFieldGroup) => {
    setEditingGroup(group);
    setIsEditPanelOpen(true);
  };

  const handleCopyGroup = (groupToCopy: UserFieldGroup | FmsFieldGroup) => {
    const newGroupData: Partial<UserFieldGroup> = {
      name: `Copy of ${groupToCopy.name}`,
      fieldIds: [...groupToCopy.fieldIds],
    };
    if ('readonly' in groupToCopy && groupToCopy.readonly) {
      newGroupData.isFmsCopy = true;
      newGroupData.originalFmsId = groupToCopy.id;
    }
    setEditingGroup(newGroupData);
    setIsEditPanelOpen(true);
  };

  const handleSaveGroup = (groupToSave: UserFieldGroup) => {
    try {
      fieldGroupService.saveUserFieldGroup(groupToSave);
      loadData();
      setIsEditPanelOpen(false);
      setEditingGroup(null);
    } catch (err) {
      console.error("Error saving group:", err);
      setError("Failed to save group. Please try again.");
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this field group?")) {
      try {
        fieldGroupService.deleteUserFieldGroup(groupId);
        loadData();
      } catch (err) {
        console.error("Error deleting group:", err);
        setError("Failed to delete group.");
      }
    }
  };

  const handleViewGroup = (groupToView: UserFieldGroup | FmsFieldGroup) => {
    setViewingGroup(groupToView);
    setIsViewPanelOpen(true);
  };

  if (isLoading) {
    return <div className="p-4">Loading field groups...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Field Groups</h1>
        <button
          onClick={handleCreateGroup}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <PlusCircle size={20} className="mr-2" />
          Create New Group
        </button>
      </div>

      {/* User-Created Groups Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">My Field Groups</h2>
        {userGroups.length === 0 ? (
          <p className="text-gray-500">You haven't created any field groups yet.</p>
        ) : (
          <div className="space-y-3">
            {userGroups.map(group => (
              <FieldGroupListItem
                key={group.id}
                group={group}
                onEdit={handleEditGroup}
                onCopy={handleCopyGroup}
                onDelete={handleDeleteGroup}
                onView={handleViewGroup}
              />
            ))}
          </div>
        )}
      </section>

      {/* FMS Ingested Groups Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Imported Field Groups (Read-only)</h2>
        {fmsGroups.length === 0 ? (
          <p className="text-gray-500">No imported field groups found.</p>
        ) : (
          <div className="space-y-3">
            {fmsGroups.map(group => (
              <FieldGroupListItem
                key={group.id}
                group={group}
                onCopy={handleCopyGroup}
                onView={handleViewGroup}
              />
            ))}
          </div>
        )}
      </section>

      <FieldGroupPanel
        isOpen={isEditPanelOpen}
        onClose={() => {
          setIsEditPanelOpen(false);
          setEditingGroup(null);
        }}
        initialData={editingGroup}
        allFields={allFields}
        allUserGroups={userGroups}
        onSave={handleSaveGroup}
        mode={
          !editingGroup ? 'create' :
          editingGroup.id ? 'edit' : 'copy'
        }
      />

      <ViewFieldGroupPanel
        isOpen={isViewPanelOpen}
        onClose={() => {
          setIsViewPanelOpen(false);
          setViewingGroup(null);
        }}
        group={viewingGroup}
        allFields={allFields}
        allUserGroups={userGroups}
      />
    </div>
  );
};

export default FieldGroupsPage;