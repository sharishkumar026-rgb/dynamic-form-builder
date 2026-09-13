import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import TableViewIcon from "@mui/icons-material/TableView";

import {
  reportsApi,
  FormReportAnswer,
  FormReportData,
  FormReportItem,
  ReportStatisticsData,
} from "../../api/reports.api";

// ============================================================
// COMPONENT
// ============================================================

const ReportDetailsPage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const formId = Number(id);

  // ==========================================================
  // STATE
  // ==========================================================

  const [report, setReport] =
    useState<FormReportData | null>(
      null,
    );

  const [statistics, setStatistics] =
    useState<ReportStatisticsData | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(
      null,
    );

  const [pdfLoading, setPdfLoading] =
    useState(false);

  const [excelLoading, setExcelLoading] =
    useState(false);

  // ==========================================================
  // LOAD REPORT
  // ==========================================================

  const loadReport = async () => {
    if (
      !formId ||
      Number.isNaN(formId)
    ) {
      setError(
        "Invalid form ID.",
      );

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      setError(null);

      console.log(
        "Loading report for form:",
        formId,
      );

      const [
        reportResult,
        statisticsResult,
      ] = await Promise.all([
        reportsApi.getFormReport(
          formId,
        ),

        reportsApi.getFormStatistics(
          formId,
        ),
      ]);

      console.log(
        "Report result:",
        reportResult,
      );

      console.log(
        "Statistics result:",
        statisticsResult,
      );

      // FormReportResponse
      setReport(
        reportResult.data,
      );

      // ReportStatisticsResponse
      setStatistics(
        statisticsResult.data,
      );
    } catch (error: any) {
      console.error(
        "Failed to load report:",
        error,
      );

      setError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load report.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // LOAD EFFECT
  // ==========================================================

  useEffect(() => {
    loadReport();
  }, [formId]);

  // ==========================================================
  // DOWNLOAD BLOB
  // ==========================================================

  const downloadBlob = (
    blob: Blob,
    filename: string,
  ) => {
    const blobUrl =
      window.URL.createObjectURL(
        blob,
      );

    const link =
      document.createElement("a");

    link.href = blobUrl;

    link.download = filename;

    document.body.appendChild(
      link,
    );

    link.click();

    document.body.removeChild(
      link,
    );

    window.setTimeout(() => {
      window.URL.revokeObjectURL(
        blobUrl,
      );
    }, 100);
  };

  // ==========================================================
  // WAIT FOR EXPORT
  // ==========================================================

  const waitForExport = async (
    taskId: string,
    exportType: "pdf" | "excel",
  ) => {
    const maxAttempts = 60;

    for (
      let attempt = 1;
      attempt <= maxAttempts;
      attempt++
    ) {
      try {
        const exportResult =
          await reportsApi.getExportStatus(
            taskId,
          );

        // ReportExportResultResponse
        const exportData =
          exportResult.data;

        console.log(
          `Export status ${attempt}:`,
          exportData,
        );

        // ====================================================
        // COMPLETED
        // ====================================================

        if (
          exportData.status ===
          "completed"
        ) {
          if (
            !exportData.file_name
          ) {
            throw new Error(
              "Export completed but no file was returned.",
            );
          }

          const blob =
            await reportsApi.downloadExport(
              exportData.file_name,
            );

          downloadBlob(
            blob,
            exportData.file_name,
          );

          return;
        }

        // ====================================================
        // FAILED
        // ====================================================

        if (
          exportData.status ===
          "failed"
        ) {
          throw new Error(
            exportData.error ||
              `Failed to generate ${exportType}.`,
          );
        }

        // ====================================================
        // WAIT
        // ====================================================

        await new Promise<void>(
          (resolve) =>
            setTimeout(
              resolve,
              1000,
            ),
        );
      } catch (error: any) {
        throw new Error(
          error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            `Failed to generate ${exportType}.`,
        );
      }
    }

    throw new Error(
      "Export is taking too long. Please try again.",
    );
  };

  // ==========================================================
  // EXPORT PDF
  // ==========================================================

  const handleExportPdf =
    async () => {
      if (
        !formId ||
        Number.isNaN(formId)
      ) {
        setError(
          "Invalid form ID.",
        );

        return;
      }

      try {
        setPdfLoading(true);

        setError(null);

        const result =
          await reportsApi.exportPdf(
            formId,
            {
              start_date: null,
              end_date: null,
              submitted_by_id: null,
            },
          );

        // ReportExportResponse
        const taskId =
          result.data.task_id;

        if (!taskId) {
          throw new Error(
            "Export task ID was not returned.",
          );
        }

        await waitForExport(
          taskId,
          "pdf",
        );
      } catch (error: any) {
        console.error(
          "PDF export failed:",
          error,
        );

        setError(
          error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            "Failed to export PDF.",
        );
      } finally {
        setPdfLoading(false);
      }
    };

  // ==========================================================
  // EXPORT EXCEL
  // ==========================================================

  const handleExportExcel =
    async () => {
      if (
        !formId ||
        Number.isNaN(formId)
      ) {
        setError(
          "Invalid form ID.",
        );

        return;
      }

      try {
        setExcelLoading(true);

        setError(null);

        const result =
          await reportsApi.exportExcel(
            formId,
            {
              start_date: null,
              end_date: null,
              submitted_by_id: null,
            },
          );

        // ReportExportResponse
        const taskId =
          result.data.task_id;

        if (!taskId) {
          throw new Error(
            "Export task ID was not returned.",
          );
        }

        await waitForExport(
          taskId,
          "excel",
        );
      } catch (error: any) {
        console.error(
          "Excel export failed:",
          error,
        );

        setError(
          error?.response?.data?.detail ||
            error?.response?.data?.message ||
            error?.message ||
            "Failed to export Excel.",
        );
      } finally {
        setExcelLoading(false);
      }
    };

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (
    value?: string | null,
  ) => {
    if (!value) {
      return "-";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return value;
    }

    return date.toLocaleString();
  };

  // ==========================================================
  // FORMAT ANSWER
  // ==========================================================

  const formatAnswerValue = (
    answer: FormReportAnswer,
  ) => {
    const value =
      answer.value ??
      answer.value_json;

    if (
      value === null ||
      value === undefined
    ) {
      return "-";
    }

    if (
      Array.isArray(value)
    ) {
      return value
        .map(
          (item) =>
            String(item),
        )
        .join(", ");
    }

    if (
      typeof value ===
      "object"
    ) {
      return JSON.stringify(
        value,
        null,
        2,
      );
    }

    return String(value);
  };

  // ==========================================================
  // GET SUBMITTED BY
  // ==========================================================

  const getSubmittedBy = (
    item: FormReportItem,
  ) => {
    if (
      !item.submitted_by
    ) {
      return "Unknown User";
    }

    const user =
      item.submitted_by;

    const name =
      user.name;

    const fullName =
      user.full_name;

    const email =
      user.email;

    if (
      typeof name ===
        "string" &&
      name.trim()
    ) {
      return name;
    }

    if (
      typeof fullName ===
        "string" &&
      fullName.trim()
    ) {
      return fullName;
    }

    if (
      typeof email ===
        "string" &&
      email.trim()
    ) {
      return email;
    }

    return "Unknown User";
  };

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
        <Stack
          spacing={2}
          alignItems="center"
        >
          <CircularProgress />

          <Typography
            color="text.secondary"
          >
            Loading report...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    error &&
    !report
  ) {
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
          <Button
            startIcon={
              <ArrowBackOutlinedIcon />
            }
            onClick={() =>
              navigate(
                "/reports",
              )
            }
            sx={{
              alignSelf:
                "flex-start",
            }}
          >
            Back to Reports
          </Button>

          <Alert severity="error">
            {error}
          </Alert>

          <Button
            variant="outlined"
            startIcon={
              <RefreshOutlinedIcon />
            }
            onClick={
              loadReport
            }
            sx={{
              alignSelf:
                "flex-start",
            }}
          >
            Try Again
          </Button>
        </Stack>
      </Box>
    );
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (!report) {
    return (
      <Box
        sx={{
          p: 3,
        }}
      >
        <Alert severity="warning">
          Report not found.
        </Alert>
      </Box>
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

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

        {/* ================================================== */}
        {/* HEADER */}
        {/* ================================================== */}

        <Box>
          <Button
            startIcon={
              <ArrowBackOutlinedIcon />
            }
            onClick={() =>
              navigate(
                "/reports",
              )
            }
            sx={{
              mb: 2,
            }}
          >
            Back to Reports
          </Button>

          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              md: "center",
            }}
            spacing={2}
          >
            <Box>
              <Typography
                variant="h4"
                fontWeight={700}
              >
                Report Details
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                {report.title}
              </Typography>
            </Box>

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
            >
              <Button
                variant="outlined"
                startIcon={
                  <PictureAsPdfIcon />
                }
                disabled={
                  pdfLoading ||
                  excelLoading
                }
                onClick={
                  handleExportPdf
                }
              >
                {pdfLoading
                  ? "Generating..."
                  : "Export PDF"}
              </Button>

              <Button
                variant="outlined"
                startIcon={
                  <TableViewIcon />
                }
                disabled={
                  pdfLoading ||
                  excelLoading
                }
                onClick={
                  handleExportExcel
                }
              >
                {excelLoading
                  ? "Generating..."
                  : "Export Excel"}
              </Button>

              <Button
                variant="outlined"
                startIcon={
                  <EditOutlinedIcon />
                }
                onClick={() =>
                  navigate(
                    `/reports/${formId}/edit`,
                  )
                }
              >
                Edit
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* ================================================== */}
        {/* ERROR */}
        {/* ================================================== */}

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {/* ================================================== */}
        {/* REPORT INFORMATION */}
        {/* ================================================== */}

        <Card>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{
                mb: 3,
              }}
            >
              Report Information
            </Typography>

            <Grid
              container
              spacing={3}
            >
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Form ID
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {report.form_id}
                </Typography>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Form Title
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {report.title}
                </Typography>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Total Fields
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {report.total_fields}
                </Typography>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Total Responses
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {report.total_responses}
                </Typography>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Start Date
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {formatDate(
                    report.start_date,
                  )}
                </Typography>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  End Date
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {formatDate(
                    report.end_date,
                  )}
                </Typography>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 4,
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Generated At
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {formatDate(
                    report.generated_at,
                  )}
                </Typography>
              </Grid>
            </Grid>

            {report.description && (
              <>
                <Divider
                  sx={{
                    my: 3,
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Description
                </Typography>

                <Typography
                  sx={{
                    mt: 1,
                  }}
                >
                  {report.description}
                </Typography>
              </>
            )}
          </CardContent>
        </Card>

        {/* ================================================== */}
        {/* REPORT STATISTICS */}
        {/* ================================================== */}

        {statistics && (
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  mb: 3,
                }}
              >
                Report Statistics
              </Typography>

              <Grid
                container
                spacing={3}
              >
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Total Responses
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    {
                      statistics.total_responses
                    }
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Total Fields
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    {
                      statistics.total_fields
                    }
                  </Typography>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Average Answers Per Response
                  </Typography>

                  <Typography
                    variant="h5"
                    fontWeight={700}
                  >
                    {
                      statistics.average_answers_per_response
                    }
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* ================================================== */}
        {/* FORM RESPONSES */}
        {/* ================================================== */}

        <Paper
          variant="outlined"
          sx={{
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              p: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={700}
            >
              Form Responses
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              All responses included in
              this report.
            </Typography>
          </Box>

          <Divider />

          {report.responses.length ===
          0 ? (
            <Box
              sx={{
                p: 4,
              }}
            >
              <Alert severity="info">
                No responses found for
                this form.
              </Alert>
            </Box>
          ) : (
            <Stack spacing={0}>
              {report.responses.map(
                (
                  response,
                  responseIndex,
                ) => (
                  <Box
                    key={
                      response.response_id
                    }
                  >
                    <Box
                      sx={{
                        p: 3,
                      }}
                    >
                      {/* RESPONSE HEADER */}

                      <Stack
                        direction={{
                          xs: "column",
                          md: "row",
                        }}
                        justifyContent="space-between"
                        spacing={2}
                        sx={{
                          mb: 3,
                        }}
                      >
                        <Box>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                          >
                            Response #
                            {
                              response.response_id
                            }
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Submitted by{" "}
                            {
                              getSubmittedBy(
                                response,
                              )
                            }
                          </Typography>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Submitted:{" "}
                          {
                            formatDate(
                              response.submitted_at,
                            )
                          }
                        </Typography>
                      </Stack>

                      {/* ANSWERS */}

                      {response.answers
                        .length === 0 ? (
                        <Alert severity="info">
                          No answers available
                          for this response.
                        </Alert>
                      ) : (
                        <Stack
                          divider={
                            <Divider />
                          }
                        >
                          {response.answers.map(
                            (
                              answer,
                            ) => (
                              <Box
                                key={
                                  answer.field_id
                                }
                                sx={{
                                  py: 2,
                                  display:
                                    "grid",
                                  gridTemplateColumns:
                                    {
                                      xs: "1fr",
                                      md: "250px 1fr",
                                    },
                                  gap: 2,
                                }}
                              >
                                <Typography
                                  fontWeight={600}
                                  color="text.secondary"
                                >
                                  {
                                    answer.field_label ||
                                    answer.field_name ||
                                    `Field #${answer.field_id}`
                                  }
                                </Typography>

                                <Typography
                                  component="pre"
                                  sx={{
                                    m: 0,
                                    fontFamily:
                                      "inherit",
                                    whiteSpace:
                                      "pre-wrap",
                                    wordBreak:
                                      "break-word",
                                  }}
                                >
                                  {
                                    formatAnswerValue(
                                      answer,
                                    )
                                  }
                                </Typography>
                              </Box>
                            ),
                          )}
                        </Stack>
                      )}
                    </Box>

                    {responseIndex <
                      report.responses
                        .length -
                        1 && (
                      <Divider />
                    )}
                  </Box>
                ),
              )}
            </Stack>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};

export default ReportDetailsPage;