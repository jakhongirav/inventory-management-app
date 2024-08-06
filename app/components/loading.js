import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

export function Loading() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}