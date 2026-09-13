import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export interface ResponseTableData {
  id: number | string;
  formId?: number | string;
  formName?: string;
  submittedBy?: string;
  submittedAt?: string | Date;
  status?: "completed" | "pending" | "reviewed";
  responseData?: Record<string, unknown>;
}

interface ResponseTableProps {
  responses?: ResponseTableData[];
  loading?: boolean;
  page?: number;
  rowsPerPage?: number;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  onView?: (response: ResponseTableData) => void;
  onEdit?: (response: ResponseTableData) => void;
  onDelete?: (response: ResponseTableData) => void;
}

const formatDate = (value?: string | Date) => {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString();
};

const getStatusColor = (
  status?: ResponseTableData["status"],
): "success" | "warning" | "info" | "default" => {
  switch (status) {
    case "completed":
      return "success";
    case "pending":
      return "warning";
    case "reviewed":
      return "info";
    default:
      return "default";
  }
};

const formatStatus = (status?: ResponseTableData["status"]) => {
  if (!status) {
    return "Unknown";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const ResponseTable = ({
  responses = [],
  loading = false,
  page = 0,
  rowsPerPage = 10,
  totalCount,
  onPageChange,
  onRowsPerPageChange,
  onView,
  onEdit,
  onDelete,
}: ResponseTableProps) => {
  const displayedResponses = responses;

  const count =
    typeof totalCount === "number"
      ? totalCount
      : responses.length;

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <TableContainer
        sx={{
          width: "100%",
          overflowX: "auto",
        }}
      >
        <Table
          sx={{
            minWidth: 850,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>
                ID
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Form
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Submitted By
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Submitted At
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Status
              </TableCell>

              <TableCell
                align="right"
                sx={{ fontWeight: 700 }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box
                    sx={{
                      py: 5,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Loading responses...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : displayedResponses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box
                    sx={{
                      py: 5,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                    >
                      No responses found
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      Responses submitted through your forms
                      will appear here.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              displayedResponses.map((response) => (
                <TableRow
                  key={String(response.id)}
                  hover
                >
                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                    >
                      #{response.id}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        maxWidth: 220,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {response.formName || "-"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color={
                        response.submittedBy
                          ? "text.primary"
                          : "text.secondary"
                      }
                    >
                      {response.submittedBy || "Anonymous"}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {formatDate(response.submittedAt)}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={formatStatus(response.status)}
                      color={getStatusColor(response.status)}
                      size="small"
                      variant="outlined"
                      sx={{
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={0.5}
                      justifyContent="flex-end"
                    >
                      {onView && (
                        <Tooltip title="View response">
                          <IconButton
                            size="small"
                            onClick={() => onView(response)}
                            aria-label="View response"
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {onEdit && (
                        <Tooltip title="Edit response">
                          <IconButton
                            size="small"
                            onClick={() => onEdit(response)}
                            aria-label="Edit response"
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {onDelete && (
                        <Tooltip title="Delete response">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(response)}
                            aria-label="Delete response"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, nextPage) => {
          onPageChange?.(nextPage);
        }}
        onRowsPerPageChange={(event) => {
          onRowsPerPageChange?.(
            Number(event.target.value),
          );
          onPageChange?.(0);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
};

export default ResponseTable;