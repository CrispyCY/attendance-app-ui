// react
import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Button } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';

// project imports
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import useAuth from "hooks/useAuth";
import axios from 'utils/axios';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// ==============================|| TABLE - BASIC DATA GRID ||============================== //

export default function TableDataGrid({ Selected }) {
    const { user, logout } = useAuth();

    const theme = useTheme();
    const [pageSize, setPageSize] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const [companyData, setCompanyData] = useState(null);

    // table columns
    const columns = [
        {
            field: 'organizationName',
            headerName: 'Full name',
            width: 250
        },
        { field: 'email', headerName: 'Email', width: 220, hide: true },
        { field: 'contactNo', headerName: 'Contact', width: 220 },
        {
            field: 'paymentStatus',
            headerName: 'Payment Status',
            width: 120,
            valueGetter: (params) =>
                `${params.row.paymentStatus ? "Paid" : "Unpaid"} `
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 130,
            renderCell: (params) => renderActionButtons(params.row),
            disableExport: true
        }
    ];

    const renderActionButtons = (companyItem) => {
        return (
            <>
                <IconButton color="secondary" size="large" aria-label="edit" onClick={() => { handleClickOpen(); setToUpdate(companyItem) }}>
                    <PriceCheckIcon sx={{ fontSize: '1.3rem' }} />
                </IconButton>
                <IconButton color="primary" size="large" aria-label="view" component={Link}
                    to={`/company/company-profile/${companyItem.orgId}`}>
                    <VisibilityTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                </IconButton>
            </>
        )
    }

    const updatedColumns = user?.isAdmin
        ? columns
        : columns.filter((column) => column.field !== 'action');

    const fetchData = async () => {
        try {
            const response = await axios.get('organization', { withCredentials: true });

            setCompanyData(response.data);
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
        fetchData(); // Call the API function when the component mounts
    }, []);

    // Update Payment Status Process
    const [toUpdate, setToUpdate] = useState();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleUpdate = async () => {
        setIsLoading(true)
        try {
            await axios.post('organization/updatePaymentStatus', { orgId: toUpdate.orgId, paidStatus: true }, { withCredentials: true });

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Submit Success',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
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
            handleCloseDialog()
            setTimeout(() => {
                fetchData()
            }, 1300);
        }
    };

    return (
        <>
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
                        companyData?.length ?
                            <DataGrid
                                getRowId={(row) => row.orgId}
                                rows={companyData}
                                columns={updatedColumns}
                                onSelectionModelChange={(newSelectionModel) => {
                                    const selectedIDs = new Set(newSelectionModel);
                                    const selectedRowData = companyData.filter((row) => selectedIDs.has(row.orgId));
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
                            />
                            :
                            <Typography align="left" variant="subtitle1">
                                No companies
                            </Typography>
                        :
                        <CustomSkeleton />
                }
            </Box>
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
                                    Are you sure to update&nbsp;<Typography component="span" variant="subtitle1" color="secondary">
                                        {toUpdate.organizationName}
                                    </Typography> payment status? This action cannot be undone.
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ pr: 2.5 }}>
                            <Button
                                sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                                onClick={handleUpdate}
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
    );
}
TableDataGrid.propTypes = {
    Selected: PropTypes.func
};
