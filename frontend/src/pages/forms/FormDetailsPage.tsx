
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DynamicFormIcon from "@mui/icons-material/DynamicForm";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import formsApi from "../../api/forms.api";
import formFieldsApi from "../../api/formFields.api";
import responsesApi from "../../api/responses.api";

interface FormData {
  id: number;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const FormDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData | null>(null);
  const [fieldCount, setFieldCount] = useState(0);
  const [responseCount, setResponseCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFormDetails();
  }, [id]);

  const loadFormDetails = async () => {
    if (!id) {
      setError("Form ID is missing.");
      setLoading(false);
      return;
    }

    const formId = Number(id);

    if (!Number.isInteger(formId) || formId <= 0) {
      setError("Invalid form ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // =====================================================
      // GET FORM
      // =====================================================

      const formResult = await formsApi.getForm(formId);

      console.log("FORM RESULT:", formResult);

      if (!formResult.success || !formResult.form) {
        setError(
          formResult.message || "Unable to load form."
        );
        return;
      }

      setForm(formResult.form);

      // =====================================================
      // GET FIELDS
      // =====================================================

      try {
        const fieldsResult =
          await formFieldsApi.getFields(
            formId,
            0,
            100
          );

        console.log(
          "FIELDS RESULT:",
          fieldsResult
        );

        const fields = Array.isArray(
          fieldsResult.fields
        )
          ? fieldsResult.fields
          : [];

        setFieldCount(fields.length);
      } catch (fieldError) {
        console.error(
          "FIELDS LOAD ERROR:",
          fieldError
        );

        setFieldCount(0);
      }

      // =====================================================
      // GET RESPONSES
      // =====================================================

      try {
        const responsesResult =
          await responsesApi.getFormResponses(
            formId
          );

        console.log(
          "RESPONSES RESULT:",
          responsesResult
        );

        /*
         * Backend response:
         *
         * {
         *   "success": true,
         *   "message": "...",
         *   "total": 1,
         *   "response": [...]
         * }
         *
         * We directly calculate the count from
         * the response array.
         */

        const responses = Array.isArray(
          responsesResult.response
        )
          ? responsesResult.response
          : [];

        console.log(
          "RESPONSES ARRAY:",
          responses
        );

        console.log(
          "RESPONSE COUNT:",
          responses.length
        );

        setResponseCount(responses.length);
      } catch (responseError) {
        console.error(
          "RESPONSES LOAD ERROR:",
          responseError
        );

        setResponseCount(0);
      }
    } catch (error: any) {
      console.error(
        "FORM DETAILS LOAD ERROR:",
        error
      );

      setError(
        error?.response?.data?.detail ||
          error?.message ||
          "Failed to load form details."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const handleBack = () => {
    navigate("/forms");
  };

  // =====================================================
  // MANAGE FIELDS
  // =====================================================

  const handleManageFields = () => {
    if (!form) return;

    navigate(`/forms/${form.id}/builder`);
  };

  // =====================================================
  // VIEW RESPONSES
  // =====================================================

  const handleViewResponses = () => {
    if (!form) return;

    navigate(`/forms/${form.id}/responses`);
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = () => {
    if (!form) return;

    navigate(`/forms/${form.id}/edit`);
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async () => {
    if (!form) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${form.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const result =
        await formsApi.deleteForm(form.id);

      if (result.success) {
        navigate("/forms");
      } else {
        alert(
          result.message ||
            "Failed to delete form."
        );
      }
    } catch (error: any) {
      console.error(
        "DELETE FORM ERROR:",
        error
      );

      alert(
        error?.response?.data?.detail ||
          "Failed to delete form."
      );
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // =====================================================
  // ERROR / FORM NOT FOUND
  // =====================================================

  if (!form) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          <Alert severity="error">
            {error || "Form not found."}
          </Alert>

          <Button
            sx={{
              mt: 2,
              textTransform: "none",
            }}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Back to Forms
          </Button>
        </Box>
      </Container>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Container
      maxWidth="lg"
      sx={{ py: 4 }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

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
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
              mb: 1,
              textTransform: "none",
            }}
          >
            Back to Forms
          </Button>

          <Typography
            variant="h4"
            fontWeight={700}
          >
            {form.title}
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            {form.description ||
              "No description available."}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
        >
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              textTransform: "none",
            }}
          >
            Edit
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDelete}
            sx={{
              textTransform: "none",
            }}
          >
            Delete
          </Button>
        </Stack>
      </Stack>

      {/* =================================================
          STATUS
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
        }}
      >
        <CardContent>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
          >
            {form.is_active ? (
              <CheckCircleIcon color="success" />
            ) : (
              <CancelIcon color="error" />
            )}

            <Typography fontWeight={600}>
              {form.is_active
                ? "Active Form"
                : "Inactive Form"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {/* =================================================
            FIELDS
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.50",
                  color: "primary.main",
                }}
              >
                <DynamicFormIcon />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Fields
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {fieldCount}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* =================================================
            TOTAL RESPONSES
        ================================================= */}

        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "success.50",
                  color: "success.main",
                }}
              >
                <QuestionAnswerIcon />
              </Box>

              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Total Responses
                </Typography>

                <Typography
                  variant="h4"
                  fontWeight={700}
                >
                  {responseCount}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      {/* =================================================
          FORM MANAGEMENT
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Form Management
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 2,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              startIcon={<DynamicFormIcon />}
              onClick={handleManageFields}
              sx={{
                py: 1.5,
                textTransform: "none",
              }}
            >
              Manage Fields
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<QuestionAnswerIcon />}
              onClick={handleViewResponses}
              sx={{
                py: 1.5,
                textTransform: "none",
              }}
            >
              View Responses
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* =================================================
          FORM INFORMATION
      ================================================= */}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          mt: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2 }}
          >
            Form Information
          </Typography>

          <Divider sx={{ mb: 2 }} />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
              },
              gap: 3,
            }}
          >
            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Form ID
              </Typography>

              <Typography fontWeight={600}>
                {form.id}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Status
              </Typography>

              <Typography fontWeight={600}>
                {form.is_active
                  ? "Active"
                  : "Inactive"}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Created At
              </Typography>

              <Typography fontWeight={600}>
                {new Date(
                  form.created_at
                ).toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Updated At
              </Typography>

              <Typography fontWeight={600}>
                {new Date(
                  form.updated_at
                ).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FormDetailsPage;

