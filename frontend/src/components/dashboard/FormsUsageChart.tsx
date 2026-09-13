
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

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
);

interface FormsUsageChartProps {
  labels?: string[];
  values?: number[];
  title?: string;
  subtitle?: string;
  height?: number;
  loading?: boolean;
}

const FormsUsageChart = ({
  labels = [],
  values = [],
  title = "Most Used Forms",
  subtitle = "Forms ranked by number of responses",
  height = 320,
  loading = false,
}: FormsUsageChartProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Responses",
        data: values,
        borderWidth: 1,
        borderRadius: 6,
        backgroundColor: "rgba(25, 118, 210, 0.75)",
        borderColor: "rgb(25, 118, 210)",
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {
          display: true,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        height: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
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
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {loading ? (
            <Box
              sx={{
                width: "100%",
                height,
                borderRadius: 1.5,
                backgroundColor: "action.hover",
              }}
            />
          ) : labels.length === 0 ? (
            <Box
              sx={{
                width: "100%",
                height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                No form usage data available.
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                height,
              }}
            >
              <Bar
                data={chartData}
                options={options}
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default FormsUsageChart;

