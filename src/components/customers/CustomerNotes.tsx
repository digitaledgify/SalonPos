import React, { useState } from 'react';
import { Box, Paper, Typography, Button, TextField, Chip, Divider } from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import AddCommentIcon from '@mui/icons-material/AddComment';
import StarIcon from '@mui/icons-material/Star';
import { CustomerNote } from '../../types/customer';
import { useCustomers } from '../../context/CustomerContext';

interface Props {
  customerId: string;
  notes: CustomerNote[];
}

export const CustomerNotes: React.FC<Props> = ({ customerId, notes }) => {
  const { addNoteToCustomer } = useCustomers();
  const [noteText, setNoteText] = useState('');

  const quickTemplates = [
    'Sensitive scalp',
    'Prefers herbal products',
    'No bleach',
    'Allergic to wax',
    'Prefers quiet appointment',
    'Likes warm water rinse',
  ];

  const handleAddNote = () => {
    if (noteText.trim()) {
      addNoteToCustomer(customerId, noteText.trim());
      setNoteText('');
    }
  };

  const handleQuickAdd = (template: string) => {
    addNoteToCustomer(customerId, template);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NoteAltIcon sx={{ color: '#6A3F4D' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Inter", sans-serif' }}>
            Staff Notes ({notes.length})
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
          Newest notes first
        </Typography>
      </Box>

      {/* Add New Note Box */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: '#F8F4EE', borderRadius: '14px', border: '1px solid #E8DFD5' }}>
        <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 700, textTransform: 'uppercase', mb: 1, display: 'block' }}>
          Add Internal Staff Note
        </Typography>

        <TextField
          fullWidth
          multiline
          rows={2}
          placeholder="Type specific customer preferences, sensitivities, or instructions..."
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          variant="outlined"
          size="small"
          sx={{
            mb: 1.5,
            bgcolor: '#FFFFFF',
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              fontSize: '0.88rem',
            },
          }}
        />

        {/* Quick Templates */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
            Quick Tags:
          </Typography>
          {quickTemplates.map((template) => (
            <Chip
              key={template}
              label={template}
              size="small"
              onClick={() => handleQuickAdd(template)}
              sx={{
                fontSize: '0.72rem',
                fontWeight: 600,
                bgcolor: '#FFFFFF',
                color: '#6A3F4D',
                border: '1px solid #A8828F',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: '#6A3F4D',
                  color: '#FFFFFF',
                },
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddCommentIcon />}
            onClick={handleAddNote}
            disabled={!noteText.trim()}
            sx={{
              bgcolor: '#6A3F4D',
              color: '#FFFFFF',
              fontWeight: 700,
              borderRadius: '8px',
              px: 2,
            }}
          >
            Save Note
          </Button>
        </Box>
      </Paper>

      {/* Notes List */}
      {notes.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#6E5C63', fontStyle: 'italic', textAlign: 'center', py: 2 }}>
          No notes added yet for this customer.
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {notes.map((note) => (
            <Paper
              key={note.id}
              elevation={0}
              sx={{
                p: 2,
                borderRadius: '12px',
                bgcolor: '#FFFFFF',
                border: note.isImportant ? '1px solid #A8828F' : '1px solid #E8DFD5',
                borderLeft: note.isImportant ? '4px solid #6A3F4D' : '4px solid #A8828F',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                  {note.isImportant && <StarIcon sx={{ fontSize: 16, color: '#B78103' }} />}
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#6A3F4D' }}>
                    {note.author}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                  {note.createdAt}
                </Typography>
              </Box>
              <Divider sx={{ my: 0.8, borderColor: '#F8F4EE' }} />
              <Typography variant="body2" sx={{ color: '#2D1F24', lineHeight: 1.5 }}>
                {note.text}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};
