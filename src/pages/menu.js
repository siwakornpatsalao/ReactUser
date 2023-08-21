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

function Menu() {
  const [menus, setMenus] = useState([]);
  const initial = useRef(false);
  const [originalMenus, setOriginalMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [paginatedMenus, setPaginatedMenus] = useState(menus);
  const [promotion, setPromotion] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleAddCategory() {
    Swal.fire({
      title: "เพิ่มหมวดหมู่",
      text: "ชื่อหมวดหมู่",
      input: "text",
      showDenyButton: true,
      confirmButtonText: "ยืนยัน",
      denyButtonText: `ยกเลิก`,
    }).then(async (result) => {
      if (result.isConfirmed && result.value !== "") {
        const categoryName = result.value;
      
        if (categories.some(category => category.name === categoryName)) {
          Swal.fire("ชื่อหมวดหมู่ซ้ำ", "", "error");
          return;
        }  

        Swal.fire(`เพิ่มหมวดหมู่แล้ว`, "", "success");
        console.log(result.value);

        const response = await fetch("http://localhost:5000/category", {
          method: "POST",
          body: JSON.stringify({
            name: result.value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to add new menu");
        }
        const resJson = await response.json();
        console.log(resJson);
      }
    });
  }

  const clearCategoryFilter = () => {
    setCategory('');
    setMenus(originalMenus);
  };

  const handleSearchMenu = (searchValue) => {
    if (searchValue !== "") {
      const filteredMenus = originalMenus.filter((menu) =>
        menu.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setMenus(filteredMenus);
    } else {
      setMenus(originalMenus);
    }
  };

  // แก้ไข promotion เก็บ category ในรูปแบบ string ok, ใน promotion เก็บ category name ok, category name ห้ามซ้ำ ok
  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory); 
    if (selectedCategory !== "") {
      const filterCategory = originalMenus.filter((menu) =>
        menu.category.includes(selectedCategory)
      );
      setMenus(filterCategory);
    } else {
      setMenus(originalMenus);
    }
  };

  function hasPromotion(menuId) {
    const hasPromo = promotion.some(promo => {
      return promo.menuId.includes(menuId);
    });
    return hasPromo;
  }

  function promoData(menuId){
    const promo = promotion.filter(promo => {
      return promo.menuId.includes(menuId);
    });
    return promo;
  }

  function hasPromotionCategory(category){
    const hasPromo = promotion.some(promo => {
      return promo.category.includes(category);
    });
    return hasPromo;
  }
  
  function promoCategoryData(category){
    console.log(`Category ID to check: ${category}`);
    const promo = promotion.filter(promo => {
      console.log(`Promo Category IDs:`, promo.category);
      return promo.category.includes(category);
    });
    console.log(`Category ${category} has promotion:`, promo);
    return promo;
  }

  useEffect(() => {
    async function fetchMenus() {
      try {
        const res = await fetch("http://localhost:5000/menus");
        const data = await res.json();
        setMenus(data);
        setOriginalMenus(data);
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
        setPromotion(data);
        console.log("Promotion Data:", data);
      } catch (error) {
        console.error("Error fetching promotion:", error);
      }
    }

    if (!initial.current) {
      initial.current = true;
      console.log(initial.current);
      fetchMenus();
      fetchCategory();
      fetchPromotion();
    }
  }, []);

  useEffect(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setPaginatedMenus(menus.slice(startIndex, endIndex));
  }, [menus, page, rowsPerPage]);

  return (
    <>
      <Head>
        <title>Menu | Devias Kit</title>
      </Head>
      <Box component="main">
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stack spacing={1}>
                  <Typography variant="h4">Menus</Typography>
                </Stack>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Link href="./add/addMenu">
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <PlusIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                  >
                    Add Menu
                  </Button>
                </Link>
                <span style={{ marginRight: "20px" }}></span>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="outlined"
                  onClick={handleAddCategory}
                >
                  เพิ่มหมวดหมู่
                </Button>
              </div>

            </Stack>
      <br/>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
        <MenuSearch onSearch={(searchValue) => handleSearchMenu(searchValue)} />
        </div>

        <div style={{ justifyContent: "flex-end" }}>
          <TextField
            value={category}
            style={{ width: "280px" }}
            select
            focused
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
            }}
          >
            {categories.map((option) => (
              <MenuItem key={option._id} value={option.name}>
                {option.name}
              </MenuItem>
            ))}

          </TextField>
          <span style={{ marginRight: "20px" }}></span>
          {/* <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button> */}
        </div>
      </div>


            <Grid container spacing={3}>
              {paginatedMenus.map((menu) => (
                <Grid
                  xs={12}
                  md={6}
                  lg={3}
                  key={menu._id}
                >
                   <MenuCard menu={menu} hasPromotion={hasPromotion(menu._id)} promoData={promoData(menu._id)} 
                   hasPromotionCategory={hasPromotionCategory(menu.category)} promoCategoryData={promoCategoryData(menu.category)}/> {/* // show promotion of category */}
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <TablePagination
                component="div"
                rowsPerPageOptions={[4, 8, 24, { label: "All", value: 1000000 }]}
                count={menus.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Stack>
        </Container>
      </Box>
    </>
  );
}

Menu.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Menu;