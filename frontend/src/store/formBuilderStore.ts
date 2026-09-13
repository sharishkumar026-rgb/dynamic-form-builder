
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

export interface FormBuilderField {
  id: number | string;
  field_type: FormFieldType;
  label: string;
  name?: string;
  placeholder?: string;
  description?: string;
  is_required: boolean;
  order: number;
  default_value?: string | number | boolean | null;
  validation?: {
    min_length?: number;
    max_length?: number;
    min_value?: number;
    max_value?: number;
  };
  options: FormFieldOption[];
}

export interface FormBuilderState {
  formId: number | string | null;
  title: string;
  description: string;
  isActive: boolean;
  fields: FormBuilderField[];
  selectedFieldId: number | string | null;
  isDirty: boolean;
}

const createId = (): string => {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;
};

const initialState: FormBuilderState = {
  formId: null,
  title: "",
  description: "",
  isActive: true,
  fields: [],
  selectedFieldId: null,
  isDirty: false,
};

let formBuilderState: FormBuilderState = {
  ...initialState,
  fields: [],
};

const listeners = new Set<
  (state: FormBuilderState) => void
>();

const notifyListeners = () => {
  listeners.forEach((listener) => {
    listener({
      ...formBuilderState,
      fields: [...formBuilderState.fields],
    });
  });
};

const updateState = (
  newState: Partial<FormBuilderState>
) => {
  formBuilderState = {
    ...formBuilderState,
    ...newState,
  };

  notifyListeners();
};

const markDirty = () => {
  updateState({
    isDirty: true,
  });
};

const setFormId = (formId: number | string | null) => {
  updateState({
    formId,
  });
};

const setTitle = (title: string) => {
  updateState({
    title,
    isDirty: true,
  });
};

const setDescription = (description: string) => {
  updateState({
    description,
    isDirty: true,
  });
};

const setIsActive = (isActive: boolean) => {
  updateState({
    isActive,
    isDirty: true,
  });
};

const createDefaultField = (
  fieldType: FormFieldType,
  label?: string
): FormBuilderField => {
  const id = createId();

  const defaultLabel =
    label ||
    fieldType
      .replace("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );

  const requiresOptions =
    fieldType === "select" ||
    fieldType === "dropdown" ||
    fieldType === "radio" ||
    fieldType === "checkbox" ||
    fieldType === "multi_select";

  return {
    id,
    field_type: fieldType,
    label: defaultLabel,
    name: `field_${id}`,
    placeholder: "",
    description: "",
    is_required: false,
    order: formBuilderState.fields.length + 1,
    default_value: null,
    validation: {},
    options: requiresOptions
      ? [
          {
            id: createId(),
            label: "Option 1",
            value: "option_1",
          },
          {
            id: createId(),
            label: "Option 2",
            value: "option_2",
          },
        ]
      : [],
  };
};

const addField = (
  fieldType: FormFieldType,
  label?: string
): FormBuilderField => {
  const field = createDefaultField(
    fieldType,
    label
  );

  updateState({
    fields: [
      ...formBuilderState.fields,
      field,
    ],
    selectedFieldId: field.id,
    isDirty: true,
  });

  return field;
};

const addExistingField = (
  field: FormBuilderField
): void => {
  const normalizedField: FormBuilderField = {
    ...field,
    order: formBuilderState.fields.length + 1,
    options: [...(field.options || [])],
  };

  updateState({
    fields: [
      ...formBuilderState.fields,
      normalizedField,
    ],
    selectedFieldId: normalizedField.id,
    isDirty: true,
  });
};

const updateField = (
  fieldId: number | string,
  updates: Partial<FormBuilderField>
): void => {
  const fields = formBuilderState.fields.map(
    (field) =>
      String(field.id) === String(fieldId)
        ? {
            ...field,
            ...updates,
          }
        : field
  );

  updateState({
    fields,
    isDirty: true,
  });
};

const updateFieldLabel = (
  fieldId: number | string,
  label: string
): void => {
  updateField(fieldId, {
    label,
  });
};

const updateFieldType = (
  fieldId: number | string,
  fieldType: FormFieldType
): void => {
  const field = formBuilderState.fields.find(
    (item) =>
      String(item.id) === String(fieldId)
  );

  if (!field) {
    return;
  }

  const requiresOptions =
    fieldType === "select" ||
    fieldType === "dropdown" ||
    fieldType === "radio" ||
    fieldType === "checkbox" ||
    fieldType === "multi_select";

  updateField(fieldId, {
    field_type: fieldType,
    options: requiresOptions
      ? field.options.length > 0
        ? field.options
        : [
            {
              id: createId(),
              label: "Option 1",
              value: "option_1",
            },
            {
              id: createId(),
              label: "Option 2",
              value: "option_2",
            },
          ]
      : [],
  });
};

const deleteField = (
  fieldId: number | string
): void => {
  const fields = formBuilderState.fields
    .filter(
      (field) =>
        String(field.id) !== String(fieldId)
    )
    .map((field, index) => ({
      ...field,
      order: index + 1,
    }));

  const selectedFieldId =
    String(formBuilderState.selectedFieldId) ===
    String(fieldId)
      ? null
      : formBuilderState.selectedFieldId;

  updateState({
    fields,
    selectedFieldId,
    isDirty: true,
  });
};

const duplicateField = (
  fieldId: number | string
): FormBuilderField | null => {
  const fieldIndex =
    formBuilderState.fields.findIndex(
      (field) =>
        String(field.id) === String(fieldId)
    );

  if (fieldIndex === -1) {
    return null;
  }

  const source =
    formBuilderState.fields[fieldIndex];

  const duplicated: FormBuilderField = {
    ...source,
    id: createId(),
    name: source.name
      ? `${source.name}_copy`
      : undefined,
    label: `${source.label} Copy`,
    order: source.order + 1,
    options: source.options.map(
      (option) => ({
        ...option,
        id: createId(),
      })
    ),
  };

  const fields = [
    ...formBuilderState.fields,
  ];

  fields.splice(
    fieldIndex + 1,
    0,
    duplicated
  );

  const reorderedFields = fields.map(
    (field, index) => ({
      ...field,
      order: index + 1,
    })
  );

  updateState({
    fields: reorderedFields,
    selectedFieldId: duplicated.id,
    isDirty: true,
  });

  return duplicated;
};

const selectField = (
  fieldId: number | string | null
): void => {
  updateState({
    selectedFieldId: fieldId,
  });
};

const getSelectedField =
  (): FormBuilderField | null => {
    if (
      formBuilderState.selectedFieldId === null
    ) {
      return null;
    }

    return (
      formBuilderState.fields.find(
        (field) =>
          String(field.id) ===
          String(
            formBuilderState.selectedFieldId
          )
      ) || null
    );
  };

const moveField = (
  fieldId: number | string,
  newIndex: number
): void => {
  const fields = [
    ...formBuilderState.fields,
  ];

  const currentIndex =
    fields.findIndex(
      (field) =>
        String(field.id) === String(fieldId)
    );

  if (currentIndex === -1) {
    return;
  }

  if (
    newIndex < 0 ||
    newIndex >= fields.length
  ) {
    return;
  }

  const [movedField] = fields.splice(
    currentIndex,
    1
  );

  fields.splice(
    newIndex,
    0,
    movedField
  );

  const reorderedFields = fields.map(
    (field, index) => ({
      ...field,
      order: index + 1,
    })
  );

  updateState({
    fields: reorderedFields,
    isDirty: true,
  });
};

const moveFieldUp = (
  fieldId: number | string
): void => {
  const index =
    formBuilderState.fields.findIndex(
      (field) =>
        String(field.id) === String(fieldId)
    );

  if (index <= 0) {
    return;
  }

  moveField(fieldId, index - 1);
};

const moveFieldDown = (
  fieldId: number | string
): void => {
  const index =
    formBuilderState.fields.findIndex(
      (field) =>
        String(field.id) === String(fieldId)
    );

  if (
    index === -1 ||
    index >=
      formBuilderState.fields.length - 1
  ) {
    return;
  }

  moveField(fieldId, index + 1);
};

const addOption = (
  fieldId: number | string,
  label = "New Option",
  value?: string
): FormFieldOption | null => {
  const field =
    formBuilderState.fields.find(
      (item) =>
        String(item.id) === String(fieldId)
    );

  if (!field) {
    return null;
  }

  const option: FormFieldOption = {
    id: createId(),
    label,
    value:
      value ||
      label
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_"),
  };

  updateField(fieldId, {
    options: [
      ...field.options,
      option,
    ],
  });

  return option;
};

const updateOption = (
  fieldId: number | string,
  optionId: number | string,
  updates: Partial<FormFieldOption>
): void => {
  const field =
    formBuilderState.fields.find(
      (item) =>
        String(item.id) === String(fieldId)
    );

  if (!field) {
    return;
  }

  const options = field.options.map(
    (option) =>
      String(option.id) ===
      String(optionId)
        ? {
            ...option,
            ...updates,
          }
        : option
  );

  updateField(fieldId, {
    options,
  });
};

const deleteOption = (
  fieldId: number | string,
  optionId: number | string
): void => {
  const field =
    formBuilderState.fields.find(
      (item) =>
        String(item.id) === String(fieldId)
    );

  if (!field) {
    return;
  }

  updateField(fieldId, {
    options: field.options.filter(
      (option) =>
        String(option.id) !==
        String(optionId)
    ),
  });
};

const setRequired = (
  fieldId: number | string,
  required: boolean
): void => {
  updateField(fieldId, {
    is_required: required,
  });
};

const setPlaceholder = (
  fieldId: number | string,
  placeholder: string
): void => {
  updateField(fieldId, {
    placeholder,
  });
};

const setFieldDescription = (
  fieldId: number | string,
  description: string
): void => {
  updateField(fieldId, {
    description,
  });
};

const setDefaultValue = (
  fieldId: number | string,
  value: string | number | boolean | null
): void => {
  updateField(fieldId, {
    default_value: value,
  });
};

const setValidation = (
  fieldId: number | string,
  validation: FormBuilderField["validation"]
): void => {
  updateField(fieldId, {
    validation,
  });
};

const loadForm = (
  data: Partial<FormBuilderState>
): void => {
  const fields = (data.fields || [])
    .map((field, index) => ({
      ...field,
      id: field.id ?? createId(),
      label: field.label || `Field ${index + 1}`,
      field_type:
        field.field_type || "text",
      is_required:
        field.is_required ?? false,
      order: index + 1,
      options: field.options || [],
    })) as FormBuilderField[];

  updateState({
    formId: data.formId ?? null,
    title: data.title ?? "",
    description: data.description ?? "",
    isActive: data.isActive ?? true,
    fields,
    selectedFieldId:
      fields.length > 0
        ? fields[0].id
        : null,
    isDirty: false,
  });
};

const getPayload = () => {
  return {
    formId: formBuilderState.formId,
    title: formBuilderState.title.trim(),
    description:
      formBuilderState.description.trim(),
    isActive: formBuilderState.isActive,
    fields: formBuilderState.fields.map(
      (field, index) => ({
        id: field.id,
        field_type: field.field_type,
        label: field.label.trim(),
        name: field.name?.trim(),
        placeholder:
          field.placeholder?.trim(),
        description:
          field.description?.trim(),
        is_required: field.is_required,
        order: index + 1,
        default_value:
          field.default_value,
        validation: field.validation || {},
        options: field.options.map(
          (option) => ({
            id: option.id,
            label: option.label.trim(),
            value: option.value.trim(),
          })
        ),
      })
    ),
  };
};

const markSaved = (): void => {
  updateState({
    isDirty: false,
  });
};

const getState = (): FormBuilderState => {
  return {
    ...formBuilderState,
    fields: [
      ...formBuilderState.fields,
    ],
  };
};

const subscribe = (
  listener: (
    state: FormBuilderState
  ) => void
) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const reset = (): void => {
  formBuilderState = {
    ...initialState,
    fields: [],
  };

  notifyListeners();
};

const formBuilderStore = {
  getState,
  subscribe,

  setFormId,
  setTitle,
  setDescription,
  setIsActive,

  addField,
  addExistingField,
  updateField,
  updateFieldLabel,
  updateFieldType,
  deleteField,
  duplicateField,

  selectField,
  getSelectedField,

  moveField,
  moveFieldUp,
  moveFieldDown,

  addOption,
  updateOption,
  deleteOption,

  setRequired,
  setPlaceholder,
  setFieldDescription,
  setDefaultValue,
  setValidation,

  loadForm,
  getPayload,
  markDirty,
  markSaved,

  reset,
};

export default formBuilderStore;

