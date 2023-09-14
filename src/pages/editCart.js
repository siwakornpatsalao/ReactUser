import { Button, Box, Container, Typography, TextField, CardContent, Card } from "@mui/material";
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Grid from "@mui/material/Grid";
import { useState, useEffect, useRef } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function EditCart(){
    const router = useRouter();
    const { id } = router.query;
    const initial = useRef(false);
    const [item, setItem] = useState([]);
    const [defaultItem, setDefaultItem] = useState([]);
    const [addons, setAddons] = useState([]);
    const [optionGroups, setOptionGroups] = useState([]);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [selectedOptionGroups, setSelectedOptionGroups] = useState([]);
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState('');
    const [itemPrice, setItemPrice] = useState(0);
    const [tempPrice, setTempPrice] = useState(0);
    const [sideClose, setSideClose] = useState(true);
    const [cartAmount, setCartAmount] = useState(0);
    const [addonPrice, setAddonPrice] = useState(0);
    const [optionPrice, setOptionPrice] = useState(0);
    const [count, setCount] = useState(0);

    
    function handleBack(){
        router.back();
    }

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    function handleMinus(){
        if (amount >= 1) {
          setAmount(amount - 1);
          if(amount>1){
            setItemPrice(tempPrice * (amount - 1));
          }
        }
    }
  
    function handlePlus(){
        setAmount(amount + 1);
        setItemPrice(tempPrice * (amount + 1));
    }

    function handleAddPriceAddon(addonPrice, addon) {
        setTempPrice(tempPrice+addonPrice);
  
        const updatedItemPrice = selectedAddons.includes(addon._id)
          ? tempPrice - addonPrice
          : tempPrice + addonPrice;
        
        if(amount==0){
          setItemPrice(updatedItemPrice);
          setTempPrice(updatedItemPrice);
          return;
        }
        setItemPrice(updatedItemPrice*amount);
        setTempPrice(updatedItemPrice);
        console.log(updatedItemPrice, 'addon');
    }
  
    function handleAddPriceOption(optionGroupPrice,option){
        setTempPrice(tempPrice+optionGroupPrice);
        
        const updatedItemPrice = selectedOptionGroups.includes(option._id)
          ? tempPrice - optionGroupPrice
          : tempPrice + optionGroupPrice;
  
        if(amount==0){
          setItemPrice(updatedItemPrice);
          setTempPrice(updatedItemPrice);
          return;
        }
          setItemPrice(updatedItemPrice*amount);
          setTempPrice(updatedItemPrice);
  
        console.log(updatedItemPrice, 'optionGroup')
    }
  

    async function editCart(){
        //put , edit

        const response = await fetch(`http://localhost:5000/carts/${item._id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                      amount: amount,
                      price: itemPrice,
                      addonId: selectedAddons,
                      optionGroupId: selectedOptionGroups,
                      note: note,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  if (!response.ok) {
                    throw new Error("Failed to edit cart");
                  }
                  
                  const resJson = await response.json();
                  console.log(resJson);

                  if(amount>item.amount){
                    setCartAmount(amount);
                  }
/*                   setAmount(0);
                  setNote('');
                  setSelectedAddons([]);
                  setSelectedOptionGroups([]);
                  setItemPrice(item.price);
                  setTempPrice(item.price); */

    }
    

    useEffect(() => {
        let newTempPrice = defaultItem.price;

        selectedAddons.forEach((addonId) => {
          const addon = addons.find((addon) => addon._id === addonId);
          if (addon) {
            newTempPrice += addon.price;
          }
        });

        optionGroups.forEach((optionGroup) => {
            if (optionGroup.options) {
              optionGroup.options.forEach((optionSet) => {
                if (selectedOptionGroups.includes(optionSet._id)) {
                  newTempPrice += optionSet.price;
                }
              });
            }
        });

        setTempPrice(newTempPrice);
      

        /* function calculateTotalAddonPrice(add){
            let totalPrice = 0;
            selectedAddons.forEach((addonId) => {
                const addon = add.find((addon) => addon._id === addonId);
                if (addon) {
                  totalPrice += addon.price;
                }
              });
            //setTempPrice(tempPrice + totalPrice);
            console.log(totalPrice, 'totalAddon');
            setAddonPrice(totalPrice);
        }
    
        function calculateTotalOptionGroupPrice(opt) {
            let totalPrice = 0;
            
            opt.forEach((optionGroup) => {
              if (optionGroup.options) {
                optionGroup.options.forEach((optionSet) => {
                  if (selectedOptionGroups.includes(optionSet._id)) {
                    totalPrice += optionSet.price;
                  }
                });
              }
            });
          
            //setTempPrice(tempPrice + totalPrice);
            console.log(totalPrice, 'totalOption');
            setOptionPrice(totalPrice);
        } */


        async function fetchCart(){
            try {
                const res = await fetch(`http://localhost:5000/carts/${id}`);
                const data = await res.json();
                setItem(data);
                setAmount(data.amount);
                setItemPrice(data.price);
                setNote(data.note);
                setSelectedAddons(data.addonId);
                setSelectedOptionGroups(data.optionGroupId);
              } catch (error) {
                console.error("Error fetching cartItems:", error);
              }
        }

        async function fetchItem() {
            try {
              const res = await fetch(`http://localhost:5000/menus/${item.itemId}`);
              const data = await res.json();
              setDefaultItem(data);
              setTempPrice(data.price);
              console.log(tempPrice,'tempPriceFetch');
              //base+ราคาaddon+ราคาoption เพิ่มตอนไหน
            } catch (error) {
              console.error("Error fetching menus:", error);
            }
          }

        async function fetchAddons() {
            try {
              const res = await fetch("http://localhost:5000/addons");
              const data = await res.json();
              if(defaultItem.addonId.length>0){
                const filteredAddons = data.filter(addon => defaultItem.addonId.includes(addon._id));
                setAddons(filteredAddons);
                //calculateTotalAddonPrice(data);
                console.log(data,'addon');
              }
            } catch (error) {
              console.error("Error fetching Addons:", error);
            }
          }

        async function fetchOptions() {
            try {
              const res = await fetch("http://localhost:5000/optiongroups");
              const data = await res.json();
              if(defaultItem.optionGroupId.length>0){
                const filteredOptions = data.filter(option => defaultItem.optionGroupId.includes(option._id));
                setOptionGroups(filteredOptions);
                //calculateTotalOptionGroupPrice(data);
                console.log(data,'option');
              }
            } catch (error) {
              console.error("Error fetching Options:", error);
            }
          }


        if (!initial.current) {
            fetchCart();
            fetchItem();
        }

        if (defaultItem.addonId && !initial.current) {
            fetchAddons();
            fetchOptions();
            initial.current = true;
        }

    },[addonPrice, addons, defaultItem.addonId, defaultItem.optionGroupId, defaultItem.price, id, item.itemId, itemPrice, optionGroups, optionPrice, selectedAddons, selectedOptionGroups, tempPrice])

    return(
        <DashboardLayout sideClose={sideClose} setSideClose={setSideClose} amount={cartAmount}>
            <Box component="main" /* sx={{ backgroundColor: '#D3D3D3'}} */>
         <Container maxWidth="x">
         <br/>
          <Button variant="contained" color="primary" onClick={handleBack}>
            ย้อนกลับ
          </Button>
            <br/>
            <br/>
            {/* EditPage */}
            <Card sx={{
        marginTop:'20px',
        display: 'flex',
        width:'100%',
        border: '1px solid #ccc', 
      }}
      style={{
        boxShadow: ' 2px 9px #EADDCD',/* #D8E8DC */
      }}>
            <CardContent>

          <Grid container justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <Typography variant="h4" component="h4" >
                    {item.name}
                </Typography>
                <br/>
                <img
                    style={{height: '100%',
                    maxWidth: '100%',}}
                    src={item.thumbnail}
                />
                
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <Box sx={{ paddingLeft: { xs: 4, sm: 2, md: 3, lg: 4, xl: 5 } }}>
                    {defaultItem.addonId && defaultItem.addonId.length>0 && (
                        <>
                    <Typography variant="h4" component="h4">
                        <u>เมนูเพิ่มเติม</u>
                    </Typography>
                    <br/>
                    <Grid container spacing={2} sx={{ marginLeft: '5px' }}>
                    {addons.map((addon) => (
                        <FormGroup key={addon._id}>
                        <FormControlLabel
                        label={
                        <>
                        <Typography variant="h5" component="h5" style={{ color: 'black', fontWeight: "normal" ,whiteSpace: "pre-wrap",}}>
                          {addon.name}
                        </Typography>
                                <Typography variant="h6" component="h6" sx={{marginTop:'5px'}} style={{ color: 'black', fontWeight: "normal",fontSize:20 }}>
                                    <span style={{color:'grey', fontSize:20}}>+{addon.price} บาท</span>
                                </Typography>
                         </>
                            }
                            control={
                            <Checkbox
                                checked={selectedAddons.includes(addon._id) }
                                onChange={() => {
                                setSelectedAddons((prev) =>
                                    prev.includes(addon._id)
                                    ? prev.filter((id) => id !== addon._id)
                                    : [...prev, addon._id]
                                ); handleAddPriceAddon(addon.price,addon)
                                }}
                            />
                            }
                        />
                        </FormGroup>
                    ))}
                    </Grid>
                    </>
                    )}
                    <br/>

                    {defaultItem.optionGroupId && defaultItem.optionGroupId.length > 0 && (
                        <>
                    <Typography variant="h4" component="h4">
                        <u>ตัวเลือก</u>
                    </Typography>
                    <br/>

                    {optionGroups && (
                        <>
                            {optionGroups.map((optionGroup) => (
                            <FormGroup key={optionGroup._id}>
                                <Typography variant="h5" component="h5" style={{ color: 'black', fontWeight: "normal", fontSize:26 }}>
                                    {optionGroup.name}
                                </Typography>
                                <br/>
                                <Grid container spacing={2}>
                                {optionGroup.options.map((optionSet) => (
                                    <Grid item key={optionSet._id} xs={6} sm={3} md={3} lg={3} xl={3}>
                                    <FormGroup>
                                        <FormControlLabel
                                        label={
                                            <>
                                            <Typography variant="h6" component="h6" style={{ color: 'black', fontWeight: "normal",fontSize:23 }}>
                                                {optionSet.name}<br/> <span style={{color:'grey', fontSize:20}}>+{optionSet.price} บาท</span>
                                            </Typography>
                                            </>
                                        }
                                        control={
                                            <Checkbox
                                            checked={selectedOptionGroups.includes(optionSet._id)}
                                            onChange={() => {
                                                setSelectedOptionGroups((prev) =>
                                                prev.includes(optionSet._id)
                                                    ? prev.filter((id) => id !== optionSet._id)
                                                    : [...prev, optionSet._id]
                                                ); handleAddPriceOption(optionSet.price,optionSet)
                                            }}
                                            />
                                        }
                                        />
                                    </FormGroup>
                                    </Grid>
                                ))}
                                </Grid>
                                <br/>
                                <hr style={{ border: 'none', borderBottom: '1px solid black', margin: '10px 0' }} />
                            </FormGroup>
                            ))}
                            
                        </>
                        )}
                    </>
                )}

                <br/>
                <Typography variant="h4" component="h4" sx={{display:'flex'}}>
                    Note: <TextField focused fullWidth
                            label="หมายเหตุสำหรับร้านค้า"
                            value={note}
                            onChange={handleNoteChange}
                            name="name" inputProps={{style: {fontSize: 20}}} sx={{ marginLeft: '10px' }}/>
                </Typography>
                <br/>
                <Typography variant="h4" component="h4" sx={{display:'flex', justifyContent:'center'}}>
                    <Button variant="contained" style={{backgroundColor:'red'}} onClick={handleMinus} sx={{ minWidth: '36px', minHeight: '36px', marginLeft: '10px' }}>
                        -
                    </Button>
                    <TextField value={amount} sx={{ width: '60px', marginLeft: '10px', marginRight: '10px' }} inputProps={{style: {fontSize: 30}}} />
                    <Button variant="contained" style={{backgroundColor:'green'}} onClick={handlePlus} sx={{ minWidth: '36px', minHeight: '36px' }}>
                        +
                    </Button>
                    </Typography>
                <br/>
                <Button sx={{fontSize:25}} fullWidth variant="contained" onClick={editCart}>
                    ซื้อสินค้า {itemPrice} บาท {/* ราคา + เมนูเพิ่มเติ่ม + ตัวเลือก */}
                </Button>
                </Box>
            </Grid>


          </Grid>
                
          </CardContent>
          </Card>
         </Container>
        </Box>
        </DashboardLayout>
    )
}