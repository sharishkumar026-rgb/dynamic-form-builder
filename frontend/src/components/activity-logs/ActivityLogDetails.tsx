import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ActivityLogTableData } from "./ActivityLogTable";

interface ActivityLogDetailsProps {
  log: ActivityLogTableData | null;
  loading?: boolean;
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

const getStatusColor = (
  status?: ActivityLogTableData["status"],
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

const getStatusLabel = (
  status?: ActivityLogTableData["status"],
) => {
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
      return "Unknown";
  }
};

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const DetailItem = ({
  icon,
  label,
  value,
}: DetailItemProps) => {
  return (
    <Stack direction="row" spacing={1.5} alignItems="flex-start">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          flexShrink: 0,
          borderRadius: 1.5,
          bgcolor: "action.hover",
          color: "primary.main",
        }}
      >
        {icon}
      </Box>

      <Stack spacing={0.25} minWidth={0}>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={500}
        >
          {label}
        </Typography>

        <Typography
          variant="body2"
          fontWeight={600}
          sx={{
            wordBreak: "break-word",
          }}
        >
          {value || "-"}
        </Typography>
      </Stack>
    </Stack>
  );
};

const ActivityLogDetails = ({
  log,
  loading = false,
}: ActivityLogDetailsProps) => {
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          p: 3,
        }}
      >
        <Stack spacing={2}>
          <Box
            sx={{
              height: 28,
              width: "40%",
              bgcolor: "action.hover",
              borderRadius: 1,
            }}
          />

          <Box
            sx={{
              height: 18,
              width: "70%",
              bgcolor: "action.hover",
              borderRadius: 1,
            }}
          />

          <Divider />

          <Grid container spacing={3}>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid
                key={index}
                size={{ xs: 12, sm: 6 }}
              >
                <Box
                  sx={{
                    height: 45,
                    bgcolor: "action.hover",
                    borderRadius: 1,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Paper>
    );
  }

  if (!log) {
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
        <DescriptionOutlinedIcon
          sx={{
            fontSize: 42,
            color: "text.secondary",
            mb: 1,
          }}
        />

        <Typography
          variant="h6"
          fontWeight={600}
          gutterBottom
        >
          No activity log selected
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Select an activity log to view its details.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Stack spacing={0}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            spacing={2}
          >
            <Stack spacing={0.5}>
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Activity Log Details
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Activity information and audit details.
              </Typography>
            </Stack>

            <Chip
              label={getStatusLabel(log.status)}
              color={getStatusColor(log.status)}
              size="small"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Box>

        <Divider />

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={
                  <NumbersOutlinedIcon fontSize="small" />
                }
                label="Log ID"
                value={String(log.id)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={
                  <AccountCircleOutlinedIcon fontSize="small" />
                }
                label="User"
                value={log.userName || "System"}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={
                  <AccountCircleOutlinedIcon fontSize="small" />
                }
                label="User Email"
                value={log.userEmail || "-"}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={
                  <NumbersOutlinedIcon fontSize="small" />
                }
                label="User ID"
                value={
                  log.userId !== undefined
                    ? String(log.userId)
                    : "-"
                }
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={
                  <DescriptionOutlinedIcon fontSize="small" />
                }
                label="Action"
                value={log.action}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={
                  <FolderOutlinedIcon fontSize="small" />
                }
                label="Module"
                value={log.module || "-"}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={
                  <DnsOutlinedIcon fontSize="small" />
                }
                label="IP Address"
                value={log.ipAddress || "-"}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                icon={
                  <AccessTimeOutlinedIcon fontSize="small" />
                }
                label="Date & Time"
                value={formatDateTime(log.createdAt)}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <DetailItem
                icon={
                  <LanguageOutlinedIcon fontSize="small" />
                }
                label="Status"
                value={getStatusLabel(log.status)}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={1}>
            <Typography
              variant="subtitle1"
              fontWeight={700}
            >
              Description
            </Typography>

            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography
                variant="body2"
                color={
                  log.description
                    ? "text.primary"
                    : "text.secondary"
                }
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {log.description ||
                  "No description available."}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ActivityLogDetails;