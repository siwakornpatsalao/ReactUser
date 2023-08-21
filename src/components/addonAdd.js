import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState, useEffect, useRef } from 'react';
import { TextField, MenuItem, Button, Radio, RadioGroup} from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

function AddonAdd(){
    const [value, setValue] = useState(0);
    const [image, setImage] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [amount, setAmount] = useState(0);
    const [editAmount, setEditAmount] = useState(0);
    const [unit, setUnit] = useState('');
    const initial = useRef(false);
    const [id, setId] = useState(0);
    const [addons, setAddons] = useState([]);

    const validationSchema = Yup.object().shape({
      name: Yup.string().required('กรุณาใส่ชื่อสินค้า'),
      price: Yup.number().positive('กรุณาใส่ราคาที่มากกว่า 0').required('กรุณาใส่ราคา'),
      amount: Yup.number().positive('กรุณาใส่จำนวนที่มากกว่า 0').required('กรุณาใส่จำนวน'),
      unit: Yup.string().required('กรุณาใส่หน่วย'),
    });
  
    const formik = useFormik({
      initialValues: {
        name:'',
        price:'',
        amount:'',
        unit:'',
      },
      validationSchema,
      onSubmit: async (values) => {
        if (!image) {
          Swal.fire("Error", "กรุณาใส่รูปภาพ", "error");
          return;
        }

        Swal.fire({
          title: "ต้องการเพิ่มเมนูเพิ่มเติมนี้หรือไม่",
          confirmButtonText: "ยืนยัน",
          showDenyButton: true,
          denyButtonText: "ยกเลิก", 
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire(`เพิ่มเมนูเพิ่มเติมชิ้นนี้แล้ว`, "", "success");
            try {
              const response = await fetch('http://localhost:5000/addons', {
                method: 'POST',
                body: JSON.stringify({
                  id: id+1,
                  name: values.name,
                  thumbnail: image,
                  price: values.price,
                  amount: values.amount,
                  editAmount: editAmount,
                  unit: values.unit,
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (!response.ok) {
                throw new Error('Failed to add new addon');
              }
              const resJson = await response.json();
              console.log(resJson);
              setImage(null);
              fetchAddons();
              formik.resetForm();
              document.getElementById('file-input').value = '';
            } catch (error) {
              console.log('Error:', error.message);
            }
          }})
      }
    })



    /* async function handleSubmit(e) {
        e.preventDefault();
        if (!image || isNameValid(name) || isPriceValid(price) || isAmountValid(amount) || isUnitValid(unit)) {
          Swal.fire("Error", "กรุณากรอกข้อมูลให้ถูกต้อง", "error");
          return;
        }
        Swal.fire({
          title: "ต้องการเพิ่มเมนูเพิ่มเติมนี้หรือไม่",
          confirmButtonText: "ยืนยัน",
          showDenyButton: true,
          denyButtonText: "ยกเลิก", 
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire(`เพิ่มเมนูเพิ่มเติมชิ้นนี้แล้ว`, "", "success");
            try {
              const response = await fetch('http://localhost:5000/addons', {
                method: 'POST',
                body: JSON.stringify({
                  id: id+1,
                  name: name,
                  thumbnail: image,
                  price: price,
                  amount: amount,
                  editAmount: editAmount,
                  unit: unit,
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (!response.ok) {
                throw new Error('Failed to add new menu');
              }
              const resJson = await response.json();
              console.log(resJson);
              setImage(null);
              setName('');
              setPrice(0);
              setAmount(0);
              setUnit("");
              fetchAddons();
              document.getElementById('file-input').value = '';
            } catch (error) {
              console.log('Error:', error.message);
            }
          }})
      } */
    
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

      const fetchAddons = async () => {
        try {
          const res = await fetch('http://localhost:5000/addons');
          const data = await res.json();
          setAddons(data);
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
        if (!initial.current) {
          initial.current = true;
          console.log(initial.current);
        }
      }, []);
    
      useEffect(() => {
        fetchAddons();
      }, [id]);

    return(
      <form noValidate onSubmit={formik.handleSubmit}>
        <Box sx={{ display: 'flex',marginLeft: '300px'  }}>
          <Box sx={{ m: 1 }}>
          <input
            id="file-input"
            type="file"
            onChange={handleChangeFile}
            accept="image/*"
          />
          <br/>
          <br/>
          {image && (
            <img
              src={image}
              style={{ maxWidth: '100%', height: '500px' }}
              alt="Preview"
            />
          )}
          </Box>

          <Box
            sx={{ '& > :not(style)': { m: 1, width: '25ch', marginLeft:'50px' } }}
            noValidate
            autoComplete="off"
          >
            <TextField
              focused
              label="ชื่อสินค้า"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
              error={formik.touched.name && !!formik.errors.name}
              helperText={formik.touched.name && formik.errors.name}
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
            <br/>
            <TextField
              focused
              label="จำนวน"
              name="amount"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.amount}
              error={formik.touched.amount && !!formik.errors.amount}
              helperText={formik.touched.amount && formik.errors.amount}
            />
            <TextField
              label="แก้ไขจำนวน"
              disabled
              value={editAmount}
              color="secondary"
              focused
              onChange={(e) => setEditAmount(e.target.value)}
            />
            <br/>
            <TextField
              focused
              label="หน่วย"
              name="unit"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.unit}
              error={formik.touched.unit && !!formik.errors.unit}
              helperText={formik.touched.unit && formik.errors.unit}
            />
          <br/>

          <Button variant="contained" type="submit">สร้างเมนูเพิ่มเติมใหม่</Button>
          </Box>
        </Box>
        </form>
    )
}

export default AddonAdd;