import { Field, UserFieldGroup, FmsFieldGroup } from '../types';
import { fieldsData, FieldData } from '../data/fieldData';
import { fmsFieldGroupsData, FmsFieldGroupData } from '../data/fmsFieldGroupsData';

const USER_FIELD_GROUPS_STORAGE_KEY = 'userFieldGroups';

// --- Read Operations ---

/**
 * Gets the list of all available fields with full data.
 */
export const getAllFields = (): FieldData[] => {
  return fieldsData;
};

/**
 * Gets the list of FMS ingested field groups (read-only).
 * In a real app, this would fetch from an API.
 */
export const getFmsFieldGroups = (): FmsFieldGroup[] => {
  // Add the readonly flag when mapping
  return fmsFieldGroupsData.map((group: FmsFieldGroupData) => ({
    ...group,
    readonly: true,
  }));
};

/**
 * Gets the list of user-created field groups from local storage.
 */
export const getUserFieldGroups = (): UserFieldGroup[] => {
  try {
    const storedGroups = localStorage.getItem(USER_FIELD_GROUPS_STORAGE_KEY);
    if (storedGroups) {
      const parsedGroups = JSON.parse(storedGroups);
      // Basic validation to ensure it's an array
      if (Array.isArray(parsedGroups)) {
        return parsedGroups as UserFieldGroup[];
      }
    }
  } catch (error) {
    console.error("Error reading user field groups from local storage:", error);
    // Optionally clear corrupted data: localStorage.removeItem(USER_FIELD_GROUPS_STORAGE_KEY);
  }
  return []; // Return empty array if nothing stored, invalid format, or error
};

// --- Write Operations ---

/**
 * Saves a user-created field group (creates if new, updates if exists) to local storage.
 * @param group The UserFieldGroup object to save. A new ID will be generated if one isn't provided.
 */
export const saveUserFieldGroup = (group: UserFieldGroup): UserFieldGroup => {
  const groups = getUserFieldGroups();
  let groupToSave = { ...group }; // Clone to avoid modifying the original object directly

  const existingIndex = groupToSave.id ? groups.findIndex(g => g.id === groupToSave.id) : -1;

  if (existingIndex > -1) {
    // Update existing group
    groups[existingIndex] = groupToSave;
  } else {
    // Create new group - generate ID if missing
    if (!groupToSave.id) {
      // Simple unique ID generation for mock purposes
      groupToSave.id = `user_group_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }
    groups.push(groupToSave);
  }

  try {
    localStorage.setItem(USER_FIELD_GROUPS_STORAGE_KEY, JSON.stringify(groups));
  } catch (error) {
    console.error("Error saving user field groups to local storage:", error);
    // Handle potential storage errors (e.g., quota exceeded)
    throw new Error("Failed to save field group."); // Re-throw or handle appropriately
  }
  return groupToSave; // Return the saved group (with ID if newly generated)
};

/**
 * Deletes a user-created field group from local storage by its ID.
 * @param groupId The ID of the group to delete.
 */
export const deleteUserFieldGroup = (groupId: string): void => {
  const groups = getUserFieldGroups();
  const updatedGroups = groups.filter(g => g.id !== groupId);

  if (groups.length === updatedGroups.length) {
    console.warn(`Attempted to delete non-existent user field group with ID: ${groupId}`);
    return; // Or throw an error if preferred
  }

  try {
    localStorage.setItem(USER_FIELD_GROUPS_STORAGE_KEY, JSON.stringify(updatedGroups));
  } catch (error) {
    console.error("Error deleting user field group from local storage:", error);
    throw new Error("Failed to delete field group."); // Re-throw or handle appropriately
  }
};