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

export default function OptionAdd(){
    const [options, setOptions] = useState([]);
    const [optionGroupName, setOptionGroupName] = useState('');
    const [isRequired, setIsRequired] = useState(true);
    const [isRequired2, setIsRequired2] = useState(true);
    const [id2, setId2] = useState(0);
    const initial = useRef(false);

    const isOptionGroupNameValid = (optionGroupName) => optionGroupName == "";

    const validationSchema = Yup.object().shape({
      optionGroupName: Yup.string().required('กรุณาใส่ชื่อสินค้า'),
    });

    const formik = useFormik({
      initialValues: {
        optionGroupName:'',
      },
      validationSchema,
      onSubmit: async (values) => {

        Swal.fire({
          title: "ต้องการเพิ่มกลุ่มตัวเลือกนี้หรือไม่",
          confirmButtonText: "ยืนยัน",
          showDenyButton: true,
          denyButtonText: "ยกเลิก", 
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              console.log(optionGroupName)
              const response = await fetch('http://localhost:5000/optiongroups', {
                method: 'POST',
                body: JSON.stringify({
                  id: id2+1,
                  name: values.optionGroupName,
                  options: options,
                  require: isRequired ? 'necessary' : 'not',
                  selection: isRequired2 ? 'one' : 'many',
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (!response.ok) {
                throw new Error('Failed to add new optionGroups');
              }
              Swal.fire(`เพิ่มกลุ่มตัวเลือกแล้ว`, "", "success");
              const resJson = await response.json();
              console.log(resJson);
              formik.resetForm();
              setOptions([]);
              fetchOptions();
            } catch (error) {
              console.log('Error:', error.message);
            }
          }})
      }
    })

    const handleIsRequiredChange = (event) => {
        setIsRequired(event.target.value === 'necessary');
      };
    
      const handleIsRequiredChange2 = (event) => {
        setIsRequired2(event.target.value === 'one');
      };
    
      function handleAddOption(){
        Swal.fire({
          title: "เพิ่มตัวเลือก",
          html: '<input id="swal-input1" class="swal2-input" placeholder="ชื่อตัวเลือก">' +
          '<input id="swal-input2" class="swal2-input" placeholder="ราคา">',
          showDenyButton: true,
          confirmButtonText: "ยืนยัน",
          denyButtonText: `ยกเลิก`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            const inputName = document.getElementById('swal-input1').value;
            const inputPrice = document.getElementById('swal-input2').value;
    
            console.log(inputName)
            console.log(inputPrice)
    
          if (inputName !== "" && inputPrice !== "") {
            Swal.fire(`เพิ่ม Option แล้ว`, "", "success");
            const newOption = {
              name: inputName,
              price: inputPrice,
            };
            setOptions([...options, newOption]);
            console.log(options)
          }
    
        }});
      }
    
      function handleEditOption(option,index){
        const selectedOption = options[index];
        Swal.fire({
          title: "แก้ไขตัวเลือก",
          html: `<input id="swal-input1" class="swal2-input" placeholder="ชื่อตัวเลือก" value=${option.name}>` +
          `<input id="swal-input2" class="swal2-input" placeholder="ราคา" value=${option.price}>`,
          showDenyButton: true,
          confirmButtonText: "ยืนยัน",
          showCancelButton: true, 
          cancelButtonText: "ยกเลิก", 
          denyButtonText: `ลบตัวเลือก`,
          customClass: {
            content: "custom-swal-content", 
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            const inputName = document.getElementById('swal-input1').value;
            const inputPrice = document.getElementById('swal-input2').value;
    
            console.log(inputName)
            console.log(inputPrice)
    
            if (inputName !== "" && inputPrice !== "") {
              Swal.fire(`แก้ไข Option แล้ว`, "", "success");
              const editOption = {
                ...selectedOption,
                name: inputName,
                price: inputPrice,
              };     
              const updatedOptions = [...options];
              updatedOptions[index] = editOption;
              setOptions(updatedOptions);
              console.log(options);
            }
          }else if(result.isDenied){
            Swal.fire("ตัวเลือกถูกลบ", "", "success");
            const updatedOptions = [...options];
            updatedOptions.splice(index, 1); 
            setOptions(updatedOptions);
            console.log(options);
          }
      });
      }
    
      async function handleSubmitOption(e){
        e.preventDefault();
        if (isOptionGroupNameValid(optionGroupName)) {
          Swal.fire("Error", "กรุณากรอกข้อมูลให้ถูกต้อง", "error");
          return;
        }
        Swal.fire({
          title: "ต้องการเพิ่มกลุ่มตัวเลือกนี้หรือไม่",
          confirmButtonText: "ยืนยัน",
          showDenyButton: true,
          denyButtonText: "ยกเลิก", 
        }).then(async (result) => {
          if (result.isConfirmed) {
            try {
              console.log(optionGroupName)
              const response = await fetch('http://localhost:5000/optiongroups', {
                method: 'POST',
                body: JSON.stringify({
                  id: id2+1,
                  name: optionGroupName,
                  options: options,
                  require: isRequired ? 'necessary' : 'not',
                  selection: isRequired2 ? 'one' : 'many',
                }),
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              if (!response.ok) {
                throw new Error('Failed to add new optionGroups');
              }
              Swal.fire(`เพิ่มกลุ่มตัวเลือกแล้ว`, "", "success");
              const resJson = await response.json();
              console.log(resJson);
              setOptionGroupName('');
              setOptions([]);
              fetchOptions();
            } catch (error) {
              console.log('Error:', error.message);
            }
          }})
      }
    
      const fetchOptions = async () => {
        try {
          const res = await fetch('http://localhost:5000/optiongroups');
          const data = await res.json();
          const maxId = data.reduce((max, item) => {
            return item.id > max ? item.id : max;
          }, 0);
          setId2(maxId);
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
        fetchOptions();
      }, [id2]);

    return(
        <form noValidate onSubmit={formik.handleSubmit}>
          <Box sx={{display:'flex',marginLeft: '400px' }}>   
          <Box sx={{ m: 1 }}>
        <h1>ชื่อกลุ่มตัวเลือก</h1>
        <TextField
           focused
           label="ชื่อกลุ่มตัวเลือก"
           name="optionGroupName"
           onBlur={formik.handleBlur}
           onChange={formik.handleChange}
           value={formik.values.optionGroupName}
           error={formik.touched.optionGroupName && !!formik.errors.optionGroupName}
           helperText={formik.touched.optionGroupName && formik.errors.optionGroupName}
        />
        <br/>
        <Button onClick={handleAddOption}>เพิ่มตัวเลือก</Button>
        {options.map((option,index) => (
              <MenuItem onClick={() => handleEditOption(option,index)} key={option._id}>
                {option.name} +{option.price} บาท
              </MenuItem>
            ))}
        <h1>ลูกค้าต้องเลือกตัวเลือกนี้หรือไม่</h1>
        <RadioGroup value={isRequired ? 'necessary' : 'not'} onChange={handleIsRequiredChange}>
          <FormControlLabel value="necessary" control={<Radio />} label="จำเป็น" />
          <FormControlLabel value="not" control={<Radio />} label="ไม่บังคับ" />
        </RadioGroup>
        <h1>ลูกค้าสามารถเลือกตัวเลือกได้กี่อย่าง</h1>
        <RadioGroup value={isRequired2 ? 'one' : 'many'} onChange={handleIsRequiredChange2}>
          <FormControlLabel value="one" control={<Radio />} label="1 อย่าง" />
          <FormControlLabel value="many" control={<Radio />} label="หลายอย่าง" />
        </RadioGroup>
        <br/>

        <Button variant='contained' type="submit">สร้างตัวเลือกใหม่</Button>
        </Box>
        </Box>
        </form>
    )
}