import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { useState } from "react";

export interface UserTableData {
  id: number | string;
  name: string;
  email: string;
  role?: string;
  roleId?: number | string;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

interface UserTableProps {
  users?: UserTableData[];
  loading?: boolean;
  onEdit?: (user: UserTableData) => void;
  onDelete?: (user: UserTableData) => void;
  onToggleStatus?: (user: UserTableData) => void;
  onView?: (user: UserTableData) => void;
}

const formatDate = (value?: string | Date) => {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString();
};

const getRoleLabel = (user: UserTableData) => {
  if (user.role) {
    return user.role;
  }

  if (user.roleId !== undefined) {
    return `Role ${user.roleId}`;
  }

  return "User";
};

const UserTable = ({
  users = [],
  loading = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onView,
}: UserTableProps) => {
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const [selectedUser, setSelectedUser] =
    useState<UserTableData | null>(null);

  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    user: UserTableData,
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleView = () => {
    if (selectedUser) {
      onView?.(selectedUser);
    }

    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedUser) {
      onEdit?.(selectedUser);
    }

    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedUser) {
      onDelete?.(selectedUser);
    }

    handleMenuClose();
  };

  const handleToggleStatus = () => {
    if (selectedUser) {
      onToggleStatus?.(selectedUser);
    }

    handleMenuClose();
  };

  if (loading) {
    return (
      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={`user-loading-${index}`}>
                  <TableCell>
                    <StackLoading />
                  </TableCell>

                  <TableCell>
                    <Skeleton width={180} />
                  </TableCell>

                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>

                  <TableCell>
                    <Skeleton width={80} />
                  </TableCell>

                  <TableCell>
                    <Skeleton width={100} />
                  </TableCell>

                  <TableCell align="right">
                    <Skeleton
                      variant="circular"
                      width={36}
                      height={36}
                      sx={{ ml: "auto" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    );
  }

  if (users.length === 0) {
    return (
      <Paper
        variant="outlined"
        sx={{
          minHeight: 260,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box textAlign="center">
          <PersonOutlineIcon
            sx={{
              fontSize: 48,
              color: "text.disabled",
              mb: 1,
            }}
          />

          <Typography
            variant="subtitle1"
            fontWeight={600}
          >
            No users found
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            There are no users matching the current filters.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => {
              const isActive = user.isActive !== false;

              return (
                <TableRow
                  key={String(user.id)}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "action.hover",
                          color: "primary.main",
                          flexShrink: 0,
                        }}
                      >
                        <PersonOutlineIcon fontSize="small" />
                      </Box>

                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          noWrap
                        >
                          {user.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          ID: {user.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">
                      {user.email}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={getRoleLabel(user)}
                      size="small"
                      variant="outlined"
                      sx={{
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Chip
                      icon={
                        isActive ? (
                          <CheckCircleOutlineIcon />
                        ) : (
                          <CancelOutlinedIcon />
                        )
                      }
                      label={isActive ? "Active" : "Inactive"}
                      size="small"
                      color={isActive ? "success" : "default"}
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {formatDate(user.createdAt)}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={(event) =>
                        handleMenuOpen(event, user)
                      }
                      aria-label={`Actions for ${user.name}`}
                      aria-controls={
                        menuOpen
                          ? "user-actions-menu"
                          : undefined
                      }
                      aria-haspopup="menu"
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        id="user-actions-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 180,
              borderRadius: 2,
            },
          },
        }}
      >
        {onView && (
          <MenuItem onClick={handleView}>
            <PersonOutlineIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />
            View User
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem onClick={handleEdit}>
            <EditOutlinedIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />
            Edit User
          </MenuItem>
        )}

        {onToggleStatus && selectedUser && (
          <MenuItem onClick={handleToggleStatus}>
            {selectedUser.isActive !== false ? (
              <CancelOutlinedIcon
                fontSize="small"
                sx={{ mr: 1.5 }}
              />
            ) : (
              <CheckCircleOutlineIcon
                fontSize="small"
                sx={{ mr: 1.5 }}
              />
            )}

            {selectedUser.isActive !== false
              ? "Deactivate User"
              : "Activate User"}
          </MenuItem>
        )}

        {onDelete && (
          <MenuItem
            onClick={handleDelete}
            sx={{
              color: "error.main",
            }}
          >
            <DeleteOutlineIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />
            Delete User
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

const StackLoading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
      }}
    >
      <Skeleton
        variant="circular"
        width={38}
        height={38}
      />

      <Box>
        <Skeleton width={120} />
        <Skeleton width={70} />
      </Box>
    </Box>
  );
};

export default UserTable;