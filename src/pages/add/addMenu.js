import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useState, useEffect, useRef } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <>
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    </>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState(""); 
  const initial = useRef(false);
  const [addons, setAddons] = useState([]);
  const [optionGroups, setOptionGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedOptionGroups, setSelectedOptionGroups] = useState([]);
  const [menus, setMenus] = useState([]);
  const [id, setId] = useState(0);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('กรุณาใส่ชื่อสินค้า'),
    description: Yup.string().required('กรุณาใส่คำอธิบาย'),
    price: Yup.number().positive('กรุณาใส่ราคาที่มากกว่า 0').required('กรุณาใส่ราคา'),
  });

  const formik = useFormik({
    initialValues: {
      name:'',
      description:'',
      price:'',
    },
    validationSchema,
    onSubmit: async (values) => {
        const addonIds = selectedAddons;
        const optionGroupIds = selectedOptionGroups; 

        if (!image || !category) {
          Swal.fire("Error", "กรุณาใส่ข้อมูล", "error");
          return;
        }

        Swal.fire({
          title: "ต้องการเพิ่มสินค้านี้หรือไม่",
          confirmButtonText: "ยืนยัน",
          showDenyButton: true,
          denyButtonText: "ยกเลิก", 
        }).then(async (result) => {
          if (result.isConfirmed) {
            console.log("Submitting form...");
            try {
              const response = await fetch("http://localhost:5000/menus", {
                method: "POST",
                body: JSON.stringify({
                  id: id+1,
                  name: values.name,
                  thumbnail: image,
                  description: values.description,
                  price: values.price,
                  category: category,
                  addonId: addonIds,
                  optionGroupId: optionGroupIds,
                }),
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (!response.ok) {
                Swal.fire(`ไม่สามารถเพิ่มเมนูได้`, "", "error");
                throw new Error("Failed to add new menu");
              }
              const resJson = await response.json();
              console.log(resJson);
              Swal.fire(`เพิ่มสินค้าชิ้นนี้แล้ว`, "", "success");
              formik.resetForm();
              setImage(null);
              setCategory("");
              setSelectedAddons([]);
              setSelectedOptionGroups([]);
              document.getElementById("file-input").value = "";
            } catch (error) {
              console.log("Error:", error.message);
            }
          }
        });
    },
  });
  

  function handleChangeFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;
      setImage(base64String);
    };

    reader.readAsDataURL(file);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const fetchMenus = async () => {
    try {
      const res = await fetch('http://localhost:5000/menus');
      const data = await res.json();
      setMenus(data);
      const maxId = data.reduce((max, item) => {
        return item.id > max ? item.id : max;
      }, 0);
      setId(maxId);
      console.log(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  }

  useEffect(() => {
    async function fetchData(url, setter) {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setter(data);
        console.log(data);
      } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
      }
    }

    if (!categories.length) {
      fetchData("http://localhost:5000/addons", setAddons);
      fetchData("http://localhost:5000/optiongroups", setOptionGroups);
      fetchData("http://localhost:5000/category", setCategories);
      fetchMenus();
    }

    if (!initial.current) {
      initial.current = true;
      console.log(initial.current);
    }
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [id]);

  return (
    <DashboardLayout>
      <Box sx={{ width: "100%"}}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            centered
          >
            <Tab label="เมนูหลัก" {...a11yProps(0)} />
            <Tab label="ส่วนเสริม" {...a11yProps(1)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
        <form noValidate onSubmit={formik.handleSubmit}>
          <Box sx={{ display: 'flex',marginLeft: '300px' }}>
            <Box sx={{ m: 1 }}>
            <input id="file-input" type="file" onChange={handleChangeFile} accept="image/*" />
            <br/>
            <br/>
            {image && (
              <img src={image} style={{ maxWidth: "100%", height: "500px" }} alt="Preview" variant="square"
              height="200px"/>
            )}
            </Box>

            <Box sx={{
                "& > :not(style)": { m: 1, width: "25ch", marginLeft:'50px' },
              }} noValidate autoComplete="off">
              <TextField
                focused
                label="ชื่อสินค้า"
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
                error={formik.touched.name && !!formik.errors.name}
                helperText={formik.touched.name && formik.errors.name}
                /* inputProps={{style: {fontSize: 30}}} 
                   font-family: Roboto; */
              />
              <br/>
              <TextField
                focused
                label="คำอธิบาย"
                name="description"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.description}
                error={formik.touched.description && !!formik.errors.description}
                helperText={formik.touched.description && formik.errors.description}
              />
              <br/>
              <TextField
                focused
                label="ราคา"
                name="price"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.price}
                error={formik.touched.price && !!formik.errors.price}
                helperText={formik.touched.price && formik.errors.price}
              />

            <TextField
              value={category}
              select
              focused
              label="หมวดหมู่"
              defaultValue="เครื่องดื่ม"
              helperText="Please select your category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <br/>

            <Button variant="contained" type="submit">สร้างเมนูใหม่</Button>
            </Box>
            </Box>
          </form>
        </CustomTabPanel>

        <CustomTabPanel value={value} index={1}>
          <h1>เมนูเพิ่มเติม</h1>
          <br/>
          {addons.map((addon) => (
            <FormGroup key={addon._id}>
              <FormControlLabel
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
                label={addon.name}
              />
            </FormGroup>
          ))}

          <h1>ตัวเลือก</h1>
          {optionGroups.map((optionGroup) => (
            <FormGroup key={optionGroup._id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptionGroups.includes(optionGroup._id)}
                    onChange={() =>
                      setSelectedOptionGroups((prev) =>
                        prev.includes(optionGroup._id)
                          ? prev.filter((id) => id !== optionGroup._id)
                          : [...prev, optionGroup._id]
                      )
                    }
                  />
                }
                label={optionGroup.name}
              />
            </FormGroup>
          ))}
        </CustomTabPanel>
      </Box>
    </DashboardLayout>
  );
}
