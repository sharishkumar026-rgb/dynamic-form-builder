import api from "./axios";

// ============================================================
// FORM FIELD TYPES
// ============================================================

export interface FormFieldCreate {
  label: string;
  field_type: string;
  name: string;
  placeholder?: string | null;
  description?: string | null;
  is_required?: boolean;
  display_order?: number;
  validation_rules?: Record<string, any> | null;
  conditional_logic?: Record<string, any> | null;
  is_active?: boolean;
}

// ============================================================
// FORM FIELD UPDATE
// ============================================================

export interface FormFieldUpdate {
  label?: string | null;
  field_type?: string | null;
  name?: string | null;
  placeholder?: string | null;
  description?: string | null;
  is_required?: boolean | null;
  display_order?: number | null;
  validation_rules?: Record<string, any> | null;
  conditional_logic?: Record<string, any> | null;
  is_active?: boolean | null;
}

// ============================================================
// FORM FIELD ORDER ITEM
// ============================================================

export interface FormFieldOrderItem {
  field_id: number;
  display_order: number;
}

// ============================================================
// FORM FIELD REORDER REQUEST
// ============================================================

export interface FormFieldReorderRequest {
  field_orders: FormFieldOrderItem[];
}

// ============================================================
// FORM FIELD RESPONSE
// ============================================================

export interface FormFieldResponse {
  id: number;
  form_id: number;
  label: string;
  field_type: string;
  name: string;
  placeholder: string | null;
  description: string | null;
  is_required: boolean;
  display_order: number;
  validation_rules: Record<string, any> | null;
  conditional_logic: Record<string, any> | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// FORM FIELD ACTION RESPONSE
// ============================================================

export interface FormFieldActionResponse {
  success: boolean;
  message: string;
  field: FormFieldResponse | null;
}

// ============================================================
// FORM FIELD DELETE RESPONSE
// ============================================================

export interface FormFieldDeleteResponse {
  success: boolean;
  message: string;
}

// ============================================================
// FORM FIELD LIST RESPONSE
// ============================================================

export interface FormFieldListResponse {
  success: boolean;
  message: string;
  total: number;
  fields: FormFieldResponse[];
}

// ============================================================
// FORM FIELD REORDER RESPONSE
// ============================================================

export interface FormFieldReorderResponse {
  success: boolean;
  message: string;
  fields: FormFieldResponse[];
}

// ============================================================
// FORM FIELDS API
// ============================================================

export const formFieldsApi = {
  // ==========================================================
  // GET ALL FIELDS
  // GET /api/forms/{form_id}/fields
  // ==========================================================

  getFields: async (
    formId: number,
    skip: number = 0,
    limit: number = 100
  ): Promise<FormFieldListResponse> => {
    const response = await api.get<FormFieldListResponse>(
      `/forms/${formId}/fields`,
      {
        params: {
          skip,
          limit,
        },
      }
    );

    return response.data;
  },

  // ==========================================================
  // GET FIELD BY ID
  // GET /api/forms/{form_id}/fields/{field_id}
  // ==========================================================

  getField: async (
    formId: number,
    fieldId: number
  ): Promise<FormFieldActionResponse> => {
    const response = await api.get<FormFieldActionResponse>(
      `/forms/${formId}/fields/${fieldId}`
    );

    return response.data;
  },

  // ==========================================================
  // CREATE FIELD
  // POST /api/forms/{form_id}/fields
  // ==========================================================

  createField: async (
    formId: number,
    data: FormFieldCreate
  ): Promise<FormFieldActionResponse> => {
    const response = await api.post<FormFieldActionResponse>(
      `/forms/${formId}/fields`,
      data
    );

    return response.data;
  },

  // ==========================================================
  // UPDATE FIELD
  // PUT /api/forms/{form_id}/fields/{field_id}
  // ==========================================================

  updateField: async (
    formId: number,
    fieldId: number,
    data: FormFieldUpdate
  ): Promise<FormFieldActionResponse> => {
    const response = await api.put<FormFieldActionResponse>(
      `/forms/${formId}/fields/${fieldId}`,
      data
    );

    return response.data;
  },

  // ==========================================================
  // DELETE FIELD
  // DELETE /api/forms/{form_id}/fields/{field_id}
  // ==========================================================

  deleteField: async (
    formId: number,
    fieldId: number
  ): Promise<FormFieldDeleteResponse> => {
    const response = await api.delete<FormFieldDeleteResponse>(
      `/forms/${formId}/fields/${fieldId}`
    );

    return response.data;
  },

  // ==========================================================
  // REORDER FIELDS
  // PATCH /api/forms/{form_id}/fields/reorder
  // ==========================================================

  reorderFields: async (
    formId: number,
    data: FormFieldReorderRequest
  ): Promise<FormFieldReorderResponse> => {
    const response = await api.patch<FormFieldReorderResponse>(
      `/forms/${formId}/fields/reorder`,
      data
    );

    return response.data;
  },
};

export default formFieldsApi;