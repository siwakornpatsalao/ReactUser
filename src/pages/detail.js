import { Button, Box, Container, Typography, TextField, CardContent, Card } from "@mui/material";
import { useRouter } from 'next/router';
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import Grid from "@mui/material/Grid";
import { useState, useEffect, useRef } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function Detail(){
    const router = useRouter();
    const { id } = router.query;
    const initial = useRef(false);
    const [item, setItem] = useState([]);
    const [addons, setAddons] = useState([]);
    const [optionGroups, setOptionGroups] = useState([]);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [selectedOptionGroups, setSelectedOptionGroups] = useState([]);
    const [amount, setAmount] = useState(0);
    const [note, setNote] = useState('');
    const [sideClose, setSideClose] = useState(true);
    const [cartAmount, setCartAmount] = useState(0);
    const [cartItem, setCartItem] = useState([]);

    function handleBack(){
        router.back();
    }

    function handleMinus(){
        if(amount>0){
            setAmount(amount-1);
        }
    }

    const handleNoteChange = (event) => {
        setNote(event.target.value);
    };

    async function fetchCart(){
        try {
            const res = await fetch(`http://localhost:5000/carts`);
            const data = await res.json();
            setCartItem(data);
            console.log(data,'cartDetail');
          } catch (error) {
            console.error("Error fetching cartItems:", error);
          }
    }

    async function addToCart(){
        //check ค่านั้นๆก่อน ถ้าเหมือนทุกอย่างจะเพิ่มจำนวนแทน return
        fetchCart();

        const checkCart = cartItem.find((cart) => {
            return (
                cart.name === item.name &&
                cart.price === item.price  &&
                cart.note === note
              /* &&
              cart.addonId === selectedAddons &&
              cart.optionGroupId === selectedOptionGroups */
            );
          });

          console.log(checkCart,'sameCartCheck1')

        if(checkCart!=null){
            console.log(checkCart,'sameCartCheckHave')
            console.log('have same cart')
            if(amount>0){
                const response = await fetch(`http://localhost:5000/carts/${checkCart._id}`, {
                    method: "PUT",
                    body: JSON.stringify({
                      amount: checkCart.amount + amount,
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

                  fetchCart();
                  setCartAmount(amount);
                  setAmount(0);
                  setNote('');
            }
        }else if(checkCart==null){
            console.log(checkCart,'sameCartCheckNull')
            if(amount>0){
                const response = await fetch("http://localhost:5000/carts", {
                    method: "POST",
                    body: JSON.stringify({
                      name: item.name,
                      price: item.price,
                      addonId: selectedAddons,
                      optionGroupId: selectedOptionGroups,
                      amount: amount,
                      note: note,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  if (!response.ok) {
                    throw new Error("Failed to add new cart");
                  }
                  
                  const resJson = await response.json();
                  console.log(resJson);
          
                  fetchCart();
                  setCartAmount(amount);
                  setAmount(0);
                  setNote('');
            }
        }
    }


    function handlePlus(){
        setAmount(amount+1);
    }
    

    useEffect(() => {
        async function fetchItem() {
          try {
            const res = await fetch(`http://localhost:5000/menus/${id}`);
            const data = await res.json();
            setItem(data);
            console.log(data,'item');
          } catch (error) {
            console.error("Error fetching menus:", error);
          }
        }

        async function fetchAddons() {
            try {
              const res = await fetch("http://localhost:5000/addons");
              const data = await res.json();
              if(item.addonId.length>0){
                const filteredAddons = data.filter(addon => item.addonId.includes(addon._id));
                setAddons(filteredAddons);
                console.log(addons,'addon');
              }
            } catch (error) {
              console.error("Error fetching Addons:", error);
            }
          }

        async function fetchOptions() {
            try {
              const res = await fetch("http://localhost:5000/optiongroups");
              const data = await res.json();
              if(item.optionGroupId.length>0){
                const filteredOptions = data.filter(option => item.optionGroupId.includes(option._id));
                setOptionGroups(filteredOptions);
                console.log(optionGroups,'option');
              }
            } catch (error) {
              console.error("Error fetching Options:", error);
            }
          }

        if (!initial.current) {
            console.log(initial.current);
            fetchItem();
        }

        if (item.addonId && !initial.current) {
            fetchAddons();
            fetchOptions();
            initial.current = true;
        }
    }, [addons,optionGroups, id, item.addonId, item.optionGroupId]);

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
                <Typography variant="h4" component="h4">
                    {item.name}
                </Typography>
                <br/>
                <img
                    style={{height: '100%',
                    maxWidth: '100%',}}
                    src={item.thumbnail}
                />
                
                {/* เพิ่มจำนวนสินค้า */}
                
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <Box sx={{ paddingLeft: { xs: 4, sm: 2, md: 3, lg: 4, xl: 5 } }}>
                    {item.addonId && item.addonId.length>0 && (
                        <>
                    <Typography variant="h4" component="h4">
                        <u>เมนูเพิ่มเติม</u>
                    </Typography>
                    <br/>
                    <Grid container spacing={2} sx={{ marginLeft: '5px' }}>
                    {addons.map((addon) => (
                        <FormGroup key={addon._id}>
                        <FormControlLabel
                        label={<Typography variant="h5" component="h5" style={{ color: 'black', fontWeight: "normal" ,whiteSpace: "pre-wrap",}}>
                        {addon.name}
                                </Typography>}
                            control={
                            <Checkbox
                                checked={selectedAddons.includes(addon._id)}
                                onChange={() =>
                                setSelectedAddons((prev) =>
                                    prev.includes(addon._id)
                                    ? prev.filter((id) => id !== addon._id)
                                    : [...prev, addon._id]
                                )
                                }
                            />
                            }
                        />
                        </FormGroup>
                    ))}
                    </Grid>
                    </>
                    )}
                    <br/>

                    {item.optionGroupId && item.optionGroupId.length > 0 && (
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
                                            onChange={() =>
                                                setSelectedOptionGroups((prev) =>
                                                prev.includes(optionSet._id)
                                                    ? prev.filter((id) => id !== optionSet._id)
                                                    : [...prev, optionSet._id]
                                                )
                                            }
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
                <Button fullWidth variant="contained" onClick={addToCart}>
                    ซื้อสินค้า {/* {item.price} บาท */}
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