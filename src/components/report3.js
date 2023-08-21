import * as React from "react";
import Box from "@mui/material/Box";
import { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import { IconButton } from "@mui/material";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import SortAndPage from "./sortAndPage";

export default function Report3(){
    const initial = useRef(false);
    const [rows3, setRows3] = useState([]);
    const [filteredRows3, setFilteredRows3] = useState(rows3);
    const [paginatedRows3, setPaginatedRows3] = useState(rows3);
    const [open, setOpen] = useState(Array(rows3.length).fill(false));
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [year, setYear] = useState("");
    const [month, setMonth] = useState("");
    const [day, setDay] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [sortDate, setSortDate] = useState("desc");
    const [sortName, setSortName] = useState("desc");
    const [sortMenuCount, setSortMenuCount] = useState("desc");
    const [sortTotal, setSortTotal] = useState("desc");

    const sortAndPage = SortAndPage();
    const pagination = sortAndPage.pagination;
    const sortByInt = sortAndPage.sortByInt;
    const sortByString = sortAndPage.sortByString;
    const sortByDate = sortAndPage.sortByDate;
    const renderDropdown = sortAndPage.renderDropdown;
    const years = sortAndPage.years;
    const months = sortAndPage.months;
    const days = sortAndPage.days;
    const formatDate = sortAndPage.formatDate;

    function handleReset() {
      setYear("");
      setMonth("");
      setDay("");
      setPage(0);
      setRowsPerPage(5);
      setOpen(Array(rows3.length).fill(false));
    }

    const handleChangeYear = (event) => {
      setYear(event.target.value);
    };

    const handleChangeMonth = (event) => {
      setMonth(event.target.value);
    };

    const handleChangeDay = (event) => {
      setDay(event.target.value);
    };


    useEffect(() => {
        async function fetchReport3() {
            try {
              const res = await fetch("http://localhost:5000/report3");
              const data = await res.json();
              const formattedData = data.map(item => ({
                ...item,
                date: formatDate(item.date),
              }));
              setRows3(formattedData);
              console.log(data);
            } catch (error) {
              console.error("Error fetching report1:", error);
            }
          }
      
        if (!initial.current) {
            initial.current = true;
            console.log(initial.current);
            fetchReport3();
        }
    }, []);


    useEffect(() => {
        if (year) {
          const filteredRowsByYear = rows3.filter((row) => row.date.endsWith(`/${year}`));
          setFilteredRows3(filteredRowsByYear);
        } else if (month) {
          const filteredRowsByMonth = rows3.filter((row) => row.date.startsWith(`0${month}`));
          setFilteredRows3(filteredRowsByMonth);
        } else if (day) {
          const filteredRowsByDay = rows3.filter((row) => parseInt(row.date.split("/")[1]) === day);
          setFilteredRows3(filteredRowsByDay);
        } else if (year && month) {
          const filteredRowsByMonth = rows3.filter(
            (row) => row.date.startsWith(`0${month}`) && row.date.endsWith(`/${year}`)
          );
          setFilteredRows3(filteredRowsByMonth);
        } else {
          setFilteredRows3(rows3);
        }
      }, [year, month, day, rows3]);
    
      // Pagination 3
    
      useEffect(() => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        setPaginatedRows3(filteredRows3.slice(startIndex, endIndex));
      }, [filteredRows3, page, rowsPerPage]);

    return(
        <TableContainer>
          <Box sx={{display: 'flex'}}>
            {renderDropdown("รายปี", years, year, handleChangeYear)}
            {renderDropdown("รายเดือน", months, month, handleChangeMonth)}
            {month && month === "กุมภาพันธ์"
              ? renderDropdown("รายวัน", days.slice(0, 29), day, handleChangeDay)
              : month === "เมษายน" || month === "มิถุนายน" || month === "กันยายน" || month === "พฤศจิกายน"
              ? renderDropdown("รายวัน", days.slice(0, 31), day, handleChangeDay)
              : renderDropdown("รายวัน", days.slice(0, 32), day, handleChangeDay)}
            <Box sx={{marginTop:'15px', marginLeft:'20px'}}>
              <Button variant="contained" onClick={handleReset}>
                Reset
              </Button>
            </Box>
          </Box>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><Button onClick={() => {sortByInt(paginatedRows3, "order", sortOrder, setSortOrder);}}> ลำดับ </Button> </TableCell>
                  <TableCell><Button onClick={() => {sortByDate(paginatedRows3, "date", sortDate, setSortDate);}}> วันที่ </Button> </TableCell>
                  <TableCell><Button onClick={() => {sortByString(paginatedRows3, "name", sortName, setSortName);}}> ชื่อสินค้า </Button> </TableCell>
                  <TableCell><Button onClick={() => {sortByInt(paginatedRows3, "menuCount", sortMenuCount, setSortMenuCount);}}> จำนวนสินค้า </Button> </TableCell>
                  <TableCell><Button onClick={() => {sortByInt(paginatedRows3, "total", sortTotal, setSortTotal);}}> ยอดขาย </Button> </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows3.map((row, index) => (
                  <>
                  <TableRow
                    key={row._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.count}</TableCell>
                    <TableCell>{row.total} บาท</TableCell>
                    <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => {
                              const newOpen = [...open];
                              newOpen[index] = !newOpen[index];
                              setOpen(newOpen);
                            }}>
                            {open[index] ? (<AiFillCaretUp style={{ color: "blue" }} />) : (<AiFillCaretDown />)}
                          </IconButton>
                        </TableCell>
                  </TableRow>
                  <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={open[index]} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                            <h1>สินค้ายอดนิยมในวันที่ {row.date}</h1>
                              <Table size="small" aria-label="purchases">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>ลำดับ</TableCell>
                                    <TableCell>เมนู</TableCell>
                                    <TableCell>จำนวน</TableCell>
                                    <TableCell>ราคา</TableCell>
                                  </TableRow>
                                </TableHead>

                                <TableBody>
                                  {row.popular.map((rowPop) => (
                                    <TableRow
                                      key={rowPop.id}>
                                      <TableCell component="th" scope="row">
                                        {rowPop.id}
                                      </TableCell>
                                      <TableCell>{rowPop.name}</TableCell>
                                      <TableCell>{rowPop.amount}</TableCell>
                                      <TableCell>{rowPop.price} บาท</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                      </>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                {pagination(filteredRows3)}
            </Box>
          </TableContainer>
    )
}