
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const DashboardSkeleton = () => {
  return (
    <Box sx={{ width: "100%" }}>
      <Stack spacing={3}>
        {/* Dashboard Header */}
        <Box>
          <Skeleton
            variant="text"
            width={220}
            height={40}
          />

          <Skeleton
            variant="text"
            width={320}
            height={24}
          />
        </Box>

        {/* Statistics Cards */}
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={2.5}
        >
          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Stack direction="row" spacing={2}>
              <Skeleton
                variant="rounded"
                width={48}
                height={48}
              />

              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" />
                <Skeleton
                  variant="text"
                  width="45%"
                  height={35}
                />
              </Box>
            </Stack>
          </Card>

          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Stack direction="row" spacing={2}>
              <Skeleton
                variant="rounded"
                width={48}
                height={48}
              />

              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" />
                <Skeleton
                  variant="text"
                  width="45%"
                  height={35}
                />
              </Box>
            </Stack>
          </Card>

          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Stack direction="row" spacing={2}>
              <Skeleton
                variant="rounded"
                width={48}
                height={48}
              />

              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" />
                <Skeleton
                  variant="text"
                  width="45%"
                  height={35}
                />
              </Box>
            </Stack>
          </Card>

          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Stack direction="row" spacing={2}>
              <Skeleton
                variant="rounded"
                width={48}
                height={48}
              />

              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="70%" />
                <Skeleton
                  variant="text"
                  width="45%"
                  height={35}
                />
              </Box>
            </Stack>
          </Card>
        </Stack>

        {/* Response Chart */}
        <Card
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          <Skeleton
            variant="text"
            width={220}
            height={32}
          />

          <Skeleton
            variant="text"
            width={300}
            height={22}
          />

          <Skeleton
            variant="rounded"
            width="100%"
            height={320}
            sx={{ mt: 2 }}
          />
        </Card>

        {/* Bottom Cards */}
        <Stack
          direction={{
            xs: "column",
            lg: "row",
          }}
          spacing={2.5}
        >
          {/* Most Used Forms */}
          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Skeleton
              variant="text"
              width={200}
              height={32}
            />

            <Skeleton
              variant="text"
              width={280}
              height={22}
            />

            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1.5}>
                <Skeleton
                  variant="rounded"
                  width={40}
                  height={40}
                />

                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="75%"
                  />

                  <Skeleton
                    variant="text"
                    width="45%"
                  />
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Skeleton
                  variant="rounded"
                  width={40}
                  height={40}
                />

                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="75%"
                  />

                  <Skeleton
                    variant="text"
                    width="45%"
                  />
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Skeleton
                  variant="rounded"
                  width={40}
                  height={40}
                />

                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="75%"
                  />

                  <Skeleton
                    variant="text"
                    width="45%"
                  />
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Skeleton
                  variant="rounded"
                  width={40}
                  height={40}
                />

                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="75%"
                  />

                  <Skeleton
                    variant="text"
                    width="45%"
                  />
                </Box>
              </Stack>
            </Stack>
          </Card>

          {/* Recent Responses */}
          <Card
            elevation={0}
            sx={{
              flex: 1,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              p: 2.5,
            }}
          >
            <Skeleton
              variant="text"
              width={200}
              height={32}
            />

            <Skeleton
              variant="text"
              width={280}
              height={22}
            />

            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <Stack direction="row" spacing={1.5}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                />

                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="70%"
                  />

                  <Skeleton
                    variant="text"
                    width="50%"
                  />
                </Box>

                <Skeleton
                  variant="rounded"
                  width={70}
                  height={24}
                />
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                />

                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="70%"
                  />

                  <Skeleton
                    variant="text"
                    width="50%"
                  />
                </Box>

                <Skeleton
                  variant="rounded"
                  width={70}
                  height={24}
                />
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                />

                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="70%"
                  />

                  <Skeleton
                    variant="text"
                    width="50%"
                  />
                </Box>

                <Skeleton
                  variant="rounded"
                  width={70}
                  height={24}
                />
              </Stack>

              <Stack direction="row" spacing={1.5}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                />

                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="70%"
                  />

                  <Skeleton
                    variant="text"
                    width="50%"
                  />
                </Box>

                <Skeleton
                  variant="rounded"
                  width={70}
                  height={24}
                />
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DashboardSkeleton;




