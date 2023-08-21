import PropTypes from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography, Button } from '@mui/material';
import Link from 'next/link';

export const AddonCard = (props) => {
  const { Addon } = props;

  function handleEdit(Addon){
    // call edit menu component
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <img
            src={Addon.thumbnail}
            variant="square"
            height="200px"
          />
        </Box>
        <Link href={`/edit/editAddon?id=${Addon._id}`} >
        <Button>Edit</Button>
        </Link>
        <Typography
          sx={{
            marginLeft: '10px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          align="left"
          gutterBottom
          variant="body1"
          nowrap
        >
          {Addon.name}
        </Typography>
        <Typography
          marginLeft={'10px'}
          align="left"
          variant="body1"
          color="red"
        >
          {Addon.price}.-
        </Typography>
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Stack
        alignItems="center"
        direction="row"
        justifyContent="space-between"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <ClockIcon />
          </SvgIcon>
          <Typography
            color="text.secondary"
            display="inline"
            variant="body2"
          >
            Updated: {new Date(Addon.updated_at).toDateString()}
          </Typography>
        </Stack>
        <Stack
          alignItems="center"
          direction="row"
          spacing={1}
        >
          <SvgIcon
            color="action"
            fontSize="small"
          >
            <ArrowDownOnSquareIcon />
          </SvgIcon>
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

AddonCard.propTypes = {
  Addon: PropTypes.object.isRequired
};
