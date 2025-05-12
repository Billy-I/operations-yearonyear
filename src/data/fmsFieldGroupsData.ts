// Mock data representing field groups ingested from an external source (e.g., FMS)
// These groups are considered read-only within this application.

export interface FmsFieldGroupData {
  id: string; // Unique identifier from the source system
  name: string; // Name of the group from the source system
  fieldIds: string[]; // Array of field IDs belonging to this group
}

export const fmsFieldGroupsData: FmsFieldGroupData[] = [
  {
    id: "fms_g1",
    name: "FMS Group Alpha (Contractor X)",
    fieldIds: ["field1", "field3", "field5"],
  },
  {
    id: "fms_g2",
    name: "FMS Group Beta (Trial Fields)",
    fieldIds: ["field2", "field4"],
  },
  {
    id: "fms_g3",
    name: "FMS Group Gamma (North Area)",
    fieldIds: ["field1", "field4", "field5"],
  },
];