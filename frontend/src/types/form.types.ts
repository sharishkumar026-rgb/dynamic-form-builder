export type FormFieldType =
  | "text"
  | "textarea"
  | "email"
  | "number"
  | "date"
  | "select"
  | "dropdown"
  | "radio"
  | "checkbox"
  | "multi_select"
  | "rating"
  | "toggle"
  | "switch"
  | "boolean"
  | "file";

export interface FormFieldOption {
  id: number | string;
  label: string;
  value: string;
}

export interface FormFieldValidation {
  min_length?: number;
  max_length?: number;
  min_value?: number;
  max_value?: number;
}

export interface FormField {
  id: number | string;
  form_id?: number | string;

  field_type: FormFieldType;
  label: string;
  name?: string;

  placeholder?: string;
  description?: string;

  is_required: boolean;
  order: number;

  default_value?: string | number | boolean | null;

  validation?: FormFieldValidation;

  options?: FormFieldOption[];

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;
}

export interface Form {
  id: number | string;

  title: string;
  description?: string | null;

  is_active: boolean;

  created_by?: number | string | null;
  createdBy?: number | string | null;

  created_at?: string;
  createdAt?: string;

  updated_at?: string;
  updatedAt?: string;

  fields?: FormField[];
}

export interface CreateFormRequest {
  title: string;
  description?: string | null;
  is_active?: boolean;
}

export interface UpdateFormRequest {
  title?: string;
  description?: string | null;
  is_active?: boolean;
}

export interface FormResponse {
  success: boolean;
  message: string;
  form: Form;
}

export interface FormListResponse {
  success: boolean;
  message: string;

  data?: Form[];
  forms?: Form[];

  total?: number;
  page?: number;
  page_size?: number;
  total_pages?: number;
}

export interface DeleteFormResponse {
  success: boolean;
  message: string;
}

export interface FormFilters {
  search?: string;

  status?: "active" | "inactive" | "all";

  page?: number;
  page_size?: number;

  sort_by?: "title" | "created_at" | "updated_at";
  sort_order?: "asc" | "desc";
}

export interface CreateFormFieldRequest {
  field_type: FormFieldType;
  label: string;
  name?: string;
  placeholder?: string;
  description?: string;
  is_required?: boolean;
  order?: number;
  default_value?: string | number | boolean | null;
  validation?: FormFieldValidation;
  options?: FormFieldOption[];
}

export interface UpdateFormFieldRequest {
  field_type?: FormFieldType;
  label?: string;
  name?: string;
  placeholder?: string;
  description?: string;
  is_required?: boolean;
  order?: number;
  default_value?: string | number | boolean | null;
  validation?: FormFieldValidation;
  options?: FormFieldOption[];
}

export interface FormFieldResponse {
  success: boolean;
  message: string;
  field: FormField;
}

export interface FormFieldListResponse {
  success: boolean;
  message: string;

  data?: FormField[];
  fields?: FormField[];
}

export interface DeleteFormFieldResponse {
  success: boolean;
  message: string;
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
  option: FormFieldOption;
}

export interface FieldOptionListResponse {
  success: boolean;
  message: string;

  data?: FormFieldOption[];
  options?: FormFieldOption[];
}

export interface DeleteFieldOptionResponse {
  success: boolean;
  message: string;
}