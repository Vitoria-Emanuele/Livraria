import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface ModalFormProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ModalForm({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm'
}: ModalFormProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box 
        sx={{ 
          ...modalStyle,
          maxWidth: {
            xs: 300,
            sm: 500,
            md: 700,
            lg: 900,
            xl: 1200
          }[maxWidth]
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          <Typography id="modal-title" variant="h6" component="h2">
            {title}
          </Typography>
          
          <IconButton 
            onClick={onClose} 
            aria-label="fechar"
            size="small"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box>
          {children}
        </Box>
      </Box>
    </Modal>
  );
}