import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import type { SelectChangeEvent } from "@mui/material/Select";

export type ActivityLogStatusFilter =
  | "all"
  | "success"
  | "failed"
  | "warning"
  | "info";

export type ActivityLogSortOption =
  | "newest"
  | "oldest"
  | "action_asc"
  | "action_desc";

export interface ActivityLogFilterValues {
  search: string;
  status: ActivityLogStatusFilter;
  module: string;
  sortBy: ActivityLogSortOption;
  dateFrom: string;
  dateTo: string;
}

interface ActivityLogFiltersProps {
  value?: Partial<ActivityLogFilterValues>;
  modules?: string[];
  loading?: boolean;
  onChange?: (filters: ActivityLogFilterValues) => void;
  onReset?: () => void;
}

const defaultFilters: ActivityLogFilterValues = {
  search: "",
  status: "all",
  module: "all",
  sortBy: "newest",
  dateFrom: "",
  dateTo: "",
};

const ActivityLogFilters = ({
  value,
  modules = [],
  loading = false,
  onChange,
  onReset,
}: ActivityLogFiltersProps) => {
  const filters: ActivityLogFilterValues = {
    ...defaultFilters,
    ...value,
  };

  const updateFilters = (
    changes: Partial<ActivityLogFilterValues>,
  ) => {
    onChange?.({
      ...filters,
      ...changes,
    });
  };

  const handleStatusChange = (
    event: SelectChangeEvent<string>,
  ) => {
    updateFilters({
      status:
        event.target.value as ActivityLogStatusFilter,
    });
  };

  const handleModuleChange = (
    event: SelectChangeEvent<string>,
  ) => {
    updateFilters({
      module: event.target.value,
    });
  };

  const handleSortChange = (
    event: SelectChangeEvent<string>,
  ) => {
    updateFilters({
      sortBy:
        event.target.value as ActivityLogSortOption,
    });
  };

  const handleReset = () => {
    onReset?.();

    if (!onReset) {
      onChange?.(defaultFilters);
    }
  };

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Search"
            placeholder="Search user, action, description..."
            value={filters.search}
            onChange={(event) =>
              updateFilters({
                search: event.target.value,
              })
            }
            disabled={loading}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl
            fullWidth
            size="small"
            disabled={loading}
          >
            <InputLabel id="activity-log-status-label">
              Status
            </InputLabel>

            <Select
              labelId="activity-log-status-label"
              value={filters.status}
              label="Status"
              onChange={handleStatusChange}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="failed">Failed</MenuItem>
              <MenuItem value="warning">Warning</MenuItem>
              <MenuItem value="info">Info</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl
            fullWidth
            size="small"
            disabled={loading}
          >
            <InputLabel id="activity-log-module-label">
              Module
            </InputLabel>

            <Select
              labelId="activity-log-module-label"
              value={filters.module}
              label="Module"
              onChange={handleModuleChange}
            >
              <MenuItem value="all">All Modules</MenuItem>

              {modules.map((module) => (
                <MenuItem
                  key={module}
                  value={module}
                >
                  {module}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
          <FormControl
            fullWidth
            size="small"
            disabled={loading}
          >
            <InputLabel id="activity-log-sort-label">
              Sort By
            </InputLabel>

            <Select
              labelId="activity-log-sort-label"
              value={filters.sortBy}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="newest">
                Newest First
              </MenuItem>

              <MenuItem value="oldest">
                Oldest First
              </MenuItem>

              <MenuItem value="action_asc">
                Action A-Z
              </MenuItem>

              <MenuItem value="action_desc">
                Action Z-A
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid
          size={{ xs: 12, sm: 6, md: 2 }}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            startIcon={<RestartAltOutlinedIcon />}
            onClick={handleReset}
            disabled={loading}
            sx={{
              minHeight: 40,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Reset
          </Button>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="From Date"
            value={filters.dateFrom}
            onChange={(event) =>
              updateFilters({
                dateFrom: event.target.value,
              })
            }
            disabled={loading}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            type="date"
            label="To Date"
            value={filters.dateTo}
            onChange={(event) =>
              updateFilters({
                dateTo: event.target.value,
              })
            }
            disabled={loading}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Grid>
      </Grid>
    </Stack>
  );
};

export default ActivityLogFilters;