import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export type AnalyticsTrend = "up" | "down" | "neutral";

interface AnalyticsStatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: AnalyticsTrend;
  trendValue?: string;
  loading?: boolean;
  onClick?: () => void;
}

const AnalyticsStatCard = ({
  title,
  value,
  icon,
  description,
  trend = "neutral",
  trendValue,
  loading = false,
  onClick,
}: AnalyticsStatCardProps) => {
  const TrendIcon =
    trend === "up"
      ? ArrowUpwardIcon
      : trend === "down"
        ? ArrowDownwardIcon
        : TrendingFlatIcon;

  const trendColor =
    trend === "up"
      ? "success.main"
      : trend === "down"
        ? "error.main"
        : "text.secondary";

  if (loading) {
    return (
      <Card
        elevation={0}
        sx={{
          width: "100%",
          height: "100%",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Skeleton
                variant="text"
                width="45%"
                height={24}
              />

              <Skeleton
                variant="rounded"
                width={42}
                height={42}
              />
            </Stack>

            <Skeleton
              variant="text"
              width="35%"
              height={42}
            />

            <Skeleton
              variant="text"
              width="70%"
              height={20}
            />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      elevation={0}
      onClick={onClick}
      sx={{
        width: "100%",
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease",
        "&:hover": onClick
          ? {
              borderColor: "primary.main",
              boxShadow: 2,
            }
          : undefined,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={600}
            >
              {title}
            </Typography>

            {icon && (
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "primary.50",
                  color: "primary.main",
                  flexShrink: 0,
                }}
              >
                {icon}
              </Box>
            )}
          </Stack>

          <Typography
            variant="h4"
            component="div"
            fontWeight={700}
            sx={{
              lineHeight: 1.2,
              wordBreak: "break-word",
            }}
          >
            {value}
          </Typography>

          {(description || trendValue) && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
            >
              {trendValue && (
                <Stack
                  direction="row"
                  spacing={0.25}
                  alignItems="center"
                  sx={{
                    color: trendColor,
                    fontWeight: 600,
                  }}
                >
                  <TrendIcon
                    sx={{
                      fontSize: 18,
                    }}
                  />

                  <Typography
                    variant="caption"
                    fontWeight={700}
                    sx={{
                      color: trendColor,
                    }}
                  >
                    {trendValue}
                  </Typography>
                </Stack>
              )}

              {description && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {description}
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AnalyticsStatCard;