import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  CardContent,
  Drawer,
  Stack,
  Typography,
  Card,
  useMediaQuery,
  RadioGroup,
  Radio,
  IconButton
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { useAuth } from 'src/hooks/use-auth';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useState, useRef, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Swal from "sweetalert2";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import ListItemText from '@mui/material/ListItemText';

export const SideNav = (props) => {
  const { open, onClose, detailCheck, onDataSend} = props;
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const auth = useAuth();
  const [cart, setCart] = useState([]);
  const initial = useRef(false);
/*   const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedOptionGroups, setSelectedOptionGroups] = useState([]); */
  const [addon, setAddon] = useState([]);
  const [optionGroup, setOptionGroup] = useState([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  function handlePay(){
    setCart([]);
  }

  function handleOpenDeleteDialog() {
    setDeleteDialogOpen(true);
  }


  async function handleDeleteCart(item){
    try {
      const response = await fetch(`http://localhost:5000/carts/${item._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete cart");
      }

      const response2 = await fetch(`http://localhost:5000/carts/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response2.ok) {
        throw new Error("Failed to delete cart");
      }

      const resJson = await response2.json();
      console.log(resJson,'data');
      setDeleteDialogOpen(false);
      handleDataSend(resJson);
      setCart(resJson);
      //setNewAmount
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  }

  function handleDataSend(data) {
    // Call the function onDataSend with the data you want to send back
    props.onDataSend(data);
  }

  async function fetchCart() {
    try {
      const res = await fetch("http://localhost:5000/carts");
      const data = await res.json();
      setCart(data);
      console.log(data, 'cart');
      console.log(data.map((dataItem) => dataItem.addonId), 'cart2');
      console.log(data.map((dataItem) => dataItem.optionGroupId), 'cart3');
    } catch (error) {
      console.error("Error fetching carts:", error);
    }
  }

  useEffect(() => {
  async function fetchAddon() {
    try {
      const res = await fetch("http://localhost:5000/addons");
      const data = await res.json();
      setAddon(data);
      console.log(data, 'addon');
    } catch (error) {
      console.error("Error fetching addon:", error);
    }
  }

  async function fetchOption() {
    try {
      const res = await fetch("http://localhost:5000/optiongroups");
      const data = await res.json();
      setOptionGroup(data);
      console.log(data, 'optionGroup');
    } catch (error) {
      console.error("Error fetching option:", error);
    }
  }

  if (!initial.current) {
    initial.current = true;
    console.log(initial.current);
    fetchCart(); 
    fetchAddon();
    fetchOption();
  }
}, []);

  /* const handleCloseSide = () => {
    setOpenNav(false); // Close the SideNav
  }; */

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
    {/* <Button onClick={handleCloseSide}>test</Button> */}
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
            {cart.map((cartItem) => (
              <div key={cartItem.id}>
                <Card>
                  <CardContent>
                  <IconButton onClick={() => handleOpenDeleteDialog()}><CloseIcon/></IconButton><br/>
                    <span style={{ fontSize: 25, fontWeight: 'bold' }}>{cartItem.name}</span>
                    {cartItem.addonId.length>0 &&
                                                    <>
                                                     <br/>
                                                 <span style={{ fontSize: 20 }}>เมนูเพิ่มเติม:</span>
                                                    {addon.filter((addonItem) => cartItem.addonId.includes(addonItem._id))
                                                          .map((matchingAddonItem) => (
                                                          <div key={matchingAddonItem._id}>
                                                             <span style={{marginLeft:'10px'}}>{matchingAddonItem.name}</span>   
                                                          </div>))}
                                                    </>}
                    {cartItem.optionGroupId.length>0 &&
                                                    <>
                                                    <br/> 
                                                    <span style={{ fontSize: 20 }}>ตัวเลือก:</span> {optionGroup.map((option) => (
                                                                <div key={option._id}>
                                                                  {option.options && 
                                                                    option.options
                                                                      .filter((optionItem) =>
                                                                        cartItem.optionGroupId.includes(optionItem._id)
                                                                      )
                                                                      .map((matchOption,index) => (
                                                                        <div key={matchOption._id}>
                                                                          {index==0 && <span>{option.name}: <br/></span>}
                                                                          <span style={{marginLeft:'15px'}}>{matchOption.name}</span>
                                                                        </div>
                                                                      ))}
                                                                </div>
                                                              ))}
                                                    </>}
                    {cartItem.note && <><br/><span style={{ fontSize: 20 }}>Note:</span> {cartItem.note}</>}
                    <br/> <span style={{ fontSize: 20 }}>ราคา:</span> {cartItem.price} บาท
                    <br/> <span style={{ fontSize: 20 }}>จำนวน:</span> {cartItem.amount} ชิ้น
                  </CardContent>
                </Card>
                <br/>

                <Dialog
                  sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
                  maxWidth="xs"
                  open={isDeleteDialogOpen}
                  onClose={() => setDeleteDialogOpen(false)}
                >
                  <DialogTitle sx={{fontSize:25}}>ต้องการลบสินค้านี้หรือไม่</DialogTitle>

                  <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>ยกเลิก</Button>
                    <Button onClick={() => handleDeleteCart(cartItem)} color="error">
                      ยืนยัน
                    </Button>
                  </DialogActions>
                </Dialog>

              </div>



            ))}

            <br/>
            <Card>
              <CardContent>
                <Typography variant="h4">
                วิธีการชำระเงิน
                </Typography>
                <br/>
                <RadioGroup>
                  <FormControlLabel value="qr" control={<Radio />} label={
                    <Typography variant="h6" component="h6">
                      Scan QR Code
                    </Typography>
                  } />
                    <br/>
                  <FormControlLabel value="cash" control={<Radio />} label={
                    <Typography variant="h6" component="h6">
                      จ่ายเงินสด
                    </Typography>
                  } />
                </RadioGroup>
              </CardContent>
            </Card>
{/*             <Card>
              <CardContent>
                <span style={{fontSize:25}}>เครปไส้แตก</span><br/> แป้ง: วนิลา<br/>ไส้: พริกเผา หมูหยอง ทูน่า ...<br/>ไส้พิเศษ: ไข่ไก่ <br/>ซอส: มะเขือเทศ มายองชีส<br/>ราคา 50 บาท  จำนวน 1 ชื้น
              </CardContent>
            </Card>
            <br/>
            <Card>
              <CardContent>
                <Typography variant="h4">
                วิธีการชำระเงิน
                </Typography>
                <br/>
                <RadioGroup>
                  <FormControlLabel value="qr" control={<Radio />} label={
                    <Typography variant="h6" component="h6">
                      Scan QR Code
                    </Typography>
                  } />
                    <br/>
                  <FormControlLabel value="cash" control={<Radio />} label={
                    <Typography variant="h6" component="h6">
                      จ่ายเงินสด
                    </Typography>
                  } />
                </RadioGroup>
              </CardContent>
            </Card> */}


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
          <br/>
          <br/>
          <Card sx={{ borderRadius: 0 ,border: '2px solid black'}}>
              <CardContent>
                <span style={{fontSize:25}}>ราคารวม</span>  <span style={{marginLeft:'120px'}}></span> <span style={{fontSize:25}}>{cart.reduce((totalPrice, cartItem) => totalPrice + cartItem.price, 0)} บาท</span><br/><br/>
                <Button onClick={handlePay}  sx={{ fontSize:25}} variant='contained' fullWidth>
                ชำระเงิน
                </Button>
              </CardContent>
        </Card>
        </Box>

{/*         <Card sx={{ borderRadius: 0 ,border: '2px solid black'}}>
              <CardContent>
                <span style={{fontSize:25}}>ราคารวม</span>  <span style={{marginLeft:'170px'}}></span> <span style={{fontSize:25}}>{cart.reduce((totalPrice, cartItem) => totalPrice + cartItem.price, 0)}</span><br/><br/>
                <Button  sx={{ fontSize:25}} variant='contained' fullWidth>
                ชำระเงิน
                </Button>
              </CardContent>
        </Card> */}

      </Box>
    </Scrollbar>
  );

/*   if (lgUp) {
    return (
      <Drawer
        anchor="right"
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
  } */if (lgUp && detailCheck) {
    return (
      <Drawer
        anchor="right"
        onClose={onClose}
        open={open}
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 500
          }
        }}
        sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
        variant="temporary"
      >{/* <Button onClick={onClose}>back</Button> */}
        {content}
      </Drawer>
    );
  }else if (lgUp){
    return (
      <Drawer
        anchor="right"
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
