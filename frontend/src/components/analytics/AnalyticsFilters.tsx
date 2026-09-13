import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

export type AnalyticsDateRange =
  | "7"
  | "30"
  | "90"
  | "365"
  | "custom";

export type AnalyticsGroupBy =
  | "day"
  | "week"
  | "month";

export interface AnalyticsFilterValues {
  formId: number | string | "all";
  dateRange: AnalyticsDateRange;
  groupBy: AnalyticsGroupBy;
  startDate: string;
  endDate: string;
}

interface AnalyticsFiltersProps {
  value?: AnalyticsFilterValues;
  forms?: Array<{
    id: number | string;
    title: string;
  }>;
  loading?: boolean;
  onChange?: (
    filters: AnalyticsFilterValues,
  ) => void;
  onReset?: () => void;
}

const defaultFilters: AnalyticsFilterValues = {
  formId: "all",
  dateRange: "30",
  groupBy: "day",
  startDate: "",
  endDate: "",
};

const AnalyticsFilters = ({
  value = defaultFilters,
  forms = [],
  loading = false,
  onChange,
  onReset,
}: AnalyticsFiltersProps) => {
  const filters = {
    ...defaultFilters,
    ...value,
  };

  const updateFilters = (
    changes: Partial<AnalyticsFilterValues>,
  ) => {
    onChange?.({
      ...filters,
      ...changes,
    });
  };

  const handleDateRangeChange = (
    dateRange: AnalyticsDateRange,
  ) => {
    updateFilters({
      dateRange,
      ...(dateRange !== "custom"
        ? {
            startDate: "",
            endDate: "",
          }
        : {}),
    });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
      return;
    }

    onChange?.(defaultFilters);
  };

  const hasFilters =
    filters.formId !== "all" ||
    filters.dateRange !== "30" ||
    filters.groupBy !== "day" ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  return (
    <Box
      sx={{
        width: "100%",
        p: {
          xs: 1.5,
          sm: 2,
        },
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        spacing={1.5}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            display: {
              xs: "none",
              md: "flex",
            },
          }}
        >
          <FilterListOutlinedIcon
            sx={{ color: "text.secondary" }}
          />
        </Stack>

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              md: 190,
            },
          }}
        >
          <InputLabel id="analytics-form-filter-label">
            Form
          </InputLabel>

          <Select
            labelId="analytics-form-filter-label"
            value={filters.formId}
            label="Form"
            disabled={loading}
            onChange={(event) => {
              const value = event.target.value;

              updateFilters({
                formId:
                  value === "all"
                    ? "all"
                    : value,
              });
            }}
          >
            <MenuItem value="all">
              All Forms
            </MenuItem>

            {forms.map((form) => (
              <MenuItem
                key={String(form.id)}
                value={form.id}
              >
                {form.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              md: 160,
            },
          }}
        >
          <InputLabel id="analytics-date-range-label">
            Date Range
          </InputLabel>

          <Select
            labelId="analytics-date-range-label"
            value={filters.dateRange}
            label="Date Range"
            disabled={loading}
            onChange={(event) => {
              handleDateRangeChange(
                event.target.value as AnalyticsDateRange,
              );
            }}
          >
            <MenuItem value="7">
              Last 7 Days
            </MenuItem>

            <MenuItem value="30">
              Last 30 Days
            </MenuItem>

            <MenuItem value="90">
              Last 90 Days
            </MenuItem>

            <MenuItem value="365">
              Last 12 Months
            </MenuItem>

            <MenuItem value="custom">
              Custom Range
            </MenuItem>
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              md: 145,
            },
          }}
        >
          <InputLabel id="analytics-group-label">
            Group By
          </InputLabel>

          <Select
            labelId="analytics-group-label"
            value={filters.groupBy}
            label="Group By"
            disabled={loading}
            onChange={(event) => {
              updateFilters({
                groupBy:
                  event.target.value as AnalyticsGroupBy,
              });
            }}
          >
            <MenuItem value="day">Day</MenuItem>
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
          </Select>
        </FormControl>

        {filters.dateRange === "custom" && (
          <>
            <TextField
              size="small"
              label="Start Date"
              type="date"
              value={filters.startDate}
              disabled={loading}
              onChange={(event) => {
                updateFilters({
                  startDate: event.target.value,
                });
              }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 155,
                },
              }}
            />

            <TextField
              size="small"
              label="End Date"
              type="date"
              value={filters.endDate}
              disabled={loading}
              onChange={(event) => {
                updateFilters({
                  endDate: event.target.value,
                });
              }}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              sx={{
                minWidth: {
                  xs: "100%",
                  md: 155,
                },
              }}
            />
          </>
        )}

        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ClearOutlinedIcon />}
          disabled={loading || !hasFilters}
          onClick={handleReset}
          sx={{
            minWidth: {
              xs: "100%",
              md: 105,
            },
            height: 40,
            textTransform: "none",
            whiteSpace: "nowrap",
          }}
        >
          Clear
        </Button>
      </Stack>
    </Box>
  );
};

export default AnalyticsFilters;