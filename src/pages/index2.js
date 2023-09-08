import Head from "next/head";
import PlusIcon from "@heroicons/react/24/solid/PlusIcon";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Container,
  Pagination,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { MenuSearch } from "src/sections/menu/menu-search";
import { useEffect, useState, useRef } from "react";
import { MenuCard } from "src/sections/menu/menu-card";
import Link from "next/link";
import MenuItem from "@mui/material/MenuItem";
import ClearIcon from '@mui/icons-material/Clear';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from "@mui/material/IconButton";
import TablePagination from '@mui/material/TablePagination';
import { ItemSearch } from "../sections/item/item-search";
import { ItemCard } from "../sections/item/item-card";
import Carousel from 'react-material-ui-carousel'

function Index2(){
    const [items, setItems] = useState([]);
    const [originalItems, setOriginalItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [promotion, setPromotions] = useState([]);
    const [category, setCategory] = useState('');
    const initial = useRef(false);

    const handleSearchItem = (searchValue) => {
        if (searchValue !== "") {
          const filteredItems = originalItems.filter((item) =>
            item.name.toLowerCase().includes(searchValue.toLowerCase())
          );
          setItems(filteredItems);
        } else {
          setItems(originalItems);
        }
    };

    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory); 
        if (selectedCategory !== "") {
          const filterCategory = originalItems.filter((item) =>
            item.category.includes(selectedCategory)
          );
          setItems(filterCategory);
        } else {
          setItems(originalItems);
        }
    };

    const clearCategoryFilter = () => {
        setCategory('');
        setItems(originalItems);
      };

    useEffect(() => {
        async function fetchItems() {
          try {
            const res = await fetch("http://localhost:5000/menus");
            const data = await res.json();
            setItems(data);
            setOriginalItems(data);
            console.log(data);
          } catch (error) {
            console.error("Error fetching menus:", error);
          }
        }

        async function fetchCategory() {
            try {
              const res = await fetch("http://localhost:5000/category");
              const data = await res.json();
              setCategories(data);
              console.log(data);
            } catch (error) {
              console.error("Error fetching category:", error);
            }
          }

          async function fetchPromotion() {
            try {
              const res = await fetch("http://localhost:5000/promotions");
              const data = await res.json();
              setPromotions(data);
              console.log(data);
            } catch (error) {
              console.error("Error fetching promotion:", error);
            }
          }

        if (!initial.current) {
            initial.current = true;
            console.log(initial.current);
            fetchItems();
            fetchCategory();
            fetchPromotion();
          }
    }, []);

    return(
      <>
      <Box component="main" /* sx={{ backgroundColor: '#D3D3D3'}} */>
        <Container maxWidth="xl">
<br/>
        <Carousel sx={{margin: 'auto',maxWidth: '80%',}} interval={10000}>
          
        {promotion.map((item, i) => (
                <div key={i}>
                    <img
                        style={{
                            height: '100%',
                            maxWidth: '100%',
                        }}
                        src={item.image}
                        alt={`Promotion ${i}`}
                    />
                </div>
            ))}
        </Carousel>
        <div style={{ display: "flex" , alignItems: "flex-end"}}>
            <div style={{ flex: 1 }}>
            <ItemSearch onSearch={(searchValue) => handleSearchItem(searchValue)}/>
            </div>
            <span style={{ marginRight: "20px" }}></span>
            <div style={{ justifyContent: "flex-end" }}>
            <TextField
                value={category}
                select
                focused
                fullWidth
                sx={{backgroundColor: 'white'}}
                label="หมวดหมู่"
                defaultValue="เครื่องดื่ม"
                helperText="Please select your category"
                onChange={(e) => {
                setCategory(e.target.value);
                handleCategoryChange(e.target.value);
                }}
                InputProps={{
                endAdornment: category && (
                    <InputAdornment position="start">
                    <IconButton onClick={() => clearCategoryFilter()}>
                        <ClearIcon />
                    </IconButton>
                    </InputAdornment>
                ),
                }}>
                {categories.map((option) => (
                <MenuItem key={option._id} value={option.name}>
                    {option.name}
                </MenuItem>
                ))}
            </TextField>
            </div>

        </div>

        <br/>
        <Grid style={{backgroundColor:'#FCF6EE' /* backgroundColor: '#F2FFF5' */}} sx={{borderRadius:'20px'}} container spacing={3}>
              {items.map((item) => (
                <Grid
                  xs={12}
                  md={6}
                  lg={3}
                  key={item._id}
                >
                   <ItemCard item={item}/> 
                   <br/>
                </Grid>
              ))}
        </Grid>
        </Container>
        </Box>
        </>
    )
}

Index2.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Index2;