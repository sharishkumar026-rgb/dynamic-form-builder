
import Grid from "@mui/material/Grid";
import type { ReactNode } from "react";

interface StatsGridProps {
  children: ReactNode;
}

const StatsGrid = ({ children }: StatsGridProps) => {
  return (
    <Grid
      container
      spacing={2.5}
      sx={{
        width: "100%",
        mb: 3,
      }}
    >
      {children}
    </Grid>
  );
};

export default StatsGrid;

