
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";

export interface FormActionData {
  id: number | string;
  title: string;
  isActive?: boolean;
}

interface FormActionsProps {
  form: FormActionData;
  onView?: (form: FormActionData) => void;
  onEdit?: (form: FormActionData) => void;
  onDelete?: (form: FormActionData) => void;
  onToggleStatus?: (form: FormActionData) => void;
  variant?: "icons" | "buttons";
}

const FormActions = ({
  form,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
  variant = "icons",
}: FormActionsProps) => {
  const handleView = () => {
    if (onView) {
      onView(form);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(form);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(form);
    }
  };

  const handleToggleStatus = () => {
    if (onToggleStatus) {
      onToggleStatus(form);
    }
  };

  if (variant === "buttons") {
    return (
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
      >
        {onView && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<VisibilityOutlinedIcon />}
            onClick={handleView}
          >
            View
          </Button>
        )}

        {onEdit && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        )}

        {onToggleStatus && (
          <Button
            size="small"
            variant="outlined"
            color={
              form.isActive === false
                ? "success"
                : "warning"
            }
            startIcon={<PowerSettingsNewIcon />}
            onClick={handleToggleStatus}
          >
            {form.isActive === false
              ? "Activate"
              : "Deactivate"}
          </Button>
        )}

        {onDelete && (
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        )}
      </Stack>
    );
  }

  return (
    <Box>
      <Stack
        direction="row"
        spacing={0.5}
        justifyContent="flex-end"
      >
        {onView && (
          <Tooltip title="View form">
            <IconButton
              size="small"
              onClick={handleView}
              aria-label={`View ${form.title}`}
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {onEdit && (
          <Tooltip title="Edit form">
            <IconButton
              size="small"
              onClick={handleEdit}
              aria-label={`Edit ${form.title}`}
            >
              <EditOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {onToggleStatus && (
          <Tooltip
            title={
              form.isActive === false
                ? "Activate form"
                : "Deactivate form"
            }
          >
            <IconButton
              size="small"
              color={
                form.isActive === false
                  ? "success"
                  : "warning"
              }
              onClick={handleToggleStatus}
              aria-label={
                form.isActive === false
                  ? `Activate ${form.title}`
                  : `Deactivate ${form.title}`
              }
            >
              <PowerSettingsNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {onDelete && (
          <Tooltip title="Delete form">
            <IconButton
              size="small"
              color="error"
              onClick={handleDelete}
              aria-label={`Delete ${form.title}`}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Box>
  );
};

export default FormActions;

