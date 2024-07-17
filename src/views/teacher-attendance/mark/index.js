import { useState, useEffect } from 'react';
import React from 'react';

// material-ui
import {
    Grid, Button, Box,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// project imports
import { gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/slices/snackbar';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import { useDispatch } from 'store';
import axios from 'utils/axios';

// third-party

// ==============================|| TABLE - BASIC ||============================== //

export default function AttendanceList() {
    const { logout } = useAuth();

    const theme = useTheme();
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    // table columns
    const columns = [
        {
            field: 'name',
            headerName: 'Full name',
            width: 250,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            valueGetter: (params) =>
                `${params.row.email ? params.row.email : "-"} `
        },
        {
            field: 'contactNo',
            headerName: 'Contact No',
            width: 135,
            valueGetter: (params) =>
                `${params.row.contactNo ? params.row.contactNo : "-"} `
        }
    ];

    // Get Unattend Data
    const [teacherData, setTeacherData] = useState(null);

    const fetchUnattendData = async () => {
        try {
            const response = await axios.get('teacher/list', { withCredentials: true });

            setTeacherData(response.data);
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

    // Mark Attendance Action
    const [teacherIds, setTeacherIds] = useState([]);
    const [teacherNames, setTeacherNames] = useState([]);
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
            payload = { teacherIds: teacherIds }

            await axios.post('teacher/attendance', payload, { withCredentials: true });

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
            setSelectedValue([])
            setOpen(false);
            setTimeout(() => {
                setIsLoading(false)
            }, 1400);
        }
    };

    return (
        <Grid container spacing={gridSpacing} justifyContent="center">
            {!isLoading ?
                <>
                    <Grid item xs={12}>
                        {/* table data grid */}
                        <MainCard
                            content={false}
                            title="Teachers"
                        >
                            {/* table data grid */}
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
                                    teacherData?.length ?
                                        <DataGrid
                                            getRowId={(row) => row.id}
                                            rows={teacherData}
                                            columns={columns}
                                            onSelectionModelChange={(newSelectionModel) => {
                                                const selectedIDs = new Set(newSelectionModel);
                                                const selectedRowData = teacherData.filter((row) => selectedIDs.has(row.id));
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
                                        <CustomSkeleton />
                                }
                            </Box>
                        </MainCard>

                    </Grid>
                    <Grid item xs={4}>
                        <Button variant="contained" disabled={selectedValue.length > 0 ? false : true} fullWidth onClick={
                            () => {
                                const teacherIds = selectedValue.length > 0 ? selectedValue.map(item => item.id) : [];
                                const teacherNames = selectedValue.length > 0 ? selectedValue.map(item => item.name) : [];
                                setTeacherNames(teacherNames)
                                setTeacherIds(teacherIds)
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
                                                {teacherNames.join(', ')}
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
