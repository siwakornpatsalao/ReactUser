import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/solid/ArrowTopRightOnSquareIcon';
import ChevronUpDownIcon from '@heroicons/react/24/solid/ChevronUpDownIcon';
import {
  Box,
  Button,
  CardContent,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  Typography,
  Card,
  useMediaQuery
} from '@mui/material';
import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import { useAuth } from 'src/hooks/use-auth';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

export const SideNav = (props) => {
  const { open, onClose } = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const auth = useAuth();

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%'
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400'
        }
      }}
    >
            <div style={{ fontSize: 30, height: '70px', padding: '10px' }}>
    <span style={{ marginLeft: '125px', fontWeight: 'bold' }}>สรุปออเดอร์</span>
  </div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >

        
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0
            }}
          >
            <br/>
            <Card>
              <CardContent>
                เครปไส้แตก แป้ง ราคา จำนวน <br/>
                test<br/>test<br/>test<br/>test<br/>test<br/>test<br/>test<br/>
              </CardContent>
            </Card>
            <br/>
            <Card>
              <CardContent>
                <Typography variant="h4">
                วิธีการชำระเงิน
                </Typography>
                <br/>
                <FormGroup>
                  <FormControlLabel control={<Checkbox />} label={
                    <Typography variant="h6" component="h6">
                      Scan QR Code
                    </Typography>
                  } />
                    <br/>
                  <FormControlLabel control={<Checkbox />} label={
                    <Typography variant="h6" component="h6">
                      จ่ายเงินสด
                    </Typography>
                  } />
                </FormGroup>
              </CardContent>
            </Card>


            {/* {items.map((item) => {
              const active = item.path ? (pathname === item.path) : false;

              return (
                <SideNavItem
                  active={active}
                  disabled={item.disabled}
                  external={item.external}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })} */}
          </Stack>
        </Box>
        <Card sx={{ borderRadius: 0 ,border: '2px solid black'}}>
              <CardContent>
                <span style={{fontSize:25}}>ราคารวม</span>  <span style={{marginLeft:'170px'}}></span> <span style={{fontSize:25}}>50 บาท</span><br/><br/>
                <Button  sx={{ fontSize:25}} variant='contained' fullWidth>
                ชำระเงิน
                </Button>
              </CardContent>
            </Card>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="right"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 430
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 400
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
