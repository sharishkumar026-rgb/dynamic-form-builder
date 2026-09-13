import api from "./axios";

// ============================================================
// FIELD OPTION TYPES
// ============================================================

export interface FieldOptionCreate {
  label: string;
  value: string;
  display_order?: number;
  is_active?: boolean;
}

// ============================================================
// FIELD OPTION UPDATE
// ============================================================

export interface FieldOptionUpdate {
  label?: string | null;
  value?: string | null;
  display_order?: number | null;
  is_active?: boolean | null;
}

// ============================================================
// FIELD OPTION STATUS UPDATE
// ============================================================

export interface FieldOptionStatusUpdate {
  is_active: boolean;
}

// ============================================================
// FIELD OPTION RESPONSE
// ============================================================

export interface FieldOptionResponse {
  id: number;
  field_id: number;
  label: string;
  value: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// FIELD OPTION ACTION RESPONSE
// ============================================================

export interface FieldOptionActionResponse {
  success: boolean;
  message: string;
  option: FieldOptionResponse | null;
}

// ============================================================
// FIELD OPTION LIST RESPONSE
// ============================================================

export interface FieldOptionListResponse {
  success: boolean;
  message: string;
  total: number;
  options: FieldOptionResponse[];
}

// ============================================================
// FIELD OPTION DELETE RESPONSE
// ============================================================

export interface FieldOptionDeleteResponse {
  success: boolean;
  message: string;
}

// ============================================================
// FIELD OPTIONS API
// ============================================================

export const fieldOptionsApi = {
  // ==========================================================
  // CREATE FIELD OPTION
  // POST /api/forms/{form_id}/fields/{field_id}/options
  // ==========================================================

  createOption: async (
    formId: number,
    fieldId: number,
    data: FieldOptionCreate
  ): Promise<FieldOptionActionResponse> => {
    const response = await api.post<FieldOptionActionResponse>(
      `/forms/${formId}/fields/${fieldId}/options`,
      data
    );

    return response.data;
  },

  // ==========================================================
  // GET ALL FIELD OPTIONS
  // GET /api/forms/{form_id}/fields/{field_id}/options
  // ==========================================================

  getOptions: async (
    formId: number,
    fieldId: number
  ): Promise<FieldOptionListResponse> => {
    const response = await api.get<FieldOptionListResponse>(
      `/forms/${formId}/fields/${fieldId}/options`
    );

    return response.data;
  },

  // ==========================================================
  // GET FIELD OPTION BY ID
  // GET /api/forms/{form_id}/fields/{field_id}/options/{option_id}
  // ==========================================================

  getOption: async (
    formId: number,
    fieldId: number,
    optionId: number
  ): Promise<FieldOptionActionResponse> => {
    const response = await api.get<FieldOptionActionResponse>(
      `/forms/${formId}/fields/${fieldId}/options/${optionId}`
    );

    return response.data;
  },

  // ==========================================================
  // UPDATE FIELD OPTION
  // PUT /api/forms/{form_id}/fields/{field_id}/options/{option_id}
  // ==========================================================

  updateOption: async (
    formId: number,
    fieldId: number,
    optionId: number,
    data: FieldOptionUpdate
  ): Promise<FieldOptionActionResponse> => {
    const response = await api.put<FieldOptionActionResponse>(
      `/forms/${formId}/fields/${fieldId}/options/${optionId}`,
      data
    );

    return response.data;
  },

  // ==========================================================
  // UPDATE FIELD OPTION STATUS
  // PATCH /api/forms/{form_id}/fields/{field_id}/options/{option_id}/status
  // ==========================================================

  updateOptionStatus: async (
    formId: number,
    fieldId: number,
    optionId: number,
    data: FieldOptionStatusUpdate
  ): Promise<FieldOptionActionResponse> => {
    const response = await api.patch<FieldOptionActionResponse>(
      `/forms/${formId}/fields/${fieldId}/options/${optionId}/status`,
      data
    );

    return response.data;
  },

  // ==========================================================
  // DELETE FIELD OPTION
  // DELETE /api/forms/{form_id}/fields/{field_id}/options/{option_id}
  // ==========================================================

  deleteOption: async (
    formId: number,
    fieldId: number,
    optionId: number
  ): Promise<FieldOptionDeleteResponse> => {
    const response = await api.delete<FieldOptionDeleteResponse>(
      `/forms/${formId}/fields/${fieldId}/options/${optionId}`
    );

    return response.data;
  },
};

export default fieldOptionsApi;