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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode.react';

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
  const [isQRDialogOpen, setQRDialogOpen] = useState(false);
  const [isCashDialogOpen, setCashDialogOpen] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState([]);
  const [method, setMethod] = useState('');
  const [qrCodeScanned, setQRCodeScanned] = useState(false);
  const router = useRouter();

  function handlePay(){
    if(method=='qr'){
      console.log('this is qr code method');
      setQRDialogOpen(true);
    }else if (method=='cash'){
      console.log('this is cash method');
      setCashDialogOpen(true);
    }
  }

  function handlePayByQR(){
    setCart([]);
    setQRDialogOpen(false);
    Swal.fire(`ออเดอร์ที่ 1`, "ชำระเงินเรียบร้อยแล้ว", "success");
  }

  function handlePayByCash(){
    setCart([]);
    setQRDialogOpen(false);
    Swal.fire(`ออเดอร์ที่ 2`, "กรุณาชำระเงินที่เคาน์เตอร์", "success");
  }

/*   function handleQRCodeScan() {
    console.log('scan qr code แล้ว');
    setQRCodeScanned(true);
    setQRDialogOpen(false);
    setCart([]);
    Swal.fire(`ออเดอร์ที่ 1`, "ชำระเงินเรียบร้อยแล้ว", "success");
  }
 */

  const handleSelectedMethod = (event) => {
    setMethod(event.target.value)
  };

  function handleOpenDeleteDialog(item) {
    setDeleteDialogOpen(true);
    setSelectedDelete(item);
  }


  async function handleDeleteCart(){
    console.log(selectedDelete,'itemDelete');
    try {
      const response = await fetch(`http://localhost:5000/carts/${selectedDelete._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete cart");
      }

      /*  const response2 = await fetch(`http://localhost:5000/carts/`, {
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
      setCart(resJson); */

      const updatedCart = cart.filter((item) => item._id !== selectedDelete._id);
      setDeleteDialogOpen(false);
      //handleDataSend(updatedCart); //แก้ cart ไม่ updated
      setCart(updatedCart);

      setSelectedDelete([]);
      //setNewAmount
      router.push('/index2');
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  }

  function handleDataSend(data) {
    props.onDataSend(data);
  }

  async function fetchCart() {
    try {
      const res = await fetch("http://localhost:5000/carts");
      const data = await res.json();
      setCart(data);
/*       console.log(data, 'cart');
      console.log(data.map((dataItem) => dataItem.addonId), 'cart2');
      console.log(data.map((dataItem) => dataItem.optionGroupId), 'cart3'); */
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
/*       console.log(data, 'addon'); */
    } catch (error) {
      console.error("Error fetching addon:", error);
    }
  }

  async function fetchOption() {
    try {
      const res = await fetch("http://localhost:5000/optiongroups");
      const data = await res.json();
      setOptionGroup(data);
      /* console.log(data, 'optionGroup'); */
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
}, [cart]);

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
              <div style={{marginBottom:'10px'}} key={cartItem.id}>
                <Card>
                  <CardContent>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link href={`/editCart?id=${cartItem._id}`}>
                      <Button>แก้ไข</Button>
                    </Link>
                    <IconButton onClick={() => handleOpenDeleteDialog(cartItem)}>
                      <CloseIcon />
                    </IconButton>
                  </div>
                    <span style={{ fontSize: 25, fontWeight: 'bold' }}>{cartItem.name}</span>
                    {cartItem.addonId.length>0 &&
                                                  <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <span style={{ fontSize: 20 }}>เมนูเพิ่มเติม:</span>
                                                    {addon.filter((addonItem) => cartItem.addonId.includes(addonItem._id))
                                                          .map((matchingAddonItem) => (
                                                          <div key={matchingAddonItem._id}>
                                                             <span style={{marginLeft:'10px'}}>{matchingAddonItem.name}</span>   
                                                          </div>))}
                                                    </div>}
                    {cartItem.optionGroupId.length>0 &&
                                                    <div style={{ display: 'flex', marginTop:'5px' }}>
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
                                                                          {index==0 && <span style={{marginLeft:'20px', marginTop:'10px', fontSize:18}}>{option.name} : <br/></span>}
                                                                          <span style={{marginLeft:'40px'}}>{matchOption.name}</span>
                                                                        </div>
                                                                      ))}
                                                                </div>
                                                              ))}
                                                    </div>}
                    {cartItem.note && <><br/><span style={{ fontSize: 20 }}>Note:</span> {cartItem.note}</>}
                    <hr/> <span style={{ fontSize: 20}}>ราคา:</span> {cartItem.price} บาท
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
                    <Button onClick={() => handleDeleteCart()} color="error">
                      ยืนยัน
                    </Button>
                  </DialogActions>
                </Dialog>



                <Dialog
                  sx={{ '& .MuiDialog-paper': { width: '16%', maxHeight: 435 } }}
                  maxWidth="xs"
                  open={isQRDialogOpen}
                  onClose={() => setQRDialogOpen(false)}
                >
                  <DialogTitle sx={{fontSize:25}}>กรุณาสแกน Qr Code </DialogTitle>
                  <DialogContent>
                  {qrCodeScanned ? (
                      <p>QR Code scanned successfully!</p>
                    ) : (<>
                    <QRCode
                      value={'คุณชำระเงินผ่าน QR Code'}
                      size={200}
                      level={'H'} 
                      renderAs={'svg'}
                    />
                    {/* <img alt="" src="/assets/qrcodeImage.png" /> */}
                    </>)}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setQRDialogOpen(false)}>ยกเลิก</Button>
                    <Button onClick={() => handlePayByQR()} color="error">
                      ยืนยัน
                    </Button>
                  </DialogActions>
                </Dialog>

                <Dialog
                  sx={{ '& .MuiDialog-paper': { width: '20%', maxHeight: 435 } }}
                  maxWidth="md"
                  open={isCashDialogOpen}
                  onClose={() => setCashDialogOpen(false)}
                >
                  <DialogTitle sx={{fontSize:25}}>คุณต้องการชำระเงินด้วยเงินสดหรือไม่ </DialogTitle>

                  <DialogActions>
                    <Button onClick={() => setCashDialogOpen(false)}>ยกเลิก</Button>
                    <Button onClick={() => handlePayByCash()} color="error">
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
                <RadioGroup value={method} onChange={handleSelectedMethod}>
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
