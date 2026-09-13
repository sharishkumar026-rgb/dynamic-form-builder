import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

export type ReportScheduleFrequency =
  | "daily"
  | "weekly"
  | "monthly";

export interface ReportScheduleData {
  enabled: boolean;
  frequency: ReportScheduleFrequency;
  time: string;
  dayOfWeek: number;
  dayOfMonth: number;
  format: "csv" | "excel" | "pdf";
}

interface ReportScheduleDialogProps {
  open: boolean;
  reportName?: string;
  initialData?: Partial<ReportScheduleData>;
  loading?: boolean;
  onClose: () => void;
  onSave?: (data: ReportScheduleData) => void;
}

const defaultSchedule: ReportScheduleData = {
  enabled: true,
  frequency: "daily",
  time: "09:00",
  dayOfWeek: 1,
  dayOfMonth: 1,
  format: "pdf",
};

const weekDays = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const ReportScheduleDialog = ({
  open,
  reportName = "Report",
  initialData,
  loading = false,
  onClose,
  onSave,
}: ReportScheduleDialogProps) => {
  const [schedule, setSchedule] =
    useState<ReportScheduleData>(defaultSchedule);

  useEffect(() => {
    if (open) {
      setSchedule({
        ...defaultSchedule,
        ...initialData,
      });
    }
  }, [open, initialData]);

  const handleChange = <K extends keyof ReportScheduleData>(
    key: K,
    value: ReportScheduleData[K],
  ) => {
    setSchedule((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSave = () => {
    onSave?.(schedule);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle
        sx={{
          pr: 6,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <ScheduleOutlinedIcon color="primary" />

          <Stack spacing={0.25}>
            <Typography variant="h6" fontWeight={700}>
              Schedule Report
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {reportName}
            </Typography>
          </Stack>
        </Stack>

        <IconButton
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
          }}
        >
          <CloseOutlinedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <FormControlLabel
            control={
              <Switch
                checked={schedule.enabled}
                onChange={(event) =>
                  handleChange("enabled", event.target.checked)
                }
                disabled={loading}
              />
            }
            label={
              <Stack>
                <Typography variant="body1" fontWeight={600}>
                  Enable scheduled report
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Automatically generate this report according to
                  the selected schedule.
                </Typography>
              </Stack>
            }
          />

          <FormControl fullWidth size="small">
            <InputLabel id="report-frequency-label">
              Frequency
            </InputLabel>

            <Select
              labelId="report-frequency-label"
              value={schedule.frequency}
              label="Frequency"
              onChange={(event) =>
                handleChange(
                  "frequency",
                  event.target.value as ReportScheduleFrequency,
                )
              }
              disabled={loading || !schedule.enabled}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          {schedule.frequency === "weekly" && (
            <FormControl fullWidth size="small">
              <InputLabel id="report-weekday-label">
                Day of Week
              </InputLabel>

              <Select
                labelId="report-weekday-label"
                value={schedule.dayOfWeek}
                label="Day of Week"
                onChange={(event) =>
                  handleChange(
                    "dayOfWeek",
                    Number(event.target.value),
                  )
                }
                disabled={loading || !schedule.enabled}
              >
                {weekDays.map((day) => (
                  <MenuItem key={day.value} value={day.value}>
                    {day.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {schedule.frequency === "monthly" && (
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Day of Month"
              value={schedule.dayOfMonth}
              onChange={(event) => {
                const value = Math.min(
                  31,
                  Math.max(1, Number(event.target.value) || 1),
                );

                handleChange("dayOfMonth", value);
              }}
              disabled={loading || !schedule.enabled}
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: 31,
                },
              }}
              helperText="Choose a day between 1 and 31."
            />
          )}

          <TextField
            fullWidth
            size="small"
            type="time"
            label="Time"
            value={schedule.time}
            onChange={(event) =>
              handleChange("time", event.target.value)
            }
            disabled={loading || !schedule.enabled}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
              input: {
                startAdornment: (
                  <AccessTimeOutlinedIcon
                    fontSize="small"
                    sx={{
                      mr: 1,
                      color: "text.secondary",
                    }}
                  />
                ),
              },
            }}
          />

          <FormControl fullWidth size="small">
            <InputLabel id="report-format-label">
              Export Format
            </InputLabel>

            <Select
              labelId="report-format-label"
              value={schedule.format}
              label="Export Format"
              onChange={(event) =>
                handleChange(
                  "format",
                  event.target.value as ReportScheduleData["format"],
                )
              }
              disabled={loading || !schedule.enabled}
            >
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
            </Select>
          </FormControl>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: "action.hover",
            }}
          >
            The report will be generated automatically using the
            selected frequency, time, and export format.
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={<ScheduleOutlinedIcon />}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          {loading ? "Saving..." : "Save Schedule"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportScheduleDialog;