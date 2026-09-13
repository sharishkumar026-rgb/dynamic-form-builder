import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

interface AnalyticsSkeletonProps {
  statCards?: number;
  showChart?: boolean;
  showFilters?: boolean;
  chartHeight?: number;
}

const AnalyticsSkeleton = ({
  statCards = 4,
  showChart = true,
  showFilters = true,
  chartHeight = 320,
}: AnalyticsSkeletonProps) => {
  return (
    <Stack spacing={3} sx={{ width: "100%" }}>
      {showFilters && (
        <Card
          elevation={0}
          sx={{
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={56}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={56}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={56}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Skeleton
                  variant="rounded"
                  width="100%"
                  height={56}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={2.5}>
        {Array.from({ length: statCards }).map((_, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 3 }}
            key={index}
          >
            <Card
              elevation={0}
              sx={{
                width: "100%",
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Skeleton
                      variant="text"
                      width="45%"
                      height={24}
                    />

                    <Skeleton
                      variant="rounded"
                      width={42}
                      height={42}
                    />
                  </Stack>

                  <Skeleton
                    variant="text"
                    width="35%"
                    height={42}
                  />

                  <Skeleton
                    variant="text"
                    width="70%"
                    height={20}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {showChart && (
        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Card
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack spacing={0.75}>
                    <Skeleton
                      variant="text"
                      width="35%"
                      height={30}
                    />

                    <Skeleton
                      variant="text"
                      width="55%"
                      height={20}
                    />
                  </Stack>

                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height={chartHeight}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Card
              elevation={0}
              sx={{
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2.5}>
                  <Stack spacing={0.75}>
                    <Skeleton
                      variant="text"
                      width="55%"
                      height={30}
                    />

                    <Skeleton
                      variant="text"
                      width="75%"
                      height={20}
                    />
                  </Stack>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Skeleton
                      variant="circular"
                      width={190}
                      height={190}
                    />
                  </Box>

                  <Stack spacing={1}>
                    <Skeleton
                      variant="rounded"
                      width="100%"
                      height={28}
                    />

                    <Skeleton
                      variant="rounded"
                      width="90%"
                      height={28}
                    />

                    <Skeleton
                      variant="rounded"
                      width="80%"
                      height={28}
                    />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      <Card
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack spacing={0.75}>
              <Skeleton
                variant="text"
                width="25%"
                height={30}
              />

              <Skeleton
                variant="text"
                width="45%"
                height={20}
              />
            </Stack>

            {Array.from({ length: 5 }).map((_, index) => (
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                key={index}
              >
                <Skeleton
                  variant="circular"
                  width={36}
                  height={36}
                />

                <Skeleton
                  variant="text"
                  width="35%"
                  height={24}
                />

                <Box sx={{ flex: 1 }} />

                <Skeleton
                  variant="text"
                  width="12%"
                  height={24}
                />
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default AnalyticsSkeleton;