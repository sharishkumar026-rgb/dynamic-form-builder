import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export type ResponseExportFormat =
  | "csv"
  | "excel"
  | "pdf";

interface ResponseExportProps {
  format?: ResponseExportFormat;
  loading?: boolean;
  disabled?: boolean;
  onFormatChange?: (
    format: ResponseExportFormat,
  ) => void;
  onExport?: (format: ResponseExportFormat) => void;
}

const getFormatLabel = (
  format: ResponseExportFormat,
) => {
  switch (format) {
    case "csv":
      return "CSV";
    case "excel":
      return "Excel";
    case "pdf":
      return "PDF";
    default:
      return "CSV";
  }
};

const getFormatIcon = (
  format: ResponseExportFormat,
) => {
  switch (format) {
    case "excel":
      return <TableChartOutlinedIcon />;
    case "pdf":
      return <PictureAsPdfOutlinedIcon />;
    case "csv":
    default:
      return <DescriptionOutlinedIcon />;
  }
};

const ResponseExport = ({
  format = "csv",
  loading = false,
  disabled = false,
  onFormatChange,
  onExport,
}: ResponseExportProps) => {
  const isDisabled = disabled || loading;

  return (
    <Card
      variant="outlined"
      sx={{
        width: "100%",
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={1.5}
          alignItems={{
            xs: "stretch",
            sm: "center",
          }}
          justifyContent="space-between"
        >
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "primary.50",
                color: "primary.main",
              }}
            >
              {getFormatIcon(format)}
            </Box>

            <Box>
              <Typography
                variant="subtitle2"
                fontWeight={700}
              >
                Export Responses
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Download the current response data.
              </Typography>
            </Box>
          </Stack>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          />

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={1}
          >
            <Select
              size="small"
              value={format}
              disabled={isDisabled}
              onChange={(event) => {
                onFormatChange?.(
                  event.target.value as ResponseExportFormat,
                );
              }}
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 120,
                },
              }}
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
            </Select>

            <Button
              variant="contained"
              startIcon={<DownloadOutlinedIcon />}
              disabled={isDisabled}
              onClick={() => onExport?.(format)}
              sx={{
                minWidth: {
                  xs: "100%",
                  sm: 120,
                },
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {loading
                ? "Exporting..."
                : `Export ${getFormatLabel(format)}`}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ResponseExport;