import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface ResponseHistoryItem {
  id: number | string;
  responseId?: number | string;
  action?: "created" | "updated" | "submitted" | "reviewed";
  description?: string;
  changedBy?: string;
  createdAt?: string | Date;
  data?: Record<string, unknown>;
}

interface ResponseHistoryProps {
  history?: ResponseHistoryItem[];
  loading?: boolean;
  emptyMessage?: string;
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

const formatAction = (
  action?: ResponseHistoryItem["action"],
) => {
  if (!action) {
    return "History";
  }

  return action.charAt(0).toUpperCase() + action.slice(1);
};

const getActionColor = (
  action?: ResponseHistoryItem["action"],
): "success" | "info" | "warning" | "default" => {
  switch (action) {
    case "created":
      return "success";
    case "submitted":
      return "info";
    case "updated":
      return "warning";
    case "reviewed":
      return "success";
    default:
      return "default";
  }
};

const getActionIcon = (
  action?: ResponseHistoryItem["action"],
) => {
  switch (action) {
    case "created":
      return <CheckCircleOutlineIcon />;
    case "submitted":
      return <CheckCircleOutlineIcon />;
    case "updated":
      return <EditOutlinedIcon />;
    case "reviewed":
      return <CheckCircleOutlineIcon />;
    default:
      return <HistoryOutlinedIcon />;
  }
};

const ResponseHistory = ({
  history = [],
  loading = false,
  emptyMessage = "No history is available for this response.",
}: ResponseHistoryProps) => {
  if (loading) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={1}>
            <Typography variant="h6" fontWeight={700}>
              Response History
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Loading response history...
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box
          sx={{
            px: 3,
            py: 2.5,
            backgroundColor: "grey.50",
          }}
        >
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
          >
            <HistoryOutlinedIcon color="primary" />

            <Box>
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Response History
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Track changes and activity for this response.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider />

        {history.length === 0 ? (
          <Box
            sx={{
              py: 6,
              px: 3,
              textAlign: "center",
            }}
          >
            <HistoryOutlinedIcon
              sx={{
                fontSize: 44,
                color: "text.disabled",
                mb: 1,
              }}
            />

            <Typography
              variant="subtitle1"
              fontWeight={600}
            >
              No history found
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          <Stack
            divider={<Divider />}
          >
            {history.map((item) => (
              <Box
                key={String(item.id)}
                sx={{
                  px: {
                    xs: 2,
                    sm: 3,
                  },
                  py: 2.5,
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="flex-start"
                >
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "primary.50",
                      color: "primary.main",
                      flexShrink: 0,
                    }}
                  >
                    {getActionIcon(item.action)}
                  </Box>

                  <Box
                    sx={{
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      alignItems={{
                        xs: "flex-start",
                        sm: "center",
                      }}
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        flexWrap="wrap"
                      >
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                        >
                          {formatAction(item.action)}
                        </Typography>

                        <Chip
                          label={formatAction(item.action)}
                          color={getActionColor(item.action)}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 600,
                          }}
                        />
                      </Stack>

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
                          {formatDate(item.createdAt)}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        lineHeight: 1.7,
                        wordBreak: "break-word",
                      }}
                    >
                      {item.description ||
                        `Response was ${item.action || "updated"}.`}
                    </Typography>

                    {item.changedBy && (
                      <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                        sx={{ mt: 1.25 }}
                      >
                        <PersonOutlineOutlinedIcon
                          sx={{
                            fontSize: 17,
                            color: "text.secondary",
                          }}
                        />

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Changed by {item.changedBy}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default ResponseHistory;