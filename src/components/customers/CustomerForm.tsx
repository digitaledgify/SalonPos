import React, { useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton,
  Divider,
  Avatar,
  FormHelperText,
  useTheme,
  useMediaQuery,
  Chip,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCustomers } from '../../context/CustomerContext';
import { MembershipTier, Gender } from '../../types/customer';

const customerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Invalid email address').or(z.literal('')),
  dob: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Female', 'Male', 'Non-Binary', 'Other']),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  occupation: z.string().optional(),
  preferredStylist: z.string().optional(),
  preferredServices: z.array(z.string()),
  skinType: z.string().optional(),
  hairType: z.string().optional(),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  specialNotes: z.string().optional(),
  referralSource: z.string().optional(),
  membershipTier: z.enum(['Normal', 'Silver', 'Gold', 'Platinum']),
  photoUrl: z.string().optional(),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export const CustomerForm: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    isCustomerFormOpen,
    setIsCustomerFormOpen,
    customerToEdit,
    addCustomer,
    updateCustomer,
    checkPhoneExists,
    showCustomerToast,
  } = useCustomers();

  const stylists = ['Aarav Kapoor', 'Pooja Sharma', 'Rohan Verma', 'Karan Malhotra', 'Ananya Roy', 'Vikram Singh'];
  const servicesList = [
    'Hair Cut & Styling',
    'Hair Spa & Keratin',
    'Hydra Facial Glow',
    'Balayage / Hair Color',
    'Beard Grooming & Shave',
    'Pedicure & Manicure',
    'Bridal Makeup',
    'Detox Face Mask',
  ];

  const defaultValues: CustomerFormData = {
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    dob: '1995-01-01',
    gender: 'Female',
    address: '',
    emergencyContact: '',
    occupation: '',
    preferredStylist: 'Aarav Kapoor',
    preferredServices: ['Hair Cut & Styling'],
    skinType: 'Normal',
    hairType: 'Straight Wavy',
    allergies: '',
    medicalConditions: '',
    specialNotes: '',
    referralSource: 'Walk-in',
    membershipTier: 'Normal',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
  };

  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  const watchPhotoUrl = watch('photoUrl');

  useEffect(() => {
    if (customerToEdit) {
      reset({
        firstName: customerToEdit.firstName,
        lastName: customerToEdit.lastName,
        phone: customerToEdit.phone,
        email: customerToEdit.email,
        dob: customerToEdit.dob,
        gender: customerToEdit.gender,
        address: customerToEdit.address,
        emergencyContact: customerToEdit.emergencyContact,
        occupation: customerToEdit.occupation,
        preferredStylist: customerToEdit.preferredStylist,
        preferredServices: customerToEdit.preferredServices || [],
        skinType: customerToEdit.skinType,
        hairType: customerToEdit.hairType,
        allergies: customerToEdit.medicalInfo?.allergies?.join(', ') || '',
        medicalConditions: customerToEdit.medicalInfo?.medicalConditions?.join(', ') || '',
        specialNotes: customerToEdit.medicalInfo?.specialInstructions || '',
        referralSource: customerToEdit.referralSource,
        membershipTier: customerToEdit.membership.tier,
        photoUrl: customerToEdit.photoUrl,
      });
    } else {
      reset(defaultValues);
    }
  }, [customerToEdit, isCustomerFormOpen, reset]);

  const handleClose = () => {
    setIsCustomerFormOpen(false);
  };

  const onSubmit: SubmitHandler<CustomerFormData> = (data) => {
    // Check duplicate phone
    if (checkPhoneExists(data.phone, customerToEdit?.id)) {
      setError('phone', { type: 'manual', message: 'A customer with this phone number already exists!' });
      return;
    }

    const medicalInfo = {
      allergies: data.allergies ? data.allergies.split(',').map((s) => s.trim()) : [],
      skinSensitivity: data.skinType || 'Normal',
      hairConcerns: [data.hairType || 'General Hair Care'],
      chemicalHistory: 'Logged via registration form',
      medicalConditions: data.medicalConditions ? data.medicalConditions.split(',').map((s) => s.trim()) : [],
      specialInstructions: data.specialNotes || '',
    };

    if (customerToEdit) {
      updateCustomer(customerToEdit.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        dob: data.dob,
        gender: data.gender as Gender,
        address: data.address,
        emergencyContact: data.emergencyContact,
        occupation: data.occupation,
        preferredStylist: data.preferredStylist,
        preferredServices: data.preferredServices,
        skinType: data.skinType,
        hairType: data.hairType,
        referralSource: data.referralSource,
        photoUrl: data.photoUrl,
        membership: {
          ...customerToEdit.membership,
          tier: data.membershipTier as MembershipTier,
        },
        medicalInfo,
      });
    } else {
      const result = addCustomer({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        email: data.email,
        dob: data.dob,
        gender: data.gender as Gender,
        address: data.address,
        emergencyContact: data.emergencyContact,
        occupation: data.occupation,
        preferredStylist: data.preferredStylist,
        preferredServices: data.preferredServices,
        skinType: data.skinType,
        hairType: data.hairType,
        referralSource: data.referralSource,
        photoUrl: data.photoUrl,
        membership: {
          tier: data.membershipTier as MembershipTier,
          joiningDate: new Date().toISOString().split('T')[0],
          renewalDate: '2027-12-31',
          discountPercent: data.membershipTier === 'Platinum' ? 25 : data.membershipTier === 'Gold' ? 15 : data.membershipTier === 'Silver' ? 10 : 0,
          benefits: ['Standard Benefits'],
        },
        medicalInfo,
      });

      if (!result.success && result.error) {
        setError('phone', { type: 'manual', message: result.error });
        return;
      }
    }

    handleClose();
  };

  return (
    <Drawer
      anchor="right"
      open={isCustomerFormOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: isMobile ? '100vw' : { sm: 580, md: 680 },
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: '#6A3F4D',
                color: '#EBD9DF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PersonAddIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
                {customerToEdit ? `Edit Profile — ${customerToEdit.fullName}` : 'New Customer Registration'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                Fields marked with * are mandatory
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Drawer Body Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ flexGrow: 1, overflowY: 'auto', p: 3 }}
        >
          {/* Photo Avatar Upload Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3.5, p: 2, bgcolor: '#FFFFFF', borderRadius: '14px', border: '1px solid #E8DFD5' }}>
            <Avatar src={watchPhotoUrl} sx={{ width: 72, height: 72, border: '2px solid #6A3F4D' }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24', mb: 0.5 }}>
                Customer Photo Avatar
              </Typography>
              <Controller
                name="photoUrl"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Image URL (Unsplash or uploaded link)"
                    sx={{ bgcolor: '#F8F4EE' }}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Section 1: Basic Information */}
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#6A3F4D', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5, display: 'block' }}>
            1. Basic Personal Information
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="firstName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="First Name *"
                    error={Boolean(errors.firstName)}
                    helperText={errors.firstName?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Last Name *"
                    error={Boolean(errors.lastName)}
                    helperText={errors.lastName?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    label="Phone Number *"
                    placeholder="+91 98765 43210"
                    error={Boolean(errors.phone)}
                    helperText={errors.phone?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email Address"
                    placeholder="name@example.com"
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    required
                    type="date"
                    label="Date of Birth *"
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={Boolean(errors.dob)}
                    helperText={errors.dob?.message}
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Gender *"
                    size="small"
                  >
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Non-Binary">Non-Binary</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Full Residential Address"
                    placeholder="Street, Locality, City, Pincode"
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="emergencyContact"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Emergency Contact"
                    placeholder="+91 Phone number"
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="occupation"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Occupation / Profession"
                    placeholder="e.g. Software Engineer"
                    size="small"
                  />
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2.5, borderColor: '#E8DFD5' }} />

          {/* Section 2: Membership & Preferences */}
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#6A3F4D', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5, display: 'block' }}>
            2. Membership Tier & Styling Preferences
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="membershipTier"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Membership Tier"
                    size="small"
                  >
                    <MenuItem value="Normal">Normal Member (0% Disc)</MenuItem>
                    <MenuItem value="Silver">Silver Tier (10% Disc)</MenuItem>
                    <MenuItem value="Gold">Gold Tier (15% Disc)</MenuItem>
                    <MenuItem value="Platinum">Platinum VIP (25% Disc)</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="preferredStylist"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Preferred Stylist"
                    size="small"
                  >
                    {stylists.map((s) => (
                      <MenuItem key={s} value={s}>{s}</MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Preferred Services</InputLabel>
                <Controller
                  name="preferredServices"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      input={<OutlinedInput label="Preferred Services" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
                        </Box>
                      )}
                    >
                      {servicesList.map((s) => (
                        <MenuItem key={s} value={s}>{s}</MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="skinType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Skin Type"
                    size="small"
                  >
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="Oily">Oily</MenuItem>
                    <MenuItem value="Dry">Dry</MenuItem>
                    <MenuItem value="Combination">Combination</MenuItem>
                    <MenuItem value="Sensitive">Sensitive</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="hairType"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Hair Texture & Type"
                    size="small"
                  >
                    <MenuItem value="Straight Wavy">Straight Wavy</MenuItem>
                    <MenuItem value="Curly / Frizzy">Curly / Frizzy</MenuItem>
                    <MenuItem value="Thin Straight">Thin Straight</MenuItem>
                    <MenuItem value="Thick Coarse">Thick Coarse</MenuItem>
                    <MenuItem value="Color Treated">Color Treated</MenuItem>
                  </TextField>
                )}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2.5, borderColor: '#E8DFD5' }} />

          {/* Section 3: Medical & Sensitivity */}
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#6A3F4D', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5, display: 'block' }}>
            3. Medical History, Allergies & Notes
          </Typography>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="allergies"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Allergies (comma separated)"
                    placeholder="e.g. Ammonia, Bleach, Wax"
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="medicalConditions"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Medical Conditions"
                    placeholder="e.g. Mild Asthma, Scalp psoriasis"
                    size="small"
                  />
                )}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Controller
                name="referralSource"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="How did you hear about us?"
                    size="small"
                  >
                    <MenuItem value="Walk-in">Walk-in</MenuItem>
                    <MenuItem value="Friend Referral">Friend Referral</MenuItem>
                    <MenuItem value="Instagram">Instagram</MenuItem>
                    <MenuItem value="Google Search">Google Search</MenuItem>
                    <MenuItem value="Flyer">Flyer / Banner</MenuItem>
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="specialNotes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    rows={2}
                    label="Special Instructions / Staff Notes"
                    placeholder="e.g. Prefers herbal tea, test patch required..."
                    size="small"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Drawer Actions Footer */}
        <Box
          sx={{
            p: 2.5,
            bgcolor: '#FFFFFF',
            borderTop: '1px solid #E8DFD5',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Button
            variant="outlined"
            startIcon={<RestartAltIcon />}
            onClick={() => reset(defaultValues)}
            sx={{ borderColor: '#E8DFD5', color: '#6E5C63' }}
          >
            Reset
          </Button>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" onClick={handleClose} sx={{ borderColor: '#E8DFD5', color: '#2D1F24' }}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              startIcon={<SaveIcon />}
              sx={{ bgcolor: '#6A3F4D', color: '#FFFFFF', fontWeight: 700, px: 3, '&:hover': { bgcolor: '#4A2B35' } }}
            >
              {customerToEdit ? 'Update Profile' : 'Save Customer'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
