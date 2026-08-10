import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
  FormControlLabel,
  Switch,
  Divider,
  Grid,
  Paper,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { useServices } from '../../context/ServiceContext';
import { ServiceCategory, ServiceGender, ServiceStatus, ServiceConsumable } from '../../types/service';

const CATEGORIES: ServiceCategory[] = [
  'Hair Care & Cut',
  'Skin & Facials',
  'Beard & Grooming',
  'Nails & Beauty',
  'Spa & Relaxation',
  'Makeup & Bridal',
  'Combo Packages',
];

const STYLIST_ROLES = [
  'Master Senior Stylist',
  'Senior Colorist & Spa Expert',
  'Grooming & Barber Lead',
  'Aesthetician & Makeup Artist',
  'Hair Specialist',
  'Nail & Spa Technician',
];

export const ServiceFormModal: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    isServiceFormOpen,
    setIsServiceFormOpen,
    serviceToEdit,
    setServiceToEdit,
    addService,
    updateService,
  } = useServices();

  const [name, setName] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [category, setCategory] = useState<ServiceCategory>('Hair Care & Cut');
  const [genderTarget, setGenderTarget] = useState<ServiceGender>('Unisex');
  const [basePrice, setBasePrice] = useState<number>(1200);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [memberDiscountPercent, setMemberDiscountPercent] = useState<number>(15);
  const [description, setDescription] = useState<string>('');
  const [recommendedStylistRole, setRecommendedStylistRole] = useState<string>('Master Senior Stylist');
  const [status, setStatus] = useState<ServiceStatus>('Active');
  const [isPopular, setIsPopular] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [consumables, setConsumables] = useState<ServiceConsumable[]>([]);

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (serviceToEdit) {
      setName(serviceToEdit.name);
      setCode(serviceToEdit.code);
      setCategory(serviceToEdit.category);
      setGenderTarget(serviceToEdit.genderTarget);
      setBasePrice(serviceToEdit.basePrice);
      setDurationMinutes(serviceToEdit.durationMinutes);
      setMemberDiscountPercent(serviceToEdit.memberDiscountPercent);
      setDescription(serviceToEdit.description);
      setRecommendedStylistRole(serviceToEdit.recommendedStylistRole);
      setStatus(serviceToEdit.status);
      setIsPopular(serviceToEdit.isPopular);
      setImageUrl(serviceToEdit.imageUrl || '');
      setConsumables(serviceToEdit.requiredConsumables || []);
    } else {
      // Defaults for new service
      setName('');
      setCode(`SRV-${Math.floor(100 + Math.random() * 900)}`);
      setCategory('Hair Care & Cut');
      setGenderTarget('Unisex');
      setBasePrice(1500);
      setDurationMinutes(45);
      setMemberDiscountPercent(15);
      setDescription('');
      setRecommendedStylistRole('Master Senior Stylist');
      setStatus('Active');
      setIsPopular(false);
      setImageUrl('');
      setConsumables([
        { itemName: 'Argan Oil Serum 100ml', qtyPerSession: '2 pumps' },
      ]);
    }
    setErrors({});
  }, [serviceToEdit, isServiceFormOpen]);

  const handleClose = () => {
    setIsServiceFormOpen(false);
    setServiceToEdit(null);
  };

  const handleAddConsumable = () => {
    setConsumables((prev) => [...prev, { itemName: '', qtyPerSession: '1 unit' }]);
  };

  const handleRemoveConsumable = (idx: number) => {
    setConsumables((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleConsumableChange = (idx: number, field: 'itemName' | 'qtyPerSession', val: string) => {
    setConsumables((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Service name is required';
    if (!code.trim()) errs.code = 'Service code is required';
    if (basePrice <= 0) errs.basePrice = 'Base price must be greater than 0';
    if (durationMinutes <= 0) errs.durationMinutes = 'Duration must be at least 1 minute';
    if (!description.trim()) errs.description = 'Description is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const validConsumables = consumables.filter((c) => c.itemName.trim() !== '');

    const payload = {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      category,
      genderTarget,
      basePrice: Number(basePrice),
      durationMinutes: Number(durationMinutes),
      memberDiscountPercent: Number(memberDiscountPercent),
      description: description.trim(),
      recommendedStylistRole,
      status,
      isPopular,
      requiredConsumables: validConsumables,
      imageUrl: imageUrl.trim() || undefined,
    };

    if (serviceToEdit) {
      updateService(serviceToEdit.id, payload);
    } else {
      addService(payload);
    }

    handleClose();
  };

  return (
    <Drawer
      anchor="right"
      open={isServiceFormOpen}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: isMobile ? '100vw' : { sm: 560, md: 660 },
            maxWidth: '100vw',
            bgcolor: '#F8F4EE',
          },
        },
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Top Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: '#6A3F4D',
                color: '#EBD9DF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ContentCutIcon sx={{ fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
                {serviceToEdit ? 'Edit Service Specification' : 'Add New Salon Service'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                Define treatment pricing, duration, consumables, and recommended stylist.
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: '#6A3F4D' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3, borderColor: '#E8DFD5' }} />

        {/* Scrollable Form Body */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
          <Grid container spacing={2}>
            {/* Service Name */}
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                fullWidth
                label="Service Name *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={Boolean(errors.name)}
                helperText={errors.name}
                size="small"
                placeholder="e.g. Keratin Deep Nourishing Spa"
              />
            </Grid>

            {/* Service Code */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Service Code *"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                error={Boolean(errors.code)}
                helperText={errors.code}
                size="small"
                placeholder="e.g. HC-101"
              />
            </Grid>

            {/* Category */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Category *"
                value={category}
                onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                size="small"
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Target Gender */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Target Gender *"
                value={genderTarget}
                onChange={(e) => setGenderTarget(e.target.value as ServiceGender)}
                size="small"
              >
                <MenuItem value="Unisex">✨ Unisex (All Customers)</MenuItem>
                <MenuItem value="Female">👩 Women Only</MenuItem>
                <MenuItem value="Male">👨 Men Only</MenuItem>
              </TextField>
            </Grid>

            {/* Base Price */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Base Price (₹) *"
                value={basePrice}
                onChange={(e) => setBasePrice(Number(e.target.value))}
                error={Boolean(errors.basePrice)}
                helperText={errors.basePrice}
                size="small"
              />
            </Grid>

            {/* Duration Minutes */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Duration (Minutes) *"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                error={Boolean(errors.durationMinutes)}
                helperText={errors.durationMinutes}
                size="small"
              />
            </Grid>

            {/* Member Discount Percent */}
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Member Discount (%)"
                value={memberDiscountPercent}
                onChange={(e) => setMemberDiscountPercent(Number(e.target.value))}
                size="small"
              />
            </Grid>

            {/* Description */}
            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Service Protocol & Description *"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={Boolean(errors.description)}
                helperText={errors.description}
                placeholder="Provide a detailed explanation of treatment steps, products used, and benefits..."
                size="small"
              />
            </Grid>

            {/* Recommended Stylist Role */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Recommended Stylist Role"
                value={recommendedStylistRole}
                onChange={(e) => setRecommendedStylistRole(e.target.value)}
                size="small"
              >
                {STYLIST_ROLES.map((r) => (
                  <MenuItem key={r} value={r}>
                    {r}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ServiceStatus)}
                size="small"
              >
                <MenuItem value="Active">🟢 Active (Available for Booking)</MenuItem>
                <MenuItem value="Inactive">🔴 Inactive (Hidden)</MenuItem>
                <MenuItem value="Seasonal">🍂 Seasonal Special</MenuItem>
              </TextField>
            </Grid>

            {/* Image URL */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Image URL (Unsplash or direct image link)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                size="small"
              />
            </Grid>

            {/* Is Popular & Flags */}
            <Grid size={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#6A3F4D' } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                    Mark as Popular / Featured Treatment
                  </Typography>
                }
              />
            </Grid>

            {/* Consumable Raw Materials Section */}
            <Grid size={12}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', textTransform: 'uppercase' }}>
                    Inventory Consumables Per Session
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddCircleIcon />}
                    onClick={handleAddConsumable}
                    sx={{ color: '#6A3F4D', fontWeight: 700, textTransform: 'none' }}
                  >
                    Add Product
                  </Button>
                </Box>

                {consumables.length === 0 ? (
                  <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                    No raw materials linked yet. Click "Add Product" to link inventory items.
                  </Typography>
                ) : (
                  consumables.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                      <TextField
                        size="small"
                        placeholder="e.g. Argan Oil Serum"
                        value={item.itemName}
                        onChange={(e) => handleConsumableChange(idx, 'itemName', e.target.value)}
                        sx={{ flexGrow: 1 }}
                      />
                      <TextField
                        size="small"
                        placeholder="Qty e.g. 2 pumps"
                        value={item.qtyPerSession}
                        onChange={(e) => handleConsumableChange(idx, 'qtyPerSession', e.target.value)}
                        sx={{ width: 130 }}
                      />
                      <IconButton size="small" onClick={() => handleRemoveConsumable(idx)} sx={{ color: '#D32F2F' }}>
                        <RemoveCircleIcon />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Form Actions Footer */}
        <Box sx={{ pt: 2, mt: 2, borderTop: '1px solid #E8DFD5', display: 'flex', gap: 1.5, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              borderColor: '#A8828F',
              color: '#6A3F4D',
              borderRadius: '10px',
              fontWeight: 700,
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              borderRadius: '10px',
              fontWeight: 800,
              px: 3.5,
              py: 1,
              boxShadow: '0 4px 12px rgba(107, 79, 58, 0.25)',
              '&:hover': { bgcolor: '#523B2A' },
            }}
          >
            {serviceToEdit ? 'Save Changes' : 'Create Service'}
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
