import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { CustomerPhoto, PhotoCategory } from '../../types/customer';
import { useCustomers } from '../../context/CustomerContext';

interface Props {
  customerId: string;
  photos: CustomerPhoto[];
}

export const PhotoGallery: React.FC<Props> = ({ customerId, photos }) => {
  const { addPhotoToCustomer } = useCustomers();

  const [activeCategory, setActiveCategory] = useState<'All' | PhotoCategory>('All');
  const [selectedPhoto, setSelectedPhoto] = useState<CustomerPhoto | null>(null);

  // Upload dialog
  const [uploadOpen, setUploadOpen] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PhotoCategory>('Hair');

  const samplePhotoUrls = [
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=600',
  ];

  const filteredPhotos = photos.filter((p) => activeCategory === 'All' || p.category === activeCategory);

  const handleAddPhoto = () => {
    const finalUrl = photoUrl.trim() || samplePhotoUrls[Math.floor(Math.random() * samplePhotoUrls.length)];
    addPhotoToCustomer(customerId, {
      url: finalUrl,
      title: title.trim() || `${category} Treatment Result`,
      category,
    });
    setUploadOpen(false);
    setPhotoUrl('');
    setTitle('');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CollectionsIcon sx={{ color: '#6A3F4D' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
            Before & After Photo Gallery ({photos.length})
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="small"
          startIcon={<AddPhotoAlternateIcon />}
          onClick={() => setUploadOpen(true)}
          sx={{
            bgcolor: '#6A3F4D',
            color: '#FFFFFF',
            fontWeight: 700,
            borderRadius: '8px',
          }}
        >
          Upload Photo
        </Button>
      </Box>

      {/* Category Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 2.5, pb: 0.5 }}>
        {(['All', 'Profile', 'Hair', 'Skin', 'Before', 'After'] as const).map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setActiveCategory(cat as any)}
              sx={{
                fontWeight: 700,
                fontSize: '0.78rem',
                bgcolor: isSelected ? '#6A3F4D' : '#F8F4EE',
                color: isSelected ? '#FFFFFF' : '#6A3F4D',
                border: '1px solid #E8DFD5',
                cursor: 'pointer',
              }}
            />
          );
        })}
      </Box>

      {/* Photo Grid */}
      {filteredPhotos.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
          <CollectionsIcon sx={{ fontSize: 40, color: '#A8828F', mb: 1 }} />
          <Typography variant="body2" sx={{ color: '#6E5C63', fontWeight: 600 }}>
            No photos found in category "{activeCategory}"
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredPhotos.map((photo) => (
            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={photo.id}>
              <Paper
                elevation={0}
                onClick={() => setSelectedPhoto(photo)}
                sx={{
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #E8DFD5',
                  cursor: 'pointer',
                  aspectRatio: '4/3',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 8px 20px rgba(107, 79, 58, 0.15)',
                  },
                }}
              >
                <Box
                  component="img"
                  src={photo.url}
                  alt={photo.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)',
                    color: '#FFFFFF',
                  }}
                >
                  <Typography noWrap variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                    {photo.title}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.2 }}>
                    <Chip
                      label={photo.category}
                      size="small"
                      sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#EBD9DF', color: '#2D1F24', fontWeight: 800 }}
                    />
                    <Typography variant="caption" sx={{ fontSize: '0.62rem', opacity: 0.8 }}>
                      {photo.uploadedAt}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Lightbox Preview Modal */}
      <Dialog
        open={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: '#000000', borderRadius: '16px' } } }}
      >
        {selectedPhoto && (
          <DialogContent sx={{ p: 0, position: 'relative' }}>
            <IconButton
              onClick={() => setSelectedPhoto(null)}
              sx={{ position: 'absolute', top: 12, right: 12, color: '#FFFFFF', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' } }}
            >
              <CloseIcon />
            </IconButton>
            <Box
              component="img"
              src={selectedPhoto.url}
              alt={selectedPhoto.title}
              sx={{ width: '100%', maxHeight: '75vh', objectFit: 'contain', bgcolor: '#000000' }}
            />
            <Box sx={{ p: 2.5, bgcolor: '#1A1A1A', color: '#FFFFFF' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#EBD9DF' }}>
                {selectedPhoto.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 1 }}>
                <Chip label={selectedPhoto.category} size="small" sx={{ bgcolor: '#6A3F4D', color: '#EBD9DF', fontWeight: 700 }} />
                <Typography variant="caption" sx={{ color: '#AAAAAA' }}>
                  Uploaded on {selectedPhoto.uploadedAt}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        )}
      </Dialog>

      {/* Add Photo Dialog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="xs" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', mb: 2 }}>
            Upload Customer Photo
          </Typography>

          <TextField
            fullWidth
            label="Photo Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Keratin Treatment - Before"
            size="small"
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value as PhotoCategory)}>
              <MenuItem value="Profile">Profile</MenuItem>
              <MenuItem value="Hair">Hair</MenuItem>
              <MenuItem value="Skin">Skin</MenuItem>
              <MenuItem value="Before">Before</MenuItem>
              <MenuItem value="After">After</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Image URL (Optional)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            size="small"
            helperText="Leave blank for sample salon result photo"
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button onClick={() => setUploadOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleAddPhoto} sx={{ bgcolor: '#6A3F4D' }}>
              Upload Photo
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};
