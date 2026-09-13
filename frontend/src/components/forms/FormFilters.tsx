import { useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import SearchIcon from "@mui/icons-material/Search";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

export type FormStatusFilter = "all" | "active" | "inactive";

export type FormSortOption =
  | "newest"
  | "oldest"
  | "title_asc"
  | "title_desc"
  | "responses_desc"
  | "responses_asc";

export interface FormFilterValues {
  search: string;
  status: FormStatusFilter;
  sortBy: FormSortOption;
}

interface FormFiltersProps {
  value?: FormFilterValues;
  onChange?: (filters: FormFilterValues) => void;
  onReset?: () => void;
  loading?: boolean;
}

const defaultFilters: FormFilterValues = {
  search: "",
  status: "all",
  sortBy: "newest",
};

const FormFilters = ({
  value,
  onChange,
  onReset,
  loading = false,
}: FormFiltersProps) => {
  const [internalFilters, setInternalFilters] =
    useState<FormFilterValues>(
      value || defaultFilters,
    );

  const filters = value || internalFilters;

  const updateFilters = (
    updates: Partial<FormFilterValues>,
  ) => {
    const nextFilters = {
      ...filters,
      ...updates,
    };

    if (!value) {
      setInternalFilters(nextFilters);
    }

    onChange?.(nextFilters);
  };

  const handleReset = () => {
    if (!value) {
      setInternalFilters(defaultFilters);
    }

    onReset?.();
    onChange?.(defaultFilters);
  };

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.status !== "all" ||
    filters.sortBy !== "newest";

  return (
    <Box
      sx={{
        width: "100%",
        p: 2,
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
        spacing={2}
        alignItems={{
          xs: "stretch",
          md: "center",
        }}
      >
        {/* Search */}
        <TextField
          fullWidth
          size="small"
          label="Search forms"
          placeholder="Search by title or description"
          value={filters.search}
          onChange={(event) =>
            updateFilters({
              search: event.target.value,
            })
          }
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{
            minWidth: {
              md: 280,
            },
            flex: 1,
          }}
        />

        {/* Status */}
        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              md: 160,
            },
          }}
        >
          <InputLabel id="form-status-filter-label">
            Status
          </InputLabel>

          <Select
            labelId="form-status-filter-label"
            value={filters.status}
            label="Status"
            disabled={loading}
            onChange={(event) =>
              updateFilters({
                status:
                  event.target.value as FormStatusFilter,
              })
            }
          >
            <MenuItem value="all">All Forms</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>

        {/* Sort */}
        <FormControl
          size="small"
          sx={{
            minWidth: {
              xs: "100%",
              md: 190,
            },
          }}
        >
          <InputLabel id="form-sort-filter-label">
            Sort By
          </InputLabel>

          <Select
            labelId="form-sort-filter-label"
            value={filters.sortBy}
            label="Sort By"
            disabled={loading}
            onChange={(event) =>
              updateFilters({
                sortBy:
                  event.target.value as FormSortOption,
              })
            }
          >
            <MenuItem value="newest">
              Newest First
            </MenuItem>

            <MenuItem value="oldest">
              Oldest First
            </MenuItem>

            <MenuItem value="title_asc">
              Title A-Z
            </MenuItem>

            <MenuItem value="title_desc">
              Title Z-A
            </MenuItem>

            <MenuItem value="responses_desc">
              Most Responses
            </MenuItem>

            <MenuItem value="responses_asc">
              Least Responses
            </MenuItem>
          </Select>
        </FormControl>

        {/* Reset */}
        <Button
          variant="outlined"
          color="inherit"
          startIcon={
            hasActiveFilters ? (
              <ClearIcon />
            ) : (
              <FilterListOutlinedIcon />
            )
          }
          onClick={handleReset}
          disabled={loading || !hasActiveFilters}
          sx={{
            minWidth: {
              xs: "100%",
              md: 110,
            },
            whiteSpace: "nowrap",
          }}
        >
          Reset
        </Button>
      </Stack>
    </Box>
  );
};

export default FormFilters;