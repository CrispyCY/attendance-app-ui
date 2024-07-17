import { useState, useEffect } from 'react';
import React from 'react';

// material-ui
import {
    Checkbox, FormControlLabel, Grid, Button, MenuItem, TextField, Box,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography, AppBar, Tabs, Tab
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PropTypes from 'prop-types';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// project imports
import { COMPANIES, SUBSCRIPTION_STATUSES, gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/slices/snackbar';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import { useDispatch } from 'store';
import axios from 'utils/axios';

// third-party
import dayjs from 'dayjs';

// ==============================|| TABLE - BASIC ||============================== //


const formatDateTime = (params) => {
    params = new Date(params)
    let formattedDate = params.getDate() + "-" + (params.getMonth() + 1) + "-" + params.getFullYear()

    return formattedDate
}

export default function AttendanceList() {
    const { user, organization, logout } = useAuth();
    const premium = organization?.subscriptionStatus === SUBSCRIPTION_STATUSES.PREMIUM ? true : true;

    const theme = useTheme();
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const [attendanceDate, setAttendanceDate] = useState(dayjs());

    // table columns
    const columns = [
        {
            field: 'studentName',
            headerName: 'Full name',
            width: 250,
        },
        {
            field: 'studentCode',
            headerName: 'ID',
            width: 110,
            align: 'left',
            headerAlign: 'left',
            hide: true,
        },
        {
            field: 'studentGroupName',
            headerName: 'Group',
            width: 135,
            valueGetter: (params) =>
                `${params.row.studentGroupName ? params.row.studentGroupName : "-"} `,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            hide: true,
            valueGetter: (params) =>
                `${params.row.email ? params.row.email : "-"} `
        },
        {
            field: 'slot',
            headerName: 'Classes',
            width: 70,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'overallClasses',
            headerName: 'Total Classes',
            width: 120,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'slotExpiryDate',
            headerName: 'Classes Expiry Date',
            type: 'date',
            width: 165,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => formatDateTime(params.row.slotExpiryDate),
        },
        {
            field: 'classNames',
            headerName: 'Class Names',
            width: 450,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row.classNames,
        },
        {
            field: 'guardianContact1',
            headerName: 'Contact 1',
            width: 135
        },
        {
            field: 'guardianContact2',
            headerName: 'Contact 2',
            width: 135,
            valueGetter: (params) =>
                `${params.row.guardianContact2 ? params.row.guardianContact2 : "-"} `,
            hide: true
        }
    ];
    if (!premium) {
        const fieldsToFilter = ['slot', 'overallClasses', 'slotExpiryDate', 'studentGroupName', 'classNames', 'studentCode'];
        fieldsToFilter.forEach((fieldToRemove) => {
            const fieldIndex = columns.findIndex((column) => column.field === fieldToRemove);
            if (fieldIndex !== -1) {
                columns.splice(fieldIndex, 1);
            }
        });
    } else {
        if (user?.orgId === COMPANIES.DVOTION) {
            const fieldsToFilter = ['slot', 'slotExpiryDate', 'studentGroupName'];
            fieldsToFilter.forEach((fieldToRemove) => {
                const fieldIndex = columns.findIndex((column) => column.field === fieldToRemove);
                if (fieldIndex !== -1) {
                    columns.splice(fieldIndex, 1);
                }
            });
        }

        if (user?.orgId === COMPANIES.WUSHU) {
            const fieldsToFilter = ['classNames'];
            fieldsToFilter.forEach((fieldToRemove) => {
                const fieldIndex = columns.findIndex((column) => column.field === fieldToRemove);
                if (fieldIndex !== -1) {
                    columns.splice(fieldIndex, 1);
                }
            });
        }
    }

    // Get Unattend Data
    const [studentData, setStudentData] = useState(null);
    const [absentStudents, setAbsentStudents] = useState();
    const [absentStudents2, setAbsentStudents2] = useState();
    const [absentStudents3, setAbsentStudents3] = useState();

    const fetchUnattendData = async () => {
        try {
            let response
            if (!premium) {
                response = await axios.get('student', { withCredentials: true });
            } else {
                response = await axios.get('student/unattendedStudents', { withCredentials: true });

                if (user?.orgId === COMPANIES.DVOTION) {
                    for (const key in response.data) {
                        for (const key2 in response.data[key]) {
                            if (key2 === 'classes') {
                                const namesArray = response.data[key][key2].map(item => item.name);
                                const mergedNamesString = namesArray.join(', ');
                                response.data[key].classNames = mergedNamesString
                            }
                        }
                    }
                }

                const group1Data = [];
                const group2Data = [];
                const group3Data = [];

                if (user?.orgId === COMPANIES.WUSHU) {
                    for (const key in response.data) {
                        if (response.data[key].studentGroupId === 1) {
                            group1Data.push(response.data[key]);
                        } else if (response.data[key].studentGroupId === 2) {
                            group2Data.push(response.data[key]);
                        } else if (response.data[key].studentGroupId === 3) {
                            group3Data.push(response.data[key]);
                        }
                    }
                }

                setAbsentStudents(group1Data);
                setAbsentStudents2(group2Data);
                setAbsentStudents3(group3Data);
            }

            setStudentData(response.data);
            setIsLoading(false)
        } catch (error) {
            if (error?.response?.status === 401) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Login Expired! Please re-login!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
                await logout();
            } else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Error Occurred!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
            }
            console.log(error)
        }
    };

    useEffect(() => {
        fetchUnattendData(); // Call the API function when the component mounts
    }, []);

    const [selectedValue, setSelectedValue] = useState([]);

    // Walk In & Replacement states
    const [isWalkIn, setIsWalkIn] = useState(false);
    const [isReplacement, setIsReplacement] = useState(false);

    const handleIsReplacement = (event) => {
        setIsReplacement(event.target.checked);
    };

    const handleIsWalkIn = (event) => {
        setIsWalkIn(event.target.checked);
    };

    // Get Class Data
    const [classData, setClassData] = useState(null);
    const [classValue, setClassValue] = useState(0);
    const [replacementClassValue, setReplacementClassValue] = useState(0);

    // Filter out only today's class
    // const d = new Date();
    // let today = d.getDay();

    const fetchClassData = async () => {
        try {
            const response = await axios.get('class/list', { withCredentials: true });

            setClassData(response.data);
            setIsLoading(false)
        } catch (error) {
            if (error?.response?.status === 401) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Login Expired! Please re-login!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
                await logout();
            } else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Error Occurred!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
            }
            console.log(error)
        }
    };

    useEffect(() => {
        if (user?.orgId === COMPANIES.DVOTION) {
            fetchClassData(); // Call the API function when the component mounts
        }
    }, []);

    const handleChangeClass = (event) => {
        setClassValue(event.target.value);
    };

    const handleChangeReplacementClass = (event) => {
        setReplacementClassValue(event.target.value);
    };

    // Mark Attendance Action
    const [studentIds, setStudentIds] = useState([]);
    const [studentNames, setStudentNames] = useState([]);
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleCloseDialog = () => {
        setOpen(false);
    };

    const markAttendance = async () => {
        try {
            setIsLoading(true)
            let payload
            if (user?.orgId === COMPANIES.DVOTION) {
                payload = { studentIds: studentIds, date: attendanceDate.format('YYYY-MM-DD'), classId: classValue, isReplacement: isReplacement, isWalkIn: isWalkIn }
                if (isReplacement == true) {
                    payload.replacementClassId = replacementClassValue
                }
            } else {
                payload = { studentIds: studentIds }
            }

            await axios.post('student/attendance', payload, { withCredentials: true });

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Submit Success',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: true
                })
            );
        } catch (error) {
            if (error?.response?.status === 401) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Login Expired! Please re-login!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
                await logout();
            }
            if (error?.response?.status === 400) {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: user?.orgId === COMPANIES.WUSHU ? 'You have exceeded monthly WhatsApp message quota, please contact customer support' : 'Error Occurred!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
            } else {
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Error Occurred!',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
            }
            console.log(error)
        } finally {
            // Reset form state after submission (if needed)
            fetchUnattendData()
            setSelectionModel([])
            setSelectedValue([])
            setIsReplacement(false)
            setIsWalkIn(false)
            setClassValue(0)
            setOpen(false);
            setTimeout(() => {
                setIsLoading(false)
            }, 1400);
        }
    };

    // Wushu tab display
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 0 }}>
                        {/* <Typography>{children}</Typography> */}
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
    const [selectionModel, setSelectionModel] = useState([]);

    return (
        <Grid container spacing={gridSpacing} justifyContent="center">
            {!isLoading ?
                <>
                    <Grid item xs={12}>
                        {/* table data grid */}
                        <MainCard
                            content={false}
                            title="Students"
                        >
                            {/* table data grid */}
                            <Box
                                sx={{
                                    height: 650,
                                    width: '100%',
                                    '& .MuiDataGrid-root': {
                                        border: 'none',
                                        '& .MuiDataGrid-cell': {
                                            borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                                        },
                                        '& .MuiDataGrid-columnsContainer': {
                                            color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
                                            borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                                        },
                                        '& .MuiDataGrid-columnSeparator': {
                                            color: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                                        }
                                    }
                                }}
                            >
                                {
                                    studentData?.length ?
                                        user?.orgId !== COMPANIES.WUSHU ?
                                            <DataGrid
                                                getRowId={(row) => row.studentId}
                                                rows={studentData}
                                                columns={columns}
                                                onSelectionModelChange={(newSelectionModel) => {
                                                    const selectedIDs = new Set(newSelectionModel);
                                                    const selectedRowData = studentData.filter((row) => selectedIDs.has(row.studentId));
                                                    setSelectedValue(selectedRowData);
                                                }}
                                                pageSize={pageSize}
                                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                                rowsPerPageOptions={[5, 10, 20]}
                                                checkboxSelection
                                                disableSelectionOnClick
                                                components={{
                                                    Toolbar: GridToolbar,
                                                }}
                                                density="compact"
                                            />
                                            :
                                            <>
                                                <AppBar position="static" sx={{ height: 50 }}>
                                                    <Tabs
                                                        value={tabValue}
                                                        onChange={handleChange}
                                                        indicatorColor="secondary"
                                                        textColor="inherit"
                                                        variant="scrollable"
                                                        aria-label="full width tabs example"
                                                    >
                                                        <Tab label="Group A" {...a11yProps(0)} />
                                                        <Tab label="Group B" {...a11yProps(1)} />
                                                        <Tab label="Group C" {...a11yProps(2)} />
                                                    </Tabs>
                                                </AppBar>
                                                <TabPanel value={tabValue} index={0} dir={theme.direction}>
                                                    <DataGrid
                                                        style={{ height: 600 }}
                                                        getRowId={(row) => row.studentId}
                                                        rows={absentStudents}
                                                        columns={columns}
                                                        onSelectionModelChange={(newSelectionModel) => {
                                                            setSelectionModel(newSelectionModel);
                                                            const selectedIDs = new Set(newSelectionModel);
                                                            const selectedRowData = absentStudents.filter((row) => selectedIDs.has(row.studentId));
                                                            setSelectedValue(selectedRowData);
                                                        }}
                                                        pageSize={pageSize}
                                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                                        rowsPerPageOptions={[5, 10, 20]}
                                                        checkboxSelection
                                                        disableSelectionOnClick
                                                        components={{
                                                            Toolbar: GridToolbar,
                                                        }}
                                                        density="compact"
                                                        selectionModel={selectionModel}
                                                    />
                                                </TabPanel>
                                                <TabPanel value={tabValue} index={1} dir={theme.direction}>
                                                    <DataGrid
                                                        style={{ height: 600 }}
                                                        getRowId={(row) => row.studentId}
                                                        rows={absentStudents2}
                                                        columns={columns}
                                                        onSelectionModelChange={(newSelectionModel) => {
                                                            setSelectionModel(newSelectionModel);
                                                            const selectedIDs = new Set(newSelectionModel);
                                                            const selectedRowData = absentStudents2.filter((row) => selectedIDs.has(row.studentId));
                                                            setSelectedValue(selectedRowData);
                                                        }}
                                                        pageSize={pageSize}
                                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                                        rowsPerPageOptions={[5, 10, 20]}
                                                        checkboxSelection
                                                        disableSelectionOnClick
                                                        components={{
                                                            Toolbar: GridToolbar,
                                                        }}
                                                        density="compact"
                                                        selectionModel={selectionModel}
                                                    />
                                                </TabPanel>
                                                <TabPanel value={tabValue} index={2} dir={theme.direction}>
                                                    <DataGrid
                                                        style={{ height: 600 }}
                                                        getRowId={(row) => row.studentId}
                                                        rows={absentStudents3}
                                                        columns={columns}
                                                        onSelectionModelChange={(newSelectionModel) => {
                                                            setSelectionModel(newSelectionModel);
                                                            const selectedIDs = new Set(newSelectionModel);
                                                            const selectedRowData = absentStudents3.filter((row) => selectedIDs.has(row.studentId));
                                                            setSelectedValue(selectedRowData);
                                                        }}
                                                        pageSize={pageSize}
                                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                                        rowsPerPageOptions={[5, 10, 20]}
                                                        checkboxSelection
                                                        disableSelectionOnClick
                                                        components={{
                                                            Toolbar: GridToolbar,
                                                        }}
                                                        density="compact"
                                                        selectionModel={selectionModel}
                                                    />
                                                </TabPanel>
                                            </>
                                        :
                                        <CustomSkeleton />
                                }
                            </Box>
                        </MainCard>

                    </Grid>
                    <Grid item xs={4}>
                        {user?.orgId === COMPANIES.DVOTION ?
                            <>
                                <Grid container spacing={gridSpacing} justifyContent="center" sx={{ mb: 1 }} >
                                    <Grid item>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                id="attendanceDate"
                                                renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                                                label="Attendance Date"
                                                value={attendanceDate}
                                                inputFormat="DD/MM/YYYY"
                                                onChange={(newValue) => {
                                                    setAttendanceDate(newValue);
                                                }}
                                                minDate={dayjs().startOf("month")}
                                                disableFuture
                                                fullWidth
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item>
                                        <TextField
                                            id="classValue"
                                            select
                                            fullWidth
                                            label="Class"
                                            value={classValue}
                                            onChange={handleChangeClass}
                                        >
                                            <MenuItem disabled value='0'>
                                                <em>Select a class...</em>
                                            </MenuItem>
                                            {classData?.map((classItem) => (
                                                // classItem?.day === today ? (
                                                //     <MenuItem key={classItem.id} value={classItem.id}>
                                                //         {classItem.name}
                                                //     </MenuItem>
                                                // ) : (
                                                //     null // or you can use <React.Fragment key={classItem.id} />
                                                // )
                                                <MenuItem key={classItem.id} value={classItem.id}>
                                                    {classItem.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item >
                                        <FormControlLabel control={<Checkbox checked={isWalkIn}
                                            onChange={handleIsWalkIn} />} label="Is Walk In" />
                                    </Grid>
                                    <Grid item>
                                        <FormControlLabel control={<Checkbox checked={isReplacement}
                                            onChange={handleIsReplacement} />} label="Is Replacement" />
                                    </Grid>
                                    {
                                        isReplacement ?
                                            <Grid item>
                                                <TextField
                                                    id="replacementClassValue"
                                                    select
                                                    fullWidth
                                                    label="ReplacementClass"
                                                    value={replacementClassValue}
                                                    onChange={handleChangeReplacementClass}
                                                >
                                                    <MenuItem disabled value='0'>
                                                        <em>Select a class...</em>
                                                    </MenuItem>
                                                    {classData?.map((classItem) => (
                                                        <MenuItem key={classItem.id} value={classItem.id}>
                                                            {classItem.name}
                                                        </MenuItem>
                                                    ))}
                                                </TextField>
                                            </Grid>
                                            :
                                            <></>
                                    }
                                </Grid>
                            </>
                            : <></>
                        }
                        <Button variant="contained" disabled={selectedValue.length > 0 ? false : true} fullWidth onClick={
                            () => {
                                const studentIds = selectedValue.length > 0 ? selectedValue.map(item => item.studentId) : [];
                                const studentNames = selectedValue.length > 0 ? selectedValue.map(item => item.studentName) : [];
                                setStudentNames(studentNames)
                                setStudentIds(studentIds)
                                handleClickOpen();
                            }
                        }>
                            Mark Attend
                        </Button>
                    </Grid>
                    <Dialog
                        open={open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={handleCloseDialog}
                        aria-labelledby="alert-dialog-slide-title1"
                        aria-describedby="alert-dialog-slide-description1"
                    >
                        {open && (
                            <>
                                <DialogTitle id="alert-dialog-slide-title1">Hold On...</DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-slide-description1">
                                        <Typography variant="body2" component="span">
                                            Are you sure to mark attend for&nbsp;<Typography component="span" variant="subtitle1" color="secondary">
                                                {studentNames.join(', ')}
                                            </Typography>? This action cannot be undone.
                                        </Typography>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions sx={{ pr: 2.5 }}>
                                    <Button
                                        sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                                        onClick={markAttendance}
                                        color="secondary"
                                    >
                                        OK
                                    </Button>
                                    <Button variant="contained" size="small" onClick={handleCloseDialog}>
                                        Cancel
                                    </Button>
                                </DialogActions>
                            </>
                        )}
                    </Dialog>
                </>
                :
                <CustomSkeleton />
            }
        </Grid >
    );
}
