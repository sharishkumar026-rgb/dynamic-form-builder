import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface AnalyticsHeaderProps {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  lastUpdated?: string | Date;
  onRefresh?: () => void;
}

const formatLastUpdated = (
  value?: string | Date,
) => {
  if (!value) {
    return undefined;
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
};

const AnalyticsHeader = ({
  title = "Analytics",
  subtitle = "Monitor form responses and performance insights.",
  loading = false,
  lastUpdated,
  onRefresh,
}: AnalyticsHeaderProps) => {
  const formattedLastUpdated =
    formatLastUpdated(lastUpdated);

  return (
    <Box
      sx={{
        width: "100%",
        mb: 3,
      }}
    >
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
      >
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "primary.50",
              color: "primary.main",
              flexShrink: 0,
            }}
          >
            <AnalyticsOutlinedIcon />
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography
                variant="h5"
                component="h1"
                fontWeight={700}
              >
                {title}
              </Typography>

              <Chip
                label="Insights"
                size="small"
                color="primary"
                variant="outlined"
              />
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                lineHeight: 1.6,
              }}
            >
              {subtitle}
            </Typography>

            {formattedLastUpdated && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  mt: 0.5,
                }}
              >
                Last updated: {formattedLastUpdated}
              </Typography>
            )}
          </Box>
        </Stack>

        {onRefresh && (
          <Button
            variant="outlined"
            startIcon={<RefreshOutlinedIcon />}
            onClick={onRefresh}
            disabled={loading}
            sx={{
              minWidth: {
                xs: "100%",
                sm: 120,
              },
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default AnalyticsHeader;