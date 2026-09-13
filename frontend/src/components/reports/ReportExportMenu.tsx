import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import type { MouseEvent } from "react";
import { useState } from "react";

export type ReportExportFormat =
  | "csv"
  | "excel"
  | "pdf";

interface ReportExportMenuProps {
  loading?: boolean;
  disabled?: boolean;
  onExport?: (format: ReportExportFormat) => void;
  buttonLabel?: string;
}

const ReportExportMenu = ({
  loading = false,
  disabled = false,
  onExport,
  buttonLabel = "Export",
}: ReportExportMenuProps) => {
  const [anchorEl, setAnchorEl] =
    useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExport = (format: ReportExportFormat) => {
    handleClose();
    onExport?.(format);
  };

  const isDisabled = disabled || loading;

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<DownloadOutlinedIcon />}
        onClick={handleOpen}
        disabled={isDisabled}
        sx={{
          textTransform: "none",
          borderRadius: 2,
        }}
        aria-haspopup="menu"
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "report-export-menu" : undefined}
      >
        {loading ? "Exporting..." : buttonLabel}
      </Button>

      <Menu
        id="report-export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            sx: {
              minWidth: 190,
              mt: 0.5,
              borderRadius: 2,
            },
          },
        }}
      >
        <MenuItem onClick={() => handleExport("csv")}>
          <ListItemIcon>
            <DescriptionOutlinedIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Export CSV"
            secondary="Comma-separated values"
          />
        </MenuItem>

        <MenuItem onClick={() => handleExport("excel")}>
          <ListItemIcon>
            <TableChartOutlinedIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Export Excel"
            secondary="Excel spreadsheet"
          />
        </MenuItem>

        <MenuItem onClick={() => handleExport("pdf")}>
          <ListItemIcon>
            <PictureAsPdfOutlinedIcon fontSize="small" />
          </ListItemIcon>

          <ListItemText
            primary="Export PDF"
            secondary="PDF document"
          />
        </MenuItem>
      </Menu>
    </>
  );
};

export default ReportExportMenu;