import React from "react";
import { CircularProgress, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const Loader = ({ message = "Loading content..." }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        gap: 2,
      }}
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <CircularProgress color="primary" size={50} thickness={4} />
      </motion.div>
      <Typography
        variant="body1"
        color="text.secondary"
        component={motion.p}
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;
