import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
  Paper,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from '@mui/material';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PaymentsIcon from '@mui/icons-material/Payments';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PersonIcon from '@mui/icons-material/Person';
import { PaymentMethod } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

const PRESET_SERVICES = [
  { name: 'Hair Cut & Styling', price: 1500 },
  { name: 'Hair Spa & Keratin', price: 2800 },
  { name: 'Hydra Facial Glow', price: 3200 },
  { name: 'Global Hair Color & Highlights', price: 4500 },
  { name: 'Beard Grooming & Shave', price: 850 },
  { name: 'Luxury Pedicure & Manicure', price: 2200 },
  { name: 'Bridal Makeup Package', price: 12000 },
];

export const BillingPOSModal: React.FC<Props> = ({ open, onClose }) => {
  const { stylists, inventory, addTransaction, showToast } = useDashboard();

  // Form State
  const [customerName, setCustomerName] = useState('Ananya Roy');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [stylistName, setStylistName] = useState('Priya Sharma');
  
  // Cart Items
  const [selectedItems, setSelectedItems] = useState<Array<{ name: string; price: number; qty: number }>>([
    { name: 'Hair Spa & Keratin', price: 2800, qty: 1 },
  ]);

  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');

  // Discount & Payment
  const [discountType, setDiscountType] = useState<'none' | 'fixed' | 'percent'>('none');
  const [discountVal, setDiscountVal] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [cashReceived, setCashReceived] = useState('');

  // Helper calculations
  const subtotal = selectedItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  let discountAmount = 0;
  if (discountType === 'fixed' && Number(discountVal)) {
    discountAmount = Math.min(subtotal, Number(discountVal));
  } else if (discountType === 'percent' && Number(discountVal)) {
    discountAmount = Math.round((subtotal * Math.min(100, Number(discountVal))) / 100);
  }

  const taxableTotal = Math.max(0, subtotal - discountAmount);
  const gstTax = Math.round(taxableTotal * 0.18); // 18% GST
  const grandTotal = taxableTotal; // Inclusive tax setup

  // Cash change calculation
  const cashChange = paymentMethod === 'Cash' && Number(cashReceived) > grandTotal
    ? Number(cashReceived) - grandTotal
    : 0;

  const handleAddItem = (name: string, price: number) => {
    const existing = selectedItems.find((i) => i.name === name);
    if (existing) {
      setSelectedItems(selectedItems.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setSelectedItems([...selectedItems, { name, price, qty: 1 }]);
    }
  };

  const handleAddCustom = () => {
    if (!customItemName || !customItemPrice) return;
    handleAddItem(customItemName, Number(customItemPrice));
    setCustomItemName('');
    setCustomItemPrice('');
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSubmitBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || selectedItems.length === 0) {
      showToast('Please specify customer name and add at least 1 service item.');
      return;
    }

    addTransaction({
      customerName,
      customerPhone,
      stylistName,
      services: selectedItems.map((i) => `${i.name} (x${i.qty})`),
      amount: grandTotal,
      paymentMethod,
      status: 'Paid',
    });

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: 1,
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
          },
        },
      }}
    >
      {/* POS Terminal Title Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
          borderBottom: '1px solid #E8DFD5',
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
              boxShadow: '0 4px 10px rgba(107, 79, 58, 0.2)',
            }}
          >
            <PointOfSaleIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.15rem' }}>
              Express POS Terminal Checkout
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              Tax Invoice Generator & Instant Payment Desk
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmitBill}>
        <DialogContent sx={{ p: 2.5 }}>
          <Grid container spacing={3}>
            {/* Left Column: Item Catalog & Customer Information */}
            <Grid size={{ xs: 12, md: 7 }}>
              {/* Customer Info */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', mb: 1.5 }}>
                1. Customer & Stylist Selection
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
                <TextField
                  label="Customer Name"
                  size="small"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
                <TextField
                  label="Customer Phone"
                  size="small"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                <TextField
                  label="Assigned Stylist"
                  select
                  size="small"
                  value={stylistName}
                  onChange={(e) => setStylistName(e.target.value)}
                  sx={{ gridColumn: 'span 2' }}
                >
                  {stylists.map((s) => (
                    <MenuItem key={s.id} value={s.name}>
                      {s.name} ({s.roleTitle})
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Divider sx={{ my: 2, borderColor: '#E8DFD5' }} />

              {/* Service & Product Quick Selector Catalog */}
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', mb: 1 }}>
                2. Quick Add Services & Retail Products
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {PRESET_SERVICES.map((svc) => (
                  <Chip
                    key={svc.name}
                    label={`${svc.name} - ₹${svc.price}`}
                    onClick={() => handleAddItem(svc.name, svc.price)}
                    icon={<AddIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      bgcolor: '#F8F4EE',
                      border: '1px solid #E8DFD5',
                      color: '#2D1F24',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      '&:hover': { bgcolor: '#E8DFD5' },
                    }}
                  />
                ))}
              </Box>

              {/* Custom Item Row */}
              <Paper elevation={0} sx={{ p: 1.5, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#6E5C63', mb: 1, display: 'block' }}>
                  Add Retail Product or Custom Service
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    placeholder="Item / Product Name"
                    size="small"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    placeholder="Price (₹)"
                    type="number"
                    size="small"
                    value={customItemPrice}
                    onChange={(e) => setCustomItemPrice(e.target.value)}
                    sx={{ width: 110 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddCustom}
                    sx={{ bgcolor: '#6A3F4D', color: '#EBD9DF', minWidth: 40 }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Right Column: Checkout Cart Summary & Payment Gateways */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: '#F8F4EE',
                  borderRadius: '16px',
                  border: '1px solid #E8DFD5',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', mb: 1.5 }}>
                    3. Cart Summary ({selectedItems.length} items)
                  </Typography>

                  {/* Cart Itemized List */}
                  <Box sx={{ maxHeight: 180, overflowY: 'auto', mb: 2 }}>
                    {selectedItems.map((item, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          py: 0.8,
                          borderBottom: '1px solid #E8DFD5',
                        }}
                      >
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '0.85rem' }}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                            ₹{item.price} x {item.qty}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                            ₹{item.price * item.qty}
                          </Typography>
                          <IconButton size="small" onClick={() => handleRemoveItem(idx)}>
                            <DeleteIcon sx={{ fontSize: 16, color: '#C62828' }} />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  {/* Discounts & Promos */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, display: 'block', mb: 0.5 }}>
                      Apply Discount Promo
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        select
                        size="small"
                        value={discountType}
                        onChange={(e: any) => setDiscountType(e.target.value)}
                        sx={{ minWidth: 100 }}
                      >
                        <MenuItem value="none">None</MenuItem>
                        <MenuItem value="fixed">Flat ₹</MenuItem>
                        <MenuItem value="percent">Flat %</MenuItem>
                      </TextField>
                      {discountType !== 'none' && (
                        <TextField
                          placeholder="Amount"
                          size="small"
                          type="number"
                          value={discountVal}
                          onChange={(e) => setDiscountVal(e.target.value)}
                          sx={{ width: 100 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {/* Bill Subtotals */}
                  <Box sx={{ bgcolor: '#FFFFFF', p: 1.5, borderRadius: '10px', border: '1px solid #E8DFD5', mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Item Subtotal
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        ₹{subtotal.toLocaleString()}
                      </Typography>
                    </Box>
                    {discountAmount > 0 && (
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ color: '#2E7D32' }}>
                          Discount
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#2E7D32' }}>
                          -₹{discountAmount.toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        GST Tax (18%)
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700 }}>
                        ₹{gstTax.toLocaleString()}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 0.8 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                        Grand Total
                      </Typography>
                      <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#6A3F4D' }}>
                        ₹{grandTotal.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Payment Mode Options */}
                  <Typography variant="caption" sx={{ fontWeight: 800, color: '#6A3F4D', display: 'block', mb: 0.8 }}>
                    4. Select Payment Gateway
                  </Typography>

                  <RadioGroup
                    row
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    sx={{ gap: 1, mb: 2 }}
                  >
                    <FormControlLabel
                      value="UPI"
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <QrCode2Icon sx={{ fontSize: 16, color: '#0288D1' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            UPI / QR
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="Card"
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CreditCardIcon sx={{ fontSize: 16, color: '#6A3F4D' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            Card
                          </Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="Cash"
                      control={<Radio size="small" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PaymentsIcon sx={{ fontSize: 16, color: '#2E7D32' }} />
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            Cash
                          </Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>

                  {/* If UPI chosen: display instant QR prompt */}
                  {paymentMethod === 'UPI' && (
                    <Paper elevation={0} sx={{ p: 1.5, textAlign: 'center', bgcolor: '#E1F5FE', borderRadius: '10px', border: '1px solid #B3E5FC' }}>
                      <QrCode2Icon sx={{ fontSize: 32, color: '#0288D1' }} />
                      <Typography variant="caption" sx={{ display: 'block', fontWeight: 800, color: '#0288D1' }}>
                        Scan & Pay ₹{grandTotal} on UPI Terminal
                      </Typography>
                    </Paper>
                  )}

                  {/* If Cash chosen: prompt Cash Received */}
                  {paymentMethod === 'Cash' && (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <TextField
                        label="Cash Received (₹)"
                        size="small"
                        type="number"
                        value={cashReceived}
                        onChange={(e) => setCashReceived(e.target.value)}
                      />
                      {cashChange > 0 && (
                        <Chip
                          label={`Return Change: ₹${cashChange}`}
                          color="success"
                          sx={{ fontWeight: 800, fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2, borderTop: '1px solid #E8DFD5' }}>
          <Button onClick={onClose} sx={{ color: '#6E5C63' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<ReceiptLongIcon />}
            sx={{
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              fontWeight: 800,
              px: 3,
              '&:hover': { bgcolor: '#523B2A' },
            }}
          >
            Collect ₹{grandTotal.toLocaleString()} & Generate Invoice
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
