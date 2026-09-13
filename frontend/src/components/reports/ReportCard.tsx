import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useState, type MouseEvent } from "react";

export type ReportStatus =
  | "active"
  | "inactive"
  | "draft"
  | "archived";

export interface ReportCardData {
  id: number | string;
  name: string;
  description?: string;
  status?: ReportStatus;
  reportType?: string;
  createdBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  lastGeneratedAt?: string | Date;
  recordCount?: number;
}

interface ReportCardProps {
  report: ReportCardData;
  loading?: boolean;
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
    case "inactive":
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

const ReportCard = ({
  report,
  loading = false,
  onView,
  onEdit,
  onDelete,
  onRun,
  onShare,
}: ReportCardProps) => {
  const [menuAnchor, setMenuAnchor] =
    useState<null | HTMLElement>(null);

  const menuOpen = Boolean(menuAnchor);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleAction = (
    callback?: (report: ReportCardData) => void,
  ) => {
    handleMenuClose();
    callback?.(report);
  };

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          height: "100%",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  backgroundColor: "action.hover",
                }}
              />

              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  backgroundColor: "action.hover",
                }}
              />
            </Stack>

            <Box
              sx={{
                width: "65%",
                height: 24,
                borderRadius: 1,
                backgroundColor: "action.hover",
              }}
            />

            <Box
              sx={{
                width: "90%",
                height: 18,
                borderRadius: 1,
                backgroundColor: "action.hover",
              }}
            />

            <Box
              sx={{
                width: "100%",
                height: 1,
                backgroundColor: "divider",
              }}
            />

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Box
                sx={{
                  width: 90,
                  height: 24,
                  borderRadius: 10,
                  backgroundColor: "action.hover",
                }}
              />

              <Box
                sx={{
                  width: 100,
                  height: 18,
                  borderRadius: 1,
                  backgroundColor: "action.hover",
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const status = report.status ?? "active";

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: 2,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "primary.50",
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              <AssessmentOutlinedIcon />
            </Box>

            <Tooltip title="More actions">
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                aria-label="More report actions"
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <Box>
            <Typography
              variant="h6"
              component="h2"
              fontWeight={700}
              sx={{
                cursor: onView ? "pointer" : "default",
                wordBreak: "break-word",
                "&:hover": onView
                  ? {
                      color: "primary.main",
                    }
                  : undefined,
              }}
              onClick={() => onView?.(report)}
            >
              {report.name}
            </Typography>

            {report.description && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.75,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.6,
                }}
              >
                {report.description}
              </Typography>
            )}
          </Box>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            useFlexGap
          >
            <Chip
              label={getStatusLabel(status)}
              color={getStatusColor(status)}
              variant="outlined"
              size="small"
              sx={{ fontWeight: 600 }}
            />

            {report.reportType && (
              <Chip
                label={report.reportType}
                variant="outlined"
                size="small"
              />
            )}
          </Stack>

          <Divider />

          <Stack spacing={1.25}>
            {report.createdBy && (
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Created by
                </Typography>

                <Typography
                  variant="caption"
                  fontWeight={600}
                  textAlign="right"
                >
                  {report.createdBy}
                </Typography>
              </Stack>
            )}

            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={2}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Updated
              </Typography>

              <Typography
                variant="caption"
                fontWeight={600}
              >
                {formatDate(report.updatedAt ?? report.createdAt)}
              </Typography>
            </Stack>

            {report.recordCount !== undefined && (
              <Stack
                direction="row"
                justifyContent="space-between"
                spacing={2}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Records
                </Typography>

                <Typography
                  variant="caption"
                  fontWeight={700}
                >
                  {report.recordCount.toLocaleString()}
                </Typography>
              </Stack>
            )}
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            justifyContent="flex-end"
          >
            {onView && (
              <Tooltip title="View report">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={() => onView(report)}
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {onRun && (
              <Tooltip title="Run report">
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => onRun(report)}
                >
                  <PlayArrowOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {onEdit && (
              <Tooltip title="Edit report">
                <IconButton
                  size="small"
                  onClick={() => onEdit(report)}
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </CardContent>

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
    </Card>
  );
};

export default ReportCard;