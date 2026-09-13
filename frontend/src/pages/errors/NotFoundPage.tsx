import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 4, sm: 6 },
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <Stack spacing={3} alignItems="center">
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "error.lighter",
              }}
            >
              <ErrorOutlineOutlinedIcon
                color="error"
                sx={{ fontSize: 56 }}
              />
            </Box>

            <Box>
              <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                  fontSize: { xs: "4rem", sm: "5rem" },
                  lineHeight: 1,
                  color: "primary.main",
                  mb: 1,
                }}
              >
                404
              </Typography>

              <Typography variant="h5" fontWeight={700} gutterBottom>
                Page Not Found
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 450, mx: "auto" }}
              >
                Sorry, the page you are looking for does not exist or may have
                been moved to another location.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ width: "100%", justifyContent: "center" }}
            >
              <Button
                variant="outlined"
                startIcon={<ArrowBackOutlinedIcon />}
                onClick={handleGoBack}
                sx={{
                  minWidth: 150,
                  textTransform: "none",
                }}
              >
                Go Back
              </Button>

              <Button
                variant="contained"
                startIcon={<HomeOutlinedIcon />}
                onClick={handleGoHome}
                sx={{
                  minWidth: 150,
                  textTransform: "none",
                }}
              >
                Dashboard
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFoundPage;