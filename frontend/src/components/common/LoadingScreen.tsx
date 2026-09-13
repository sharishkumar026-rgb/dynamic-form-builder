import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingScreen = ({
  message = "Loading...",
  fullScreen = true,
}: LoadingScreenProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: fullScreen ? "100vh" : 240,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        alignItems="center"
        spacing={2}
      >
        <CircularProgress
          size={40}
          thickness={4}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </Stack>
    </Box>
  );
};

export default LoadingScreen;