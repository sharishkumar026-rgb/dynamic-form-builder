import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface StatusBadgeProps {
  status: boolean | string;
  activeLabel?: string;
  inactiveLabel?: string;
}

const StatusBadge = ({
  status,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
}: StatusBadgeProps) => {
  const isActive =
    typeof status === "boolean"
      ? status
      : status.toLowerCase() === "active";

  const label = isActive ? activeLabel : inactiveLabel;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1.25,
        py: 0.5,
        borderRadius: 10,
        backgroundColor: isActive
          ? "success.light"
          : "action.hover",
        color: isActive
          ? "success.dark"
          : "text.secondary",
        whiteSpace: "nowrap",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
      >
        {isActive ? (
          <CheckCircleOutlineIcon
            sx={{
              fontSize: 16,
              color: "success.main",
            }}
          />
        ) : (
          <HighlightOffIcon
            sx={{
              fontSize: 16,
              color: "text.disabled",
            }}
          />
        )}

        <Typography
          component="span"
          variant="caption"
          sx={{
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Box>
  );
};

export default StatusBadge;