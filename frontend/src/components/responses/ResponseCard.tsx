import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export interface ResponseCardData {
  id: number | string;
  formId?: number | string;
  formName?: string;
  submittedBy?: string;
  submittedAt?: string | Date;
  status?: "completed" | "pending" | "reviewed";
  responseData?: Record<string, unknown>;
}

interface ResponseCardProps {
  response: ResponseCardData;
  onView?: (response: ResponseCardData) => void;
  onEdit?: (response: ResponseCardData) => void;
  onDelete?: (response: ResponseCardData) => void;
}

const formatDate = (value?: string | Date) => {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
};

const getStatusColor = (
  status?: ResponseCardData["status"],
): "success" | "warning" | "info" | "default" => {
  switch (status) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "reviewed":
      return "info";
    default:
      return "default";
  }
};

const formatStatus = (status?: ResponseCardData["status"]) => {
  if (!status) {
    return "Unknown";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const ResponseCard = ({
  response,
  onView,
  onEdit,
  onDelete,
}: ResponseCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 2.5,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: 3,
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "primary.50",
                  color: "primary.main",
                  flexShrink: 0,
                }}
              >
                <DescriptionOutlinedIcon />
              </Box>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {response.formName || "Untitled Form"}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Response #{response.id}
                </Typography>
              </Box>
            </Stack>

            <Chip
              label={formatStatus(response.status)}
              color={getStatusColor(response.status)}
              size="small"
              variant="outlined"
              sx={{
                fontWeight: 600,
                flexShrink: 0,
              }}
            />
          </Stack>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={{
              xs: 1.25,
              sm: 3,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Submitted By
              </Typography>

              <Typography
                variant="body2"
                fontWeight={500}
              >
                {response.submittedBy || "Anonymous"}
              </Typography>
            </Box>

            <Box>
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="center"
              >
                <AccessTimeOutlinedIcon
                  sx={{
                    fontSize: 16,
                    color: "text.secondary",
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Submitted At
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ mt: 0.25 }}
              >
                {formatDate(response.submittedAt)}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={0.5}
          >
            {onView && (
              <Tooltip title="View response">
                <IconButton
                  size="small"
                  onClick={() => onView(response)}
                  aria-label="View response"
                >
                  <VisibilityOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {onEdit && (
              <Tooltip title="Edit response">
                <IconButton
                  size="small"
                  onClick={() => onEdit(response)}
                  aria-label="Edit response"
                >
                  <EditOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}

            {onDelete && (
              <Tooltip title="Delete response">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(response)}
                  aria-label="Delete response"
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResponseCard;