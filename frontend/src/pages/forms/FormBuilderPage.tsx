import { useMemo, useState, type DragEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import BuilderHeader from "../../components/form-builder/BuilderHeader";
import BuilderLayout from "../../components/form-builder/BuilderLayout";

import FieldPalette, {
  type FieldType,
} from "../../components/form-builder/FieldPalette";

import FieldSettings, {
  type FieldSettingsData,
} from "../../components/form-builder/FieldSettings";


interface BuilderField extends FieldSettingsData {
  id: number | string;
}


const getDefaultLabel = (
  type: FieldType,
): string => {
  const labels: Record<FieldType, string> = {
    text: "Short Text",
    textarea: "Long Text",
    email: "Email Address",
    number: "Number",
    date: "Date",
    select: "Select Option",
    radio: "Choose an Option",
    checkbox: "Select Options",
    rating: "Rating",
    file: "Upload File",
    toggle: "Toggle",
  };

  return labels[type];
};


const getDefaultPlaceholder = (
  type: FieldType,
): string => {
  const placeholders: Partial<
    Record<FieldType, string>
  > = {
    text: "Enter your answer",
    textarea: "Enter your answer",
    email: "Enter your email address",
    number: "Enter a number",
  };

  return placeholders[type] || "";
};


const FormBuilderPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const [fields, setFields] =
    useState<BuilderField[]>([]);

  const [
    selectedFieldId,
    setSelectedFieldId,
  ] = useState<number | string | null>(
    null,
  );

  const [saving, setSaving] =
    useState(false);

  const [
    hasUnsavedChanges,
    setHasUnsavedChanges,
  ] = useState(false);


  // ==========================================
  // SELECTED FIELD
  // ==========================================

  const selectedField = useMemo(() => {
    if (selectedFieldId === null) {
      return null;
    }

    return (
      fields.find(
        (field) =>
          field.id === selectedFieldId,
      ) || null
    );
  }, [
    fields,
    selectedFieldId,
  ]);


  // ==========================================
  // ADD FIELD
  // ==========================================

  const handleAddField = (
    type: FieldType,
  ) => {
    const newField: BuilderField = {
      id: Date.now(),
      type,
      label: getDefaultLabel(type),
      description: "",
      placeholder:
        getDefaultPlaceholder(type),
      required: false,
      hidden: false,
    };

    setFields((previousFields) => [
      ...previousFields,
      newField,
    ]);

    setSelectedFieldId(
      newField.id,
    );

    setHasUnsavedChanges(true);
  };


  // ==========================================
  // DRAG OVER
  // ==========================================

  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "copy";
  };


  // ==========================================
  // DROP FIELD
  // ==========================================

  const handleDrop = (
    event: DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    const fieldType =
      event.dataTransfer.getData(
        "application/form-field-type",
      ) as FieldType;

    if (!fieldType) {
      return;
    }

    handleAddField(fieldType);
  };


  // ==========================================
  // UPDATE FIELD
  // ==========================================

  const handleFieldChange = (
    updatedField: FieldSettingsData,
  ) => {
    setFields((previousFields) =>
      previousFields.map((field) =>
        field.id === updatedField.id
          ? {
              ...field,
              ...updatedField,
            }
          : field,
      ),
    );

    setHasUnsavedChanges(true);
  };


  // ==========================================
  // DELETE FIELD
  // ==========================================

  const handleDeleteField = (
    fieldId: number | string,
  ) => {
    setFields((previousFields) =>
      previousFields.filter(
        (field) =>
          field.id !== fieldId,
      ),
    );

    if (
      selectedFieldId === fieldId
    ) {
      setSelectedFieldId(null);
    }

    setHasUnsavedChanges(true);
  };


  // ==========================================
  // SAVE FORM
  // ==========================================

  const handleSave = async () => {
    setSaving(true);

    try {
      /*
       * API integration will go here.
       */

      await new Promise(
        (resolve) =>
          setTimeout(resolve, 800),
      );

      setHasUnsavedChanges(false);
    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // PREVIEW FORM
  // ==========================================

  const handlePreview = () => {
    if (id) {
      navigate(
        `/forms/${id}/preview`,
      );

      return;
    }

    alert(
      "Please save the form before opening preview.",
    );
  };


  // ==========================================
  // BACK
  // ==========================================

  const handleBack = () => {
    navigate("/forms");
  };


  return (
    <BuilderLayout
      header={
        <BuilderHeader
          title={
            id
              ? "Edit Form"
              : "Create Form"
          }
          subtitle={
            id
              ? "Build and configure your form fields"
              : "Create your dynamic form"
          }
          saving={saving}
          hasUnsavedChanges={
            hasUnsavedChanges
          }
          onBack={handleBack}
          onSave={handleSave}
          onPreview={handlePreview}
        />
      }

      leftPanel={
        <FieldPalette
          onAddField={
            handleAddField
          }
        />
      }

      rightPanel={
        <FieldSettings
          field={selectedField}
          onChange={
            handleFieldChange
          }
        />
      }
    >
      <Box
        onDragOver={
          handleDragOver
        }
        onDrop={handleDrop}
        sx={{
          minHeight: 500,
        }}
      >
        {/* FORM HEADER */}

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight={700}
          >
            {id
              ? "Form Builder"
              : "New Form"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Add fields from the left panel
            and configure them using the
            settings panel.
          </Typography>
        </Box>


        {/* EMPTY STATE */}

        {fields.length === 0 && (
          <Card
            sx={{
              border: 2,
              borderStyle: "dashed",
              borderColor: "divider",
              boxShadow: "none",
              backgroundColor:
                "background.paper",
            }}
          >
            <CardContent
              sx={{
                py: 8,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Start building your form
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  mb: 3,
                }}
              >
                Click a field from the
                left panel or drag it into
                this area.
              </Typography>

              <Button
                variant="contained"
                startIcon={
                  <AddIcon />
                }
                onClick={() =>
                  handleAddField("text")
                }
              >
                Add First Field
              </Button>
            </CardContent>
          </Card>
        )}


        {/* FIELD LIST */}

        <Stack spacing={2}>
          {fields.map(
            (field, index) => {
              const isSelected =
                selectedFieldId ===
                field.id;

              return (
                <Card
                  key={field.id}
                  onClick={() =>
                    setSelectedFieldId(
                      field.id,
                    )
                  }
                  sx={{
                    cursor: "pointer",
                    border: 2,
                    borderColor:
                      isSelected
                        ? "primary.main"
                        : "divider",
                    transition:
                      "border-color 0.2s, box-shadow 0.2s",
                    boxShadow:
                      isSelected
                        ? 3
                        : 0,
                    "&:hover": {
                      borderColor:
                        "primary.main",
                    },
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Field{" "}
                          {index + 1}
                          {" • "}
                          {field.type}
                        </Typography>

                        <Typography
                          variant="subtitle1"
                          fontWeight={700}
                          sx={{
                            mt: 0.5,
                          }}
                        >
                          {field.label}

                          {field.required &&
                            " *"}
                        </Typography>

                        {field.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.5,
                            }}
                          >
                            {
                              field.description
                            }
                          </Typography>
                        )}

                        {field.hidden && (
                          <Typography
                            variant="caption"
                            color="warning.main"
                            sx={{
                              display:
                                "block",
                              mt: 1,
                            }}
                          >
                            This field is
                            hidden
                          </Typography>
                        )}
                      </Box>


                      <Tooltip
                        title="Delete field"
                      >
                        <IconButton
                          color="error"
                          onClick={(
                            event,
                          ) => {
                            event.stopPropagation();

                            handleDeleteField(
                              field.id,
                            );
                          }}
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>


                    <Divider
                      sx={{
                        my: 2,
                      }}
                    />


                    {/* FIELD PREVIEW */}

                    {field.type ===
                      "textarea" ? (
                      <Box
                        sx={{
                          height: 90,
                          border: 1,
                          borderColor:
                            "divider",
                          borderRadius: 1,
                          p: 1.5,
                          color:
                            "text.disabled",
                        }}
                      >
                        {field.placeholder ||
                          "Enter your answer"}
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          height: 42,
                          border: 1,
                          borderColor:
                            "divider",
                          borderRadius: 1,
                          display:
                            "flex",
                          alignItems:
                            "center",
                          px: 1.5,
                          color:
                            "text.disabled",
                        }}
                      >
                        {field.placeholder ||
                          `Enter ${field.label.toLowerCase()}`}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              );
            },
          )}
        </Stack>
      </Box>
    </BuilderLayout>
  );
};


export default FormBuilderPage;

