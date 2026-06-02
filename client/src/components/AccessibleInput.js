import React from 'react';
import { TextField } from '@mui/material';

export default function AccessibleInput(props) {
  return <TextField {...props} inputProps={{ 'aria-label': props.label }} />;
}
