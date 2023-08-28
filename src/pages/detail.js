import { Button, Box, Container, Typography, TextField } from "@mui/material";
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

    function handleBack(){
        router.back();
    }

    function handleMinus(){
        if(amount>0){
            setAmount(amount-1);
        }
    }

    function addToCart(){

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
        <>
        <Box component="main" /* sx={{ backgroundColor: '#D3D3D3'}} */>
         <Container maxWidth="xl">
          <Button variant="contained" color="primary" onClick={handleBack}>
            ย้อนกลับ
          </Button>
          
          <Grid container justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <img
                    style={{maxWidth: "100%"}}
                    src={item.thumbnail}
                    alt="Preview"
                    variant="square"
                    width='800px' height='600px'
                />
                {/* เพิ่มจำนวนสินค้า */}
                
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                <Box sx={{ paddingLeft: { xs: 0, sm: 2, md: 3, lg: 4, xl: 5 } }}>
                    {item.addonId && item.addonId.length>0 && (
                        <>
                    <Typography variant="h4" component="h4">
                        เมนูเพิ่มเติม
                    </Typography>
                    <br/>

                    {addons.map((addon) => (
                        <FormGroup key={addon._id}>
                        <FormControlLabel
                        label={<Typography variant="h5" component="h5" style={{ color: 'black', fontWeight: "normal" }}>
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
                    </>
                    )}
                    <br/>

                    {item.optionGroupId && item.optionGroupId.length > 0 && (
                        <>
                    <Typography variant="h4" component="h4">
                        ตัวเลือก
                    </Typography>
                    <br/>

                    {optionGroups && (
                        <>
                            {optionGroups.map((option) => (
                                <FormGroup key={option._id}>
                                    <Typography variant="h5" component="h5" style={{ color: 'black', fontWeight: "normal" }}>
                                        {option.name}
                                    </Typography>
                                    {option.options.map((optionSet) => (
                                        <FormGroup key={optionSet._id}>
                                            <FormControlLabel
                                                label={
                                                    <>
                                                        <Typography variant="h6" component="h6" style={{ color: 'black', fontWeight: "normal" }}>
                                                            {optionSet.name} +{optionSet.price} บาท
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
                                    ))}
                                    <br/>
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
                            name="name" sx={{ marginLeft: '10px' }}/>
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

         </Container>
        </Box>
        </>
    )
}

Detail.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;