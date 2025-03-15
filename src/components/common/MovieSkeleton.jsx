import { Card, Skeleton, Box } from "@mui/material";

const MovieSkeleton = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <Skeleton
        variant="rectangular"
        sx={{
          width: "100%",
          aspectRatio: "2/3",
        }}
      />
      <Box sx={{ p: 2 }}>
        <Skeleton variant="text" width="80%" />
        <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Box>
    </Card>
  );
};

export default MovieSkeleton;
