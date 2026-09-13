
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export interface RecentResponse {
  id: number | string;
  formName: string;
  submittedBy?: string;
  submittedAt?: string | Date;
  status?: "completed" | "pending" | "reviewed";
}

interface RecentResponsesProps {
  responses?: RecentResponse[];
  title?: string;
  subtitle?: string;
  loading?: boolean;
  onView?: (response: RecentResponse) => void;
}

const RecentResponses = ({
  responses = [],
  title = "Recent Responses",
  subtitle = "Latest responses submitted to your forms",
  loading = false,
  onView,
}: RecentResponsesProps) => {
  const formatDate = (value?: string | Date) => {
    if (!value) {
      return "-";
    }

    const date =
      value instanceof Date
        ? value
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusLabel = (
    status: RecentResponse["status"],
  ) => {
    if (status === "completed") {
      return "Completed";
    }

    if (status === "reviewed") {
      return "Reviewed";
    }

    if (status === "pending") {
      return "Pending";
    }

    return "Submitted";
  };

  const getStatusColor = (
    status: RecentResponse["status"],
  ) => {
    if (status === "completed") {
      return "success";
    }

    if (status === "reviewed") {
      return "info";
    }

    if (status === "pending") {
      return "warning";
    }

    return "default";
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <CardContent
        sx={{
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Stack spacing={2}>
          <Box>
            <Typography
              variant="h6"
              component="h2"
              sx={{
                fontWeight: 700,
              }}
            >
              {title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
              }}
            >
              {subtitle}
            </Typography>
          </Box>

          {loading ? (
            <Stack spacing={1.5}>
              {[1, 2, 3].map((item) => (
                <Box
                  key={item}
                  sx={{
                    width: "100%",
                    height: 52,
                    borderRadius: 1,
                    backgroundColor: "action.hover",
                  }}
                />
              ))}
            </Stack>
          ) : responses.length === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
              }}
            >
              <AssignmentOutlinedIcon
                sx={{
                  fontSize: 42,
                  color: "text.disabled",
                  mb: 1,
                }}
              />

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                }}
              >
                No recent responses
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Responses submitted to your forms will appear here.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table
                size="small"
                aria-label="Recent responses"
              >
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Form
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Submitted By
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Submitted At
                    </TableCell>

                    <TableCell
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Status
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {responses.map((response) => (
                    <TableRow
                      key={response.id}
                      hover
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                        >
                          <AssignmentOutlinedIcon
                            fontSize="small"
                            color="action"
                          />

                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                            }}
                          >
                            {response.formName}
                          </Typography>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          {response.submittedBy || "Anonymous"}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(
                            response.submittedAt,
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={getStatusLabel(
                            response.status,
                          )}
                          color={getStatusColor(
                            response.status,
                          )}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="View response">
                          <IconButton
                            size="small"
                            aria-label="View response"
                            onClick={() =>
                              onView?.(response)
                            }
                            disabled={!onView}
                          >
                            <VisibilityOutlinedIcon
                              fontSize="small"
                            />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RecentResponses;

