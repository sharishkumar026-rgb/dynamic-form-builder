import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import type { MouseEvent } from "react";
import { useState } from "react";

export interface RoleTableData {
  id: number | string;
  name: string;
  description?: string;
  isActive?: boolean;
  userCount?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface RoleTableProps {
  roles?: RoleTableData[];
  loading?: boolean;
  onView?: (role: RoleTableData) => void;
  onEdit?: (role: RoleTableData) => void;
  onDelete?: (role: RoleTableData) => void;
  onToggleStatus?: (role: RoleTableData) => void;
}

const formatDate = (value?: string | Date) => {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString();
};

const RoleTable = ({
  roles = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
  onToggleStatus,
}: RoleTableProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRole, setSelectedRole] =
    useState<RoleTableData | null>(null);

  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (
    event: MouseEvent<HTMLButtonElement>,
    role: RoleTableData,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRole(role);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRole(null);
  };

  const handleAction = (
    callback?: (role: RoleTableData) => void,
  ) => {
    if (selectedRole) {
      callback?.(selectedRole);
    }

    handleCloseMenu();
  };

  const handleDelete = () => {
    if (selectedRole) {
      onDelete?.(selectedRole);
    }

    handleCloseMenu();
  };

  if (loading) {
    return (
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Role</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Users</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 6 }).map((__, cellIndex) => (
                  <TableCell key={cellIndex}>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (roles.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          p: 5,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
        >
          No roles found
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          There are no roles to display.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 850 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight={700}>
                  Role
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={700}>
                  Description
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={700}>
                  Users
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={700}>
                  Status
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={700}>
                  Created
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Typography fontWeight={700}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {roles.map((role) => (
              <TableRow
                key={String(role.id)}
                hover
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {role.name}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 320,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {role.description || "-"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {role.userCount ?? 0}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    size="small"
                    label={
                      role.isActive === false
                        ? "Inactive"
                        : "Active"
                    }
                    color={
                      role.isActive === false
                        ? "default"
                        : "success"
                    }
                    variant="outlined"
                    sx={{ fontWeight: 600 }}
                  />
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {formatDate(role.createdAt)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Actions">
                    <span>
                      <IconButton
                        size="small"
                        onClick={(event) =>
                          handleOpenMenu(event, role)
                        }
                        sx={{
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 1.5,
                        }}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            sx: {
              minWidth: 190,
              mt: 0.5,
              borderRadius: 2,
            },
          },
        }}
      >
        {onView && (
          <MenuItem onClick={() => handleAction(onView)}>
            <ListItemIcon>
              <VisibilityOutlinedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="View" />
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem onClick={() => handleAction(onEdit)}>
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Edit" />
          </MenuItem>
        )}

        {onToggleStatus && selectedRole && (
          <MenuItem
            onClick={() =>
              handleAction(onToggleStatus)
            }
          >
            <ListItemIcon>
              {selectedRole.isActive === false ? (
                <CheckCircleOutlineIcon fontSize="small" />
              ) : (
                <BlockOutlinedIcon fontSize="small" />
              )}
            </ListItemIcon>

            <ListItemText
              primary={
                selectedRole.isActive === false
                  ? "Activate"
                  : "Deactivate"
              }
            />
          </MenuItem>
        )}

        {onDelete && (
          <MenuItem
            onClick={handleDelete}
            sx={{
              color: "error.main",
            }}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="Delete" />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default RoleTable;