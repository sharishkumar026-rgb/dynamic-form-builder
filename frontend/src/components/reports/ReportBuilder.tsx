import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { useState } from "react";

export type ReportFieldType =
  | "text"
  | "number"
  | "date"
  | "boolean";

export type ReportFilterOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "greater_than"
  | "less_than"
  | "greater_or_equal"
  | "less_or_equal";

export interface ReportField {
  id: number | string;
  name: string;
  label: string;
  type?: ReportFieldType;
}

export interface ReportFilter {
  id: number | string;
  fieldId: number | string;
  operator: ReportFilterOperator;
  value: string;
}

export interface ReportSort {
  id: number | string;
  fieldId: number | string;
  direction: "asc" | "desc";
}

export interface ReportBuilderData {
  id?: number | string;
  name: string;
  description: string;
  fields: ReportField[];
  filters: ReportFilter[];
  sorts: ReportSort[];
  groupBy?: number | string;
}

interface ReportBuilderProps {
  initialData?: Partial<ReportBuilderData>;
  availableFields?: ReportField[];
  loading?: boolean;
  saving?: boolean;
  running?: boolean;
  onSave?: (data: ReportBuilderData) => void;
  onRun?: (data: ReportBuilderData) => void;
  onCancel?: () => void;
}

const defaultFields: ReportField[] = [
  {
    id: "name",
    name: "name",
    label: "Name",
    type: "text",
  },
  {
    id: "department",
    name: "department",
    label: "Department",
    type: "text",
  },
  {
    id: "status",
    name: "status",
    label: "Status",
    type: "text",
  },
  {
    id: "created_at",
    name: "created_at",
    label: "Created At",
    type: "date",
  },
];

const operatorOptions: Array<{
  value: ReportFilterOperator;
  label: string;
}> = [
  {
    value: "equals",
    label: "Equals",
  },
  {
    value: "not_equals",
    label: "Not equals",
  },
  {
    value: "contains",
    label: "Contains",
  },
  {
    value: "greater_than",
    label: "Greater than",
  },
  {
    value: "less_than",
    label: "Less than",
  },
  {
    value: "greater_or_equal",
    label: "Greater or equal",
  },
  {
    value: "less_or_equal",
    label: "Less or equal",
  },
];

const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const ReportBuilder = ({
  initialData,
  availableFields = defaultFields,
  loading = false,
  saving = false,
  running = false,
  onSave,
  onRun,
  onCancel,
}: ReportBuilderProps) => {
  const [name, setName] = useState(
    initialData?.name ?? "",
  );

  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );

  const [selectedFields, setSelectedFields] =
    useState<ReportField[]>(
      initialData?.fields ?? [],
    );

  const [filters, setFilters] = useState<ReportFilter[]>(
    initialData?.filters ?? [],
  );

  const [sorts, setSorts] = useState<ReportSort[]>(
    initialData?.sorts ?? [],
  );

  const [groupBy, setGroupBy] = useState<
    number | string | ""
  >(initialData?.groupBy ?? "");

  const addField = (field: ReportField) => {
    const alreadySelected = selectedFields.some(
      (item) => String(item.id) === String(field.id),
    );

    if (alreadySelected) {
      return;
    }

    setSelectedFields((current) => [
      ...current,
      field,
    ]);
  };

  const removeField = (fieldId: number | string) => {
    setSelectedFields((current) =>
      current.filter(
        (field) =>
          String(field.id) !== String(fieldId),
      ),
    );

    setFilters((current) =>
      current.filter(
        (filter) =>
          String(filter.fieldId) !== String(fieldId),
      ),
    );

    setSorts((current) =>
      current.filter(
        (sort) =>
          String(sort.fieldId) !== String(fieldId),
      ),
    );

    if (
      groupBy !== "" &&
      String(groupBy) === String(fieldId)
    ) {
      setGroupBy("");
    }
  };

  const addFilter = () => {
    const firstField =
      selectedFields[0] ?? availableFields[0];

    if (!firstField) {
      return;
    }

    setFilters((current) => [
      ...current,
      {
        id: createId(),
        fieldId: firstField.id,
        operator: "equals",
        value: "",
      },
    ]);
  };

  const updateFilter = (
    filterId: number | string,
    changes: Partial<ReportFilter>,
  ) => {
    setFilters((current) =>
      current.map((filter) =>
        String(filter.id) === String(filterId)
          ? { ...filter, ...changes }
          : filter,
      ),
    );
  };

  const removeFilter = (
    filterId: number | string,
  ) => {
    setFilters((current) =>
      current.filter(
        (filter) =>
          String(filter.id) !== String(filterId),
      ),
    );
  };

  const addSort = () => {
    const firstField =
      selectedFields[0] ?? availableFields[0];

    if (!firstField) {
      return;
    }

    setSorts((current) => [
      ...current,
      {
        id: createId(),
        fieldId: firstField.id,
        direction: "asc",
      },
    ]);
  };

  const updateSort = (
    sortId: number | string,
    changes: Partial<ReportSort>,
  ) => {
    setSorts((current) =>
      current.map((sort) =>
        String(sort.id) === String(sortId)
          ? { ...sort, ...changes }
          : sort,
      ),
    );
  };

  const removeSort = (
    sortId: number | string,
  ) => {
    setSorts((current) =>
      current.filter(
        (sort) =>
          String(sort.id) !== String(sortId),
      ),
    );
  };

  const getFieldLabel = (
    fieldId: number | string,
  ) => {
    const field = availableFields.find(
      (item) =>
        String(item.id) === String(fieldId),
    );

    return field?.label ?? String(fieldId);
  };

  const buildData = (): ReportBuilderData => ({
    id: initialData?.id,
    name: name.trim(),
    description: description.trim(),
    fields: selectedFields,
    filters,
    sorts,
    groupBy:
      groupBy === "" ? undefined : groupBy,
  });

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }

    onSave?.(buildData());
  };

  const handleRun = () => {
    if (!name.trim()) {
      return;
    }

    onRun?.(buildData());
  };

  const isBusy = loading || saving || running;

  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              justifyContent="space-between"
              alignItems={{
                xs: "flex-start",
                sm: "center",
              }}
              spacing={2}
            >
              <Box>
                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight={700}
                >
                  Report Builder
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Create a custom report using fields,
                  filters, sorting, and grouping.
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={1}
              >
                {onCancel && (
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    disabled={isBusy}
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    Cancel
                  </Button>
                )}

                {onRun && (
                  <Button
                    variant="outlined"
                    startIcon={
                      <PlayArrowOutlinedIcon />
                    }
                    onClick={handleRun}
                    disabled={
                      isBusy || !name.trim()
                    }
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    {running
                      ? "Running..."
                      : "Run Report"}
                  </Button>
                )}

                {onSave && (
                  <Button
                    variant="contained"
                    startIcon={<SaveOutlinedIcon />}
                    onClick={handleSave}
                    disabled={
                      isBusy || !name.trim()
                    }
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Report"}
                  </Button>
                )}
              </Stack>
            </Stack>

            <Divider />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Report Name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Enter report name"
                  required
                  disabled={isBusy}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={description}
                  onChange={(event) =>
                    setDescription(
                      event.target.value,
                    )
                  }
                  placeholder="Describe this report"
                  disabled={isBusy}
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 4 }}>
          <BuilderSection
            icon={<TableChartOutlinedIcon />}
            title="Available Fields"
            subtitle="Select fields to include in the report."
          >
            <Stack spacing={1}>
              {availableFields.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  No fields available.
                </Typography>
              ) : (
                availableFields.map((field) => {
                  const selected =
                    selectedFields.some(
                      (item) =>
                        String(item.id) ===
                        String(field.id),
                    );

                  return (
                    <Paper
                      key={field.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: selected
                          ? "action.selected"
                          : "background.paper",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={1}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                          >
                            {field.label}
                          </Typography>

                          {field.type && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {field.type}
                            </Typography>
                          )}
                        </Box>

                        <IconButton
                          size="small"
                          color={
                            selected
                              ? "success"
                              : "primary"
                          }
                          onClick={() =>
                            selected
                              ? removeField(field.id)
                              : addField(field)
                          }
                          disabled={isBusy}
                        >
                          {selected ? (
                            <DeleteOutlineIcon fontSize="small" />
                          ) : (
                            <AddCircleOutlineIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Stack>
                    </Paper>
                  );
                })
              )}
            </Stack>
          </BuilderSection>
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <BuilderSection
              icon={<TableChartOutlinedIcon />}
              title="Selected Fields"
              subtitle="Fields displayed in the report."
            >
              {selectedFields.length === 0 ? (
                <EmptyBuilderMessage>
                  Add fields from the available fields
                  section.
                </EmptyBuilderMessage>
              ) : (
                <Stack spacing={1}>
                  {selectedFields.map(
                    (field, index) => (
                      <Paper
                        key={field.id}
                        variant="outlined"
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Typography
                              variant="body2"
                              fontWeight={700}
                              color="text.secondary"
                            >
                              {index + 1}
                            </Typography>

                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                              >
                                {field.label}
                              </Typography>

                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {field.type ??
                                  "text"}
                              </Typography>
                            </Box>
                          </Stack>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() =>
                              removeField(
                                field.id,
                              )
                            }
                            disabled={isBusy}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Paper>
                    ),
                  )}
                </Stack>
              )}
            </BuilderSection>

            <BuilderSection
              icon={<FilterAltOutlinedIcon />}
              title="Filters"
              subtitle="Filter the records included in the report."
              action={
                <Button
                  size="small"
                  startIcon={
                    <AddCircleOutlineIcon />
                  }
                  onClick={addFilter}
                  disabled={
                    isBusy ||
                    selectedFields.length === 0
                  }
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Add Filter
                </Button>
              }
            >
              {filters.length === 0 ? (
                <EmptyBuilderMessage>
                  No filters added. Add a filter to
                  limit the report data.
                </EmptyBuilderMessage>
              ) : (
                <Stack spacing={1.5}>
                  {filters.map((filter) => (
                    <Paper
                      key={filter.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      <Grid
                        container
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Grid
                          size={{
                            xs: 12,
                            sm: 4,
                          }}
                        >
                          <FormControl
                            fullWidth
                            size="small"
                          >
                            <InputLabel>
                              Field
                            </InputLabel>

                            <Select
                              label="Field"
                              value={String(
                                filter.fieldId,
                              )}
                              onChange={(event) =>
                                updateFilter(
                                  filter.id,
                                  {
                                    fieldId:
                                      event.target
                                        .value,
                                  },
                                )
                              }
                              disabled={isBusy}
                            >
                              {selectedFields.map(
                                (field) => (
                                  <MenuItem
                                    key={field.id}
                                    value={String(
                                      field.id,
                                    )}
                                  >
                                    {field.label}
                                  </MenuItem>
                                ),
                              )}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid
                          size={{
                            xs: 12,
                            sm: 3,
                          }}
                        >
                          <FormControl
                            fullWidth
                            size="small"
                          >
                            <InputLabel>
                              Operator
                            </InputLabel>

                            <Select
                              label="Operator"
                              value={
                                filter.operator
                              }
                              onChange={(event) =>
                                updateFilter(
                                  filter.id,
                                  {
                                    operator:
                                      event.target
                                        .value as ReportFilterOperator,
                                  },
                                )
                              }
                              disabled={isBusy}
                            >
                              {operatorOptions.map(
                                (operator) => (
                                  <MenuItem
                                    key={
                                      operator.value
                                    }
                                    value={
                                      operator.value
                                    }
                                  >
                                    {
                                      operator.label
                                    }
                                  </MenuItem>
                                ),
                              )}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid
                          size={{
                            xs: 10,
                            sm: 4,
                          }}
                        >
                          <TextField
                            fullWidth
                            size="small"
                            label="Value"
                            value={filter.value}
                            onChange={(event) =>
                              updateFilter(
                                filter.id,
                                {
                                  value:
                                    event.target
                                      .value,
                                },
                              )
                            }
                            disabled={isBusy}
                          />
                        </Grid>

                        <Grid
                          size={{
                            xs: 2,
                            sm: 1,
                          }}
                        >
                          <IconButton
                            color="error"
                            onClick={() =>
                              removeFilter(
                                filter.id,
                              )
                            }
                            disabled={isBusy}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              )}
            </BuilderSection>

            <BuilderSection
              icon={<SortOutlinedIcon />}
              title="Sorting"
              subtitle="Choose how report records should be ordered."
              action={
                <Button
                  size="small"
                  startIcon={
                    <AddCircleOutlineIcon />
                  }
                  onClick={addSort}
                  disabled={
                    isBusy ||
                    selectedFields.length === 0
                  }
                  sx={{
                    textTransform: "none",
                  }}
                >
                  Add Sort
                </Button>
              }
            >
              {sorts.length === 0 ? (
                <EmptyBuilderMessage>
                  No sorting rules added.
                </EmptyBuilderMessage>
              ) : (
                <Stack spacing={1.5}>
                  {sorts.map((sort) => (
                    <Paper
                      key={sort.id}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      <Grid
                        container
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Grid
                          size={{
                            xs: 12,
                            sm: 5,
                          }}
                        >
                          <FormControl
                            fullWidth
                            size="small"
                          >
                            <InputLabel>
                              Field
                            </InputLabel>

                            <Select
                              label="Field"
                              value={String(
                                sort.fieldId,
                              )}
                              onChange={(event) =>
                                updateSort(
                                  sort.id,
                                  {
                                    fieldId:
                                      event.target
                                        .value,
                                  },
                                )
                              }
                              disabled={isBusy}
                            >
                              {selectedFields.map(
                                (field) => (
                                  <MenuItem
                                    key={field.id}
                                    value={String(
                                      field.id,
                                    )}
                                  >
                                    {field.label}
                                  </MenuItem>
                                ),
                              )}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid
                          size={{
                            xs: 10,
                            sm: 5,
                          }}
                        >
                          <FormControl
                            fullWidth
                            size="small"
                          >
                            <InputLabel>
                              Direction
                            </InputLabel>

                            <Select
                              label="Direction"
                              value={sort.direction}
                              onChange={(event) =>
                                updateSort(
                                  sort.id,
                                  {
                                    direction:
                                      event.target
                                        .value as
                                        | "asc"
                                        | "desc",
                                  },
                                )
                              }
                              disabled={isBusy}
                            >
                              <MenuItem value="asc">
                                Ascending
                              </MenuItem>

                              <MenuItem value="desc">
                                Descending
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid
                          size={{
                            xs: 2,
                            sm: 2,
                          }}
                        >
                          <IconButton
                            color="error"
                            onClick={() =>
                              removeSort(sort.id)
                            }
                            disabled={isBusy}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Stack>
              )}
            </BuilderSection>

            <BuilderSection
              icon={<GroupWorkOutlinedIcon />}
              title="Grouping"
              subtitle="Optionally group report records by a field."
            >
              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel>
                  Group By
                </InputLabel>

                <Select
                  label="Group By"
                  value={String(groupBy)}
                  onChange={(event) =>
                    setGroupBy(
                      event.target.value,
                    )
                  }
                  disabled={
                    isBusy ||
                    selectedFields.length === 0
                  }
                >
                  <MenuItem value="">
                    None
                  </MenuItem>

                  {selectedFields.map(
                    (field) => (
                      <MenuItem
                        key={field.id}
                        value={String(field.id)}
                      >
                        {field.label}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            </BuilderSection>

            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                backgroundColor: "action.hover",
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  justifyContent="space-between"
                  alignItems={{
                    xs: "flex-start",
                    sm: "center",
                  }}
                  spacing={2}
                >
                  <Box>
                    <Typography
                      variant="body1"
                      fontWeight={700}
                    >
                      Report configuration
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {selectedFields.length}{" "}
                      fields, {filters.length}{" "}
                      filters, {sorts.length}{" "}
                      sorting rules
                      {groupBy !== ""
                        ? ", 1 grouping"
                        : ""}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1}
                  >
                    {onRun && (
                      <Button
                        variant="outlined"
                        startIcon={
                          <PlayArrowOutlinedIcon />
                        }
                        onClick={handleRun}
                        disabled={
                          isBusy ||
                          !name.trim()
                        }
                        sx={{
                          textTransform: "none",
                        }}
                      >
                        Run
                      </Button>
                    )}

                    {onSave && (
                      <Button
                        variant="contained"
                        startIcon={
                          <SaveOutlinedIcon />
                        }
                        onClick={handleSave}
                        disabled={
                          isBusy ||
                          !name.trim()
                        }
                        sx={{
                          textTransform: "none",
                        }}
                      >
                        Save
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
};

interface BuilderSectionProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  children: ReactNode;
  action?: ReactNode;
}

const BuilderSection = ({
  icon,
  title,
  subtitle,
  children,
  action,
}: BuilderSectionProps) => {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
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
                  flexShrink: 0,
                }}
              >
                {icon}
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
                  sx={{ mt: 0.25 }}
                >
                  {subtitle}
                </Typography>
              </Box>
            </Stack>

            {action}
          </Stack>

          <Divider />

          {children}
        </Stack>
      </CardContent>
    </Card>
  );
};

interface EmptyBuilderMessageProps {
  children: ReactNode;
}

const EmptyBuilderMessage = ({
  children,
}: EmptyBuilderMessageProps) => {
  return (
    <Box
      sx={{
        py: 4,
        px: 2,
        textAlign: "center",
        border: "1px dashed",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography
        variant="body2"
        color="text.secondary"
      >
        {children}
      </Typography>
    </Box>
  );
};

export default ReportBuilder;