import React, { useRef } from 'react';
import { Box, Typography, Button } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useCustomers } from '../../context/CustomerContext';

export const PageHeader: React.FC = () => {
  const { setIsCustomerFormOpen, setCustomerToEdit, exportCSV, importCustomersCSV } = useCustomers();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateNew = () => {
    setCustomerToEdit(null);
    setIsCustomerFormOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) importCustomersCSV(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        mb: 3,
        p: 2.5,
        bgcolor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E8DFD5',
        boxShadow: '0 4px 20px rgba(107, 79, 58, 0.04)',
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#2D1F24',
            fontFamily: '"Inter", sans-serif',
            fontSize: { xs: '1.5rem', md: '1.85rem' },
            letterSpacing: '-0.02em',
          }}
        >
          Customers
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5C63', mt: 0.3 }}>
          Manage customer profiles, memberships, loyalty points, and visit history.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept=".csv"
          onChange={handleFileUpload}
        />
        <Button
          variant="outlined"
          startIcon={<FileUploadIcon />}
          onClick={() => fileInputRef.current?.click()}
          sx={{
            borderColor: '#A8828F',
            color: '#6A3F4D',
            fontWeight: 700,
            borderRadius: '10px',
            bgcolor: '#F8F4EE',
            '&:hover': {
              borderColor: '#6A3F4D',
              bgcolor: '#F8F4EE',
            },
          }}
        >
          Import Customers
        </Button>

        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={exportCSV}
          sx={{
            borderColor: '#A8828F',
            color: '#6A3F4D',
            fontWeight: 700,
            borderRadius: '10px',
            bgcolor: '#F8F4EE',
            '&:hover': {
              borderColor: '#6A3F4D',
              bgcolor: '#F8F4EE',
            },
          }}
        >
          Export CSV
        </Button>

        <Button
          variant="contained"
          startIcon={<PersonAddAlt1Icon />}
          onClick={handleCreateNew}
          sx={{
            bgcolor: '#6A3F4D',
            color: '#FFFFFF',
            fontWeight: 700,
            borderRadius: '10px',
            px: 2.5,
            boxShadow: '0 4px 12px rgba(107, 79, 58, 0.2)',
            '&:hover': {
              bgcolor: '#4A2B35',
            },
          }}
        >
          + New Customer
        </Button>
      </Box>
    </Box>
  );
};
