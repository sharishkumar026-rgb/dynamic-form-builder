import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import QuestionAnswerOutlinedIcon from "@mui/icons-material/QuestionAnswerOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";


// ============================================================
// API
// ============================================================

const API_BASE_URL = "http://127.0.0.1:8000/api";


// ============================================================
// TYPES
// ============================================================

interface FormItem {
  id: number | string;

  title: string;

  description?: string;

  is_active?: boolean;

  isActive?: boolean;

  field_count?: number;

  fieldCount?: number;

  response_count?: number;

  responseCount?: number;

  created_at?: string;

  createdAt?: string;

  updated_at?: string;

  updatedAt?: string;
}


interface FormResponse {
  id?: number | string;

  success?: boolean;

  total?: number;

  response?: unknown[];

  responses?: unknown[];

  data?: unknown[];
}


interface FormDetailResponse {
  id?: number | string;

  title?: string;

  description?: string;

  is_active?: boolean;

  fields?: unknown[];

  data?: {
    id?: number | string;

    title?: string;

    description?: string;

    is_active?: boolean;

    fields?: unknown[];
  };
}


type StatusFilter =
  | "all"
  | "active"
  | "inactive";


type SortOption =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc"
  | "responses_desc"
  | "responses_asc";


// ============================================================
// STAT CARD
// ============================================================

interface StatCardProps {
  title: string;

  value: number;

  icon: React.ReactNode;

  valueColor?: string;
}


const StatCard = ({
  title,
  value,
  icon,
  valueColor,
}: StatCardProps) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
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
              sx={{
                mt: 0.75,
                color: valueColor,
              }}
            >
              {value}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "action.hover",
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
// FORMS PAGE
// ============================================================

const FormsPage = () => {
  const navigate = useNavigate();


  // ==========================================================
  // STATE
  // ==========================================================

  const [forms, setForms] =
    useState<FormItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState<StatusFilter>("all");

  const [sortBy, setSortBy] =
    useState<SortOption>("newest");


  // ==========================================================
  // TOKEN
  // ==========================================================

  const getToken = (): string | null => {
    return (
      localStorage.getItem("access_token") ||
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("access_token") ||
      sessionStorage.getItem("accessToken")
    );
  };


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


  // ==========================================================
  // FETCH RESPONSE COUNT
  // ==========================================================

  const fetchResponseCount = async (
    formId: number | string
  ): Promise<number> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/forms/${formId}/responses`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );


      if (!response.ok) {
        return 0;
      }


      const result: FormResponse =
        await response.json();


      if (
        typeof result.total === "number"
      ) {
        return result.total;
      }


      if (
        Array.isArray(result.response)
      ) {
        return result.response.length;
      }


      if (
        Array.isArray(result.responses)
      ) {
        return result.responses.length;
      }


      if (
        Array.isArray(result.data)
      ) {
        return result.data.length;
      }


      return 0;

    } catch (error) {

      console.error(
        `Failed to load responses for form ${formId}:`,
        error
      );

      return 0;
    }
  };


  // ==========================================================
  // FETCH FIELD COUNT
  // ==========================================================

  const fetchFieldCount = async (
    formId: number | string
  ): Promise<number> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/forms/${formId}`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );


      if (!response.ok) {
        return 0;
      }


      const result: FormDetailResponse =
        await response.json();


      if (
        Array.isArray(result.fields)
      ) {
        return result.fields.length;
      }


      if (
        Array.isArray(
          result.data?.fields
        )
      ) {
        return result.data.fields.length;
      }


      return 0;

    } catch (error) {

      console.error(
        `Failed to load fields for form ${formId}:`,
        error
      );

      return 0;
    }
  };


  // ==========================================================
  // FETCH FORMS
  // ==========================================================

  const fetchForms = async (): Promise<void> => {
    setLoading(true);

    setError("");


    try {

      const response = await fetch(
        `${API_BASE_URL}/forms`,
        {
          method: "GET",
          headers: getHeaders(),
        }
      );


      if (!response.ok) {

        let message =
          `Request failed with status ${response.status}`;


        try {

          const errorData =
            await response.json();


          if (
            typeof errorData?.detail ===
            "string"
          ) {
            message =
              errorData.detail;

          } else if (
            typeof errorData?.message ===
            "string"
          ) {
            message =
              errorData.message;
          }

        } catch {
          // Keep default error message.
        }


        throw new Error(message);
      }


      const result =
        await response.json();


      let receivedForms:
        FormItem[] = [];


      if (
        Array.isArray(result)
      ) {

        receivedForms =
          result;

      } else if (
        Array.isArray(result?.data)
      ) {

        receivedForms =
          result.data;

      } else if (
        Array.isArray(result?.forms)
      ) {

        receivedForms =
          result.forms;
      }


      // ========================================================
      // LOAD ACTUAL COUNTS FOR EVERY FORM
      // ========================================================

      const formsWithCounts =
        await Promise.all(
          receivedForms.map(
            async (form) => {

              const existingResponseCount =
                form.responseCount ??
                form.response_count;


              const existingFieldCount =
                form.fieldCount ??
                form.field_count;


              const [
                responseCount,
                fieldCount,
              ] =
                await Promise.all([

                  existingResponseCount !==
                  undefined
                    ? Promise.resolve(
                        existingResponseCount
                      )
                    : fetchResponseCount(
                        form.id
                      ),

                  existingFieldCount !==
                  undefined
                    ? Promise.resolve(
                        existingFieldCount
                      )
                    : fetchFieldCount(
                        form.id
                      ),

                ]);


              return {
                ...form,

                responseCount,

                fieldCount,
              };
            }
          )
        );


      setForms(
        formsWithCounts
      );

    } catch (requestError) {

      console.error(
        "Failed to load forms:",
        requestError
      );


      setForms([]);


      setError(
        requestError instanceof Error
          ? requestError.message
          : "Failed to load forms."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    void fetchForms();

  }, []);


  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const filteredForms =
    useMemo(() => {

      const searchValue =
        search
          .trim()
          .toLowerCase();


      const result =
        forms.filter(
          (form) => {

            const active =
              form.isActive ??
              form.is_active ??
              false;


            const matchesSearch =
              !searchValue ||

              form.title
                .toLowerCase()
                .includes(
                  searchValue
                ) ||

              (
                form.description ??
                ""
              )
                .toLowerCase()
                .includes(
                  searchValue
                );


            const matchesStatus =
              status === "all" ||

              (
                status === "active" &&
                active
              ) ||

              (
                status === "inactive" &&
                !active
              );


            return (
              matchesSearch &&
              matchesStatus
            );
          }
        );


      return result.sort(
        (a, b) => {

          switch (sortBy) {

            case "oldest":

              return (
                new Date(
                  a.createdAt ??
                  a.created_at ??
                  0
                ).getTime() -

                new Date(
                  b.createdAt ??
                  b.created_at ??
                  0
                ).getTime()
              );


            case "title_asc":

              return a.title.localeCompare(
                b.title
              );


            case "title_desc":

              return b.title.localeCompare(
                a.title
              );


            case "responses_desc":

              return (
                (
                  b.responseCount ??
                  b.response_count ??
                  0
                ) -

                (
                  a.responseCount ??
                  a.response_count ??
                  0
                )
              );


            case "responses_asc":

              return (
                (
                  a.responseCount ??
                  a.response_count ??
                  0
                ) -

                (
                  b.responseCount ??
                  b.response_count ??
                  0
                )
              );


            case "newest":
            default:

              return (
                new Date(
                  b.createdAt ??
                  b.created_at ??
                  0
                ).getTime() -

                new Date(
                  a.createdAt ??
                  a.created_at ??
                  0
                ).getTime()
              );

          }

        }
      );

    }, [
      forms,
      search,
      status,
      sortBy,
    ]);


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalForms =
    forms.length;


  const activeForms =
    forms.filter(
      (form) =>
        form.isActive ??
        form.is_active ??
        false
    ).length;


  const inactiveForms =
    totalForms -
    activeForms;


  const totalResponses =
    forms.reduce(
      (
        total,
        form
      ) => {

        return (
          total +

          (
            form.responseCount ??
            form.response_count ??
            0
          )
        );

      },
      0
    );


  // ==========================================================
  // DATE FORMAT
  // ==========================================================

  const formatDate = (
    value?: string
  ): string => {

    if (!value) {
      return "—";
    }


    const date =
      new Date(value);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return "—";
    }


    return date.toLocaleDateString();

  };


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const handleCreate = (): void => {
    navigate(
      "/forms/create"
    );
  };


  const handleView = (
    form: FormItem
  ): void => {
    navigate(
      `/forms/${form.id}`
    );
  };


  const handleEdit = (
    form: FormItem
  ): void => {
    navigate(
      `/forms/${form.id}/edit`
    );
  };


  const handleResponses = (
    form: FormItem
  ): void => {
    navigate(
      `/forms/${form.id}/responses`
    );
  };


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <Box
      sx={{
        width: "100%",
        maxWidth: 1400,
        mx: "auto",

        p: {
          xs: 2,
          md: 3,
        },
      }}
    >

      <Stack spacing={3}>


        {/* ====================================================
            HEADER
        ==================================================== */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2}
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          justifyContent="space-between"
        >

          <Box>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              Forms
            </Typography>


            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              Create, manage, and monitor your dynamic forms.
            </Typography>

          </Box>


          <Stack
            direction="row"
            spacing={1}
          >

            <Tooltip title="Refresh forms">

              <Button
                variant="outlined"
                startIcon={
                  loading
                    ? (
                      <CircularProgress
                        size={18}
                      />
                    )
                    : (
                      <RefreshOutlinedIcon />
                    )
                }
                disabled={loading}
                onClick={() =>
                  void fetchForms()
                }
              >
                Refresh
              </Button>

            </Tooltip>


            <Button
              variant="contained"
              startIcon={
                <AddOutlinedIcon />
              }
              onClick={
                handleCreate
              }
            >
              Create Form
            </Button>

          </Stack>

        </Stack>


        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (

          <Alert
            severity="error"
            action={

              <Button
                color="inherit"
                size="small"
                onClick={() =>
                  void fetchForms()
                }
              >
                Retry
              </Button>

            }
          >
            {error}
          </Alert>

        )}


        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <Grid
          container
          spacing={2}
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
                loading
                  ? 0
                  : totalForms
              }
              icon={
                <DescriptionOutlinedIcon />
              }
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
                loading
                  ? 0
                  : activeForms
              }
              valueColor="success.main"
              icon={
                <CheckCircleOutlinedIcon />
              }
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
              title="Inactive Forms"
              value={
                loading
                  ? 0
                  : inactiveForms
              }
              valueColor="text.secondary"
              icon={
                <CancelOutlinedIcon />
              }
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
                loading
                  ? 0
                  : totalResponses
              }
              icon={
                <QuestionAnswerOutlinedIcon />
              }
            />

          </Grid>

        </Grid>


        {/* ====================================================
            FILTERS
        ==================================================== */}

        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >

          <CardContent>

            <Grid
              container
              spacing={2}
            >

              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
              >

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search forms..."

                  value={
                    search
                  }

                  onChange={
                    (event) =>
                      setSearch(
                        event.target.value
                      )
                  }

                  slotProps={{
                    input: {
                      startAdornment: (

                        <InputAdornment
                          position="start"
                        >
                          <SearchIcon />
                        </InputAdornment>

                      ),
                    },
                  }}
                />

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >

                <Select
                  fullWidth
                  size="small"

                  value={
                    status
                  }

                  onChange={
                    (event) =>
                      setStatus(
                        event.target
                          .value as StatusFilter
                      )
                  }
                >

                  <MenuItem
                    value="all"
                  >
                    All Status
                  </MenuItem>

                  <MenuItem
                    value="active"
                  >
                    Active
                  </MenuItem>

                  <MenuItem
                    value="inactive"
                  >
                    Inactive
                  </MenuItem>

                </Select>

              </Grid>


              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                }}
              >

                <Select
                  fullWidth
                  size="small"

                  value={
                    sortBy
                  }

                  onChange={
                    (event) =>
                      setSortBy(
                        event.target
                          .value as SortOption
                      )
                  }
                >

                  <MenuItem
                    value="newest"
                  >
                    Newest First
                  </MenuItem>

                  <MenuItem
                    value="oldest"
                  >
                    Oldest First
                  </MenuItem>

                  <MenuItem
                    value="title_asc"
                  >
                    Title A-Z
                  </MenuItem>

                  <MenuItem
                    value="title_desc"
                  >
                    Title Z-A
                  </MenuItem>

                  <MenuItem
                    value="responses_desc"
                  >
                    Most Responses
                  </MenuItem>

                  <MenuItem
                    value="responses_asc"
                  >
                    Least Responses
                  </MenuItem>

                </Select>

              </Grid>

            </Grid>

          </CardContent>

        </Card>


        {/* ====================================================
            FORMS HEADER
        ==================================================== */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >

          <Box>

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Your Forms
            </Typography>


            <Typography
              variant="body2"
              color="text.secondary"
            >
              {loading
                ? "Loading forms..."
                : `${filteredForms.length} form${
                    filteredForms.length === 1
                      ? ""
                      : "s"
                  }`}
            </Typography>

          </Box>

        </Stack>


        {/* ====================================================
            LOADING
        ==================================================== */}

        {loading ? (

          <Grid
            container
            spacing={2.5}
          >

            {[1, 2, 3].map(
              (item) => (

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 4,
                  }}
                  key={item}
                >

                  <Card
                    sx={{
                      borderRadius: 3,
                    }}
                  >

                    <CardContent>

                      <Stack
                        spacing={2}
                      >

                        <Skeleton
                          width="70%"
                          height={35}
                        />

                        <Skeleton
                          width="100%"
                        />

                        <Skeleton
                          width="90%"
                        />

                        <Divider />

                        <Stack
                          direction="row"
                          spacing={2}
                        >

                          <Skeleton
                            width="50%"
                            height={60}
                          />

                          <Skeleton
                            width="50%"
                            height={60}
                          />

                        </Stack>

                      </Stack>

                    </CardContent>

                  </Card>

                </Grid>

              )
            )}

          </Grid>

        ) : filteredForms.length === 0 ? (

          /* ==================================================
              EMPTY STATE
          ================================================== */

          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >

            <CardContent>

              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{
                  py: 8,
                }}
              >

                <DescriptionOutlinedIcon
                  sx={{
                    fontSize: 64,
                    color: "text.disabled",
                  }}
                />


                <Typography
                  variant="h6"
                  fontWeight={600}
                >
                  No forms found
                </Typography>


                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  {forms.length === 0
                    ? "Create your first form to get started."
                    : "Try changing your search or filters."}
                </Typography>


                {forms.length === 0 && (

                  <Button
                    variant="contained"
                    startIcon={
                      <AddOutlinedIcon />
                    }
                    onClick={
                      handleCreate
                    }
                  >
                    Create Form
                  </Button>

                )}

              </Stack>

            </CardContent>

          </Card>

        ) : (

          /* ==================================================
              FORM CARDS
          ================================================== */

          <Grid
            container
            spacing={2.5}
          >

            {filteredForms.map(
              (form) => {

                const active =
                  form.isActive ??
                  form.is_active ??
                  false;


                const responseCount =
                  form.responseCount ??
                  form.response_count ??
                  0;


                const fieldCount =
                  form.fieldCount ??
                  form.field_count ??
                  0;


                const createdAt =
                  form.createdAt ??
                  form.created_at;


                return (

                  <Grid
                    size={{
                      xs: 12,
                      sm: 6,
                      lg: 4,
                    }}
                    key={
                      form.id
                    }
                  >

                    <Card
                      sx={{
                        height: "100%",

                        borderRadius: 3,

                        border:
                          "1px solid",

                        borderColor:
                          "divider",

                        transition:
                          "all 0.2s ease",

                        "&:hover": {

                          boxShadow: 5,

                          transform:
                            "translateY(-3px)",

                        },
                      }}
                    >

                      <CardContent
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection:
                            "column",
                        }}
                      >

                        <Stack
                          spacing={2}
                          sx={{
                            height: "100%",
                          }}
                        >


                          {/* TITLE */}

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            spacing={1}
                          >

                            <Box
                              sx={{
                                minWidth: 0,
                              }}
                            >

                              <Typography
                                variant="h6"
                                fontWeight={700}
                                sx={{
                                  wordBreak:
                                    "break-word",
                                }}
                              >
                                {form.title}
                              </Typography>

                            </Box>


                            <Chip
                              label={
                                active
                                  ? "Active"
                                  : "Inactive"
                              }

                              color={
                                active
                                  ? "success"
                                  : "default"
                              }

                              size="small"
                            />

                          </Stack>


                          {/* DESCRIPTION */}

                          <Typography
                            variant="body2"
                            color="text.secondary"

                            sx={{
                              minHeight: 44,

                              display:
                                "-webkit-box",

                              WebkitLineClamp: 2,

                              WebkitBoxOrient:
                                "vertical",

                              overflow:
                                "hidden",
                            }}
                          >
                            {form.description ||
                              "No description provided."}
                          </Typography>


                          <Divider />


                          {/* COUNTS */}

                          <Grid
                            container
                            spacing={1.5}
                          >

                            <Grid
                              size={{
                                xs: 6,
                              }}
                            >

                              <Box
                                sx={{
                                  p: 1.5,

                                  borderRadius: 2,

                                  backgroundColor:
                                    "action.hover",
                                }}
                              >

                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >

                                  <DescriptionOutlinedIcon
                                    fontSize="small"
                                  />

                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Fields
                                  </Typography>

                                </Stack>


                                <Typography
                                  variant="h5"
                                  fontWeight={700}
                                  sx={{
                                    mt: 0.5,
                                  }}
                                >
                                  {fieldCount}
                                </Typography>

                              </Box>

                            </Grid>


                            <Grid
                              size={{
                                xs: 6,
                              }}
                            >

                              <Box
                                sx={{
                                  p: 1.5,

                                  borderRadius: 2,

                                  backgroundColor:
                                    "action.hover",
                                }}
                              >

                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >

                                  <PeopleAltOutlinedIcon
                                    fontSize="small"
                                  />

                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Responses
                                  </Typography>

                                </Stack>


                                <Typography
                                  variant="h5"
                                  fontWeight={700}
                                  sx={{
                                    mt: 0.5,
                                  }}
                                >
                                  {responseCount}
                                </Typography>

                              </Box>

                            </Grid>

                          </Grid>


                          {/* CREATED DATE */}

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Created:{" "}
                            {formatDate(
                              createdAt
                            )}
                          </Typography>


                          {/* ACTIONS */}

                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                              mt: "auto",

                              pt: 1,
                            }}
                          >

                            <Button
                              fullWidth

                              size="small"

                              variant="contained"

                              startIcon={
                                <VisibilityOutlinedIcon />
                              }

                              onClick={() =>
                                handleView(
                                  form
                                )
                              }
                            >
                              View
                            </Button>


                            <Button
                              size="small"

                              variant="outlined"

                              onClick={() =>
                                handleEdit(
                                  form
                                )
                              }
                            >
                              <EditOutlinedIcon />
                            </Button>


                            <Button
                              size="small"

                              variant="outlined"

                              onClick={() =>
                                handleResponses(
                                  form
                                )
                              }
                            >
                              <QuestionAnswerOutlinedIcon />
                            </Button>

                          </Stack>

                        </Stack>

                      </CardContent>

                    </Card>

                  </Grid>

                );

              }
            )}

          </Grid>

        )}

      </Stack>

    </Box>

  );
};


export default FormsPage;