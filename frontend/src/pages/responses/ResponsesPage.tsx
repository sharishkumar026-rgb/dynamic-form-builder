import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const API_BASE_URL = "http://127.0.0.1:8000/api";

// ============================================================
// TYPES
// ============================================================

interface Role {
  id?: number;
  name?: string;
  description?: string;
  is_active?: boolean;
}

interface SubmittedBy {
  id?: number;
  name?: string;
  email?: string;
  role?: Role;
}

interface FormData {
  id?: number;
  title?: string;
  description?: string;
  is_active?: boolean;
}

interface Field {
  id?: number;
  label?: string;
  name?: string;
  field_type?: string;
  is_required?: boolean;
}

interface ResponseDetail {
  id?: number;
  response_id?: number;
  field_id?: number;

  field?: Field;

  field_name?: string;
  field_label?: string;
  field_type?: string;

  value?: string | null;

  value_json?: unknown;

  created_at?: string;
  updated_at?: string;
}

interface ResponseData {
  id: number | string;

  form?: FormData | null;

  submitted_by?: SubmittedBy | null;

  submitted_at?: string | null;

  created_at?: string | null;

  updated_at?: string | null;

  status?: string | null;

  details?: ResponseDetail[];

  answers?: ResponseDetail[];
}

type StatusFilter =
  | "all"
  | "completed"
  | "pending"
  | "reviewed";

const PAGE_SIZE_OPTIONS = [5, 10, 25, 50];

// ============================================================
// STAT CARD
// ============================================================

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBackground: string;
  iconColor: string;
}

const StatCard = ({
  title,
  value,
  icon,
  iconBackground,
  iconColor,
}: StatCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
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
              {title}
            </Typography>

            <Typography
              variant="h4"
              fontWeight={700}
              sx={{ mt: 0.5 }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: iconBackground,
              color: iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// ============================================================
// COMPONENT
// ============================================================

export default function ResponsesPage() {
  const navigate = useNavigate();

  const { id } = useParams<{
    id: string;
  }>();

  const [responses, setResponses] =
    useState<ResponseData[]>([]);

  const [formTitle, setFormTitle] =
    useState("Form Responses");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [page, setPage] =
    useState(0);

  const [rowsPerPage, setRowsPerPage] =
    useState(10);

  // ============================================================
  // TOKEN
  // ============================================================

  const getToken = (): string | null => {
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("access_token") ||
      sessionStorage.getItem("accessToken")
    );
  };

  // ============================================================
  // HEADERS
  // ============================================================

  const getHeaders = (): HeadersInit => {
    const token = getToken();

    return {
      Accept: "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  // ============================================================
  // EXTRACT RESPONSES
  // ============================================================

  const extractResponses = (
    result: unknown,
  ): ResponseData[] => {
    if (Array.isArray(result)) {
      return result as ResponseData[];
    }

    if (
      typeof result !== "object" ||
      result === null
    ) {
      return [];
    }

    const data =
      result as Record<string, unknown>;

    // Backend:
    // { response: [...] }

    if (
      Array.isArray(data.response)
    ) {
      return data.response as ResponseData[];
    }

    // Backend:
    // { responses: [...] }

    if (
      Array.isArray(data.responses)
    ) {
      return data.responses as ResponseData[];
    }

    // Backend:
    // { data: [...] }

    if (
      Array.isArray(data.data)
    ) {
      return data.data as ResponseData[];
    }

    // Backend:
    // { items: [...] }

    if (
      Array.isArray(data.items)
    ) {
      return data.items as ResponseData[];
    }

    // Nested:
    // { data: { responses: [...] } }

    if (
      typeof data.data === "object" &&
      data.data !== null
    ) {
      const nestedData =
        data.data as Record<
          string,
          unknown
        >;

      if (
        Array.isArray(
          nestedData.responses,
        )
      ) {
        return nestedData.responses as ResponseData[];
      }

      if (
        Array.isArray(
          nestedData.response,
        )
      ) {
        return nestedData.response as ResponseData[];
      }

      if (
        Array.isArray(
          nestedData.items,
        )
      ) {
        return nestedData.items as ResponseData[];
      }
    }

    return [];
  };

  // ============================================================
  // EXTRACT FORM TITLE
  // ============================================================

  const extractFormTitle = (
    result: unknown,
    responseList: ResponseData[],
  ): string | null => {
    if (
      typeof result === "object" &&
      result !== null
    ) {
      const data =
        result as Record<string, unknown>;

      if (
        typeof data.form === "object" &&
        data.form !== null
      ) {
        const form =
          data.form as Record<
            string,
            unknown
          >;

        if (
          typeof form.title ===
          "string"
        ) {
          return form.title;
        }
      }

      if (
        typeof data.data === "object" &&
        data.data !== null &&
        !Array.isArray(data.data)
      ) {
        const nested =
          data.data as Record<
            string,
            unknown
          >;

        if (
          typeof nested.form ===
            "object" &&
          nested.form !== null
        ) {
          const form =
            nested.form as Record<
              string,
              unknown
            >;

          if (
            typeof form.title ===
            "string"
          ) {
            return form.title;
          }
        }

        if (
          typeof nested.title ===
          "string"
        ) {
          return nested.title;
        }
      }
    }

    if (
      responseList.length > 0 &&
      responseList[0].form?.title
    ) {
      return responseList[0].form.title;
    }

    return null;
  };

  // ============================================================
  // FETCH RESPONSES
  // ============================================================

  const fetchResponses =
    async (): Promise<void> => {
      if (!id) {
        setResponses([]);

        setError(
          "Form ID is missing.",
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        setError("");

        const apiResponse =
          await fetch(
            `${API_BASE_URL}/forms/${id}/responses`,
            {
              method: "GET",
              headers: getHeaders(),
            },
          );

        const result: unknown =
          await apiResponse
            .json()
            .catch(() => null);

        console.log(
          "Responses API status:",
          apiResponse.status,
        );

        console.log(
          "Responses API result:",
          result,
        );

        if (!apiResponse.ok) {
          let message =
            `Failed to load responses. ` +
            `Server returned ${apiResponse.status}.`;

          if (
            typeof result ===
              "object" &&
            result !== null
          ) {
            const errorResult =
              result as Record<
                string,
                unknown
              >;

            if (
              typeof errorResult.message ===
              "string"
            ) {
              message =
                errorResult.message;
            } else if (
              typeof errorResult.detail ===
              "string"
            ) {
              message =
                errorResult.detail;
            }
          }

          throw new Error(
            message,
          );
        }

        const responseList =
          extractResponses(
            result,
          );

        console.log(
          "Extracted response list:",
          responseList,
        );

        setResponses(
          responseList,
        );

        const title =
          extractFormTitle(
            result,
            responseList,
          );

        if (title) {
          setFormTitle(
            title,
          );
        }
      } catch (err) {
        console.error(
          "Failed to fetch responses:",
          err,
        );

        setResponses([]);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load responses.",
        );
      } finally {
        setLoading(false);
      }
    };

  // ============================================================
  // EFFECT
  // ============================================================

  useEffect(() => {
    void fetchResponses();
  }, [id]);

  // ============================================================
  // STATUS
  // ============================================================

  const getStatus = (
    response: ResponseData,
  ): string => {
    return (
      response.status ||
      "completed"
    ).toLowerCase();
  };

  // ============================================================
  // SUBMITTED BY
  // ============================================================

  const getSubmittedBy = (
    response: ResponseData,
  ): string => {
    if (
      response.submitted_by?.name
    ) {
      return (
        response.submitted_by.name
      );
    }

    if (
      response.submitted_by?.email
    ) {
      return (
        response.submitted_by.email
      );
    }

    return "Anonymous";
  };

  const getSubmittedByEmail = (
    response: ResponseData,
  ): string | undefined => {
    return (
      response.submitted_by?.email
    );
  };

  // ============================================================
  // DATE
  // ============================================================

  const getSubmittedAt = (
    response: ResponseData,
  ): string | null | undefined => {
    return (
      response.submitted_at ||
      response.created_at
    );
  };

  const formatDate = (
    value?: string | null,
  ): string => {
    if (!value) {
      return "Not available";
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

    return (
      date.toLocaleString()
    );
  };

  // ============================================================
  // ANSWER COUNT
  // ============================================================

  const getAnswerCount = (
    response: ResponseData,
  ): number => {
    if (
      Array.isArray(
        response.details,
      )
    ) {
      return (
        response.details.length
      );
    }

    if (
      Array.isArray(
        response.answers,
      )
    ) {
      return (
        response.answers.length
      );
    }

    return 0;
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredResponses =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return responses.filter(
        (response) => {
          const status =
            getStatus(
              response,
            );

          if (
            statusFilter !== "all" &&
            status !==
              statusFilter
          ) {
            return false;
          }

          if (
            !normalizedSearch
          ) {
            return true;
          }

          const submittedBy =
            getSubmittedBy(
              response,
            ).toLowerCase();

          const email =
            (
              getSubmittedByEmail(
                response,
              ) || ""
            ).toLowerCase();

          const responseId =
            String(
              response.id,
            ).toLowerCase();

          const submittedAt =
            formatDate(
              getSubmittedAt(
                response,
              ),
            ).toLowerCase();

          return (
            submittedBy.includes(
              normalizedSearch,
            ) ||
            email.includes(
              normalizedSearch,
            ) ||
            responseId.includes(
              normalizedSearch,
            ) ||
            submittedAt.includes(
              normalizedSearch,
            ) ||
            status.includes(
              normalizedSearch,
            )
          );
        },
      );
    }, [
      responses,
      search,
      statusFilter,
    ]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const paginatedResponses =
    useMemo(() => {
      const start =
        page *
        rowsPerPage;

      return filteredResponses.slice(
        start,
        start +
          rowsPerPage,
      );
    }, [
      filteredResponses,
      page,
      rowsPerPage,
    ]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalResponses =
    responses.length;

  const completedCount =
    responses.filter(
      (response) =>
        getStatus(
          response,
        ) === "completed",
    ).length;

  const pendingCount =
    responses.filter(
      (response) =>
        getStatus(
          response,
        ) === "pending",
    ).length;

  const reviewedCount =
    responses.filter(
      (response) =>
        getStatus(
          response,
        ) === "reviewed",
    ).length;

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleSearchChange = (
    value: string,
  ): void => {
    setSearch(value);

    setPage(0);
  };

  const handleStatusChange = (
    value: StatusFilter,
  ): void => {
    setStatusFilter(
      value,
    );

    setPage(0);
  };

  const handleChangePage = (
    _event: unknown,
    newPage: number,
  ): void => {
    setPage(
      newPage,
    );
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<
      HTMLInputElement
    >,
  ): void => {
    setRowsPerPage(
      Number(
        event.target.value,
      ),
    );

    setPage(0);
  };

  const handleViewResponse = (
    responseId: number | string,
  ): void => {
    navigate(
      `/forms/${id}/responses/${responseId}`,
    );
  };

  const handleBack =
    (): void => {
      navigate(
        `/forms/${id}`,
      );
    };

  const handleRefresh =
    (): void => {
      void fetchResponses();
    };

  const handleDeleteResponse =
    async (
      responseId:
        | number
        | string,
    ): Promise<void> => {
      if (!id) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to delete this response?",
        );

      if (!confirmed) {
        return;
      }

      try {
        const apiResponse =
          await fetch(
            `${API_BASE_URL}/forms/${id}/responses/${responseId}`,
            {
              method:
                "DELETE",
              headers:
                getHeaders(),
            },
          );

        if (
          !apiResponse.ok
        ) {
          throw new Error(
            `Failed to delete response. Server returned ${apiResponse.status}.`,
          );
        }

        await fetchResponses();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to delete response.",
        );
      }
    };

  const getStatusColor = (
    status: string,
  ):
    | "success"
    | "warning"
    | "info"
    | "default"
    | "error" => {
    switch (
      status
    ) {
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

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems:
            "center",
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
            Loading responses...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <Box
      sx={{
        maxWidth: 1400,
        mx: "auto",
        p: {
          xs: 2,
          md: 3,
        },
      }}
    >
      {/* HEADER */}

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
        sx={{
          mb: 3,
        }}
      >
        <Box>
          <Button
            startIcon={
              <ArrowBackIcon />
            }
            onClick={
              handleBack
            }
            sx={{
              mb: 1,
              textTransform:
                "none",
              px: 0,
            }}
          >
            Back to Form
          </Button>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            Responses
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            View and manage responses for{" "}
            <strong>
              {formTitle}
            </strong>
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={
            <RefreshIcon />
          }
          onClick={
            handleRefresh
          }
          sx={{
            textTransform:
              "none",
            borderRadius: 2,
          }}
        >
          Refresh
        </Button>
      </Stack>

      {/* ERROR */}

      {error && (
        <Alert
          severity="error"
          onClose={() =>
            setError("")
          }
          sx={{
            mb: 3,
          }}
        >
          {error}
        </Alert>
      )}

      {/* STATISTICS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          title="Total Responses"
          value={
            totalResponses
          }
          icon={
            <QuestionAnswerOutlinedIcon />
          }
          iconBackground="#e3f2fd"
          iconColor="#1976d2"
        />

        <StatCard
          title="Completed"
          value={
            completedCount
          }
          icon={
            <CheckCircleOutlineIcon />
          }
          iconBackground="#e8f5e9"
          iconColor="#2e7d32"
        />

        <StatCard
          title="Pending"
          value={
            pendingCount
          }
          icon={
            <PendingOutlinedIcon />
          }
          iconBackground="#fff3e0"
          iconColor="#ed6c02"
        />

        <StatCard
          title="Reviewed"
          value={
            reviewedCount
          }
          icon={
            <RateReviewOutlinedIcon />
          }
          iconBackground="#e3f2fd"
          iconColor="#0288d1"
        />
      </Box>

      {/* RESPONSE TABLE */}

      <Card
        sx={{
          borderRadius: 2,
          boxShadow:
            "0 2px 12px rgba(0,0,0,0.08)",
          overflow:
            "hidden",
        }}
      >
        <CardContent
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              mb: 3,
            }}
          >
            <QuestionAnswerOutlinedIcon
              color="primary"
            />

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Submitted Responses
            </Typography>
          </Stack>

          {/* FILTERS */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 220px",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search responses..."
              value={
                search
              }
              onChange={(
                event,
              ) =>
                handleSearchChange(
                  event.target.value,
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                  >
                    <SearchIcon
                      color="action"
                    />
                  </InputAdornment>
                ),
              }}
            />

            <Select
              fullWidth
              value={
                statusFilter
              }
              onChange={(
                event,
              ) =>
                handleStatusChange(
                  event.target
                    .value as StatusFilter,
                )
              }
            >
              <MenuItem value="all">
                All Statuses
              </MenuItem>

              <MenuItem value="completed">
                Completed
              </MenuItem>

              <MenuItem value="pending">
                Pending
              </MenuItem>

              <MenuItem value="reviewed">
                Reviewed
              </MenuItem>
            </Select>
          </Box>

          <Divider
            sx={{
              mb: 2,
            }}
          />

          {/* EMPTY */}

          {filteredResponses.length ===
          0 ? (
            <Box
              sx={{
                py: 8,
                textAlign:
                  "center",
              }}
            >
              <QuestionAnswerOutlinedIcon
                sx={{
                  fontSize: 60,
                  color:
                    "text.disabled",
                  mb: 2,
                }}
              />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                {responses.length ===
                0
                  ? "No responses yet"
                  : "No matching responses"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                }}
              >
                {responses.length ===
                0
                  ? "Responses submitted for this form will appear here."
                  : "Try changing your search or status filter."}
              </Typography>

              {responses.length >
                0 && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearch("");

                    setStatusFilter(
                      "all",
                    );

                    setPage(0);
                  }}
                  sx={{
                    mt: 3,
                    textTransform:
                      "none",
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor:
                          "action.hover",
                      }}
                    >
                      <TableCell>
                        <strong>
                          Response ID
                        </strong>
                      </TableCell>

                      <TableCell>
                        <strong>
                          Submitted By
                        </strong>
                      </TableCell>

                      <TableCell>
                        <strong>
                          Submitted At
                        </strong>
                      </TableCell>

                      <TableCell>
                        <strong>
                          Answers
                        </strong>
                      </TableCell>

                      <TableCell>
                        <strong>
                          Status
                        </strong>
                      </TableCell>

                      <TableCell
                        align="right"
                      >
                        <strong>
                          Actions
                        </strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {paginatedResponses.map(
                      (
                        response,
                      ) => {
                        const status =
                          getStatus(
                            response,
                          );

                        return (
                          <TableRow
                            key={
                              response.id
                            }
                            hover
                          >
                            <TableCell>
                              <Typography
                                fontWeight={700}
                              >
                                #
                                {
                                  response.id
                                }
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                              >
                                <Box
                                  sx={{
                                    width: 34,
                                    height: 34,
                                    borderRadius:
                                      "50%",
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    backgroundColor:
                                      "action.hover",
                                  }}
                                >
                                  <PersonOutlineIcon
                                    fontSize="small"
                                  />
                                </Box>

                                <Box>
                                  <Typography
                                    variant="body2"
                                    fontWeight={600}
                                  >
                                    {getSubmittedBy(
                                      response,
                                    )}
                                  </Typography>

                                  {getSubmittedByEmail(
                                    response,
                                  ) && (
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      display="block"
                                    >
                                      {getSubmittedByEmail(
                                        response,
                                      )}
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>
                            </TableCell>

                            <TableCell>
                              <Typography
                                variant="body2"
                              >
                                {formatDate(
                                  getSubmittedAt(
                                    response,
                                  ),
                                )}
                              </Typography>
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={`${getAnswerCount(
                                  response,
                                )} answers`}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>

                            <TableCell>
                              <Chip
                                label={
                                  status
                                    .charAt(
                                      0,
                                    )
                                    .toUpperCase() +
                                  status.slice(
                                    1,
                                  )
                                }
                                color={getStatusColor(
                                  status,
                                )}
                                size="small"
                              />
                            </TableCell>

                            <TableCell
                              align="right"
                            >
                              <Stack
                                direction="row"
                                justifyContent="flex-end"
                                spacing={0.5}
                              >
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    handleViewResponse(
                                      response.id,
                                    )
                                  }
                                  title="View response"
                                >
                                  <VisibilityOutlinedIcon />
                                </IconButton>

                                <IconButton
                                  color="error"
                                  title="Delete response"
                                  onClick={() =>
                                    void handleDeleteResponse(
                                      response.id,
                                    )
                                  }
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={
                  filteredResponses.length
                }
                page={
                  page
                }
                onPageChange={
                  handleChangePage
                }
                rowsPerPage={
                  rowsPerPage
                }
                onRowsPerPageChange={
                  handleChangeRowsPerPage
                }
                rowsPerPageOptions={
                  PAGE_SIZE_OPTIONS
                }
              />
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}