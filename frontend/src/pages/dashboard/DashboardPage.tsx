import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import PeopleIcon from "@mui/icons-material/People";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventNoteIcon from "@mui/icons-material/EventNote";
import BarChartIcon from "@mui/icons-material/BarChart";
import GroupsIcon from "@mui/icons-material/Groups";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

import {
  dashboardApi,
} from "../../api/dashboard.api";

import formsApi from "../../api/forms.api";

import responsesApi, {
  FormResponseData,
} from "../../api/responses.api";

// ============================================================
// DASHBOARD SUMMARY
// ============================================================

interface DashboardSummary {
  total_forms: number;
  active_forms: number;
  inactive_forms: number;
  total_responses: number;
  total_users: number;
  active_users: number;
  generated_at: string;
}

// ============================================================
// MOST USED FORM
// ============================================================

interface MostUsedForm {
  form_id: number;
  form_title?: string;
  title?: string;
  response_count: number;
  is_active: boolean;
}

// ============================================================
// SUBMISSION TREND
// ============================================================

interface SubmissionTrend {
  date: string;
  count: number;
  response_count?: number;
}

// ============================================================
// FORM FIELD
// ============================================================

interface FormFieldData {
  id?: number;
  label: string;
  name: string;
  field_type: string;
  is_required: boolean;
}

// ============================================================
// STAT CARD
// ============================================================

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBackground: string;
  iconColor: string;
  valueColor?: string;
  subtitle?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  iconBackground,
  iconColor,
  valueColor,
  subtitle,
}: StatCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow:
          "0 4px 18px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent
        sx={{
          p: 2,
          "&:last-child": {
            pb: 2,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={2}
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
              backgroundColor:
                iconBackground,
              color: iconColor,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>

          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
            >
              {title}
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mt: 0.25,
                fontWeight: 700,
                color: valueColor,
              }}
            >
              {value}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.25,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ============================================================
// BUILD SUBMISSION TRENDS FROM ACTUAL RESPONSES
// ============================================================

const buildSubmissionTrends = (
  responses: FormResponseData[],
): SubmissionTrend[] => {
  const trendMap =
    new Map<string, number>();

  responses.forEach(
    (response) => {
      if (!response.submitted_at) {
        return;
      }

      const submittedDate =
        new Date(
          response.submitted_at,
        );

      if (
        Number.isNaN(
          submittedDate.getTime(),
        )
      ) {
        return;
      }

      const dateKey =
        submittedDate
          .toISOString()
          .split("T")[0];

      trendMap.set(
        dateKey,
        (trendMap.get(dateKey) || 0) +
          1,
      );
    },
  );

  return Array.from(
    trendMap.entries(),
  )
    .map(
      ([date, count]) => ({
        date,
        count,
        response_count: count,
      }),
    )
    .sort(
      (a, b) =>
        new Date(
          a.date,
        ).getTime() -
        new Date(
          b.date,
        ).getTime(),
    );
};

// ============================================================
// SIMPLE SVG SUBMISSION TREND CHART
// ============================================================

interface TrendChartProps {
  trends: SubmissionTrend[];
}

const TrendChart = ({
  trends,
}: TrendChartProps) => {
  const chartData = useMemo(() => {
    return trends
      .map(
        (item) => {
          const rawCount =
            item.count ??
            item.response_count ??
            0;

          const count =
            Number(rawCount);

          return {
            date: item.date,
            count:
              Number.isFinite(
                count,
              ) && count >= 0
                ? count
                : 0,
          };
        },
      )
      .filter(
        (item) =>
          item.date &&
          item.date.trim() !== "",
      );
  }, [trends]);

  const maxValue =
    Math.max(
      1,
      ...chartData.map(
        (item) => item.count,
      ),
    );

  const width = 900;

  const height = 260;

  const paddingLeft = 55;

  const paddingRight = 25;

  const paddingTop = 20;

  const paddingBottom = 45;

  const chartWidth =
    width -
    paddingLeft -
    paddingRight;

  const chartHeight =
    height -
    paddingTop -
    paddingBottom;

  const points =
    chartData.map(
      (item, index) => {
        const x =
          chartData.length <= 1
            ? paddingLeft +
              chartWidth / 2
            : paddingLeft +
              (index /
                (chartData.length -
                  1)) *
                chartWidth;

        const y =
          paddingTop +
          chartHeight -
          (item.count / maxValue) *
            chartHeight;

        return {
          ...item,
          x,
          y,
        };
      },
    );

  const polylinePoints =
    points
      .map(
        (point) =>
          `${point.x},${point.y}`,
      )
      .join(" ");

  const formatDate = (
    date: string,
  ) => {
    const parsedDate =
      new Date(
        `${date}T00:00:00`,
      );

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      },
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: 300,
        overflow: "hidden",
      }}
    >
      {chartData.length === 0 ? (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "center",
          }}
        >
          <Typography
            color="text.secondary"
          >
            No submission trend data
            available.
          </Typography>
        </Box>
      ) : (
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          {/* GRID LINES */}

          {[0, 0.25, 0.5, 0.75, 1].map(
            (percentage) => {
              const y =
                paddingTop +
                chartHeight -
                percentage *
                  chartHeight;

              return (
                <line
                  key={percentage}
                  x1={paddingLeft}
                  x2={
                    width -
                    paddingRight
                  }
                  y1={y}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              );
            },
          )}

          {/* Y AXIS */}

          <line
            x1={paddingLeft}
            x2={paddingLeft}
            y1={paddingTop}
            y2={
              paddingTop +
              chartHeight
            }
            stroke="#d1d5db"
            strokeWidth="1"
          />

          {/* X AXIS */}

          <line
            x1={paddingLeft}
            x2={
              width -
              paddingRight
            }
            y1={
              paddingTop +
              chartHeight
            }
            y2={
              paddingTop +
              chartHeight
            }
            stroke="#d1d5db"
            strokeWidth="1"
          />

          {/* TREND LINE */}

          {points.length > 1 && (
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#1976d2"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* AREA UNDER LINE */}

          {points.length > 1 && (
            <polygon
              points={[
                `${points[0].x},${
                  paddingTop +
                  chartHeight
                }`,
                ...points.map(
                  (point) =>
                    `${point.x},${point.y}`,
                ),
                `${
                  points[
                    points.length - 1
                  ].x
                },${
                  paddingTop +
                  chartHeight
                }`,
              ].join(" ")}
              fill="rgba(25, 118, 210, 0.10)"
            />
          )}

          {/* SINGLE RESPONSE TREND */}

          {points.length === 1 && (
            <line
              x1={paddingLeft}
              x2={
                width -
                paddingRight
              }
              y1={points[0].y}
              y2={points[0].y}
              stroke="#1976d2"
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

          {/* POINTS */}

          {points.map(
            (point, index) => (
              <g
                key={`${point.date}-${index}`}
              >
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="#1976d2"
                  stroke="#ffffff"
                  strokeWidth="2"
                />

                {/* VALUE */}

                <text
                  x={point.x}
                  y={point.y - 12}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="600"
                  fill="#1976d2"
                >
                  {point.count}
                </text>

                {/* DATE */}

                <text
                  x={point.x}
                  y={
                    paddingTop +
                    chartHeight +
                    28
                  }
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {formatDate(
                    point.date,
                  )}
                </text>
              </g>
            ),
          )}

          {/* Y AXIS VALUES */}

          {[0, 0.5, 1].map(
            (percentage) => {
              const value =
                Math.round(
                  maxValue *
                    percentage,
                );

              const y =
                paddingTop +
                chartHeight -
                percentage *
                  chartHeight;

              return (
                <text
                  key={percentage}
                  x={
                    paddingLeft -
                    12
                  }
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {value}
                </text>
              );
            },
          )}
        </svg>
      )}
    </Box>
  );
};

// ============================================================
// DASHBOARD PAGE
// ============================================================

const DashboardPage = () => {
  const navigate =
    useNavigate();

  const [
    summary,
    setSummary,
  ] =
    useState<DashboardSummary | null>(
      null,
    );

  const [
    mostUsedForms,
    setMostUsedForms,
  ] =
    useState<MostUsedForm[]>([]);

  const [
    submissionTrends,
    setSubmissionTrends,
  ] =
    useState<SubmissionTrend[]>([]);

  const [
    recentResponses,
    setRecentResponses,
  ] =
    useState<FormResponseData[]>([]);

  const [
    formFields,
    setFormFields,
  ] =
    useState<FormFieldData[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState<string | null>(null);

  // ==========================================================
  // TODAY RESPONSES
  // ==========================================================

  const todayResponses =
    useMemo(() => {
      const now =
        new Date();

      return recentResponses.filter(
        (response) => {
          if (
            !response.submitted_at
          ) {
            return false;
          }

          const date =
            new Date(
              response.submitted_at,
            );

          return (
            date.getFullYear() ===
              now.getFullYear() &&
            date.getMonth() ===
              now.getMonth() &&
            date.getDate() ===
              now.getDate()
          );
        },
      ).length;
    }, [recentResponses]);

  // ==========================================================
  // THIS WEEK RESPONSES
  // ==========================================================

  const thisWeekResponses =
    useMemo(() => {
      const now =
        new Date();

      const startOfWeek =
        new Date(now);

      startOfWeek.setDate(
        now.getDate() -
          now.getDay(),
      );

      startOfWeek.setHours(
        0,
        0,
        0,
        0,
      );

      return recentResponses.filter(
        (response) => {
          if (
            !response.submitted_at
          ) {
            return false;
          }

          const date =
            new Date(
              response.submitted_at,
            );

          return (
            date >= startOfWeek &&
            date <= now
          );
        },
      ).length;
    }, [recentResponses]);

  // ==========================================================
  // THIS MONTH RESPONSES
  // ==========================================================

  const thisMonthResponses =
    useMemo(() => {
      const now =
        new Date();

      return recentResponses.filter(
        (response) => {
          if (
            !response.submitted_at
          ) {
            return false;
          }

          const date =
            new Date(
              response.submitted_at,
            );

          return (
            date.getFullYear() ===
              now.getFullYear() &&
            date.getMonth() ===
              now.getMonth()
          );
        },
      ).length;
    }, [recentResponses]);

  // ==========================================================
  // AVERAGE RESPONSES PER FORM
  // ==========================================================

  const averageResponsesPerForm =
    summary &&
    summary.total_forms > 0
      ? (
          summary.total_responses /
          summary.total_forms
        ).toFixed(2)
      : "0.00";

  // ==========================================================
  // MOST ACTIVE FORM
  // ==========================================================

  const mostActiveForm =
    mostUsedForms.length > 0
      ? mostUsedForms[0]
      : null;

  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  const loadDashboard =
    async (): Promise<void> => {
      try {
        setLoading(true);

        setError(null);

        // ======================================================
        // SUMMARY
        // ======================================================

        const summaryResponse =
          await dashboardApi.getSummary();

        setSummary(
          summaryResponse.data,
        );

        // ======================================================
        // MOST USED FORMS
        // ======================================================

        let loadedMostUsedForms:
          MostUsedForm[] =
          [];

        try {
          const mostUsedResponse =
            await dashboardApi.getMostUsedForms(
              10,
            );

          loadedMostUsedForms =
            (
              mostUsedResponse.data ||
              []
            ).map(
              (item: any) => ({
                form_id:
                  item.form_id ??
                  item.id,

                form_title:
                  item.form_title ??
                  item.title ??
                  item.name ??
                  `Form #${
                    item.form_id ??
                    item.id
                  }`,

                title:
                  item.title ??
                  item.form_title ??
                  item.name,

                response_count:
                  Number(
                    item.response_count ??
                      item.total_responses ??
                      item.count ??
                      0,
                  ),

                is_active:
                  item.is_active ??
                  true,
              }),
            );

          setMostUsedForms(
            loadedMostUsedForms,
          );
        } catch (
          mostUsedError
        ) {
          console.error(
            "Failed to load most used forms:",
            mostUsedError,
          );

          loadedMostUsedForms =
            [];

          setMostUsedForms([]);
        }

        // ======================================================
        // GET ALL FORMS
        // ======================================================

        const formsResponse =
          await formsApi.getForms(
            0,
            100,
          );

        const forms =
          formsResponse.forms ||
          [];

        // ======================================================
        // GET RESPONSES FOR EVERY FORM
        // ======================================================

        const responsePromises =
          forms.map(
            async (
              form: any,
            ) => {
              try {
                const response =
                  await responsesApi.getFormResponses(
                    form.id,
                  );

                if (
                  !response.success ||
                  !Array.isArray(
                    response.response,
                  )
                ) {
                  return [];
                }

                return response.response;
              } catch (
                responseError
              ) {
                console.error(
                  `Failed to load responses for form ${form.id}:`,
                  responseError,
                );

                return [];
              }
            },
          );

        const responseResults =
          await Promise.all(
            responsePromises,
          );

        const allResponses =
          responseResults.flat();

        // ======================================================
        // SORT NEWEST FIRST
        // ======================================================

        allResponses.sort(
          (
            a: FormResponseData,
            b: FormResponseData,
          ) => {
            const dateA =
              a.submitted_at
                ? new Date(
                    a.submitted_at,
                  ).getTime()
                : 0;

            const dateB =
              b.submitted_at
                ? new Date(
                    b.submitted_at,
                  ).getTime()
                : 0;

            return (
              dateB - dateA
            );
          },
        );

        // ======================================================
        // BUILD SUBMISSION TRENDS
        // DIRECTLY FROM ACTUAL RESPONSES
        // ======================================================

        const generatedTrends =
          buildSubmissionTrends(
            allResponses,
          );

        setSubmissionTrends(
          generatedTrends,
        );

        // ======================================================
        // RECENT RESPONSES
        // ======================================================

        setRecentResponses(
          allResponses.slice(
            0,
            10,
          ),
        );

        // ======================================================
        // FORM FIELDS
        // ======================================================

        const activeFormId =
          loadedMostUsedForms[0]
            ?.form_id;

        let selectedResponse =
          allResponses.find(
            (response) =>
              response.form?.id ===
              activeFormId,
          );

        if (
          !selectedResponse &&
          allResponses.length > 0
        ) {
          selectedResponse =
            allResponses[0];
        }

        const details =
          (selectedResponse as any)
            ?.details || [];

        const extractedFields:
          FormFieldData[] =
          details.map(
            (detail: any) => ({
              id:
                detail.field?.id ??
                detail.field_id,

              label:
                detail.field?.label ??
                "Untitled Field",

              name:
                detail.field?.name ??
                "",

              field_type:
                detail.field
                  ?.field_type ??
                "text",

              is_required:
                detail.field
                  ?.is_required ??
                false,
            }),
          );

        setFormFields(
          extractedFields,
        );
      } catch (
        dashboardError: any
      ) {
        console.error(
          "Failed to load dashboard:",
          dashboardError,
        );

        setError(
          dashboardError?.response
            ?.data?.detail ||
            "Failed to load dashboard data",
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadDashboard();
  }, []);

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <Box
      sx={{
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* HEADER */}

      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          Dashboard
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 0.5,
          }}
        >
          Overview of forms,
          responses, users and
          submission activity.
        </Typography>
      </Box>

      {/* TOP SUMMARY CARDS */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="Total Forms"
            value={
              summary?.total_forms ??
              0
            }
            icon={
              <DescriptionIcon />
            }
            iconBackground="#e3f2fd"
            iconColor="#1976d2"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="Active Forms"
            value={
              summary?.active_forms ??
              0
            }
            icon={
              <CheckCircleIcon />
            }
            iconBackground="#e8f5e9"
            iconColor="#2e7d32"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="Total Responses"
            value={
              summary?.total_responses ??
              0
            }
            icon={
              <QuestionAnswerIcon />
            }
            iconBackground="#fff3e0"
            iconColor="#ed6c02"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="Total Users"
            value={
              summary?.total_users ??
              0
            }
            icon={
              <PeopleIcon />
            }
            iconBackground="#e1f5fe"
            iconColor="#0277bd"
          />
        </Grid>
      </Grid>

      {/* ACTIVITY CARDS */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="Today"
            value={todayResponses}
            subtitle="Responses"
            icon={
              <TrendingUpIcon />
            }
            iconBackground="#f3f8ff"
            iconColor="#1976d2"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="This Week"
            value={thisWeekResponses}
            subtitle="Responses"
            icon={
              <EventNoteIcon />
            }
            iconBackground="#fff8e1"
            iconColor="#ed6c02"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="This Month"
            value={thisMonthResponses}
            subtitle="Responses"
            icon={
              <BarChartIcon />
            }
            iconBackground="#e8f5e9"
            iconColor="#2e7d32"
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="Average / Form"
            value={
              averageResponsesPerForm
            }
            subtitle="Responses"
            icon={
              <TrendingUpIcon />
            }
            iconBackground="#f3f8ff"
            iconColor="#1976d2"
          />
        </Grid>
      </Grid>

      {/* SUBMISSION TRENDS */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid
          size={{
            xs: 12,
            md: 8,
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow:
                "0 4px 18px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                }}
              >
                Submission Trends
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1,
                }}
              >
                Responses submitted
                over time
              </Typography>

              <TrendChart
                trends={
                  submissionTrends
                }
              />
            </CardContent>
          </Card>
        </Grid>

        {/* MOST ACTIVE FORM */}

        <Grid
          size={{
            xs: 12,
            md: 4,
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow:
                "0 4px 18px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Most Active Form
              </Typography>

              {mostActiveForm ? (
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 1,
                    }}
                  >
                    {mostActiveForm.form_title ||
                      mostActiveForm.title ||
                      `Form #${mostActiveForm.form_id}`}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 0.75,
                    }}
                  >
                    Form ID:{" "}
                    {
                      mostActiveForm.form_id
                    }
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Responses:{" "}
                    {
                      mostActiveForm.response_count
                    }
                  </Typography>
                </Box>
              ) : (
                <Typography
                  color="text.secondary"
                >
                  No active form data
                  available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* MOST USED FORMS */}

      <Grid
        container
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow:
                "0 4px 18px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Most Used Forms
              </Typography>

              {mostUsedForms.length ===
              0 ? (
                <Typography
                  color="text.secondary"
                >
                  No form usage data
                  available.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {mostUsedForms
                    .slice(0, 5)
                    .map(
                      (form) => (
                        <Box
                          key={
                            form.form_id
                          }
                          onClick={() =>
                            navigate(
                              `/forms/${form.form_id}`,
                            )
                          }
                          sx={{
                            cursor:
                              "pointer",
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 700,
                            }}
                          >
                            {form.form_title ||
                              form.title ||
                              `Form #${form.form_id}`}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Responses:{" "}
                            {
                              form.response_count
                            }
                            {" • "}
                            {form.is_active
                              ? "Active"
                              : "Inactive"}
                          </Typography>
                        </Box>
                      ),
                    )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* FORM FIELDS */}

        <Grid
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              boxShadow:
                "0 4px 18px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  mb: 2,
                }}
              >
                <InsertDriveFileIcon
                  color="primary"
                />

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  Form Fields
                </Typography>
              </Stack>

              {formFields.length ===
              0 ? (
                <Typography
                  color="text.secondary"
                >
                  No form field data
                  available.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {formFields.map(
                    (
                      field,
                      index,
                    ) => (
                      <Box
                        key={
                          field.id ??
                          index
                        }
                        sx={{
                          py: 1.25,
                          borderBottom:
                            index <
                            formFields.length -
                              1
                              ? "1px solid"
                              : "none",
                          borderColor:
                            "divider",
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 700,
                          }}
                        >
                          {
                            field.label
                          }
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Name:{" "}
                          {
                            field.name
                          }
                          {" • "}
                          Type:{" "}
                          {
                            field.field_type
                          }
                          {" • "}
                          {field.is_required
                            ? "Required"
                            : "Optional"}
                        </Typography>
                      </Box>
                    ),
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* RECENT RESPONSES */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow:
            "0 4px 18px rgba(0,0,0,0.06)",
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              mb: 2,
            }}
          >
            <BarChartIcon
              color="primary"
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Recent Responses
            </Typography>
          </Stack>

          {recentResponses.length ===
          0 ? (
            <Typography
              color="text.secondary"
            >
              No recent responses found.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {recentResponses
                .slice(0, 5)
                .map((item) => (
                  <Box
                    key={item.id}
                    onClick={() =>
                      navigate(
                        `/forms/${item.form?.id}/responses/${item.id}`,
                      )
                    }
                    sx={{
                      cursor:
                        "pointer",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {item.form?.title ||
                        `Form #${item.form?.id}`}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Submitted by:{" "}
                      {item.submitted_by
                        ?.name ||
                        "Unknown User"}
                      {" • "}
                      {item.submitted_at
                        ? new Date(
                            item.submitted_at,
                          ).toLocaleString()
                        : "-"}
                    </Typography>
                  </Box>
                ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* BOTTOM SUMMARY */}

      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Grid
            container
            spacing={2}
            alignItems="center"
          >
            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <GroupsIcon
                  fontSize="small"
                  color="primary"
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Active Users:{" "}
                  {
                    summary?.active_users ??
                    0
                  }
                </Typography>
              </Stack>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <DescriptionIcon
                  fontSize="small"
                  color="primary"
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Inactive Forms:{" "}
                  {
                    summary?.inactive_forms ??
                    0
                  }
                </Typography>
              </Stack>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign={{
                  xs: "left",
                  md: "right",
                }}
              >
                Last Updated:{" "}
                {summary?.generated_at
                  ? new Date(
                      summary.generated_at,
                    ).toLocaleString()
                  : new Date().toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardPage;