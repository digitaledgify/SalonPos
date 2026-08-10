import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Paper,
  Grid,
  Tabs,
  Tab,
  Button,
  Chip,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CollectionsIcon from '@mui/icons-material/Collections';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import EditIcon from '@mui/icons-material/Edit';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useCustomers } from '../../context/CustomerContext';
import { MembershipBadge } from './MembershipBadge';
import { LoyaltyCard } from './LoyaltyCard';
import { VisitHistory } from './VisitHistory';
import { CustomerNotes } from './CustomerNotes';
import { PhotoGallery } from './PhotoGallery';
import { QuickActions } from './QuickActions';
import { Analytics } from './Analytics';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ py: 2.5 }}>{children}</Box>}
    </div>
  );
}

export const CustomerProfile: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { selectedCustomer, setSelectedCustomer, setIsCustomerFormOpen, setCustomerToEdit } = useCustomers();
  const [tabValue, setTabValue] = useState(0);

  if (!selectedCustomer) return null;

  const handleClose = () => {
    setSelectedCustomer(null);
  };

  const handleEditClick = () => {
    setCustomerToEdit(selectedCustomer);
    setIsCustomerFormOpen(true);
  };

  return (
    <Drawer
      anchor="right"
      open={Boolean(selectedCustomer)}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: isMobile ? '100vw' : { sm: '85vw', md: 840, lg: 960 },
            maxWidth: '100vw',
            bgcolor: '#F8F4EE',
          },
        },
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Drawer Header */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: '#FFFFFF',
            borderBottom: '1px solid #E8DFD5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={selectedCustomer.photoUrl}
              alt={selectedCustomer.fullName}
              sx={{ width: 56, height: 56, border: '2px solid #6A3F4D' }}
            />
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
                  {selectedCustomer.fullName}
                </Typography>
                <MembershipBadge tier={selectedCustomer.membership.tier} size="medium" />
              </Box>
              <Typography variant="body2" sx={{ color: '#6E5C63', mt: 0.3 }}>
                Customer ID: <strong style={{ color: '#6A3F4D' }}>{selectedCustomer.id}</strong> • Joined {selectedCustomer.createdAt}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEditClick}
              sx={{ borderColor: '#A8828F', color: '#6A3F4D', fontWeight: 700, borderRadius: '8px' }}
            >
              Edit Profile
            </Button>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Quick Actions Panel Bar */}
        <Box sx={{ p: 2, bgcolor: '#F8F4EE', borderBottom: '1px solid #E8DFD5' }}>
          <QuickActions customer={selectedCustomer} />
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E8DFD5', px: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(_, val) => setTabValue(val)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.88rem',
                color: '#6E5C63',
                py: 1.8,
                '&.Mui-selected': { color: '#6A3F4D' },
              },
              '& .MuiTabs-indicator': { bgcolor: '#6A3F4D', height: 3 },
            }}
          >
            <Tab icon={<PersonIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Overview & Info" />
            <Tab icon={<WorkspacePremiumIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Membership & Loyalty" />
            <Tab icon={<ReceiptLongIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Visits & Invoices (${selectedCustomer.visits.length})`} />
            <Tab icon={<NoteAltIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Staff Notes (${selectedCustomer.notes.length})`} />
            <Tab icon={<CollectionsIcon sx={{ fontSize: 18 }} />} iconPosition="start" label={`Gallery (${selectedCustomer.photos.length})`} />
            <Tab icon={<HealthAndSafetyIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Medical & Hair/Skin" />
            <Tab icon={<BarChartIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Analytics" />
          </Tabs>
        </Box>

        {/* Scrollable Content Body */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}>
          {/* TAB 0: OVERVIEW & BASIC INFO */}
          <CustomTabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Basic Info Card */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', textTransform: 'uppercase', mb: 2 }}>
                    Basic Customer Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>Phone Number</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>{selectedCustomer.phone}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>Email Address</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>{selectedCustomer.email}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>Date of Birth</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                        {selectedCustomer.dob} ({selectedCustomer.birthdayFormatted})
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>Gender</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>{selectedCustomer.gender}</Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>Residential Address</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>{selectedCustomer.address}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>Emergency Contact</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>{selectedCustomer.emergencyContact || 'Not provided'}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>Occupation</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>{selectedCustomer.occupation}</Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>Referral Source</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>{selectedCustomer.referralSource}</Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Preferences Card */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', mt: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', textTransform: 'uppercase', mb: 2 }}>
                    Preferences & Favourites
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>Favourite Stylist</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                        ✂️ {selectedCustomer.preferredStylist}
                      </Typography>
                    </Grid>
                    <Grid size={6}>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>Skin Type</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>{selectedCustomer.skinType}</Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block', mb: 0.5 }}>Favourite Services</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                        {selectedCustomer.preferredServices.map((srv, idx) => (
                          <Chip key={idx} label={srv} size="small" sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 700, border: '1px solid #E8DFD5' }} />
                        ))}
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Stats & Membership Summary Column */}
              <Grid size={{ xs: 12, md: 5 }}>
                {/* Stats Summary */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#6A3F4D', color: '#FFFFFF', mb: 3 }}>
                  <Typography variant="caption" sx={{ color: '#EBD9DF', fontWeight: 700, textTransform: 'uppercase' }}>
                    Lifetime Financial Summary
                  </Typography>
                  <Typography variant="h3" sx={{ fontWeight: 800, fontFamily: '"Poppins", sans-serif', my: 1, color: '#EBD9DF' }}>
                    ₹{selectedCustomer.lifetimeSpend.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Total Visits</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedCustomer.visitsCount}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Loyalty Points</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, color: '#EBD9DF' }}>{selectedCustomer.loyalty.availablePoints}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Last Visit</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>{selectedCustomer.lastVisitDate}</Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Membership Card Preview */}
                <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                      Membership Benefits
                    </Typography>
                    <MembershipBadge tier={selectedCustomer.membership.tier} />
                  </Box>
                  <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block', mb: 1.5 }}>
                    Renewal Date: <strong>{selectedCustomer.membership.renewalDate}</strong> ({selectedCustomer.membership.discountPercent}% Discount)
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                    {selectedCustomer.membership.benefits.map((b, idx) => (
                      <Typography key={idx} variant="caption" sx={{ color: '#2D1F24', fontWeight: 600 }}>
                        ✓ {b}
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CustomTabPanel>

          {/* TAB 1: MEMBERSHIP & LOYALTY */}
          <CustomTabPanel value={tabValue} index={1}>
            <Box sx={{ mb: 3 }}>
              <LoyaltyCard customer={selectedCustomer} />
            </Box>

            {/* Membership Details Card */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WorkspacePremiumIcon sx={{ color: '#6A3F4D', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
                    Membership Details — {selectedCustomer.membership.tier} Tier
                  </Typography>
                </Box>
                <MembershipBadge tier={selectedCustomer.membership.tier} size="medium" />
              </Box>

              <Grid container spacing={2} sx={{ my: 1 }}>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" sx={{ color: '#6E5C63' }}>Joining Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{selectedCustomer.membership.joiningDate}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" sx={{ color: '#6E5C63' }}>Renewal Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#D32F2F' }}>{selectedCustomer.membership.renewalDate}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" sx={{ color: '#6E5C63' }}>Service Discount</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                    {selectedCustomer.membership.discountPercent}% OFF
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" sx={{ color: '#6E5C63' }}>Status</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#2E7D32' }}>Active</Typography>
                </Grid>
              </Grid>
            </Paper>
          </CustomTabPanel>

          {/* TAB 2: VISIT HISTORY */}
          <CustomTabPanel value={tabValue} index={2}>
            <VisitHistory visits={selectedCustomer.visits} />
          </CustomTabPanel>

          {/* TAB 3: STAFF NOTES */}
          <CustomTabPanel value={tabValue} index={3}>
            <CustomerNotes customerId={selectedCustomer.id} notes={selectedCustomer.notes} />
          </CustomTabPanel>

          {/* TAB 4: PHOTO GALLERY */}
          <CustomTabPanel value={tabValue} index={4}>
            <PhotoGallery customerId={selectedCustomer.id} photos={selectedCustomer.photos} />
          </CustomTabPanel>

          {/* TAB 5: MEDICAL & HAIR/SKIN CONCERNS */}
          <CustomTabPanel value={tabValue} index={5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <HealthAndSafetyIcon sx={{ color: '#D32F2F', fontSize: 26 }} />
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
                  Medical Profile & Scalp/Skin Health
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
                    Allergies & Sensitivities
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1 }}>
                    {selectedCustomer.medicalInfo.allergies.map((alg, idx) => (
                      <Chip key={idx} label={alg} size="small" color="error" sx={{ fontWeight: 700 }} />
                    ))}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
                    Skin Sensitivity
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24', mt: 1 }}>
                    {selectedCustomer.medicalInfo.skinSensitivity}
                  </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
                    Hair Texture & Concerns
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1 }}>
                    {selectedCustomer.medicalInfo.hairConcerns.map((hc, idx) => (
                      <Chip key={idx} label={hc} size="small" sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', border: '1px solid #E8DFD5' }} />
                    ))}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
                    Chemical History
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24', mt: 1 }}>
                    {selectedCustomer.medicalInfo.chemicalHistory}
                  </Typography>
                </Grid>

                <Grid size={12}>
                  <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
                    Special Instructions
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#6A3F4D', mt: 1, bgcolor: '#F8F4EE', p: 2, borderRadius: '10px', border: '1px solid #E8DFD5' }}>
                    {selectedCustomer.medicalInfo.specialInstructions || 'No specific medical instructions provided.'}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </CustomTabPanel>

          {/* TAB 6: ANALYTICS */}
          <CustomTabPanel value={tabValue} index={6}>
            <Analytics customer={selectedCustomer} />
          </CustomTabPanel>
        </Box>
      </Box>
    </Drawer>
  );
};
