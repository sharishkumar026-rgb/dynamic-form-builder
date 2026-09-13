import api from "./axios";

// ============================================================
// FORM TYPES
// ============================================================

export interface FormResponse {
  id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================================
// CREATE FORM
// ============================================================

export interface FormCreate {
  title: string;
  description?: string | null;
}

// ============================================================
// UPDATE FORM
// ============================================================

export interface FormUpdate {
  title?: string | null;
  description?: string | null;
}

// ============================================================
// FORM STATUS UPDATE
// ============================================================

export interface FormStatusUpdate {
  is_active: boolean;
}

// ============================================================
// FORM LIST RESPONSE
// ============================================================

export interface FormListResponse {
  success: boolean;
  message: string;
  total: number;
  forms: FormResponse[];
}

// ============================================================
// SINGLE FORM RESPONSE
// ============================================================

export interface FormAPIResponse {
  success: boolean;
  message: string;
  form: FormResponse | null;
}

// ============================================================
// FORM ACTION RESPONSE
// ============================================================

export interface FormActionResponse {
  success: boolean;
  message: string;
  form: FormResponse | null;
}

// ============================================================
// DELETE FORM RESPONSE
// ============================================================

export interface FormDeleteResponse {
  success: boolean;
  message: string;
}

// ============================================================
// FORMS API
// ============================================================

export const formsApi = {
  // ==========================================================
  // GET ALL FORMS
  // GET /api/forms
  // Admin + User
  // ==========================================================

  getForms: async (
    skip: number = 0,
    limit: number = 100,
    isActive?: boolean
  ): Promise<FormListResponse> => {
    const response = await api.get<FormListResponse>("/forms", {
      params: {
        skip,
        limit,
        ...(isActive !== undefined && {
          is_active: isActive,
        }),
      },
    });

    return response.data;
  },

  // ==========================================================
  // GET FORM BY ID
  // GET /api/forms/{form_id}
  // Admin + User
  // ==========================================================

  getForm: async (formId: number): Promise<FormAPIResponse> => {
    const response = await api.get<FormAPIResponse>(
      `/forms/${formId}`
    );

    return response.data;
  },

  // ==========================================================
  // CREATE FORM
  // POST /api/forms
  // Admin only
  // ==========================================================

  createForm: async (
    data: FormCreate
  ): Promise<FormActionResponse> => {
    const response = await api.post<FormActionResponse>(
      "/forms",
      data
    );

    return response.data;
  },

  // ==========================================================
  // UPDATE FORM
  // PUT /api/forms/{form_id}
  // Admin only
  // ==========================================================

  updateForm: async (
    formId: number,
    data: FormUpdate
  ): Promise<FormActionResponse> => {
    const response = await api.put<FormActionResponse>(
      `/forms/${formId}`,
      data
    );

    return response.data;
  },

  // ==========================================================
  // DELETE FORM
  // DELETE /api/forms/{form_id}
  // Admin only
  // ==========================================================

  deleteForm: async (
    formId: number
  ): Promise<FormDeleteResponse> => {
    const response = await api.delete<FormDeleteResponse>(
      `/forms/${formId}`
    );

    return response.data;
  },

  // ==========================================================
  // UPDATE FORM STATUS
  // PATCH /api/forms/{form_id}/status
  // Admin only
  // ==========================================================

  updateFormStatus: async (
    formId: number,
    data: FormStatusUpdate
  ): Promise<FormActionResponse> => {
    const response = await api.patch<FormActionResponse>(
      `/forms/${formId}/status`,
      data
    );

    return response.data;
  },

  // ==========================================================
  // ENABLE FORM
  // PATCH /api/forms/{form_id}/enable
  // Admin only
  // ==========================================================

  enableForm: async (
    formId: number
  ): Promise<FormActionResponse> => {
    const response = await api.patch<FormActionResponse>(
      `/forms/${formId}/enable`
    );

    return response.data;
  },

  // ==========================================================
  // DISABLE FORM
  // PATCH /api/forms/{form_id}/disable
  // Admin only
  // ==========================================================

  disableForm: async (
    formId: number
  ): Promise<FormActionResponse> => {
    const response = await api.patch<FormActionResponse>(
      `/forms/${formId}/disable`
    );

    return response.data;
  },
};

export default formsApi;