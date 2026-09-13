export interface FieldOption {
  id: number | string;
  field_id?: number | string;

  label: string;
  value: string;

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;
}

export interface CreateFieldOptionRequest {
  label: string;
  value: string;
}

export interface UpdateFieldOptionRequest {
  label?: string;
  value?: string;
}

export interface FieldOptionResponse {
  success: boolean;
  message: string;
  option: FieldOption;
}

export interface FieldOptionListResponse {
  success: boolean;
  message: string;
  data?: FieldOption[];
  options?: FieldOption[];
}

export interface DeleteFieldOptionResponse {
  success: boolean;
  message: string;
}