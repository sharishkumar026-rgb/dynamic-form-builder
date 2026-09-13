import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Box from "@mui/material/Box";
import PaginationItem from "@mui/material/PaginationItem";
import MuiPagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  showItemCount?: boolean;
  disabled?: boolean;
}

const Pagination = ({
  page,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  showItemCount = false,
  disabled = false,
}: PaginationProps) => {
  if (totalPages <= 0) {
    return null;
  }

  const safePage = Math.min(Math.max(page, 1), totalPages);

  const startItem =
    totalItems && itemsPerPage
      ? (safePage - 1) * itemsPerPage + 1
      : 0;

  const endItem =
    totalItems && itemsPerPage
      ? Math.min(safePage * itemsPerPage, totalItems)
      : 0;

  return (
    <Box
      sx={{
        width: "100%",
        py: 2,
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        {showItemCount && totalItems !== undefined && itemsPerPage ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              whiteSpace: "nowrap",
            }}
          >
            Showing {startItem}–{endItem} of {totalItems}
          </Typography>
        ) : (
          <Box />
        )}

        <MuiPagination
          page={safePage}
          count={totalPages}
          disabled={disabled}
          onChange={(_, newPage) => onPageChange(newPage)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          renderItem={(item) => (
            <PaginationItem
              {...item}
              slots={{
                previous: ChevronLeftIcon,
                next: ChevronRightIcon,
              }}
            />
          )}
        />
      </Stack>
    </Box>
  );
};

export default Pagination;