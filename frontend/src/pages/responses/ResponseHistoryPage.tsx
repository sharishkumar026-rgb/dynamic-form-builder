import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBackOutlined as ArrowBackOutlinedIcon,
  RefreshOutlined as RefreshOutlinedIcon,
  HistoryOutlined as HistoryOutlinedIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  EditOutlined as EditOutlinedIcon,
  SendOutlined as SendOutlinedIcon,
  VisibilityOutlined as VisibilityOutlinedIcon,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE_URL = "http://127.0.0.1:8000/api";

interface ResponseHistoryItem {
  id: number | string;
  response_id?: number | string;
  responseId?: number | string;
  action?: string;
  description?: string;
  changed_by?: string;
  changedBy?: string;
  created_at?: string;
  createdAt?: string;
  data?: Record<string, unknown>;
}

interface FormData {
  id?: number | string;
  title?: string;
}

const getToken = (): string | null => {
  return (
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("access_token") ||
    sessionStorage.getItem("accessToken")
  );
};

const isObject = (
  value: unknown
): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const convertToHistoryItem = (
  value: unknown
): ResponseHistoryItem | null => {
  if (!isObject(value)) {
    return null;
  }

  if (
    !("id" in value) ||
    (typeof value.id !== "number" &&
      typeof value.id !== "string")
  ) {
    return null;
  }

  return {
    id: value.id,

    response_id:
      typeof value.response_id === "number" ||
      typeof value.response_id === "string"
        ? value.response_id
        : undefined,

    responseId:
      typeof value.responseId === "number" ||
      typeof value.responseId === "string"
        ? value.responseId
        : undefined,

    action:
      typeof value.action === "string"
        ? value.action
        : undefined,

    description:
      typeof value.description === "string"
        ? value.description
        : undefined,

    changed_by:
      typeof value.changed_by === "string"
        ? value.changed_by
        : undefined,

    changedBy:
      typeof value.changedBy === "string"
        ? value.changedBy
        : undefined,

    created_at:
      typeof value.created_at === "string"
        ? value.created_at
        : undefined,

    createdAt:
      typeof value.createdAt === "string"
        ? value.createdAt
        : undefined,

    data: isObject(value.data)
      ? value.data
      : undefined,
  };
};

const convertHistoryArray = (
  value: unknown
): ResponseHistoryItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(convertToHistoryItem)
    .filter(
      (
        item
      ): item is ResponseHistoryItem =>
        item !== null
    );
};

const formatDate = (
  value?: string
): string => {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

const formatLabel = (
  value: string
): string => {
  return value
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
};

const formatValue = (
  value: unknown
): string => {
  if (
    value === null ||
    value === undefined
  ) {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(
        value,
        null,
        2
      );
    } catch {
      return String(value);
    }
  }

  return String(value);
};

const getActionColor = (
  action?: string
):
  | "success"
  | "info"
  | "warning"
  | "error"
  | "default" => {
  switch (action?.toLowerCase()) {
    case "created":
      return "success";

    case "submitted":
      return "info";

    case "updated":
      return "warning";

    case "reviewed":
      return "info";

    case "deleted":
      return "error";

    default:
      return "default";
  }
};

const getActionIcon = (
  action?: string
) => {
  switch (action?.toLowerCase()) {
    case "created":
      return (
        <AddCircleOutlineIcon fontSize="small" />
      );

    case "updated":
      return (
        <EditOutlinedIcon fontSize="small" />
      );

    case "submitted":
      return (
        <SendOutlinedIcon fontSize="small" />
      );

    case "reviewed":
      return (
        <VisibilityOutlinedIcon fontSize="small" />
      );

    default:
      return (
        <HistoryOutlinedIcon fontSize="small" />
      );
  }
};

export default function ResponseHistoryPage() {
  const navigate = useNavigate();

  const {
    id,
    responseId,
  } = useParams<{
    id: string;
    responseId: string;
  }>();

  const formId = id;
  const currentResponseId = responseId;

  const [history, setHistory] =
    useState<ResponseHistoryItem[]>(
      []
    );

  const [formTitle, setFormTitle] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadHistory = async () => {
    if (
      !formId ||
      !currentResponseId
    ) {
      setError(
        "Form ID or response ID is missing."
      );
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const token = getToken();

      const headers: HeadersInit = {
        Accept: "application/json",
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${API_BASE_URL}/forms/${formId}/responses/${currentResponseId}/history`,
        {
          method: "GET",
          headers,
        }
      );

      const result: unknown =
        await response.json();

      if (!response.ok) {
        let message = `Failed to load response history (${response.status})`;

        if (
          isObject(result) &&
          typeof result.message ===
            "string"
        ) {
          message = result.message;
        }

        throw new Error(message);
      }

      let historyItems: ResponseHistoryItem[] =
        [];

      /*
       * Supported backend formats:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * {
       *   "history": [...]
       * }
       *
       * {
       *   "data": [...]
       * }
       *
       * {
       *   "response_history": [...]
       * }
       */
      if (Array.isArray(result)) {
        historyItems =
          convertHistoryArray(result);
      } else if (isObject(result)) {
        if ("history" in result) {
          historyItems =
            convertHistoryArray(
              result.history
            );
        } else if ("response_history" in result) {
          historyItems =
            convertHistoryArray(
              result.response_history
            );
        } else if ("responseHistory" in result) {
          historyItems =
            convertHistoryArray(
              result.responseHistory
            );
        } else if ("data" in result) {
          historyItems =
            convertHistoryArray(
              result.data
            );
        }
      }

      setHistory(historyItems);

      if (
        isObject(result) &&
        isObject(result.form) &&
        typeof result.form.title ===
          "string"
      ) {
        setFormTitle(
          result.form.title
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load response history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadHistory();
  }, [
    formId,
    currentResponseId,
  ]);

  const sortedHistory = useMemo(() => {
    return [...history].sort(
      (a, b) => {
        const dateA = a.created_at
          ? new Date(
              a.created_at
            ).getTime()
          : a.createdAt
          ? new Date(
              a.createdAt
            ).getTime()
          : 0;

        const dateB = b.created_at
          ? new Date(
              b.created_at
            ).getTime()
          : b.createdAt
          ? new Date(
              b.createdAt
            ).getTime()
          : 0;

        return dateB - dateA;
      }
    );
  }, [history]);

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
            Loading response history...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
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
                `/forms/${formId}/responses/${currentResponseId}`
              )
            }
            sx={{
              alignSelf:
                "flex-start",
            }}
          >
            Back to Response
          </Button>

          <Alert severity="error">
            {error}
          </Alert>

          <Button
            variant="outlined"
            startIcon={
              <RefreshOutlinedIcon />
            }
            onClick={() =>
              void loadHistory()
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
        <Box>
          <Button
            startIcon={
              <ArrowBackOutlinedIcon />
            }
            onClick={() =>
              navigate(
                `/forms/${formId}/responses/${currentResponseId}`
              )
            }
            sx={{ mb: 2 }}
          >
            Back to Response
          </Button>

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
                Response History
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {formTitle
                  ? `${formTitle} • `
                  : ""}
                Response #
                {currentResponseId}
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={
                <RefreshOutlinedIcon />
              }
              onClick={() =>
                void loadHistory()
              }
            >
              Refresh
            </Button>
          </Stack>
        </Box>

        {/* Summary */}
        <Card variant="outlined">
          <CardContent>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={3}
              divider={
                <Divider
                  orientation={
                    window.innerWidth >=
                    600
                      ? "vertical"
                      : "horizontal"
                  }
                  flexItem
                />
              }
            >
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Response ID
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
                  #{currentResponseId}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  History Entries
                </Typography>

                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{ mt: 0.5 }}
                >
                  {history.length}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Empty State */}
        {sortedHistory.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{ p: 5 }}
          >
            <Stack
              spacing={2}
              alignItems="center"
              textAlign="center"
            >
              <HistoryOutlinedIcon
                sx={{
                  fontSize: 56,
                  color:
                    "text.secondary",
                }}
              />

              <Typography
                variant="h6"
                fontWeight={700}
              >
                No History Available
              </Typography>

              <Typography
                color="text.secondary"
              >
                There are no history records
                available for this response.
              </Typography>
            </Stack>
          </Paper>
        ) : (
          /* Timeline */
          <Stack spacing={2}>
            {sortedHistory.map(
              (item, index) => {
                const action =
                  item.action ||
                  "history";

                const createdAt =
                  item.created_at ||
                  item.createdAt;

                const changedBy =
                  item.changed_by ||
                  item.changedBy ||
                  "System";

                return (
                  <Box
                    key={`${item.id}-${index}`}
                    sx={{
                      display: "flex",
                      gap: 2,
                    }}
                  >
                    {/* Timeline icon */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection:
                          "column",
                        alignItems:
                          "center",
                      }}
                    >
                      <Box
                        sx={{
                          width: 42,
                          height: 42,
                          borderRadius:
                            "50%",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          bgcolor:
                            "action.hover",
                          color:
                            "text.secondary",
                          flexShrink: 0,
                        }}
                      >
                        {getActionIcon(
                          action
                        )}
                      </Box>

                      {index <
                        sortedHistory.length -
                          1 && (
                        <Box
                          sx={{
                            width: 2,
                            flex: 1,
                            minHeight: 35,
                            bgcolor:
                              "divider",
                            mt: 1,
                          }}
                        />
                      )}
                    </Box>

                    {/* History Card */}
                    <Paper
                      variant="outlined"
                      sx={{
                        flex: 1,
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{ p: 3 }}
                      >
                        <Stack
                          direction={{
                            xs: "column",
                            sm: "row",
                          }}
                          spacing={1}
                          justifyContent="space-between"
                          alignItems={{
                            xs: "flex-start",
                            sm: "center",
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Chip
                              icon={getActionIcon(
                                action
                              )}
                              label={formatLabel(
                                action
                              )}
                              color={getActionColor(
                                action
                              )}
                              size="small"
                            />
                          </Stack>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {formatDate(
                              createdAt
                            )}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="body1"
                          fontWeight={600}
                          sx={{
                            mt: 2,
                          }}
                        >
                          {item.description ||
                            `${formatLabel(
                              action
                            )} response`}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                          }}
                        >
                          Changed by:{" "}
                          <strong>
                            {changedBy}
                          </strong>
                        </Typography>

                        {/* Changed Data */}
                        {item.data &&
                          Object.keys(
                            item.data
                          ).length >
                            0 && (
                            <Box
                              sx={{
                                mt: 2,
                                p: 2,
                                bgcolor:
                                  "action.hover",
                                borderRadius: 1,
                              }}
                            >
                              <Typography
                                variant="subtitle2"
                                fontWeight={
                                  700
                                }
                                sx={{
                                  mb: 1,
                                }}
                              >
                                Changed Data
                              </Typography>

                              <Stack
                                spacing={1}
                              >
                                {Object.entries(
                                  item.data
                                ).map(
                                  ([
                                    key,
                                    value,
                                  ]) => (
                                    <Box
                                      key={
                                        key
                                      }
                                      sx={{
                                        display:
                                          "grid",
                                        gridTemplateColumns:
                                          {
                                            xs: "1fr",
                                            md: "180px 1fr",
                                          },
                                        gap: 1,
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        fontWeight={
                                          600
                                        }
                                      >
                                        {formatLabel(
                                          key
                                        )}
                                      </Typography>

                                      <Typography
                                        variant="body2"
                                        sx={{
                                          whiteSpace:
                                            typeof value ===
                                            "object"
                                              ? "pre-wrap"
                                              : "normal",
                                          wordBreak:
                                            "break-word",
                                        }}
                                      >
                                        {formatValue(
                                          value
                                        )}
                                      </Typography>
                                    </Box>
                                  )
                                )}
                              </Stack>
                            </Box>
                          )}
                      </Box>
                    </Paper>
                  </Box>
                );
              }
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}