
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useState, type MouseEvent } from "react";

export interface FormCardData {
  id: number | string;
  title: string;
  description?: string;
  isActive?: boolean;
  fieldCount?: number;
  responseCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface FormCardProps {
  form: FormCardData;
  onView?: (form: FormCardData) => void;
  onEdit?: (form: FormCardData) => void;
  onDelete?: (form: FormCardData) => void;
  onToggleStatus?: (form: FormCardData) => void;
}

const formatDate = (
  value?: string | Date,
): string => {
  if (!value) {
    return "No date available";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const FormCard = ({
  form,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: FormCardProps) => {
  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);

  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (
    event: MouseEvent<HTMLElement>,
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    handleMenuClose();

    if (onView) {
      onView(form);
    }
  };

  const handleEdit = () => {
    handleMenuClose();

    if (onEdit) {
      onEdit(form);
    }
  };

  const handleDelete = () => {
    handleMenuClose();

    if (onDelete) {
      onDelete(form);
    }
  };

  const handleToggleStatus = () => {
    handleMenuClose();

    if (onToggleStatus) {
      onToggleStatus(form);
    }
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        transition: "box-shadow 0.2s ease",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Stack spacing={2}>
          {/* Header */}
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={1}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{
                minWidth: 0,
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "action.hover",
                  color: "primary.main",
                }}
              >
                <DescriptionOutlinedIcon />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  noWrap
                  sx={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
                  {form.title}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Form #{form.id}
                </Typography>
              </Box>
            </Stack>

            {(onView ||
              onEdit ||
              onDelete ||
              onToggleStatus) && (
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                aria-label={`Actions for ${form.title}`}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
          </Stack>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              minHeight: 42,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {form.description ||
              "No description available."}
          </Typography>

          {/* Status */}
          <Box>
            <Chip
              label={
                form.isActive === false
                  ? "Inactive"
                  : "Active"
              }
              size="small"
              color={
                form.isActive === false
                  ? "default"
                  : "success"
              }
              variant="outlined"
            />
          </Box>

          {/* Statistics */}
          <Stack
            direction="row"
            spacing={3}
            sx={{
              pt: 1.5,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                }}
              >
                Fields
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                }}
              >
                {form.fieldCount ?? 0}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                }}
              >
                Responses
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                }}
              >
                {form.responseCount ?? 0}
              </Typography>
            </Box>

            <Box sx={{ ml: "auto" }}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                }}
              >
                Updated
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                }}
              >
                {formatDate(
                  form.updatedAt ||
                    form.createdAt,
                )}
              </Typography>
            </Box>
          </Stack>

          {/* Action Menu */}
          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {onView && (
              <MenuItem onClick={handleView}>
                View Form
              </MenuItem>
            )}

            {onEdit && (
              <MenuItem onClick={handleEdit}>
                Edit Form
              </MenuItem>
            )}

            {onToggleStatus && (
              <MenuItem
                onClick={handleToggleStatus}
              >
                {form.isActive === false
                  ? "Activate Form"
                  : "Deactivate Form"}
              </MenuItem>
            )}

            {onDelete && (
              <MenuItem
                onClick={handleDelete}
                sx={{
                  color: "error.main",
                }}
              >
                Delete Form
              </MenuItem>
            )}
          </Menu>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FormCard;



