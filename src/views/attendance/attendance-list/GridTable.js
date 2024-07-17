import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Grid, Button, MenuItem, TextField } from '@mui/material';

// project imports
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import { COMPANIES, gridSpacing } from 'store/constant';
import axios from 'utils/axios';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from 'hooks/useAuth';

// third-party
import dayjs from 'dayjs';

// ==============================|| TABLE - BASIC DATA GRID ||============================== //

export default function TableDataGrid({ Selected }) {
    const theme = useTheme();
    const { user, logout } = useAuth();
    const [pageSize, setPageSize] = useState(10);
    const [attendanceData, setAttendanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const [isLoading2, setIsLoading2] = useState(false);
    const [classes, setClassesData] = useState(null);
    const [classValue, setClassValue] = useState(0);
    const [startDate, setStartDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs());

    const fetchClassData = async () => {
        try {
            const response = await axios.get('class/list', { withCredentials: true });

            setClassesData(response.data);
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
        fetchClassData(); // Call the API function when the component mounts
    }, []);

    const handleChangeClass = (event) => {
        setClassValue(event.target.value);
    };

    const fetchAttendanceData = async () => {
        try {
            setIsLoading2(true)
            const response = await axios.post('student/getAttendance', { startDate: startDate.format('YYYY-MM-DD'), endDate: endDate.format('YYYY-MM-DD'), classId: classValue }, { withCredentials: true });

            setAttendanceData(response.data);
            setIsLoading2(false)
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

    // table columns
    const columns = [
        {
            field: 'students.studentName',
            headerName: 'Name',
            minWidth: 250,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row?.students?.studentName
        },
        {
            field: 'students.email',
            headerName: 'Email',
            minWidth: 220,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row?.students?.email,
            hide: true
        },
        {
            field: 'isWalkIn',
            headerName: 'Is Walk In',
            minWidth: 150,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row?.isWalkIn ? 'Yes' : 'No'
        },
        {
            field: 'isReplacement',
            headerName: 'Is Replacement',
            minWidth: 150,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row?.isReplacement ? 'Yes' : 'No'
        },
        {
            field: 'replacementClassName',
            headerName: 'Replacement Class',
            minWidth: 350,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row?.replacementClassName === null ? '-' : params.row?.replacementClassName
        },
        {
            field: 'createdAt',
            headerName: 'Attendance Date',
            type: 'date',
            minWidth: 220,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'createdBy',
            headerName: 'Causer',
            minWidth: 220,
            align: 'left',
            headerAlign: 'left',
        },
    ];

    if (user?.orgId !== COMPANIES.DVOTION) {
        const fieldsToFilter = ['isWalkIn', 'isReplacement', 'replacementClassName'];
        fieldsToFilter.forEach((fieldToRemove) => {
            const fieldIndex = columns.findIndex((column) => column.field === fieldToRemove);
            if (fieldIndex !== -1) {
                columns.splice(fieldIndex, 1);
            }
        });
    }

    return (
        <>
            {
                !isLoading ?
                    <>
                        <Grid container spacing={gridSpacing} justifyContent="center" alignItems="stretch" >
                            <Grid item>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        id="startDate"
                                        renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                                        label="Start Date"
                                        value={startDate}
                                        inputFormat="DD/MM/YYYY"
                                        onChange={(newValue) => {
                                            setStartDate(newValue);
                                        }}
                                        disableFuture
                                        fullWidth
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        id="endDate"
                                        renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                                        label="End Date"
                                        value={endDate}
                                        inputFormat="DD/MM/YYYY"
                                        onChange={(newValue) => {
                                            setEndDate(newValue);
                                        }}
                                        disableFuture
                                        fullWidth
                                    />
                                </LocalizationProvider>
                            </Grid>
                            {
                                user?.orgId === COMPANIES.DVOTION ?
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
                                            {classes?.map((classItem) => (
                                                <MenuItem key={classItem.id} value={classItem.id}>
                                                    {classItem.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    :
                                    <></>
                            }
                            <Grid item >
                                {
                                    user?.orgId === COMPANIES.DVOTION ?
                                        <Button variant="contained" disabled={startDate !== null && endDate !== null && classValue !== 0 ? false : true} sx={{
                                            margin: 0,
                                            height: '100%',
                                            width: '100%',
                                        }}
                                            onClick={() => { fetchAttendanceData() }}>
                                            Filter
                                        </Button>
                                        :
                                        <Button variant="contained" disabled={startDate !== null && endDate !== null ? false : true} sx={{
                                            margin: 0,
                                            height: '100%',
                                            width: '100%',
                                        }}
                                            onClick={() => { fetchAttendanceData() }}>
                                            Filter
                                        </Button>
                                }
                            </Grid>
                        </Grid>
                        <Box
                            sx={{
                                height: 400,
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
                                !isLoading2 ?
                                    <DataGrid
                                        getRowId={(row) => row.id}
                                        rows={attendanceData}
                                        columns={columns}
                                        onSelectionModelChange={(newSelectionModel) => {
                                            const selectedIDs = new Set(newSelectionModel);
                                            const selectedRowData = attendanceData.filter((row) => selectedIDs.has(row.id));
                                            Selected(selectedRowData);
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
                                    <CustomSkeleton />
                            }
                        </Box>
                    </>
                    :
                    <CustomSkeleton />
            }
        </>
    );
}
TableDataGrid.propTypes = {
    Selected: PropTypes.func,
    Prop: PropTypes.array
};
