import React from 'react';
import { Chip, Box } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarIcon from '@mui/icons-material/Star';
import ShieldIcon from '@mui/icons-material/Shield';
import PersonIcon from '@mui/icons-material/Person';
import { MembershipTier } from '../../types/customer';

interface Props {
  tier: MembershipTier;
  size?: 'small' | 'medium';
  showIcon?: boolean;
}

export const MembershipBadge: React.FC<Props> = ({ tier, size = 'small', showIcon = true }) => {
  const config = {
    Normal: {
      label: 'Normal Member',
      bg: '#F8F4EE',
      color: '#6A3F4D',
      border: '#E8DFD5',
      icon: <PersonIcon sx={{ fontSize: size === 'small' ? 14 : 18 }} />,
    },
    Silver: {
      label: 'Silver Tier',
      bg: '#E0E0E0',
      color: '#424242',
      border: '#BDBDBD',
      icon: <ShieldIcon sx={{ fontSize: size === 'small' ? 14 : 18 }} />,
    },
    Gold: {
      label: 'Gold Member',
      bg: '#FFF8E1',
      color: '#B78103',
      border: '#FFE082',
      icon: <StarIcon sx={{ fontSize: size === 'small' ? 14 : 18 }} />,
    },
    Platinum: {
      label: 'Platinum VIP',
      bg: '#EDE7F6',
      color: '#4A148C',
      border: '#D1C4E9',
      icon: <WorkspacePremiumIcon sx={{ fontSize: size === 'small' ? 14 : 18 }} />,
    },
  }[tier || 'Normal'];

  return (
    <Chip
      size={size}
      icon={showIcon ? <Box component="span" sx={{ display: 'flex', alignItems: 'center', ml: 0.5, color: config.color }}>{config.icon}</Box> : undefined}
      label={tier}
      sx={{
        fontWeight: 800,
        fontSize: size === 'small' ? '0.72rem' : '0.82rem',
        bgcolor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        borderRadius: '8px',
        px: 0.5,
      }}
    />
  );
};
