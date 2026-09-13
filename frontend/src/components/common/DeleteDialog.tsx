import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface DeleteDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteDialog = ({
  open,
  title = "Delete Item",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: DeleteDialogProps) => {
  const handleConfirm = () => {
    if (!loading) {
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
          <DeleteOutlineIcon color="error" />

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

        {itemName && (
          <Typography
            variant="body2"
            sx={{
              mt: 1.5,
              fontWeight: 600,
              wordBreak: "break-word",
            }}
          >
            {itemName}
          </Typography>
        )}
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
          disabled={loading}
          variant="contained"
          color="error"
          startIcon={<DeleteOutlineIcon />}
        >
          {loading ? "Deleting..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;