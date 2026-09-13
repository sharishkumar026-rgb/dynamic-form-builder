import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

import FieldPreview, {
  type FieldPreviewData,
} from "./FieldPreview";

interface BuilderPreviewProps {
  title?: string;
  description?: string;
  fields?: FieldPreviewData[];
  emptyMessage?: string;
  footer?: ReactNode;
}

const BuilderPreview = ({
  title = "Form Preview",
  description,
  fields = [],
  emptyMessage = "No fields have been added to this form yet.",
  footer,
}: BuilderPreviewProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        backgroundColor: "grey.50",
        py: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        px: {
          xs: 1,
          sm: 2,
          md: 3,
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 760,
          mx: "auto",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "background.paper",
          }}
        >
          <Box
            sx={{
              px: {
                xs: 2,
                sm: 3,
                md: 4,
              },
              py: {
                xs: 2.5,
                sm: 3,
              },
            }}
          >
            <Stack spacing={1.5}>
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
              >
                <VisibilityOutlinedIcon
                  color="primary"
                  fontSize="small"
                />

                <Chip
                  label="Preview"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Typography
                variant="h5"
                component="h1"
                fontWeight={700}
                sx={{
                  wordBreak: "break-word",
                }}
              >
                {title}
              </Typography>

              {description && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {description}
                </Typography>
              )}
            </Stack>
          </Box>

          <Divider />

          <Box
            sx={{
              px: {
                xs: 2,
                sm: 3,
                md: 4,
              },
              py: {
                xs: 2.5,
                sm: 3,
              },
            }}
          >
            {fields.length === 0 ? (
              <Box
                sx={{
                  minHeight: 220,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  border: 1,
                  borderStyle: "dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                  px: 3,
                }}
              >
                <Stack spacing={1}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                  >
                    No fields to preview
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    {emptyMessage}
                  </Typography>
                </Stack>
              </Box>
            ) : (
              <Stack spacing={3}>
                {fields.map((field) => (
                  <Box key={String(field.id)}>
                    <FieldPreview
                      field={field}
                      disabled
                      showTypeIcon
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {footer && (
            <>
              <Divider />

              <Box
                sx={{
                  px: {
                    xs: 2,
                    sm: 3,
                    md: 4,
                  },
                  py: 2,
                }}
              >
                {footer}
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default BuilderPreview;