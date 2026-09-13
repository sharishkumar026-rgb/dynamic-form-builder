import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
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
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState, type MouseEvent } from "react";

import type { ReportCardData, ReportStatus } from "./ReportCard";

interface ReportTableProps {
  reports?: ReportCardData[];
  loading?: boolean;
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onView?: (report: ReportCardData) => void;
  onEdit?: (report: ReportCardData) => void;
  onDelete?: (report: ReportCardData) => void;
  onRun?: (report: ReportCardData) => void;
  onShare?: (report: ReportCardData) => void;
}

const formatDate = (value?: string | Date) => {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString();
};

const getStatusColor = (
  status: ReportStatus,
): "success" | "default" | "warning" | "error" => {
  switch (status) {
    case "active":
      return "success";
    case "draft":
      return "warning";
    case "archived":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status?: ReportStatus) => {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return "Active";
  }
};

const ReportTable = ({
  reports = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onDelete,
  onRun,
  onShare,
}: ReportTableProps) => {
  const [menuAnchor, setMenuAnchor] =
    useState<null | HTMLElement>(null);
  const [selectedReport, setSelectedReport] =
    useState<ReportCardData | null>(null);

  const menuOpen = Boolean(menuAnchor);

  const handleMenuOpen = (
    event: MouseEvent<HTMLElement>,
    report: ReportCardData,
  ) => {
    setMenuAnchor(event.currentTarget);
    setSelectedReport(report);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedReport(null);
  };

  const handleAction = (
    callback?: (report: ReportCardData) => void,
  ) => {
    if (selectedReport) {
      callback?.(selectedReport);
    }

    handleMenuClose();
  };

  const handlePageChange = (
    _event: unknown,
    newPage: number,
  ) => {
    onPageChange?.(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newRowsPerPage = Number(event.target.value);

    onRowsPerPageChange?.(newRowsPerPage);
    onPageChange?.(0);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 700,
                  backgroundColor: "action.hover",
                }}
              >
                Report
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  backgroundColor: "action.hover",
                }}
              >
                Type
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  backgroundColor: "action.hover",
                }}
              >
                Status
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  backgroundColor: "action.hover",
                }}
              >
                Created By
              </TableCell>

              <TableCell
                sx={{
                  fontWeight: 700,
                  backgroundColor: "action.hover",
                }}
              >
                Updated
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  backgroundColor: "action.hover",
                }}
              >
                Records
              </TableCell>

              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  backgroundColor: "action.hover",
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading &&
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={`loading-${index}`}>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Skeleton
                        variant="text"
                        width="70%"
                        height={24}
                      />
                      <Skeleton
                        variant="text"
                        width="90%"
                        height={18}
                      />
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Skeleton
                      variant="rounded"
                      width={80}
                      height={24}
                    />
                  </TableCell>

                  <TableCell>
                    <Skeleton
                      variant="rounded"
                      width={75}
                      height={24}
                    />
                  </TableCell>

                  <TableCell>
                    <Skeleton
                      variant="text"
                      width={100}
                    />
                  </TableCell>

                  <TableCell>
                    <Skeleton
                      variant="text"
                      width={90}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Skeleton
                      variant="text"
                      width={60}
                      sx={{ ml: "auto" }}
                    />
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

            {!loading && reports.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={7}
                  align="center"
                  sx={{ py: 7 }}
                >
                  <Stack
                    spacing={1}
                    alignItems="center"
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                    >
                      No reports found
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Reports will appear here once they are
                      created.
                    </Typography>
                  </Stack>
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              reports.map((report) => {
                const status = report.status ?? "active";

                return (
                  <TableRow
                    key={report.id}
                    hover
                    sx={{
                      "&:last-child td": {
                        borderBottom: 0,
                      },
                    }}
                  >
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: 1.5,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "primary.50",
                            color: "primary.main",
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={700}
                          >
                            R
                          </Typography>
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{
                              cursor: onView
                                ? "pointer"
                                : "default",
                              "&:hover": onView
                                ? {
                                    color: "primary.main",
                                  }
                                : undefined,
                            }}
                            onClick={() =>
                              onView?.(report)
                            }
                          >
                            {report.name}
                          </Typography>

                          {report.description && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "block",
                                maxWidth: 300,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {report.description}
                            </Typography>
                          )}
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {report.reportType ? (
                        <Chip
                          label={report.reportType}
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={getStatusLabel(status)}
                        color={getStatusColor(status)}
                        variant="outlined"
                        size="small"
                        sx={{
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {report.createdBy ?? "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(
                          report.updatedAt ??
                            report.createdAt,
                        )}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        variant="body2"
                        fontWeight={700}
                      >
                        {report.recordCount !== undefined
                          ? report.recordCount.toLocaleString()
                          : "—"}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="More actions">
                        <IconButton
                          size="small"
                          onClick={(event) =>
                            handleMenuOpen(event, report)
                          }
                          aria-label="More report actions"
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount ?? reports.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      <Menu
        anchorEl={menuAnchor}
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
          <MenuItem onClick={() => handleAction(onView)}>
            <ListItemIcon>
              <VisibilityOutlinedIcon fontSize="small" />
            </ListItemIcon>
            View report
          </MenuItem>
        )}

        {onRun && (
          <MenuItem onClick={() => handleAction(onRun)}>
            <ListItemIcon>
              <PlayArrowOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Run report
          </MenuItem>
        )}

        {onEdit && (
          <MenuItem onClick={() => handleAction(onEdit)}>
            <ListItemIcon>
              <EditOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Edit report
          </MenuItem>
        )}

        {onShare && (
          <MenuItem onClick={() => handleAction(onShare)}>
            <ListItemIcon>
              <ShareOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Share report
          </MenuItem>
        )}

        {onDelete && (
          <MenuItem
            onClick={() => handleAction(onDelete)}
            sx={{
              color: "error.main",
            }}
          >
            <ListItemIcon
              sx={{
                color: "error.main",
              }}
            >
              <DeleteOutlineIcon fontSize="small" />
            </ListItemIcon>
            Delete report
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default ReportTable;