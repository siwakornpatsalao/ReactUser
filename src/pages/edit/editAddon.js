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
import { useRouter } from 'next/router';

const disabledTabStyle = {
  pointerEvents: 'none',
  opacity: 0.5,
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [editAmount, setEditAmount] = useState(0);
  const [unit, setUnit] = useState('');
  const initial = useRef(false);
  const [optionGroupName, setOptionGroupName] = useState('');
  const [options, setOptions] = useState([]);
  const [isRequired, setIsRequired] = useState(true);
  const [isRequired2, setIsRequired2] = useState(true);
  const router = useRouter();
  const { id } = router.query;
  const [addon, setAddon] = useState([]);
  const [optionGroup, setOptionGroup] = useState(null);

  const isNameValid = (name) => name == "";
  const isPriceValid = (price) => price<=0;
  const isEditAmountValid = (editAmount) => editAmount<0;
  const isUnitValid = (unit) => unit =="";

  const isOptionGroupNameValid = (optionGroupName) => optionGroupName == "";


  async function handleSubmit(e) {
    e.preventDefault();
    if (!image || isNameValid(name) || isPriceValid(price) || isEditAmountValid(editAmount) || isUnitValid(unit)) {
      Swal.fire("Error", "กรุณากรอกข้อมูลให้ถูกต้อง", "error");
      return;
    }
    Swal.fire({
      title: "ยืนยันการแก้ไขเมนูเพิ่มเติมนี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true, 
      denyButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(`แก้ไขเมนูเพิ่มเติมชิ้นนี้แล้ว`, "", "success");
        try {
          const response = await fetch(`http://localhost:5000/addons/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              name: name,
              thumbnail: image,
              price: price,
              amount: parseInt(amount) + parseInt(editAmount),
              editAmount: editAmount,
              unit: unit,
              updated_at: new Date().toISOString(),
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
          document.getElementById('file-input').value = '';
        } catch (error) {
          console.log('Error:', error.message);
        }
      }})
  }

  async function handleDeleteAddon(e) {
    e.preventDefault();
    Swal.fire({
      title: "ต้องการลบเมนูเพิ่มเติมนี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true, 
      denyButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(`ลบเมนูเพิ่มเติมชิ้นนี้แล้ว`, "", "success");
        try {
          const response = await fetch(`http://localhost:5000/addons/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete this addons");
          }
          setImage(null);
          setName('');
          setPrice(0);
          setAmount('');
          setEditAmount('');
          setUnit('');
        } catch (error) {
          console.log("Error:", error.message);
        }
      }
    })
  }

  function handleChangeFile(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      const base64String = reader.result;
      setImage(base64String);
    };
  
    reader.readAsDataURL(file);
  }

   //---------------------------------------------------------------------------------------------------------

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
      title: "ยืนยันการแก้ไขกลุ่มตัวเลือกนี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true, 
      denyButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(`แก้ไขกลุ่มตัวเลือกนี้แล้ว`, "", "success");
        try {
          console.log(optionGroupName)
          const response = await fetch(`http://localhost:5000/optiongroups/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              name: optionGroupName,
              options: options,
              require: isRequired ? 'necessary' : 'not',
              selection: isRequired2 ? 'one' : 'many',
              updated_at: new Date().toISOString(),
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            throw new Error('Failed to add new optionGroups');
          }
          const resJson = await response.json();
          console.log(resJson);
        } catch (error) {
          console.log('Error:', error.message);
        }
      }
    })
  }

  async function handleDeleteOption(e) {
    e.preventDefault();
    Swal.fire({
      title: "ต้องการลบกลุ่มตัวเลือกนี้หรือไม่",
      confirmButtonText: "ยืนยัน",
      showDenyButton: true,
      denyButtonText: "ยกเลิก", 
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire(`ลบกลุ่มตัวเลือกนี้แล้ว`, "", "success");
        try {
          const response = await fetch(`http://localhost:5000/optiongroups/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete this optiongroups");
          }
          setOptionGroupName('');
          setOptions([]);
        } catch (error) {
          console.log("Error:", error.message);
        }
      }
    })
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {

    if (id) {
        fetchAddonData();
        fetchOptionGroup();
    }


    if(name==''){
      setValue(1);
      //disable addon tab
    }else if(optionGroupName==''){
      setValue(0);
      //disable optiongroup tab
    }
    //if from addon do fetchAddonData **BUT** if from option do fetchOptionGroup
    
    async function fetchAddonData(){
        try {
          const response = await fetch(`http://localhost:5000/addons/${id}`);
          const data = await response.json();
          setAddon(data);
          setName(data.name);
          setPrice(data.price);
          setAmount(data.amount);
          setEditAmount(data.editAmount);
          setImage(data.thumbnail);
          setUnit(data.unit);
        } catch (error) {
          console.error('Error fetching menu:', error);
        }
      };

    async function fetchOptionGroup() {
      try {
        const res = await fetch(`http://localhost:5000/optiongroups/${id}`);
        const data = await res.json();
        setOptionGroup(data);
        setOptionGroupName(data.name);
        setOptions(data.options);
        console.log(data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }

    if (!initial.current) {
      initial.current = true;
      console.log(initial.current);
      fetchOptionGroup();
      fetchAddonData();
    }
  }, [id, name,optionGroupName]);

  return (
    <DashboardLayout>
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          textColor="secondary"
          indicatorColor="secondary"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          centered
        >
          <Tab style={!name ? disabledTabStyle : {}} label="เมนูเพิ่มเติม" {...a11yProps(0)} />
          <Tab style={!optionGroupName ? disabledTabStyle : {}} label="ตัวเลือก" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <form onSubmit={handleSubmit}>
        <Button style={{ background: 'red' }} variant="contained" onClick={handleDeleteAddon}>ลบเมนูเพิ่มเติมชิ้นนี้</Button>
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
              label="ชื่อเมนู"
              value={name}
              color="secondary"
              error={isNameValid(name)}
              helperText="กรุณาใส่ชื่อสินค้า"
              focused
              onChange={(e) => setName(e.target.value)}
            />
            <br/>
            <TextField
              label="ราคา"
              value={price}
              color="secondary"
              error={isPriceValid(price)}
              helperText="ราคาควรมีค่า 0 ขึ้นไป"
              focused
              onChange={(e) => setPrice(e.target.value)}
            />
            <br/>
            <TextField
              label="จำนวน"
              value={amount}
              color="secondary"
              disabled
              focused
              onChange={(e) => setAmount(e.target.value)}
            />
            <TextField
              label="แก้ไขจำนวน"
              value={editAmount}
              color="secondary"
              error={isEditAmountValid(editAmount)}
              helperText="จำนวนที่แก้ไขควรมีค่า 0 ขึ้นไป"
              focused
              onChange={(e) => setEditAmount(e.target.value)}
            />
            <br/>
            <TextField
              label="หน่วย"
              value={unit}
              color="secondary"
              error={isUnitValid(unit)}
              helperText="กรุณาใส่หน่วย"
              focused
              onChange={(e) => setUnit(e.target.value)}
            />
          <br/>

          <Button variant="contained" type="submit">แก้ไขเมนูเพิ่มเติม</Button>
          </Box>
        </Box>
        </form>
      </CustomTabPanel>

      <CustomTabPanel value={value} index={1}>
        <form onSubmit={handleSubmitOption}>
        <Box sx={{display:'flex',marginLeft: '400px' }}>   
        <Box sx={{ m: 1 }}>
        <Button style={{ background: 'red' }} variant="contained" onClick={handleDeleteOption}>ลบกลุ่มตัวเลือก</Button>
        <h1>ชื่อกลุ่มตัวเลือก</h1>
        <TextField
              label="ชื่อกลุ่มตัวเลือก"
              value={optionGroupName}
              color="secondary"
              error={isOptionGroupNameValid(optionGroupName)}
              helperText="กรุณาใส่ชื่อกลุ่มตัวเลือก"
              focused
              onChange={(e) => setOptionGroupName(e.target.value)}
        />
        <br/>
        <Button onClick={handleAddOption}>เพิ่มตัวเลือก</Button>
        {/* If edit addon disable */}
        {options.map((option) => (
              <MenuItem onClick={() => handleEditOption(option)} key={option._id}>
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

        <Button variant='contained' type="submit">แก้ไขกลุ่มตัวเลือก</Button>
        </Box>
        </Box>
        </form>
      </CustomTabPanel>
    </Box>
    </DashboardLayout>
  );
}
