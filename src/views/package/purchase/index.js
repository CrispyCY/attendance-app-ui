import { useState, useEffect } from 'react';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import {
    Grid, Button, Box,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Typography,
} from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// project imports
import { COMPANIES, gridSpacing } from 'store/constant';
import MainCard from 'ui-component/cards/MainCard';
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/slices/snackbar';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import { useDispatch } from 'store';
import axios from 'utils/axios';

// ==============================|| TABLE - BASIC ||============================== //


const formatDateTime = (params) => {
    params = new Date(params)
    let formattedDate = params.getDate() + "-" + (params.getMonth() + 1) + "-" + params.getFullYear()

    return formattedDate
}

export default function PurchasePackage() {
    const { user, logout } = useAuth();
    const { packageId } = useParams();

    const theme = useTheme();
    const [pageSize, setPageSize] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
            hide: true,
            valueGetter: (params) =>
                `${params.row.email ? params.row.email : "-"} `
        },
        {
            field: 'slot_count',
            headerName: 'Classes',
            width: 70,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'slot_expiry_date',
            headerName: 'Classes Expiry Date',
            type: 'date',
            width: 165,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => formatDateTime(params.row.slot_expiry_date),
        },
        {
            field: 'phone_no1',
            headerName: 'Contact 1',
            width: 135
        },
        {
            field: 'phone_no2',
            headerName: 'Contact 2',
            width: 135,
            valueGetter: (params) =>
                `${params.row.phone_no2 ? params.row.phone_no2 : "-"} `,
            hide: true
        }
    ];

    if (user?.orgId === COMPANIES.DVOTION) {
        const fieldsToFilter = ['slot_count', 'slot_expiry_date'];
        fieldsToFilter.forEach((fieldToRemove) => {
            const fieldIndex = columns.findIndex((column) => column.field === fieldToRemove);
            if (fieldIndex !== -1) {
                columns.splice(fieldIndex, 1);
            }
        });
    }

    // Get Student Data
    const [studentData, setStudentData] = useState(null);

    const fetchStudentData = async () => {
        try {
            const response = await axios.get('student', { withCredentials: true });

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
        }
    };

    useEffect(() => {
        fetchStudentData(); // Call the API function when the component mounts
    }, []);

    const [selectedValue, setSelectedValue] = useState([]);

    // Purchase package Action
    const [studentIds, setStudentIds] = useState([]);
    const [studentNames, setStudentNames] = useState([]);
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleCloseDialog = () => {
        setOpen(false);
    };

    const purchasePackage = async () => {
        try {
            setIsLoading(true)

            await axios.post('package-transac', { studentIds: studentIds, packageId: packageId }, { withCredentials: true });

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
            setSelectedValue([])
            setOpen(false);
            setTimeout(() => {
                setIsLoading(false)
                navigate('/package/package-list', { replace: true })
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
                                        <DataGrid
                                            getRowId={(row) => row.id}
                                            rows={studentData}
                                            columns={columns}
                                            onSelectionModelChange={(newSelectionModel) => {
                                                const selectedIDs = new Set(newSelectionModel);
                                                const selectedRowData = studentData.filter((row) => selectedIDs.has(row.id));
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
                                const studentIds = selectedValue.length > 0 ? selectedValue.map(item => item.id) : [];
                                const studentNames = selectedValue.length > 0 ? selectedValue.map(item => item.name) : [];
                                setStudentNames(studentNames)
                                setStudentIds(studentIds)
                                handleClickOpen();
                            }
                        }>
                            Buy Package
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
                                            Are you sure to buy package for&nbsp;<Typography component="span" variant="subtitle1" color="secondary">
                                                {studentNames.join(', ')}
                                            </Typography>? This action cannot be undone.
                                        </Typography>
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions sx={{ pr: 2.5 }}>
                                    <Button
                                        sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                                        onClick={purchasePackage}
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
