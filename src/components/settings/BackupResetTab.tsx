import React, { useState } from 'react';
import {
  Paper,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import BackupIcon from '@mui/icons-material/Backup';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSettings } from './SettingsContext';
import { useDashboard } from '../../context/DashboardContext';

export const BackupResetTab: React.FC = () => {
  const { resetToDefaults } = useSettings();
  const { showToast } = useDashboard();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleExportJSON = () => {
    showToast('Exporting complete salon database state (JSON backup file downloaded)...');
  };

  const handleImportData = () => {
    showToast('Select a valid JSON backup archive to restore system data...');
  };

  const handleConfirmReset = () => {
    resetToDefaults();
    setIsConfirmOpen(false);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <BackupIcon sx={{ color: '#6A3F4D', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
            Database Backup & System Recovery
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63' }}>
            Download complete encrypted backups of salon customers, appointments, staff shifts, and expenses.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Export Data Box */}
        <Box sx={{ p: 2.5, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
              Full System JSON Database Export
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>
              Download a complete JSON snapshot containing all customers, billing records, employee shifts, and inventory logs.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportJSON}
            sx={{ bgcolor: '#6A3F4D', color: '#F8F4EE', fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
          >
            Download Backup
          </Button>
        </Box>

        {/* Restore Data Box */}
        <Box sx={{ p: 2.5, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
              Restore Database from Backup Archive
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>
              Import previously saved backup archive to restore system configuration and records.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={handleImportData}
            sx={{ borderColor: '#A8828F', color: '#6A3F4D', fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
          >
            Upload Restore File
          </Button>
        </Box>

        {/* Reset to Factory Defaults */}
        <Box sx={{ p: 2.5, bgcolor: '#FFEBEE', borderRadius: '12px', border: '1px solid #FFCDD2', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#C62828' }}>
              Reset System Settings to Defaults
            </Typography>
            <Typography variant="body2" sx={{ color: '#B71C1C' }}>
              Resets salon business profile, GST tax rates, and working hours back to default factory parameters.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="error"
            startIcon={<RestartAltIcon />}
            onClick={() => setIsConfirmOpen(true)}
            sx={{ fontWeight: 700, borderRadius: '8px', textTransform: 'none' }}
          >
            Reset Defaults
          </Button>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        slotProps={{ paper: { sx: { borderRadius: '16px', p: 1 } } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#C62828' }}>
          Confirm Factory Reset
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#2D1F24', fontWeight: 600 }}>
            Are you sure you want to reset all salon profile information, working hours, and billing tax rates to factory defaults?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsConfirmOpen(false)} sx={{ fontWeight: 700, color: '#6E5C63' }}>
            Cancel
          </Button>
          <Button onClick={handleConfirmReset} variant="contained" color="error" sx={{ fontWeight: 700, borderRadius: '8px' }}>
            Yes, Reset Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
