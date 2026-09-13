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

import {
  FormResponseData,
  ResponseDetailResponse,
  responsesApi,
} from "../../api/responses.api";

// ============================================================
// COMPONENT
// ============================================================

const ResponseDetailsPage = () => {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const responseId = Number(id);

  const [response, setResponse] =
    useState<FormResponseData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // ============================================================
  // LOAD RESPONSE
  // ============================================================

  const loadResponse = async () => {
    if (
      !responseId ||
      Number.isNaN(responseId)
    ) {
      setError("Invalid response ID.");

      setLoading(false);

      return;
    }

    try {
      setLoading(true);

      setError(null);

      console.log(
        "Loading response:",
        responseId,
      );

      const result =
        await responsesApi.getResponse(
          responseId,
        );

      console.log(
        "Response result:",
        result,
      );

      // ========================================================
      // API RETURNS:
      //
      // {
      //   success,
      //   message,
      //   response: FormResponseData
      // }
      // ========================================================

      setResponse(
        result.response,
      );
    } catch (error: any) {
      console.error(
        "Failed to load response:",
        error,
      );

      setError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load response.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // EFFECT
  // ============================================================

  useEffect(() => {
    loadResponse();
  }, [responseId]);

  // ============================================================
  // FORMAT DATE
  // ============================================================

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

  // ============================================================
  // GET SUBMITTED USER
  // ============================================================

  const getSubmittedBy = () => {
    if (
      !response?.submitted_by
    ) {
      return "Unknown User";
    }

    const user =
      response.submitted_by;

    if (
      typeof user.name ===
        "string" &&
      user.name.trim()
    ) {
      return user.name;
    }

    if (
      typeof user.email ===
        "string" &&
      user.email.trim()
    ) {
      return user.email;
    }

    return "Unknown User";
  };

  // ============================================================
  // FORMAT ANSWER VALUE
  // ============================================================

  const formatAnswerValue = (
    answer: ResponseDetailResponse,
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

  // ============================================================
  // GET FIELD NAME
  // ============================================================

  const getFieldName = (
    answer: ResponseDetailResponse,
    index: number,
  ) => {
    if (
      answer.field?.label
    ) {
      return answer.field.label;
    }

    if (
      answer.field?.name
    ) {
      return answer.field.name;
    }

    return `Field #${
      answer.field_id ??
      index + 1
    }`;
  };

  // ============================================================
  // LOADING
  // ============================================================

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
            Loading response...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (
    error &&
    !response
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
                "/responses",
              )
            }
            sx={{
              alignSelf:
                "flex-start",
            }}
          >
            Back to Responses
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
              loadResponse
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

  // ============================================================
  // NOT FOUND
  // ============================================================

  if (!response) {
    return (
      <Box
        sx={{
          p: 3,
        }}
      >
        <Alert severity="warning">
          Response not found.
        </Alert>
      </Box>
    );
  }

  // ============================================================
  // MAIN PAGE
  // ============================================================

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
                "/responses",
              )
            }
            sx={{
              mb: 2,
            }}
          >
            Back to Responses
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
                Response Details
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                }}
              >
                Response #
                {response.id}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={
                <EditOutlinedIcon />
              }
              onClick={() =>
                navigate(
                  `/responses/${response.id}/edit`,
                )
              }
            >
              Edit
            </Button>
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
        {/* RESPONSE INFORMATION */}
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
              Response Information
            </Typography>

            <Grid
              container
              spacing={3}
            >

              {/* RESPONSE ID */}

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
                  Response ID
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {response.id}
                </Typography>
              </Grid>

              {/* FORM ID */}

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
                  Form ID
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {response.form?.id ?? "-"}
                </Typography>
              </Grid>

              {/* FORM TITLE */}

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
                  Form
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {response.form?.title ??
                    "-"}
                </Typography>
              </Grid>

              {/* SUBMITTED BY */}

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
                  Submitted By
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {getSubmittedBy()}
                </Typography>
              </Grid>

              {/* SUBMITTED AT */}

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
                  Submitted At
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {formatDate(
                    response.submitted_at,
                  )}
                </Typography>
              </Grid>

              {/* UPDATED AT */}

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
                  Last Updated
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {formatDate(
                    response.updated_at,
                  )}
                </Typography>
              </Grid>

            </Grid>
          </CardContent>
        </Card>

        {/* ================================================== */}
        {/* ANSWERS */}
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
              Submitted Answers
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              Answers submitted for this response.
            </Typography>
          </Box>

          <Divider />

          {response.details.length ===
          0 ? (
            <Box
              sx={{
                p: 4,
              }}
            >
              <Alert severity="info">
                No answers available for this response.
              </Alert>
            </Box>
          ) : (
            <Stack
              divider={
                <Divider />
              }
            >
              {response.details.map(
                (
                  answer,
                  index,
                ) => (
                  <Box
                    key={
                      answer.id ??
                      answer.field_id ??
                      index
                    }
                    sx={{
                      p: 3,
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
                    {/* FIELD NAME */}

                    <Typography
                      fontWeight={600}
                      color="text.secondary"
                    >
                      {getFieldName(
                        answer,
                        index,
                      )}
                    </Typography>

                    {/* FIELD VALUE */}

                    <Typography
                      sx={{
                        whiteSpace:
                          "pre-wrap",
                        wordBreak:
                          "break-word",
                      }}
                    >
                      {formatAnswerValue(
                        answer,
                      )}
                    </Typography>
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

export default ResponseDetailsPage;