import PropTypes from 'prop-types';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Box, Card, CardContent, Divider, Stack, SvgIcon, Typography, Button } from '@mui/material';
import Link from 'next/link';

export const OptionCard = (props) => {
  const { OptionGroups } = props;

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent>
        <Link href={`/edit/editAddon?id=${OptionGroups._id}`} >
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
          variant="h6"
          nowrap
        >
          {OptionGroups.name}
        </Typography>
        <Typography
            marginLeft={'10px'}
            align="left"
            variant="body1"
            color="grey"
          >
            Options:<br/> {OptionGroups.options.map((option) => (
            <span key={option._id}>{option.name}  <span style={{ marginRight: '20px' }}></span> +{option.price}.-<br/> </span>
          ))}
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
            Updated: {new Date(OptionGroups.updated_at).toDateString()}
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

OptionCard.propTypes = {
  OptionGroups: PropTypes.object.isRequired
};
