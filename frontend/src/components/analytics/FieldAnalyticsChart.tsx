import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import type { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
);

export interface FieldAnalyticsItem {
  fieldId: number | string;
  fieldLabel: string;
  fieldType?: string;
  responseCount: number;
  completionRate?: number;
}

interface FieldAnalyticsChartProps {
  data?: FieldAnalyticsItem[];
  title?: string;
  subtitle?: string;
  height?: number;
  loading?: boolean;
  horizontal?: boolean;
}

const FieldAnalyticsChart = ({
  data = [],
  title = "Field Analytics",
  subtitle = "Response count by form field.",
  height = 320,
  loading = false,
  horizontal = true,
}: FieldAnalyticsChartProps) => {
  const labels = data.map((item) => item.fieldLabel);
  const values = data.map((item) => item.responseCount);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Responses",
        data: values,
        borderWidth: 1,
        borderRadius: 6,
        barThickness: "flex" as const,
        maxBarThickness: 32,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? "y" : "x",

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = horizontal
              ? context.parsed.x
              : context.parsed.y;

            return ` Responses: ${value ?? 0}`;
          },
        },
      },
    },

    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {},
      },

      y: {
        beginAtZero: true,
        grid: {},
      },
    },
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={1.5} alignItems="center">
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
              }}
            >
              <BarChartOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h6"
                component="h2"
                fontWeight={700}
              >
                {title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {subtitle}
              </Typography>
            </Box>
          </Stack>

          {loading ? (
            <Box sx={{ width: "100%" }}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={height}
              />
            </Box>
          ) : data.length === 0 ? (
            <Box
              sx={{
                minHeight: height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 2,
              }}
            >
              <Stack spacing={1} alignItems="center">
                <BarChartOutlinedIcon
                  sx={{
                    fontSize: 44,
                    color: "text.disabled",
                  }}
                />

                <Typography
                  variant="body1"
                  fontWeight={600}
                  color="text.secondary"
                >
                  No field analytics available
                </Typography>

                <Typography
                  variant="body2"
                  color="text.disabled"
                >
                  Field response statistics will appear here once
                  responses are submitted.
                </Typography>
              </Stack>
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                height,
                position: "relative",
              }}
            >
              <Bar data={chartData} options={options} />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FieldAnalyticsChart;