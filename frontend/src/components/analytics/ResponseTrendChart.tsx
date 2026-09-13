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
import Skeleton from "@mui/material/Skeleton";
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

interface ResponseTrendChartProps {
  labels?: string[];
  values?: number[];
  title?: string;
  subtitle?: string;
  height?: number;
  loading?: boolean;
}

const ResponseTrendChart = ({
  labels = [],
  values = [],
  title = "Response Trends",
  subtitle = "Responses submitted over time.",
  height = 320,
  loading = false,
}: ResponseTrendChartProps) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Responses",
        data: values,
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
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
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {subtitle}
            </Typography>
          </Box>

          {loading ? (
            <Skeleton
              variant="rounded"
              animation="wave"
              sx={{
                width: "100%",
                height,
              }}
            />
          ) : labels.length === 0 ? (
            <Box
              sx={{
                height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: 1,
                borderStyle: "dashed",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                No response trend data available.
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
                options={chartOptions}
              />
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResponseTrendChart;