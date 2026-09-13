
import { useState, type MouseEvent } from "react";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

export interface FormTableData {
  id: number | string;
  title: string;
  description?: string;
  isActive?: boolean;
  fieldCount?: number;
  responseCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface FormTableProps {
  forms?: FormTableData[];
  loading?: boolean;
  onView?: (form: FormTableData) => void;
  onEdit?: (form: FormTableData) => void;
  onDelete?: (form: FormTableData) => void;
  onToggleStatus?: (form: FormTableData) => void;
}

const formatDate = (
  value?: string | Date,
): string => {
  if (!value) {
    return "-";
  }

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const FormTable = ({
  forms = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: FormTableProps) => {
  const [anchorEl, setAnchorEl] =
    useState<HTMLElement | null>(null);

  const [selectedForm, setSelectedForm] =
    useState<FormTableData | null>(null);

  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (
    event: MouseEvent<HTMLElement>,
    form: FormTableData,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedForm(form);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedForm(null);
  };

  const handleView = () => {
    if (selectedForm && onView) {
      onView(selectedForm);
    }

    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedForm && onEdit) {
      onEdit(selectedForm);
    }

    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedForm && onDelete) {
      onDelete(selectedForm);
    }

    handleMenuClose();
  };

  const handleToggleStatus = () => {
    if (selectedForm && onToggleStatus) {
      onToggleStatus(selectedForm);
    }

    handleMenuClose();
  };

  const hasActions =
    Boolean(onView) ||
    Boolean(onEdit) ||
    Boolean(onDelete) ||
    Boolean(onToggleStatus);

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: 850,
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "action.hover",
              }}
            >
              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Form
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Status
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Fields
              </TableCell>

              <TableCell
                align="center"
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Responses
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Created
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                Updated
              </TableCell>

              {hasActions && (
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading &&
              [1, 2, 3, 4, 5].map((item) => (
                <TableRow key={item}>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Skeleton
                        variant="rounded"
                        width={40}
                        height={40}
                      />

                      <Box>
                        <Skeleton
                          variant="text"
                          width={180}
                        />

                        <Skeleton
                          variant="text"
                          width={120}
                        />
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Skeleton
                      variant="rounded"
                      width={70}
                      height={24}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Skeleton
                      variant="text"
                      width={30}
                      sx={{ mx: "auto" }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Skeleton
                      variant="text"
                      width={30}
                      sx={{ mx: "auto" }}
                    />
                  </TableCell>

                  <TableCell>
                    <Skeleton
                      variant="text"
                      width={90}
                    />
                  </TableCell>

                  <TableCell>
                    <Skeleton
                      variant="text"
                      width={90}
                    />
                  </TableCell>

                  {hasActions && (
                    <TableCell align="right">
                      <Skeleton
                        variant="circular"
                        width={32}
                        height={32}
                        sx={{ ml: "auto" }}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}

            {!loading &&
              forms.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={hasActions ? 7 : 6}
                  >
                    <Box
                      sx={{
                        py: 7,
                        textAlign: "center",
                      }}
                    >
                      <DescriptionOutlinedIcon
                        sx={{
                          fontSize: 48,
                          color: "text.disabled",
                          mb: 1,
                        }}
                      />

                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        No forms found
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        Forms will appear here once
                        they are created.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}

            {!loading &&
              forms.map((form) => (
                <TableRow
                  key={form.id}
                  hover
                  sx={{
                    "&:last-child td": {
                      borderBottom: 0,
                    },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        minWidth: 220,
                        maxWidth: 360,
                      }}
                    >
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          flexShrink: 0,
                          borderRadius: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "action.hover",
                          color: "primary.main",
                        }}
                      >
                        <DescriptionOutlinedIcon
                          fontSize="small"
                        />
                      </Box>

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {form.title}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                          noWrap
                          sx={{
                            display: "block",
                          }}
                        >
                          {form.description ||
                            `Form #${form.id}`}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
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
                  </TableCell>

                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {form.fieldCount ?? 0}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {form.responseCount ?? 0}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                    >
                      {formatDate(form.createdAt)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      noWrap
                    >
                      {formatDate(
                        form.updatedAt ||
                          form.createdAt,
                      )}
                    </Typography>
                  </TableCell>

                  {hasActions && (
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        aria-label={`Actions for ${form.title}`}
                        onClick={(event) =>
                          handleMenuOpen(
                            event,
                            form,
                          )
                        }
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

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
            {selectedForm?.isActive === false
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
    </Card>
  );
};

export default FormTable;


