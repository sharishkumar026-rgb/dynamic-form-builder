import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import GroupWorkOutlinedIcon from "@mui/icons-material/GroupWorkOutlined";
import PlayArrowOutlinedIcon from "@mui/icons-material/PlayArrowOutlined";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";

import type {
  ReportField,
  ReportFilter,
  ReportSort,
} from "./ReportBuilder";

export interface ReportPreviewData {
  id?: number | string;
  name: string;
  description?: string;
  fields?: ReportField[];
  filters?: ReportFilter[];
  sorts?: ReportSort[];
  groupBy?: number | string;
  rows?: Record<string, unknown>[];
  totalRecords?: number;
  generatedAt?: string | Date;
}

interface ReportPreviewProps {
  data: ReportPreviewData | null;
  loading?: boolean;
  running?: boolean;
  onRun?: () => void;
  onEdit?: () => void;
}

const formatDate = (value?: string | Date) => {
  if (!value) {
    return "—";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
};

const formatCellValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const getFieldLabel = (
  fieldId: number | string,
  fields: ReportField[],
) => {
  const field = fields.find(
    (item) => String(item.id) === String(fieldId),
  );

  return field?.label ?? String(fieldId);
};

const getOperatorLabel = (operator: ReportFilter["operator"]) => {
  const labels: Record<ReportFilter["operator"], string> = {
    equals: "Equals",
    not_equals: "Not Equals",
    contains: "Contains",
    greater_than: "Greater Than",
    less_than: "Less Than",
    greater_or_equal: "Greater or Equal",
    less_or_equal: "Less or Equal",
  };

  return labels[operator];
};

const ReportPreview = ({
  data,
  loading = false,
  running = false,
  onRun,
  onEdit,
}: ReportPreviewProps) => {
  if (!data) {
    return (
      <Paper
        variant="outlined"
        sx={{
          minHeight: 420,
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Stack
          spacing={1.5}
          alignItems="center"
          textAlign="center"
          sx={{ maxWidth: 420 }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "action.hover",
              color: "text.secondary",
            }}
          >
            <DescriptionOutlinedIcon sx={{ fontSize: 32 }} />
          </Box>

          <Typography variant="h6" fontWeight={700}>
            No report selected
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Select or create a report to preview its configuration
            and results.
          </Typography>
        </Stack>
      </Paper>
    );
  }

  const fields = data.fields ?? [];
  const filters = data.filters ?? [];
  const sorts = data.sorts ?? [];
  const rows = data.rows ?? [];

  const groupByLabel =
    data.groupBy !== undefined
      ? getFieldLabel(data.groupBy, fields)
      : undefined;

  return (
    <Stack spacing={2.5}>
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
            <Stack spacing={0.75}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >
                <DescriptionOutlinedIcon color="primary" />

                <Typography
                  variant="h5"
                  component="h1"
                  fontWeight={700}
                >
                  {data.name || "Untitled Report"}
                </Typography>
              </Stack>

              {data.description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {data.description}
                </Typography>
              )}
            </Stack>

            <Stack direction="row" spacing={1}>
              {onEdit && (
                <Button
                  variant="outlined"
                  onClick={onEdit}
                  disabled={loading || running}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  Edit
                </Button>
              )}

              {onRun && (
                <Button
                  variant="contained"
                  startIcon={<PlayArrowOutlinedIcon />}
                  onClick={onRun}
                  disabled={loading || running}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                  }}
                >
                  {running ? "Running..." : "Run Report"}
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>

        <Divider />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{
            p: 2,
            backgroundColor: "action.hover",
          }}
        >
          <Chip
            icon={<CheckCircleOutlineIcon />}
            label={`${fields.length} field${
              fields.length === 1 ? "" : "s"
            }`}
            size="small"
            variant="outlined"
          />

          <Chip
            icon={<FilterAltOutlinedIcon />}
            label={`${filters.length} filter${
              filters.length === 1 ? "" : "s"
            }`}
            size="small"
            variant="outlined"
          />

          <Chip
            icon={<SortOutlinedIcon />}
            label={`${sorts.length} sort${
              sorts.length === 1 ? "" : "s"
            }`}
            size="small"
            variant="outlined"
          />

          {groupByLabel && (
            <Chip
              icon={<GroupWorkOutlinedIcon />}
              label={`Group: ${groupByLabel}`}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: { xs: 2, sm: 2.5 },
        }}
      >
        <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
          Report Configuration
        </Typography>

        <Stack spacing={2}>
          <Box>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              mb={0.75}
            >
              Selected Fields
            </Typography>

            {fields.length > 0 ? (
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={0.75}
              >
                {fields.map((field) => (
                  <Chip
                    key={String(field.id)}
                    label={field.label}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No fields selected.
              </Typography>
            )}
          </Box>

          {filters.length > 0 && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={0.75}
              >
                Filters
              </Typography>

              <Stack spacing={0.75}>
                {filters.map((filter) => (
                  <Box
                    key={String(filter.id)}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: "action.hover",
                    }}
                  >
                    <Typography variant="body2">
                      <strong>
                        {getFieldLabel(filter.fieldId, fields)}
                      </strong>{" "}
                      {getOperatorLabel(filter.operator)}{" "}
                      <strong>{filter.value || "—"}</strong>
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {sorts.length > 0 && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={0.75}
              >
                Sorting
              </Typography>

              <Stack spacing={0.75}>
                {sorts.map((sort) => (
                  <Box
                    key={String(sort.id)}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: "action.hover",
                    }}
                  >
                    <Typography variant="body2">
                      <strong>
                        {getFieldLabel(sort.fieldId, fields)}
                      </strong>{" "}
                      — {sort.direction === "asc" ? "Ascending" : "Descending"}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {groupByLabel && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                mb={0.75}
              >
                Group By
              </Typography>

              <Chip
                icon={<GroupWorkOutlinedIcon />}
                label={groupByLabel}
                size="small"
                variant="outlined"
              />
            </Box>
          )}
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: { xs: 2, sm: 2.5 },
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              Report Results
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {data.totalRecords ?? rows.length} record
              {(data.totalRecords ?? rows.length) === 1 ? "" : "s"}
              {data.generatedAt
                ? ` • Generated ${formatDate(data.generatedAt)}`
                : ""}
            </Typography>
          </Box>
        </Box>

        <Divider />

        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              Loading report results...
            </Typography>
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <DescriptionOutlinedIcon
              sx={{
                fontSize: 42,
                color: "text.disabled",
                mb: 1,
              }}
            />

            <Typography variant="subtitle1" fontWeight={600}>
              No results available
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Run the report to retrieve matching records.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ maxHeight: 520 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {fields.map((field) => (
                    <TableCell
                      key={String(field.id)}
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {field.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow
                    key={`report-row-${rowIndex}`}
                    hover
                  >
                    {fields.map((field) => (
                      <TableCell
                        key={String(field.id)}
                        sx={{
                          maxWidth: 280,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {formatCellValue(row[field.name])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Stack>
  );
};

export default ReportPreview;