import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import Box from "@mui/material/Box";
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

export type ActivityLogStatus =
  | "success"
  | "failed"
  | "warning"
  | "info";

export interface ActivityLogTableData {
  id: number | string;
  userId?: number | string;
  userName?: string;
  userEmail?: string;
  action: string;
  description?: string;
  module?: string;
  status?: ActivityLogStatus;
  ipAddress?: string;
  createdAt?: string | Date;
}

interface ActivityLogTableProps {
  logs?: ActivityLogTableData[];
  loading?: boolean;
  onView?: (log: ActivityLogTableData) => void;
}

const formatDateTime = (value?: string | Date) => {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
};

const getStatusLabel = (status?: ActivityLogStatus) => {
  switch (status) {
    case "success":
      return "Success";
    case "failed":
      return "Failed";
    case "warning":
      return "Warning";
    case "info":
      return "Info";
    default:
      return "-";
  }
};

const getStatusColor = (
  status?: ActivityLogStatus,
): "success" | "error" | "warning" | "info" | "default" => {
  switch (status) {
    case "success":
      return "success";
    case "failed":
      return "error";
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "default";
  }
};

const ActivityLogTable = ({
  logs = [],
  loading = false,
  onView,
}: ActivityLogTableProps) => {
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const [selectedLog, setSelectedLog] =
    useState<ActivityLogTableData | null>(null);

  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (
    event: MouseEvent<HTMLButtonElement>,
    log: ActivityLogTableData,
  ) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedLog(log);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedLog(null);
  };

  const handleView = () => {
    if (selectedLog) {
      onView?.(selectedLog);
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
              <TableCell>User</TableCell>
              <TableCell>Action</TableCell>
              <TableCell>Module</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>IP Address</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index}>
                {Array.from({ length: 7 }).map(
                  (__, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton
                        variant="text"
                        width="80%"
                      />
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (logs.length === 0) {
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
          No activity logs found
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          There are no activity logs to display.
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
        <Table sx={{ minWidth: 1100 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography fontWeight={700}>
                  User
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={700}>
                  Action
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={700}>
                  Module
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={700}>
                  Status
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={700}>
                  IP Address
                </Typography>
              </TableCell>

              <TableCell>
                <Typography fontWeight={700}>
                  Date & Time
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
            {logs.map((log) => (
              <TableRow
                key={String(log.id)}
                hover
                sx={{
                  "&:last-child td, &:last-child th": {
                    border: 0,
                  },
                }}
              >
                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {log.userName || "System"}
                    </Typography>

                    {log.userEmail && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {log.userEmail}
                      </Typography>
                    )}
                  </Stack>
                </TableCell>

                <TableCell>
                  <Stack spacing={0.25}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      {log.action}
                    </Typography>

                    {log.description && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          maxWidth: 280,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {log.description}
                      </Typography>
                    )}
                  </Stack>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {log.module || "-"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box
                    component="span"
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 5,
                      fontSize: 12,
                      fontWeight: 600,
                      bgcolor:
                        log.status === "success"
                          ? "success.50"
                          : log.status === "failed"
                            ? "error.50"
                            : log.status === "warning"
                              ? "warning.50"
                              : log.status === "info"
                                ? "info.50"
                                : "action.hover",
                      color:
                        log.status === "success"
                          ? "success.main"
                          : log.status === "failed"
                            ? "error.main"
                            : log.status === "warning"
                              ? "warning.main"
                              : log.status === "info"
                                ? "info.main"
                                : "text.secondary",
                    }}
                  >
                    {getStatusLabel(log.status)}
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {log.ipAddress || "-"}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ whiteSpace: "nowrap" }}
                  >
                    {formatDateTime(log.createdAt)}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Actions">
                    <span>
                      <IconButton
                        size="small"
                        onClick={(event) =>
                          handleOpenMenu(event, log)
                        }
                        disabled={!onView}
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
              minWidth: 160,
              mt: 0.5,
              borderRadius: 2,
            },
          },
        }}
      >
        {onView && (
          <MenuItem onClick={handleView}>
            <ListItemIcon>
              <VisibilityOutlinedIcon fontSize="small" />
            </ListItemIcon>

            <ListItemText primary="View Details" />
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default ActivityLogTable;