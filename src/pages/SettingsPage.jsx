import ConnectionTest from "../components/ConnectionTest";
import { Container, Typography, Box } from "@mui/material";
const SettingsPage = () => {
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Settings
      </Typography>

      {/* other settings components */}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          System
        </Typography>
        <ConnectionTest />
      </Box>
    </Container>
  );
};

export default SettingsPage;
