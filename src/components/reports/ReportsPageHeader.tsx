import React from 'react';
import { Box, Typography, Button, FormControl, Select, MenuItem, Tabs, Tab } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableViewIcon from '@mui/icons-material/TableView';
import { ReportTimeRange } from '../../types/report';
import { useReports } from './ReportsContext';

export const ReportsPageHeader: React.FC = () => {
  const { timeRange, setTimeRange, activeTab, setActiveTab, exportReportPDF, exportReportExcel } = useReports();

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top Title & Actions Row */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#2D1F24',
              fontFamily: '"Playfair Display", serif',
              fontSize: { xs: '1.5rem', sm: '1.85rem' },
            }}
          >
            Business Analytics & Financial Intelligence
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63', mt: 0.5 }}>
            Executive insights into revenue trends, profit margins, department yields, and staff productivity.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Time Range Selector */}
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as ReportTimeRange)}
              sx={{ borderRadius: '10px', bgcolor: '#FFFFFF', fontWeight: 700, color: '#6A3F4D' }}
            >
              <MenuItem value="This Week">This Week</MenuItem>
              <MenuItem value="This Month">This Month</MenuItem>
              <MenuItem value="Last Month">Last Month</MenuItem>
              <MenuItem value="This Quarter">This Quarter</MenuItem>
              <MenuItem value="FY 2025-26">FY 2025-26</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            startIcon={<TableViewIcon />}
            onClick={exportReportExcel}
            sx={{
              borderColor: '#A8828F',
              color: '#6A3F4D',
              fontWeight: 700,
              borderRadius: '10px',
              textTransform: 'none',
              px: 2,
              '&:hover': { bgcolor: '#F8F4EE', borderColor: '#6A3F4D' },
            }}
          >
            Excel Data
          </Button>

          <Button
            variant="contained"
            startIcon={<PictureAsPdfIcon />}
            onClick={exportReportPDF}
            sx={{
              bgcolor: '#6A3F4D',
              color: '#F8F4EE',
              fontWeight: 700,
              borderRadius: '10px',
              textTransform: 'none',
              px: 2.5,
              '&:hover': { bgcolor: '#4A2B35' },
            }}
          >
            Export Executive PDF
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#E8DFD5' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newTab) => setActiveTab(newTab)}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#6E5C63',
              mr: 2,
              '&.Mui-selected': {
                color: '#6A3F4D',
                fontWeight: 800,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6A3F4D',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab label="Financial & Profitability" />
          <Tab label="Service & Department Yield" />
          <Tab label="Staff Productivity & Commissions" />
          <Tab label="GST & Tax Statement" />
        </Tabs>
      </Box>
    </Box>
  );
};
