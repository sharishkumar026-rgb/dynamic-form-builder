
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type StatTrend = "up" | "down" | "neutral";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: StatTrend;
  trendValue?: string;
  loading?: boolean;
}

const StatCard = ({
  title,
  value,
  icon,
  description,
  trend = "neutral",
  trendValue,
  loading = false,
}: StatCardProps) => {
  const getTrendIcon = () => {
    if (trend === "up") {
      return <ArrowUpwardIcon fontSize="small" />;
    }

    if (trend === "down") {
      return <ArrowDownwardIcon fontSize="small" />;
    }

    return <TrendingFlatIcon fontSize="small" />;
  };

  const getTrendColor = () => {
    if (trend === "up") {
      return "success.main";
    }

    if (trend === "down") {
      return "error.main";
    }

    return "text.secondary";
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": {
          boxShadow: 2,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>

            {icon && (
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  backgroundColor: "action.hover",
                  color: "primary.main",
                }}
              >
                {icon}
              </Box>
            )}
          </Stack>

          {loading ? (
            <Box
              sx={{
                height: 42,
                width: "65%",
                borderRadius: 1,
                backgroundColor: "action.hover",
              }}
            />
          ) : (
            <Typography
              variant="h4"
              component="p"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {value}
            </Typography>
          )}

          {(trendValue || description) && !loading && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={0.75}
              sx={{
                minHeight: 24,
              }}
            >
              {trendValue && (
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={0.25}
                  sx={{
                    color: getTrendColor(),
                    fontWeight: 600,
                  }}
                >
                  {getTrendIcon()}

                  <Typography
                    variant="caption"
                    sx={{
                      color: "inherit",
                      fontWeight: 600,
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

export default StatCard;

