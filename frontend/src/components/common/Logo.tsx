import DescriptionIcon from "@mui/icons-material/Description";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface LogoProps {
  collapsed?: boolean;
  showText?: boolean;
}

const Logo = ({
  collapsed = false,
  showText = true,
}: LogoProps) => {
  const hideText = collapsed || !showText;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <DescriptionIcon fontSize="medium" />
      </Box>

      {!hideText && (
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            noWrap
            sx={{
              lineHeight: 1.2,
              fontWeight: 700,
            }}
          >
            Dynamic Forms
          </Typography>

          <Typography
            variant="caption"
            noWrap
            sx={{
              lineHeight: 1.2,
              color: "text.secondary",
            }}
          >
            Form Builder
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default Logo;