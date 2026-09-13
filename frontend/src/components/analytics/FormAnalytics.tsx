import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import FieldAnalyticsChart, {
  type FieldAnalyticsItem,
} from "./FieldAnalyticsChart";

export interface FormAnalyticsData {
  formId: number | string;
  formName: string;
  description?: string;
  totalResponses?: number;
  completedResponses?: number;
  completionRate?: number;
  totalFields?: number;
  active?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  fieldAnalytics?: FieldAnalyticsItem[];
}

interface FormAnalyticsProps {
  data: FormAnalyticsData | null;
  loading?: boolean;
  showFieldAnalytics?: boolean;
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

const formatPercentage = (value?: number) => {
  if (value === undefined || value === null) {
    return "0%";
  }

  return `${Math.round(value)}%`;
};

const FormAnalytics = ({
  data,
  loading = false,
  showFieldAnalytics = true,
}: FormAnalyticsProps) => {
  if (loading) {
    return (
      <Stack spacing={3}>
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box
                sx={{
                  width: "45%",
                  height: 28,
                  borderRadius: 1,
                  backgroundColor: "action.hover",
                }}
              />

              <Box
                sx={{
                  width: "70%",
                  height: 20,
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

              <Grid container spacing={2}>
                {[1, 2, 3, 4].map((item) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
                    <Box
                      sx={{
                        height: 90,
                        borderRadius: 2,
                        backgroundColor: "action.hover",
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </CardContent>
        </Card>

        {showFieldAnalytics && (
          <Box
            sx={{
              height: 360,
              borderRadius: 3,
              backgroundColor: "action.hover",
            }}
          />
        )}
      </Stack>
    );
  }

  if (!data) {
    return (
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ py: 6 }}>
          <Stack spacing={1.5} alignItems="center" textAlign="center">
            <AssessmentOutlinedIcon
              sx={{
                fontSize: 48,
                color: "text.disabled",
              }}
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              No analytics available
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Select a form to view its analytics.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  const totalResponses = data.totalResponses ?? 0;
  const completedResponses = data.completedResponses ?? 0;
  const completionRate =
    data.completionRate ??
    (totalResponses > 0
      ? (completedResponses / totalResponses) * 100
      : 0);

  const totalFields = data.totalFields ?? data.fieldAnalytics?.length ?? 0;

  return (
    <Stack spacing={3}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={2}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
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
                  }}
                >
                  <DescriptionOutlinedIcon />
                </Box>

                <Box>
                  <Typography
                    variant="h5"
                    component="h2"
                    fontWeight={700}
                  >
                    {data.formName}
                  </Typography>

                  {data.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {data.description}
                    </Typography>
                  )}
                </Box>
              </Stack>

              <Chip
                label={data.active === false ? "Inactive" : "Active"}
                color={data.active === false ? "default" : "success"}
                variant="outlined"
                size="small"
              />
            </Stack>

            <Divider />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AnalyticsStat
                  icon={<PeopleOutlineIcon />}
                  label="Total Responses"
                  value={totalResponses}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AnalyticsStat
                  icon={<CheckCircleOutlineIcon />}
                  label="Completed"
                  value={completedResponses}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AnalyticsStat
                  icon={<BarChartOutlinedIcon />}
                  label="Completion Rate"
                  value={formatPercentage(completionRate)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <AnalyticsStat
                  icon={<DescriptionOutlinedIcon />}
                  label="Total Fields"
                  value={totalFields}
                />
              </Grid>
            </Grid>

            <Divider />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoRow
                  label="Form ID"
                  value={String(data.formId)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoRow
                  label="Created"
                  value={formatDate(data.createdAt)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoRow
                  label="Last Updated"
                  value={formatDate(data.updatedAt)}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <InfoRow
                  label="Status"
                  value={data.active === false ? "Inactive" : "Active"}
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {showFieldAnalytics && (
        <FieldAnalyticsChart
          data={data.fieldAnalytics ?? []}
          title="Field Analytics"
          subtitle="Response activity across individual form fields."
        />
      )}
    </Stack>
  );
};

interface AnalyticsStatProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

const AnalyticsStat = ({
  icon,
  label,
  value,
}: AnalyticsStatProps) => {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        height: "100%",
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "action.hover",
            color: "primary.main",
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
          >
            {label}
          </Typography>

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mt: 0.25 }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

interface InfoRowProps {
  label: string;
  value: string;
}

const InfoRow = ({
  label,
  value,
}: InfoRowProps) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={2}
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        variant="body2"
        fontWeight={600}
        textAlign="right"
      >
        {value}
      </Typography>
    </Stack>
  );
};

export default FormAnalytics;