import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface EmptyBuilderProps {
  title?: string;
  description?: string;
  onAddField?: () => void;
}

const EmptyBuilder = ({
  title = "Start building your form",
  description = "Add fields from the field palette to create your form.",
  onAddField,
}: EmptyBuilderProps) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        minHeight: 420,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderStyle: "dashed",
        borderColor: "divider",
        backgroundColor: "background.paper",
        borderRadius: 3,
        p: 4,
      }}
    >
      <Stack
        spacing={2}
        alignItems="center"
        textAlign="center"
        sx={{
          maxWidth: 460,
        }}
      >
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "primary.50",
            color: "primary.main",
          }}
        >
          <DescriptionOutlinedIcon sx={{ fontSize: 36 }} />
        </Box>

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
          sx={{
            maxWidth: 400,
            lineHeight: 1.7,
          }}
        >
          {description}
        </Typography>

        {onAddField && (
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={onAddField}
            sx={{
              mt: 1,
              borderRadius: 2,
              px: 3,
              py: 1.1,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Add your first field
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default EmptyBuilder;