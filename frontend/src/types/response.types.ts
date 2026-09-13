export type ResponseStatus =
  | "pending"
  | "completed"
  | "reviewed"
  | "submitted"
  | "draft"
  | "cancelled"
  | string;

export interface ResponseFieldValue {
  field_id: number | string;
  field_label?: string;
  field_name?: string;
  field_type?: string;
  value: string | number | boolean | null | string[];
}

export interface FormResponseData {
  id: number | string;
  form_id: number | string;

  user_id?: number | string | null;
  submitted_by?: number | string | null;
  submittedBy?: number | string | null;

  status?: ResponseStatus;

  data?: Record<string, unknown>;
  responses?: Record<string, unknown>;
  values?: ResponseFieldValue[];

  submitted_at?: string;
  submittedAt?: string;

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;
}

export interface CreateResponseRequest {
  data: Record<string, unknown>;
}

export interface UpdateResponseRequest {
  data?: Record<string, unknown>;
  status?: ResponseStatus;
}

export interface ResponseResponse {
  success: boolean;
  message: string;
  response: FormResponseData;
}

export interface ResponseListResponse {
  success: boolean;
  message: string;

  data?: FormResponseData[];
  responses?: FormResponseData[];

  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

export interface DeleteResponseResponse {
  success: boolean;
  message: string;
}

export interface ResponseHistoryItem {
  id: number | string;
  response_id?: number | string;

  user_id?: number | string | null;
  changed_by?: number | string | null;
  changedBy?: number | string | null;

  status?: ResponseStatus;

  data?: Record<string, unknown>;
  changes?: Record<string, unknown>;

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;
}

export interface ResponseHistoryResponse {
  success: boolean;
  message: string;

  data?: ResponseHistoryItem[];
  history?: ResponseHistoryItem[];
}