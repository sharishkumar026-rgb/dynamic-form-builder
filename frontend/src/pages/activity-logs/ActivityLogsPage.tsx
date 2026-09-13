import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import PageContainer from "../../components/layout/PageContainer";
import PageHeader from "../../components/common/PageHeader";

const ActivityLogsPage = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Activity Logs"
        subtitle="View and monitor system activity."
      />

      <Box
        sx={{
          mt: 3,
          p: 3,
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          backgroundColor: "background.paper",
        }}
      >
        <Typography variant="body1">
          Activity logs will appear here.
        </Typography>
      </Box>
    </PageContainer>
  );
};

export default ActivityLogsPage;