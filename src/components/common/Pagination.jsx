import React from "react";
import { Pagination as MuiPagination, Box } from "@mui/material";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleChange = (event, value) => {
    onPageChange(value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        my: 4,
      }}
    >
      <MuiPagination
        count={totalPages > 500 ? 500 : totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
        showFirstButton
        showLastButton
        siblingCount={1}
      />
    </Box>
  );
};

export default Pagination;
