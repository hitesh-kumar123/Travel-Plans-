import React from 'react';
import { Modal, Box } from '@mui/material';

export default function BaseModal({ open, onClose, children }) {
  return (
    <Modal open={open} onClose={onClose} disableEscapeKeyDown>
      <Box sx={{ p: 4, bgcolor: 'background.paper' }}>{children}</Box>
    </Modal>
  );
}
