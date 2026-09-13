import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  disabled?: boolean;
  confirmColor?:
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
  onConfirm: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

const ConfirmDialog = ({
  open,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  disabled = false,
  confirmColor = "primary",
  onConfirm,
  onCancel,
  children,
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    if (!loading && !disabled) {
      onConfirm();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <CheckCircleOutlineIcon color={confirmColor} />

          <Typography
            component="span"
            sx={{
              fontWeight: 700,
            }}
          >
            {title}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>

        {children}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={onCancel}
          disabled={loading}
          color="inherit"
        >
          {cancelText}
        </Button>

        <Button
          onClick={handleConfirm}
          disabled={loading || disabled}
          variant="contained"
          color={confirmColor}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;