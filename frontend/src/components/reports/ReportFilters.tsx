import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export type ReportStatusFilter =
  | "all"
  | "active"
  | "inactive"
  | "draft"
  | "archived";

export type ReportSortOption =
  | "newest"
  | "oldest"
  | "name_asc"
  | "name_desc"
  | "records_desc"
  | "records_asc";

export interface ReportFilterValues {
  search: string;
  status: ReportStatusFilter;
  sortBy: ReportSortOption;
}

interface ReportFiltersProps {
  value?: ReportFilterValues;
  loading?: boolean;
  onChange?: (filters: ReportFilterValues) => void;
  onReset?: () => void;
}

const defaultFilters: ReportFilterValues = {
  search: "",
  status: "all",
  sortBy: "newest",
};

const ReportFilters = ({
  value = defaultFilters,
  loading = false,
  onChange,
  onReset,
}: ReportFiltersProps) => {
  const handleChange = <K extends keyof ReportFilterValues>(
    key: K,
    newValue: ReportFilterValues[K],
  ) => {
    onChange?.({
      ...value,
      [key]: newValue,
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
    value.search.trim() !== "" ||
    value.status !== "all" ||
    value.sortBy !== "newest";

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 2.5 },
        borderRadius: 3,
        mb: 3,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          spacing={1.5}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "action.hover",
                color: "primary.main",
              }}
            >
              <FilterAltOutlinedIcon fontSize="small" />
            </Box>

            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                Report Filters
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Search, filter, and sort reports.
              </Typography>
            </Box>
          </Stack>

          {hasFilters && (
            <Button
              variant="text"
              color="inherit"
              size="small"
              startIcon={<RestartAltOutlinedIcon />}
              onClick={handleReset}
              disabled={loading}
              sx={{
                textTransform: "none",
                color: "text.secondary",
              }}
            >
              Reset
            </Button>
          )}
        </Stack>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <TextField
            fullWidth
            label="Search reports"
            placeholder="Search by report name or description"
            value={value.search}
            onChange={(event) =>
              handleChange("search", event.target.value)
            }
            disabled={loading}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              flex: 2,
              minWidth: 220,
            }}
          />

          <FormControl
            size="small"
            sx={{
              flex: 1,
              minWidth: { xs: "100%", md: 170 },
            }}
          >
            <InputLabel id="report-status-filter-label">
              Status
            </InputLabel>

            <Select
              labelId="report-status-filter-label"
              value={value.status}
              label="Status"
              onChange={(event) =>
                handleChange(
                  "status",
                  event.target.value as ReportStatusFilter,
                )
              }
              disabled={loading}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="archived">Archived</MenuItem>
            </Select>
          </FormControl>

          <FormControl
            size="small"
            sx={{
              flex: 1,
              minWidth: { xs: "100%", md: 190 },
            }}
          >
            <InputLabel id="report-sort-filter-label">
              Sort By
            </InputLabel>

            <Select
              labelId="report-sort-filter-label"
              value={value.sortBy}
              label="Sort By"
              onChange={(event) =>
                handleChange(
                  "sortBy",
                  event.target.value as ReportSortOption,
                )
              }
              disabled={loading}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
              <MenuItem value="name_asc">Name A-Z</MenuItem>
              <MenuItem value="name_desc">Name Z-A</MenuItem>
              <MenuItem value="records_desc">
                Most Records
              </MenuItem>
              <MenuItem value="records_asc">
                Least Records
              </MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ReportFilters;