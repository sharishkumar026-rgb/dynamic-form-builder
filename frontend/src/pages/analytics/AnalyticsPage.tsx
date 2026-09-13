import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import {
  AssessmentOutlined as AssessmentOutlinedIcon,
  BarChartOutlined as BarChartOutlinedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  ErrorOutline as ErrorOutlineIcon,
  RefreshOutlined as RefreshOutlinedIcon,
  TrendingUpOutlined as TrendingUpOutlinedIcon,
} from "@mui/icons-material";
import {
  Bar,
  Doughnut,
  Line,
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL =
  "http://127.0.0.1:8000/api";

interface AnalyticsData {
  total_forms?: number;
  active_forms?: number;
  inactive_forms?: number;
  total_responses?: number;
  total_users?: number;
  active_users?: number;

  response_count?: number;
  responses_count?: number;

  form_count?: number;
  forms_count?: number;

  labels?: string[];
  values?: number[];

  dates?: string[];
  counts?: number[];

  response_statistics?: unknown;
  form_statistics?: unknown;
  most_used_forms?: unknown;

  [key: string]: unknown;
}

interface MostUsedForm {
  id: number | string;
  title: string;
  response_count: number;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

const isObject = (
  value: unknown
): value is Record<string, unknown> => {
  return (
    typeof value === "object" &&
    value !== null
  );
};

const getToken = (): string | null => {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken")
  );
};

const toNumber = (
  value: unknown
): number => {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isNaN(parsed)
      ? 0
      : parsed;
  }

  return 0;
};

const getNumber = (
  object: Record<string, unknown>,
  ...keys: string[]
): number => {
  for (const key of keys) {
    if (key in object) {
      return toNumber(object[key]);
    }
  }

  return 0;
};

const getStringArray = (
  value: unknown
): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) =>
    String(item)
  );
};

const getNumberArray = (
  value: unknown
): number[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) =>
    toNumber(item)
  );
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] =
    useState<AnalyticsData | null>(
      null
    );

  const [mostUsedForms, setMostUsedForms] =
    useState<MostUsedForm[]>([]);

  const [period, setPeriod] =
    useState("7");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const headers: HeadersInit = {
        Accept: "application/json",
      };

      if (token) {
        headers.Authorization =
          `Bearer ${token}`;
      }

      const [
        analyticsResponse,
        formsResponse,
      ] = await Promise.all([
        fetch(
          `${API_BASE_URL}/analytics`,
          {
            method: "GET",
            headers,
          }
        ),

        fetch(
          `${API_BASE_URL}/dashboard/most-used-forms?limit=10`,
          {
            method: "GET",
            headers,
          }
        ),
      ]);

      const analyticsResult: unknown =
        await analyticsResponse.json();

      const formsResult: unknown =
        await formsResponse.json();

      if (!analyticsResponse.ok) {
        let message =
          `Failed to load analytics (${analyticsResponse.status})`;

        if (
          isObject(analyticsResult) &&
          typeof analyticsResult.message ===
            "string"
        ) {
          message =
            analyticsResult.message;
        }

        throw new Error(message);
      }

      let analyticsObject:
        | AnalyticsData
        | null = null;

      if (
        isObject(analyticsResult)
      ) {
        if (
          "data" in analyticsResult &&
          isObject(
            analyticsResult.data
          )
        ) {
          analyticsObject =
            analyticsResult.data as AnalyticsData;
        } else {
          analyticsObject =
            analyticsResult as AnalyticsData;
        }
      }

      setAnalytics(
        analyticsObject
      );

      /*
       * Most-used forms can be returned as:
       *
       * {
       *   "data": [...]
       * }
       *
       * {
       *   "forms": [...]
       * }
       *
       * [...]
       */
      let rawForms: unknown = [];

      if (Array.isArray(formsResult)) {
        rawForms = formsResult;
      } else if (
        isObject(formsResult)
      ) {
        if (
          "data" in formsResult
        ) {
          rawForms =
            formsResult.data;
        } else if (
          "forms" in formsResult
        ) {
          rawForms =
            formsResult.forms;
        }
      }

      if (Array.isArray(rawForms)) {
        const convertedForms =
          rawForms
            .filter(isObject)
            .map((item) => ({
              id:
                typeof item.id ===
                  "number" ||
                typeof item.id ===
                  "string"
                  ? item.id
                  : 0,

              title:
                typeof item.title ===
                "string"
                  ? item.title
                  : "Untitled Form",

              response_count:
                getNumber(
                  item,
                  "response_count",
                  "responseCount",
                  "responses",
                  "responses_count"
                ),
            }));

        setMostUsedForms(
          convertedForms
        );
      } else {
        setMostUsedForms([]);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAnalytics();
  }, []);

  const summary = useMemo(() => {
    const data = analytics || {};

    return {
      totalForms: getNumber(
        data,
        "total_forms",
        "totalForms",
        "form_count",
        "forms_count"
      ),

      activeForms: getNumber(
        data,
        "active_forms",
        "activeForms"
      ),

      inactiveForms: getNumber(
        data,
        "inactive_forms",
        "inactiveForms"
      ),

      totalResponses: getNumber(
        data,
        "total_responses",
        "totalResponses",
        "response_count",
        "responses_count"
      ),

      totalUsers: getNumber(
        data,
        "total_users",
        "totalUsers"
      ),

      activeUsers: getNumber(
        data,
        "active_users",
        "activeUsers"
      ),
    };
  }, [analytics]);

  const responseChart = useMemo(() => {
    const data =
      analytics || {};

    let labels = getStringArray(
      data.labels
    );

    let values = getNumberArray(
      data.values
    );

    if (
      labels.length === 0 &&
      Array.isArray(data.dates)
    ) {
      labels = getStringArray(
        data.dates
      );
    }

    if (
      values.length === 0 &&
      Array.isArray(data.counts)
    ) {
      values = getNumberArray(
        data.counts
      );
    }

    if (
      labels.length === 0 ||
      values.length === 0
    ) {
      labels = [
        "Total Responses",
      ];

      values = [
        summary.totalResponses,
      ];
    }

    return {
      labels,
      datasets: [
        {
          label: "Responses",
          data: values,
          fill: true,
          tension: 0.35,
          borderWidth: 2,
          pointRadius: 4,
        },
      ],
    };
  }, [
    analytics,
    summary.totalResponses,
  ]);

  const formsChart = useMemo(() => {
    return {
      labels: mostUsedForms.map(
        (form) => form.title
      ),

      datasets: [
        {
          label: "Responses",
          data: mostUsedForms.map(
            (form) =>
              form.response_count
          ),
          borderWidth: 1,
        },
      ],
    };
  }, [mostUsedForms]);

  const statusChart = useMemo(() => {
    return {
      labels: [
        "Active Forms",
        "Inactive Forms",
      ],

      datasets: [
        {
          data: [
            summary.activeForms,
            summary.inactiveForms,
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [
    summary.activeForms,
    summary.inactiveForms,
  ]);

  const statCards = [
    {
      title: "Total Forms",
      value: summary.totalForms,
      icon: (
        <AssessmentOutlinedIcon />
      ),
    },
    {
      title: "Active Forms",
      value: summary.activeForms,
      icon: (
        <CheckCircleOutlineIcon />
      ),
    },
    {
      title: "Total Responses",
      value:
        summary.totalResponses,
      icon: (
        <TrendingUpOutlinedIcon />
      ),
    },
    {
      title: "Total Users",
      value: summary.totalUsers,
      icon: (
        <BarChartOutlinedIcon />
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack
          spacing={2}
          alignItems="center"
        >
          <CircularProgress />

          <Typography color="text.secondary">
            Loading analytics...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 4,
        },
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight={700}
            >
              Analytics
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              View form, response, and
              user analytics
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
          >
            <FormControl
              size="small"
              sx={{
                minWidth: 150,
              }}
            >
              <InputLabel>
                Period
              </InputLabel>

              <Select
                value={period}
                label="Period"
                onChange={(event) =>
                  setPeriod(
                    event.target.value
                  )
                }
              >
                <MenuItem value="7">
                  Last 7 days
                </MenuItem>

                <MenuItem value="30">
                  Last 30 days
                </MenuItem>

                <MenuItem value="90">
                  Last 90 days
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              startIcon={
                <RefreshOutlinedIcon />
              }
              onClick={() =>
                void loadAnalytics()
              }
            >
              Refresh
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Alert
            severity="error"
            icon={
              <ErrorOutlineIcon />
            }
          >
            {error}
          </Alert>
        )}

        {/* Summary Cards */}
        <Grid container spacing={2}>
          {statCards.map((card) => (
            <Grid
              key={card.title}
              size={{
                xs: 12,
                sm: 6,
                md: 3,
              }}
            >
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                }}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {card.title}
                      </Typography>

                      <Typography
                        variant="h4"
                        fontWeight={700}
                        sx={{ mt: 1 }}
                      >
                        {card.value.toLocaleString()}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        display: "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "center",
                        bgcolor:
                          "action.hover",
                      }}
                    >
                      {card.icon}
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Additional Summary */}
        <Grid container spacing={2}>
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Inactive Forms
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ mt: 1 }}
                >
                  {summary.inactiveForms.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Active Users
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ mt: 1 }}
                >
                  {summary.activeUsers.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Card variant="outlined">
              <CardContent>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Selected Period
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={700}
                  sx={{ mt: 1 }}
                >
                  {period} days
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Response Trend */}
        <Paper
          variant="outlined"
          sx={{ p: 3 }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Response Trend
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Response activity over the
            selected period
          </Typography>

          <Box
            sx={{
              height: 360,
              position: "relative",
            }}
          >
            <Line
              data={responseChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: true,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      precision: 0,
                    },
                  },
                },
              }}
            />
          </Box>
        </Paper>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Paper
              variant="outlined"
              sx={{ p: 3 }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Most Used Forms
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Forms with the highest
                number of responses
              </Typography>

              {mostUsedForms.length ===
              0 ? (
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                  }}
                >
                  <Typography color="text.secondary">
                    No form usage data
                    available.
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 300,
                    position:
                      "relative",
                  }}
                >
                  <Bar
                    data={formsChart}
                    options={{
                      responsive: true,
                      maintainAspectRatio:
                        false,
                      plugins: {
                        legend: {
                          display:
                            false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero:
                            true,
                          ticks: {
                            precision: 0,
                          },
                        },
                      },
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <Paper
              variant="outlined"
              sx={{ p: 3 }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Form Status
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3 }}
              >
                Active versus inactive
                forms
              </Typography>

              <Box
                sx={{
                  height: 300,
                  position:
                    "relative",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                }}
              >
                <Doughnut
                  data={statusChart}
                  options={{
                    responsive: true,
                    maintainAspectRatio:
                      false,
                    plugins: {
                      legend: {
                        position:
                          "bottom",
                      },
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Most Used Forms Table */}
        <Paper
          variant="outlined"
          sx={{ overflow: "hidden" }}
        >
          <Box sx={{ p: 3 }}>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Form Usage Details
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Response count by form
            </Typography>
          </Box>

          <Divider />

          {mostUsedForms.length ===
          0 ? (
            <Box sx={{ p: 4 }}>
              <Typography
                color="text.secondary"
                textAlign="center"
              >
                No form usage data
                available.
              </Typography>
            </Box>
          ) : (
            <Stack
              divider={
                <Divider />
              }
            >
              {mostUsedForms.map(
                (form, index) => (
                  <Box
                    key={String(form.id)}
                    sx={{
                      p: 2.5,
                      display: "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      gap: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius:
                            "50%",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          bgcolor:
                            "action.hover",
                          fontWeight: 700,
                        }}
                      >
                        {index + 1}
                      </Box>

                      <Box
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          fontWeight={600}
                          noWrap
                        >
                          {form.title}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Form ID:{" "}
                          {form.id}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography
                      fontWeight={700}
                      sx={{
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {form.response_count.toLocaleString()}{" "}
                      responses
                    </Typography>
                  </Box>
                )
              )}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Box>
  );
}