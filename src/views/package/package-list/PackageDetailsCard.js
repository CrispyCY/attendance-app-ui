import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
    Button, Card, Grid,
    // ListItemIcon, 
    // Menu,
    // MenuItem, 
    Typography,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide
} from '@mui/material';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// project imports
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import { gridSpacing } from 'store/constant';
import DropDownActions from './DropDownActions';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from 'hooks/useAuth';
import axios from 'utils/axios';

// assets
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TagIcon from '@mui/icons-material/Tag';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

// ==============================|| SOCIAL PROFILE - FOLLOWER CARD ||============================== //

const PackageDetailsCard = () => {
    const { logout } = useAuth();
    const theme = useTheme();
    const [packageData, setPackageData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const fetchData = async () => {
        try {
            const response = await axios.get('package', { withCredentials: true });

            setPackageData(response.data);
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

    // Delete Process
    const [toDelete, setToDelete] = useState();
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            await axios.delete('package/' + toDelete.id, { withCredentials: true });

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
            {
                !isLoading ? (
                    packageData?.length ? (
                        <>
                            <Grid container spacing={gridSpacing}>
                                {Array.from(packageData)?.map((packageItem) => (
                                    <Grid item xs={12} md={6} key={packageItem.id}>
                                        <Card
                                            sx={{
                                                padding: '16px',
                                                background:
                                                    theme.palette.mode === 'dark'
                                                        ? theme.palette.dark.main
                                                        : theme.palette.grey[50],
                                                border:
                                                    '1px solid',
                                                borderColor:
                                                    theme.palette.mode === 'dark'
                                                        ? theme.palette.dark.main
                                                        : theme.palette.grey[100],
                                                '&:hover': {
                                                    border: `1px solid${theme.palette.primary.main}`,
                                                },
                                            }}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs zeroMinWidth>
                                                            <Typography
                                                                variant="h3"
                                                                component="div"
                                                                sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                                                            >
                                                                {packageItem.name}
                                                            </Typography>
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                                                            >
                                                                <AttachMoneyIcon sx={{ mr: '6px', fontSize: '16px', verticalAlign: 'text-top' }} />
                                                                RM{packageItem.price ? packageItem.price : 0.00}
                                                            </Typography>
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                                                            >
                                                                <TagIcon sx={{ mr: '6px', fontSize: '16px', verticalAlign: 'text-top' }} />
                                                                {packageItem.slot ? packageItem.slot : 0} classes
                                                            </Typography>
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{ mt: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                                                            >
                                                                <CalendarMonthIcon sx={{ mr: '6px', fontSize: '16px', verticalAlign: 'text-top' }} />
                                                                {packageItem.expiry_days ? packageItem.expiry_days : 0} days
                                                            </Typography>
                                                        </Grid>
                                                        <DropDownActions prop={packageItem} />
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button variant="contained" fullWidth startIcon={<ShoppingCartIcon />} component={Link}
                                                        to={`/package/purchase-package/${packageItem.id}`}>
                                                        Purchase
                                                    </Button>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Button sx={{
                                                        color: theme.palette.error.main,
                                                        borderColor: theme.palette.error.main,
                                                        '&:hover': {
                                                            background: theme.palette.error.light + 25,
                                                            borderColor: theme.palette.error.main
                                                        }
                                                    }}
                                                        variant="outlined" fullWidth startIcon={<DeleteIcon />}
                                                        onClick={() => { handleClickOpen(); setToDelete(packageItem) }}>
                                                        Delete
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                    </Grid>
                                ))}
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
                                                    Are you sure to delete&nbsp;<Typography component="span" variant="subtitle1" color="secondary">
                                                        {toDelete.name}
                                                    </Typography>? This action cannot be undone.
                                                </Typography>
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions sx={{ pr: 2.5 }}>
                                            <Button
                                                sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                                                onClick={handleDelete}
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
                    ) : (
                        <Typography align="left" variant="subtitle1">
                            No Packages
                        </Typography>
                    )
                ) : (
                    <CustomSkeleton />
                )
            }
        </>
    );
};

PackageDetailsCard.propTypes = {
    avatar: PropTypes.string,
    follow: PropTypes.number,
    location: PropTypes.string,
    name: PropTypes.string
};

export default PackageDetailsCard;
