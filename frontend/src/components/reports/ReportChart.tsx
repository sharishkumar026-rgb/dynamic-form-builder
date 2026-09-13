import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
);

export type ReportChartType = "bar" | "line";

export interface ReportChartData {
  label: string;
  value: number;
}

interface ReportChartProps {
  data?: ReportChartData[];
  title?: string;
  subtitle?: string;
  chartType?: ReportChartType;
  height?: number;
  loading?: boolean;
  onChartTypeChange?: (type: ReportChartType) => void;
}

const ReportChart = ({
  data = [],
  title = "Report Chart",
  subtitle = "Visual representation of report results.",
  chartType = "bar",
  height = 360,
  loading = false,
  onChartTypeChange,
}: ReportChartProps) => {
  const labels = data.map((item) => item.label);
  const values = data.map((item) => item.value);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Value",
        data: values,
        borderWidth: 2,
        borderRadius: chartType === "bar" ? 6 : 0,
        tension: 0.35,
        fill: chartType === "line",
        pointRadius: chartType === "line" ? 4 : 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
        grid: {},
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        grid: {},
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "action.hover",
                color: "primary.main",
              }}
            >
              <BarChartOutlinedIcon />
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {title}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>
          </Stack>

          {onChartTypeChange && (
            <FormControl
              size="small"
              sx={{
                minWidth: 130,
              }}
            >
              <InputLabel id="report-chart-type-label">
                Chart Type
              </InputLabel>

              <Select
                labelId="report-chart-type-label"
                value={chartType}
                label="Chart Type"
                onChange={(event) =>
                  onChartTypeChange(
                    event.target.value as ReportChartType,
                  )
                }
                disabled={loading}
              >
                <MenuItem value="bar">Bar Chart</MenuItem>
                <MenuItem value="line">Line Chart</MenuItem>
              </Select>
            </FormControl>
          )}
        </Stack>
      </Box>

      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          pb: { xs: 2, sm: 2.5 },
        }}
      >
        {loading ? (
          <Box
            sx={{
              height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">
              Loading chart...
            </Typography>
          </Box>
        ) : data.length === 0 ? (
          <Box
            sx={{
              height,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              backgroundColor: "action.hover",
            }}
          >
            <Stack spacing={1} alignItems="center">
              <BarChartOutlinedIcon
                sx={{
                  fontSize: 42,
                  color: "text.disabled",
                }}
              />

              <Typography
                variant="subtitle2"
                fontWeight={600}
              >
                No chart data available
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Run the report or add data to display the chart.
              </Typography>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ height }}>
            {chartType === "line" ? (
              <Line
                data={chartData}
                options={chartOptions}
              />
            ) : (
              <Bar
                data={chartData}
                options={chartOptions}
              />
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ReportChart;