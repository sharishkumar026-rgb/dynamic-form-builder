import api from "./axios";

// ============================================================
// RESPONSE DETAIL CREATE
// ============================================================

export interface ResponseDetailCreate {
  field_id: number;
  value?: string | null;
  value_json?: any | null;
}

// ============================================================
// RESPONSE DETAIL UPDATE
// ============================================================

export interface ResponseDetailUpdate {
  field_id: number;
  value?: string | null;
  value_json?: any | null;
}

// ============================================================
// FORM RESPONSE CREATE
// ============================================================

export interface FormResponseCreate {
  details: ResponseDetailCreate[];
}

// ============================================================
// FORM RESPONSE UPDATE
// ============================================================

export interface FormResponseUpdate {
  details: ResponseDetailUpdate[];
}

// ============================================================
// ROLE DATA
// ============================================================

export interface ResponseRoleData {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

// ============================================================
// USER DATA
// ============================================================

export interface ResponseUserData {
  id: number;
  name: string;
  email: string;
  role: ResponseRoleData | null;
}

// ============================================================
// FORM DATA
// ============================================================

export interface ResponseFormData {
  id: number;
  title: string;
  description: string | null;
  is_active: boolean;
}

// ============================================================
// FIELD DATA
// ============================================================

export interface ResponseFieldData {
  id: number;
  label: string;
  name: string;
  field_type: string;
  is_required: boolean;
}

// ============================================================
// RESPONSE DETAIL DATA
// ============================================================

export interface ResponseDetailResponse {
  id: number;
  response_id: number;
  field_id: number;
  field: ResponseFieldData | null;
  value: string | null;
  value_json: any | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// COMPLETE RESPONSE DATA
// ============================================================

export interface FormResponseData {
  id: number;
  form: ResponseFormData;
  submitted_by: ResponseUserData | null;
  submitted_at: string;
  updated_at: string;
  details: ResponseDetailResponse[];
}

// ============================================================
// FORM RESPONSE RESPONSE
// ============================================================

export interface FormResponseResponse {
  success: boolean;
  message: string;
  response: FormResponseData;
}

// ============================================================
// FORM RESPONSE DETAIL RESPONSE
// ============================================================

export interface FormResponseDetailResponse {
  success: boolean;
  message: string;
  response: FormResponseData;
}

// ============================================================
// FORM RESPONSE LIST RESPONSE
// ============================================================

export interface FormResponseListResponse {
  success: boolean;
  message: string;
  total: number;
  response: FormResponseData[];
}

// ============================================================
// FORM RESPONSE DELETE RESPONSE
// ============================================================

export interface FormResponseDeleteResponse {
  success: boolean;
  message: string;
}

// ============================================================
// RESPONSE HISTORY ITEM
// ============================================================

export interface ResponseHistoryItem {
  id: number;
  response_id: number;
  field_id: number;
  value: string | null;
  value_json: any | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// RESPONSE HISTORY RESPONSE
// ============================================================

export interface ResponseHistoryResponse {
  success: boolean;
  message: string;
  total: number;
  response: ResponseHistoryItem[];
}

// ============================================================
// RESPONSES API
// ============================================================

export const responsesApi = {
  // ==========================================================
  // CREATE RESPONSE
  // POST /api/forms/{form_id}/responses
  // USER
  // ==========================================================

  createResponse: async (
    formId: number,
    data: FormResponseCreate
  ): Promise<FormResponseResponse> => {
    const response = await api.post<FormResponseResponse>(
      `/forms/${formId}/responses`,
      data
    );

    return response.data;
  },

  // ==========================================================
  // GET ALL RESPONSES
  // GET /api/forms/{form_id}/responses
  // ADMIN
  // ==========================================================

  getFormResponses: async (
    formId: number
  ): Promise<FormResponseListResponse> => {
    const response = await api.get<FormResponseListResponse>(
      `/forms/${formId}/responses`
    );

    return response.data;
  },

  // ==========================================================
  // GET RESPONSE BY ID
  // GET /api/responses/{response_id}
  // ADMIN = ANY RESPONSE
  // USER = OWN RESPONSE
  // ==========================================================

  getResponse: async (
    responseId: number
  ): Promise<FormResponseResponse> => {
    const response = await api.get<FormResponseResponse>(
      `/responses/${responseId}`
    );

    return response.data;
  },

  // ==========================================================
  // UPDATE RESPONSE
  // PUT /api/responses/{response_id}
  // USER - OWN RESPONSE
  // ==========================================================

  updateResponse: async (
    responseId: number,
    data: FormResponseUpdate
  ): Promise<FormResponseResponse> => {
    const response = await api.put<FormResponseResponse>(
      `/responses/${responseId}`,
      data
    );

    return response.data;
  },

  // ==========================================================
  // DELETE RESPONSE
  // DELETE /api/responses/{response_id}
  // USER - OWN RESPONSE
  // ==========================================================

  deleteResponse: async (
    responseId: number
  ): Promise<FormResponseDeleteResponse> => {
    const response = await api.delete<FormResponseDeleteResponse>(
      `/responses/${responseId}`
    );

    return response.data;
  },

  // ==========================================================
  // RESPONSE HISTORY
  // GET /api/responses/{response_id}/history
  // ADMIN
  // ==========================================================

  getResponseHistory: async (
    responseId: number
  ): Promise<ResponseHistoryResponse> => {
    const response = await api.get<ResponseHistoryResponse>(
      `/responses/${responseId}/history`
    );

    return response.data;
  },
};

export default responsesApi;