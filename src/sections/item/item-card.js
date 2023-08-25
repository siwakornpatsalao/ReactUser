import PropTypes, { func } from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box, Button, Card, CardContent, Divider, Stack, SvgIcon, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Link from 'next/link';
import { useEffect, useState, useRef } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CelebrationIcon from '@mui/icons-material/Celebration';

export const ItemCard = (props) => {
  const { item } = props;

  /* const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
 */
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxWidth: 350,
        
      }}
    >
      <Link href={`/detail?id=${item._id}`} style={{ textDecoration: 'none' }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img style={{
                maxWidth: "100%",
              }} src={item.thumbnail} alt="Preview" variant="square" width='300px' height='200px'
                />
        </Box>
        <br/>

        <Typography
          sx={{
            marginLeft: '10px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          align="left"
          gutterBottom
          variant="body1"
        >
          {item.name}
        </Typography>
        <Typography
          marginLeft={'10px'}
          align="left"
          variant="body1"
          color="red"
        >
          {item.price}.-
        </Typography>
      </CardContent>
      </Link>
      <Box sx={{ flexGrow: 1 }} />
{/*       <Divider /> */}
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 1 }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >

          {/* {hasPromotion && (
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? 'basic-item' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              >
                <KeyboardArrowDownIcon />
              </Button>
              <Menu
                id="basic-item"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                itemListProps={{ 'aria-labelledby': 'basic-button' }}
              >
                Promotion item: {promoData.map((promo) => (
                <itemItem key={promo.id}>
                    <p>Topic: {promo.topic}</p>
                </itemItem>
                 ))}
                 {hasPromotionCategory && (
                  <div>
                    <p>Promotion Category:</p>
                    {promoCategoryData.map((promo) => (
                      <itemItem key={promo.id} sx={{ color: 'text.secondary' }}>
                        Topic: {promo.topic}
                      </itemItem>
                    ))}
                  </div>
                )}

              </Menu>
            </div>
          )} */}
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >

          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

ItemCard.propTypes = {
  item: PropTypes.object.isRequired,
};