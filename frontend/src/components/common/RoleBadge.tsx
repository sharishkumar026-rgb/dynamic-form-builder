import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface RoleBadgeProps {
  role: string;
  adminLabel?: string;
  userLabel?: string;
}

const RoleBadge = ({
  role,
  adminLabel = "Admin",
  userLabel = "User",
}: RoleBadgeProps) => {
  const normalizedRole = role.trim().toLowerCase();

  const isAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "administrator";

  const label = isAdmin ? adminLabel : userLabel;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        px: 1.25,
        py: 0.5,
        borderRadius: 10,
        backgroundColor: isAdmin
          ? "primary.light"
          : "action.hover",
        color: isAdmin
          ? "primary.dark"
          : "text.secondary",
        whiteSpace: "nowrap",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
      >
        {isAdmin ? (
          <AdminPanelSettingsOutlinedIcon
            sx={{
              fontSize: 16,
              color: "primary.main",
            }}
          />
        ) : (
          <PersonOutlineIcon
            sx={{
              fontSize: 16,
              color: "text.secondary",
            }}
          />
        )}

        <Typography
          component="span"
          variant="caption"
          sx={{
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
      </Stack>
    </Box>
  );
};

export default RoleBadge;