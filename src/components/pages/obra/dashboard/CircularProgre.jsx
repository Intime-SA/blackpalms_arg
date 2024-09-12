import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function CircularProgre() {
  return (
    <Box sx={{ width: "10px", height: "10px" }}>
      <CircularProgress size={10} />
    </Box>
  );
}
