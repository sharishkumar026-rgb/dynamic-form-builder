import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";

import type { ChartOptions } from "chart.js";

import { Line } from "react-chartjs-2";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
);

interface ResponseChartProps {
  labels?: string[];
  values?: number[];
  title?: string;
  subtitle?: string;
  height?: number;
  loading?: boolean;
}

const ResponseChart = ({
  labels = [],
  values = [],
  title = "Submission Trends",
  subtitle = "Responses submitted over time",
  height = 320,
  loading = false,
}: ResponseChartProps) => {
  const chartLabels = labels.map((label) =>
    String(label),
  );

  const chartValues = chartLabels.map(
    (_, index) => {
      const value = Number(values[index]);

      return Number.isFinite(value) && value >= 0
        ? value
        : 0;
    },
  );

  const hasData = chartValues.some(
    (value) => value > 0,
  );

  const maxValue = Math.max(
    ...chartValues,
    1,
  );

  const suggestedMax =
    maxValue <= 1
      ? 2
      : Math.ceil(maxValue * 1.2);

  const chartData = {
    labels: chartLabels,

    datasets: [
      {
        label: "Submissions",

        data: chartValues,

        fill: true,

        tension: 0.35,

        borderWidth: 2,

        pointRadius: 4,

        pointHoverRadius: 6,

        backgroundColor:
          "rgba(25, 118, 210, 0.12)",

        borderColor:
          "rgb(25, 118, 210)",

        pointBackgroundColor:
          "rgb(25, 118, 210)",

        pointBorderColor:
          "rgb(255, 255, 255)",

        pointBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,

    maintainAspectRatio: false,

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

        callbacks: {
          label: (context) => {
            const value =
              context.parsed.y ?? 0;

            return `Submissions: ${value}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 7,
        },
      },

      y: {
        beginAtZero: true,

        suggestedMax,

        ticks: {
          precision: 0,

          stepSize:
            maxValue <= 5
              ? 1
              : undefined,

          callback: (value) =>
            Number(value).toString(),
        },

        grid: {
          display: true,
        },
      },
    },
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
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
              fontWeight={700}
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
                backgroundColor:
                  "action.hover",
              }}
            />
          ) : chartLabels.length === 0 ? (
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
                No submission data available.
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
              <Line
                data={chartData}
                options={options}
              />

              {!hasData && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    textAlign: "center",
                    mt: 1,
                  }}
                >
                  No submissions recorded for this
                  period.
                </Typography>
              )}
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResponseChart;