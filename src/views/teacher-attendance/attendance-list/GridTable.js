import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Grid, Button, TextField } from '@mui/material';

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
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const [startDate, setStartDate] = useState(dayjs().startOf("month"));
    const [endDate, setEndDate] = useState(dayjs());

    const fetchAttendanceData = async () => {
        try {
            setIsLoading(true)
            const response = await axios.get('teacher/listAttendance?start=' + startDate.format('YYYY-MM-DD') + '&end=' + endDate.format('YYYY-MM-DD'), { withCredentials: true });

            setAttendanceData(response.data);
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

    // table columns
    const columns = [
        {
            field: 'teachers.name',
            headerName: 'Name',
            minWidth: 250,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row?.teachers?.name
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
                            <Grid item >
                                {
                                    user?.orgId === COMPANIES.DVOTION ?
                                        <Button variant="contained" disabled={startDate !== null && endDate !== null ? false : true} sx={{
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
                                !isLoading ?
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
