import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export interface ResponseDetailsData {
  id: number | string;
  formId?: number | string;
  formName?: string;
  submittedBy?: string;
  submittedAt?: string | Date;
  status?: "completed" | "pending" | "reviewed";
  responseData?: Record<string, unknown>;
}

interface ResponseDetailsProps {
  response: ResponseDetailsData | null;
  loading?: boolean;
  onBack?: () => void;
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
  status?: ResponseDetailsData["status"],
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

const formatStatus = (status?: ResponseDetailsData["status"]) => {
  if (!status) {
    return "Unknown";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "-";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const ResponseDetails = ({
  response,
  loading = false,
  onBack,
}: ResponseDetailsProps) => {
  if (loading) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography color="text.secondary">
            Loading response details...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!response) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Stack
            spacing={1}
            alignItems="center"
            textAlign="center"
          >
            <DescriptionOutlinedIcon
              sx={{
                fontSize: 44,
                color: "text.secondary",
              }}
            />

            <Typography variant="h6" fontWeight={700}>
              Response not found
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              The requested response could not be found.
            </Typography>

            {onBack && (
              <Button
                variant="outlined"
                startIcon={<ArrowBackOutlinedIcon />}
                onClick={onBack}
                sx={{
                  mt: 1,
                  textTransform: "none",
                }}
              >
                Back to Responses
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const responseEntries = Object.entries(
    response.responseData || {},
  );

  return (
    <Stack spacing={3}>
      {onBack && (
        <Button
          variant="text"
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={onBack}
          sx={{
            alignSelf: "flex-start",
            textTransform: "none",
          }}
        >
          Back to Responses
        </Button>
      )}

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: {
              xs: 2,
              sm: 3,
            },
            py: 2.5,
            backgroundColor: "grey.50",
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
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

              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  {response.formName || "Untitled Form"}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Response #{response.id}
                </Typography>
              </Box>
            </Stack>

            <Chip
              label={formatStatus(response.status)}
              color={getStatusColor(response.status)}
              variant="outlined"
              sx={{ fontWeight: 600 }}
            />
          </Stack>
        </Box>

        <Divider />

        <CardContent sx={{ p: 3 }}>
          <Grid
            container
            spacing={2.5}
          >
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <PersonOutlineOutlinedIcon
                  sx={{
                    color: "text.secondary",
                    mt: 0.2,
                  }}
                />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Submitted By
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {response.submittedBy || "Anonymous"}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
              >
                <AccessTimeOutlinedIcon
                  sx={{
                    color: "text.secondary",
                    mt: 0.2,
                  }}
                />

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Submitted At
                  </Typography>

                  <Typography
                    variant="body2"
                    fontWeight={600}
                  >
                    {formatDate(response.submittedAt)}
                  </Typography>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Form ID
                </Typography>

                <Typography
                  variant="body2"
                  fontWeight={600}
                >
                  {response.formId ?? "-"}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2.5 }}
          >
            Response Data
          </Typography>

          {responseEntries.length === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
                border: 1,
                borderStyle: "dashed",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                No response data available.
              </Typography>
            </Box>
          ) : (
            <Stack
              spacing={0}
              divider={<Divider />}
            >
              {responseEntries.map(([field, value]) => (
                <Box
                  key={field}
                  sx={{
                    py: 2,
                    display: "flex",
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "35%",
                      },
                      wordBreak: "break-word",
                    }}
                  >
                    {field}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      flex: 1,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {formatValue(value)}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
};

export default ResponseDetails;