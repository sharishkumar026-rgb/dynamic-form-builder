import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface DateDisplayProps {
  value: string | Date | null | undefined;
  format?: "date" | "datetime" | "time";
  locale?: string;
  fallback?: string;
}

const DateDisplay = ({
  value,
  format = "datetime",
  locale = "en-IN",
  fallback = "—",
}: DateDisplayProps) => {
  if (!value) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {fallback}
      </Typography>
    );
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {fallback}
      </Typography>
    );
  }

  let formattedDate: string;

  if (format === "date") {
    formattedDate = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  } else if (format === "time") {
    formattedDate = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } else {
    formattedDate = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return (
    <Box component="span">
      <Stack spacing={0.25}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          {formattedDate}
        </Typography>
      </Stack>
    </Box>
  );
};

export default DateDisplay;