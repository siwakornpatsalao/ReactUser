import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';
import { useState } from 'react';

export const ItemSearch = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (value) => {
    setSearchValue(value);
    onSearch(value);
  };

  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        value={searchValue}
        onChange={(e) => handleSearch(e.target.value)}
        fullWidth
        placeholder="Search Item"
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        sx={{ maxWidth: 1000, backgroundColor:'#D9D9D9','&:hover': { backgroundColor: '#D9D9D9' } }}
      />
    </Card>
  );
};
