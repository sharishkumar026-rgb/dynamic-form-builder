import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Box from "@mui/material/Box";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  maxItems?: number;
}

const Breadcrumbs = ({
  items,
  maxItems = 4,
}: BreadcrumbsProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        mb: 2,
      }}
    >
      <MuiBreadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        maxItems={maxItems}
        aria-label="breadcrumb"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          if (isLast) {
            return (
              <Typography
                key={`${item.label}-${index}`}
                variant="body2"
                color="text.primary"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontWeight: 600,
                }}
              >
                {item.icon}
                {item.label}
              </Typography>
            );
          }

          return (
            <Link
              key={`${item.label}-${index}`}
              href={item.href}
              onClick={item.onClick}
              underline="hover"
              color="text.secondary"
              variant="body2"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;