import { useEffect, useState } from "react";
import formBuilderStore, {
  type FormBuilderField,
  type FormBuilderState,
  type FormFieldOption,
  type FormFieldType,
} from "../store/formBuilderStore";

interface UseFormBuilderResult extends FormBuilderState {
  setFormId: (formId: number | string | null) => void;

  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setIsActive: (isActive: boolean) => void;

  addField: (
    fieldType?: FormFieldType,
    label?: string
  ) => void;

  addExistingField: (
    field: FormBuilderField
  ) => void;

  updateField: (
    fieldId: number | string,
    updates: Partial<FormBuilderField>
  ) => void;

  updateFieldLabel: (
    fieldId: number | string,
    label: string
  ) => void;

  updateFieldType: (
    fieldId: number | string,
    fieldType: FormFieldType
  ) => void;

  deleteField: (
    fieldId: number | string
  ) => void;

  duplicateField: (
    fieldId: number | string
  ) => void;

  selectField: (
    fieldId: number | string | null
  ) => void;

  getSelectedField: () => FormBuilderField | null;

  moveField: (
    fieldId: number | string,
    newIndex: number
  ) => void;

  moveFieldUp: (
    fieldId: number | string
  ) => void;

  moveFieldDown: (
    fieldId: number | string
  ) => void;

  addOption: (
    fieldId: number | string,
    label?: string,
    value?: string
  ) => void;

  updateOption: (
    fieldId: number | string,
    optionId: number | string,
    updates: Partial<FormFieldOption>
  ) => void;

  deleteOption: (
    fieldId: number | string,
    optionId: number | string
  ) => void;

  setRequired: (
    fieldId: number | string,
    isRequired: boolean
  ) => void;

  setPlaceholder: (
    fieldId: number | string,
    placeholder: string
  ) => void;

  setFieldDescription: (
    fieldId: number | string,
    description: string
  ) => void;

  setDefaultValue: (
    fieldId: number | string,
    value: string | number | boolean | null
  ) => void;

  setValidation: (
    fieldId: number | string,
    validation: FormBuilderField["validation"]
  ) => void;

  loadForm: (
    form: Partial<FormBuilderState>
  ) => void;

  getPayload: () => Record<string, unknown>;

  markDirty: () => void;
  markSaved: () => void;
  reset: () => void;
}

const useFormBuilder = (): UseFormBuilderResult => {
  const [state, setState] =
    useState<FormBuilderState>(
      formBuilderStore.getState()
    );

  useEffect(() => {
    return formBuilderStore.subscribe(
      (newState) => {
        setState(newState);
      }
    );
  }, []);

  return {
    ...state,

    setFormId: (formId) => {
      formBuilderStore.setFormId(formId);
    },

    setTitle: (title) => {
      formBuilderStore.setTitle(title);
    },

    setDescription: (description) => {
      formBuilderStore.setDescription(description);
    },

    setIsActive: (isActive) => {
      formBuilderStore.setIsActive(isActive);
    },

    addField: (
      fieldType = "text",
      label = "New Field"
    ) => {
      formBuilderStore.addField(
        fieldType,
        label
      );
    },

    addExistingField: (field) => {
      formBuilderStore.addExistingField(field);
    },

    updateField: (
      fieldId,
      updates
    ) => {
      formBuilderStore.updateField(
        fieldId,
        updates
      );
    },

    updateFieldLabel: (
      fieldId,
      label
    ) => {
      formBuilderStore.updateFieldLabel(
        fieldId,
        label
      );
    },

    updateFieldType: (
      fieldId,
      fieldType
    ) => {
      formBuilderStore.updateFieldType(
        fieldId,
        fieldType
      );
    },

    deleteField: (fieldId) => {
      formBuilderStore.deleteField(
        fieldId
      );
    },

    duplicateField: (fieldId) => {
      formBuilderStore.duplicateField(
        fieldId
      );
    },

    selectField: (fieldId) => {
      formBuilderStore.selectField(
        fieldId
      );
    },

    getSelectedField: () => {
      return formBuilderStore.getSelectedField();
    },

    moveField: (
      fieldId,
      newIndex
    ) => {
      formBuilderStore.moveField(
        fieldId,
        newIndex
      );
    },

    moveFieldUp: (fieldId) => {
      formBuilderStore.moveFieldUp(
        fieldId
      );
    },

    moveFieldDown: (fieldId) => {
      formBuilderStore.moveFieldDown(
        fieldId
      );
    },

    addOption: (
      fieldId,
      label = "New Option",
      value
    ) => {
      formBuilderStore.addOption(
        fieldId,
        label,
        value
      );
    },

    updateOption: (
      fieldId,
      optionId,
      updates
    ) => {
      formBuilderStore.updateOption(
        fieldId,
        optionId,
        updates
      );
    },

    deleteOption: (
      fieldId,
      optionId
    ) => {
      formBuilderStore.deleteOption(
        fieldId,
        optionId
      );
    },

    setRequired: (
      fieldId,
      isRequired
    ) => {
      formBuilderStore.setRequired(
        fieldId,
        isRequired
      );
    },

    setPlaceholder: (
      fieldId,
      placeholder
    ) => {
      formBuilderStore.setPlaceholder(
        fieldId,
        placeholder
      );
    },

    setFieldDescription: (
      fieldId,
      description
    ) => {
      formBuilderStore.setFieldDescription(
        fieldId,
        description
      );
    },

    setDefaultValue: (
      fieldId,
      value
    ) => {
      formBuilderStore.setDefaultValue(
        fieldId,
        value
      );
    },

    setValidation: (
      fieldId,
      validation
    ) => {
      formBuilderStore.setValidation(
        fieldId,
        validation
      );
    },

    loadForm: (form) => {
      formBuilderStore.loadForm(form);
    },

    getPayload: () => {
      return formBuilderStore.getPayload();
    },

    markDirty: () => {
      formBuilderStore.markDirty();
    },

    markSaved: () => {
      formBuilderStore.markSaved();
    },

    reset: () => {
      formBuilderStore.reset();
    },
  };
};

export default useFormBuilder;