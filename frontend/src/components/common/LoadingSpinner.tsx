import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  showMessage?: boolean;
  fullWidth?: boolean;
}

const LoadingSpinner = ({
  size = 28,
  message = "Loading...",
  showMessage = false,
  fullWidth = false,
}: LoadingSpinnerProps) => {
  return (
    <Box
      sx={{
        width: fullWidth ? "100%" : "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
      >
        <CircularProgress
          size={size}
          thickness={4}
        />

        {showMessage && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontWeight: 500,
            }}
          >
            {message}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default LoadingSpinner;