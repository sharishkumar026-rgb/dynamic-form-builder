
import { useEffect, useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export interface CreateFormData {
  title: string;
  description: string;
}

interface CreateFormDialogProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateFormData) => void;
}

const CreateFormDialog = ({
  open,
  loading = false,
  onClose,
  onSubmit,
}: CreateFormDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [titleError, setTitleError] =
    useState("");

  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setTitleError("");
    }
  }, [open]);

  const handleTitleChange = (
    value: string,
  ) => {
    setTitle(value);

    if (titleError && value.trim()) {
      setTitleError("");
    }
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setTitleError("Form title is required.");
      return;
    }

    if (trimmedTitle.length < 2) {
      setTitleError(
        "Form title must be at least 2 characters.",
      );
      return;
    }

    if (trimmedTitle.length > 200) {
      setTitleError(
        "Form title must not exceed 200 characters.",
      );
      return;
    }

    onSubmit({
      title: trimmedTitle,
      description: description.trim(),
    });
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          pr: 6,
          fontWeight: 700,
        }}
      >
        Create New Form

        <IconButton
          onClick={handleClose}
          disabled={loading}
          aria-label="Close"
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 0.5 }}>
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Create a new form by providing a
              title and optional description.
            </Typography>

            <TextField
              fullWidth
              required
              label="Form Title"
              placeholder="Enter form title"
              value={title}
              onChange={(event) =>
                handleTitleChange(
                  event.target.value,
                )
              }
              error={Boolean(titleError)}
              helperText={
                titleError ||
                `${title.length}/200 characters`
              }
              disabled={loading}
              autoFocus
              inputProps={{
                maxLength: 200,
              }}
            />
          </Box>

          <TextField
            fullWidth
            label="Description"
            placeholder="Enter form description"
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            disabled={loading}
            multiline
            rows={4}
            helperText="Optional"
          />
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={loading}
          color="inherit"
        >
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={<AddIcon />}
        >
          {loading
            ? "Creating..."
            : "Create Form"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateFormDialog;