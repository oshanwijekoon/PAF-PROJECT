import React from 'react';
import { Box, IconButton, Popover } from '@mui/material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const EmojiPicker = ({ onEmojiSelect }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji.native);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick} color="primary">
        <EmojiEmotionsIcon />
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 1 }}>
          <Picker data={data} onEmojiSelect={handleEmojiSelect} />
        </Box>
      </Popover>
    </>
  );
};

export default EmojiPicker;