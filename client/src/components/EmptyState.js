import React from 'react';
import { Typography, Box } from '@mui/material';

export default function EmptyState({ message }) {
  return (
    <Box textAlign='center' mt={5}>
      <Typography variant='h6' color='textSecondary'>{message}</Typography>
    </Box>
  );
}
