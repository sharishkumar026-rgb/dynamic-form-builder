import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

export type ResponseStatusFilter =
  | "all"
  | "completed"
  | "pending"
  | "reviewed";

export type ResponseSortOption =
  | "newest"
  | "oldest"
  | "form_asc"
  | "form_desc";

export interface ResponseFilterValues {
  search: string;
  status: ResponseStatusFilter;
  sortBy: ResponseSortOption;
}

interface ResponseFiltersProps {
  value?: ResponseFilterValues;
  onChange?: (filters: ResponseFilterValues) => void;
  onReset?: () => void;
  loading?: boolean;
}

const defaultFilters: ResponseFilterValues = {
  search: "",
  status: "all",
  sortBy: "newest",
};

const ResponseFilters = ({
  value = defaultFilters,
  onChange,
  onReset,
  loading = false,
}: ResponseFiltersProps) => {
  const filters = {
    ...defaultFilters,
    ...value,
  };

  const updateFilters = (
    changes: Partial<ResponseFilterValues>,
  ) => {
    onChange?.({
      ...filters,
      ...changes,
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
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.sortBy !== "newest";

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
        <TextField
          fullWidth
          size="small"
          label="Search responses"
          placeholder="Search by form or user"
          value={filters.search}
          disabled={loading}
          onChange={(event) => {
            updateFilters({
              search: event.target.value,
            });
          }}
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
            minWidth: {
              md: 260,
            },
          }}
        />

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              md: 170,
            },
          }}
        >
          <InputLabel id="response-status-filter-label">
            Status
          </InputLabel>

          <Select
            labelId="response-status-filter-label"
            value={filters.status}
            label="Status"
            disabled={loading}
            onChange={(event) => {
              updateFilters({
                status:
                  event.target.value as ResponseStatusFilter,
              });
            }}
          >
            <MenuItem value="all">All Statuses</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="reviewed">Reviewed</MenuItem>
          </Select>
        </FormControl>

        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              md: 180,
            },
          }}
        >
          <InputLabel id="response-sort-filter-label">
            Sort By
          </InputLabel>

          <Select
            labelId="response-sort-filter-label"
            value={filters.sortBy}
            label="Sort By"
            disabled={loading}
            onChange={(event) => {
              updateFilters({
                sortBy:
                  event.target.value as ResponseSortOption,
              });
            }}
          >
            <MenuItem value="newest">
              Newest First
            </MenuItem>

            <MenuItem value="oldest">
              Oldest First
            </MenuItem>

            <MenuItem value="form_asc">
              Form Name A-Z
            </MenuItem>

            <MenuItem value="form_desc">
              Form Name Z-A
            </MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          color="inherit"
          startIcon={
            hasFilters ? (
              <ClearOutlinedIcon />
            ) : (
              <FilterListOutlinedIcon />
            )
          }
          disabled={loading || !hasFilters}
          onClick={handleReset}
          sx={{
            minWidth: {
              xs: "100%",
              md: 110,
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

export default ResponseFilters;