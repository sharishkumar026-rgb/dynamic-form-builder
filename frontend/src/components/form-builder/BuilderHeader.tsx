import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PreviewOutlinedIcon from "@mui/icons-material/PreviewOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

interface BuilderHeaderProps {
  title?: string;
  subtitle?: string;
  saving?: boolean;
  hasUnsavedChanges?: boolean;
  onBack?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
}

const BuilderHeader = ({
  title = "Form Builder",
  subtitle,
  saving = false,
  hasUnsavedChanges = false,
  onBack,
  onSave,
  onPreview,
}: BuilderHeaderProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        px: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
        py: 1.5,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        {/* Left Section */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >
          {onBack && (
            <Tooltip title="Back">
              <IconButton
                onClick={onBack}
                size="small"
                aria-label="Back"
              >
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          )}

          <Box sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{ flexWrap: "wrap" }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                noWrap
                sx={{
                  maxWidth: {
                    xs: 180,
                    sm: 300,
                    md: 500,
                  },
                }}
              >
                {title}
              </Typography>

              {hasUnsavedChanges && (
                <Chip
                  label="Unsaved changes"
                  size="small"
                  color="warning"
                  variant="outlined"
                />
              )}

              {!hasUnsavedChanges && !saving && (
                <Chip
                  icon={<CheckCircleOutlineIcon />}
                  label="Saved"
                  size="small"
                  color="success"
                  variant="outlined"
                />
              )}
            </Stack>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{
                  mt: 0.25,
                  maxWidth: {
                    xs: 220,
                    sm: 400,
                    md: 600,
                  },
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {/* Right Section */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          flexShrink={0}
        >
          <Button
            variant="outlined"
            color="inherit"
            startIcon={<PreviewOutlinedIcon />}
            onClick={onPreview}
            disabled={saving}
            sx={{
              display: {
                xs: "none",
                sm: "inline-flex",
              },
            }}
          >
            Preview
          </Button>

          <Button
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
            onClick={onSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default BuilderHeader;