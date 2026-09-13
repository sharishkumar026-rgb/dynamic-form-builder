import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  backAction?: ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

const PageHeader = ({
  title,
  subtitle,
  action,
  backAction,
  showBackButton = false,
  onBack,
}: PageHeaderProps) => {
  return (
    <Box
      sx={{
        width: "100%",
        mb: 3,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            minWidth: 0,
          }}
        >
          {showBackButton && onBack && (
            <IconButton
              onClick={onBack}
              size="small"
              aria-label="Go back"
            >
              <ArrowBackIcon />
            </IconButton>
          )}

          {backAction && <Box>{backAction}</Box>}

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                lineHeight: 1.2,
                wordBreak: "break-word",
              }}
            >
              {title}
            </Typography>

            {subtitle && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.75,
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        </Stack>

        {action && (
          <Box
            sx={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {action}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default PageHeader;