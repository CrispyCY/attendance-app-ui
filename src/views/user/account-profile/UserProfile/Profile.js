import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';

// material-ui
import {
    Avatar, Button, Grid, Stack, TextField, Typography,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@mui/material/styles';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import { useDispatch } from 'store';
import { PHONE_NO_REGEX } from 'store/constant';
import axios from 'utils/axios';
import useAuth from "hooks/useAuth";

// assets
import Avatar1 from 'assets/images/users/avatar-user.png';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';
import dayjs from 'dayjs';

const validationSchema = yup.object({
    memberName: yup.string().min(5, 'Name should be of minimum 5 characters length').required('Name is required'),
    email: yup.string()
        .notRequired()
        .nullable()
        .default(null)
        .email('Email is invalid'),
    contactNo: yup.string()
        .required('At least 1 phone number is required')
        .matches(PHONE_NO_REGEX, 'Phone number is not in correct format'),
    doB: yup.date()
        .notRequired()
        .nullable(),
    address1: yup.string()
        .notRequired()
        .nullable()
        .default(null),
    bio: yup.string()
        .notRequired()
        .nullable()
        .default(null)
});

// ==============================|| PROFILE 3 - PROFILE ||============================== //

const Profile = (prop) => {
    const theme = useTheme();
    const { user, logout } = useAuth();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [doBInput, setDoBInput] = useState(prop.userDetail?.doB ? dayjs(prop.userDetail)?.doB : dayjs());

    const formik = useFormik({
        initialValues: {
            memberName: prop.userDetail?.memberName,
            email: prop.userDetail?.email,
            contactNo: prop.userDetail?.contactNo,
            doB: dayjs(prop.userDetail?.doB),
            address: prop.userDetail?.address,
            bio: prop.userDetail?.bio,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Check if email and guardianContact2 are empty or undefined
                if (values.email === '' || values.email === undefined) {
                    delete values.email; // Remove the email field from values
                }
                if (values.guardianContact2 === '' || values.guardianContact2 === undefined) {
                    delete values.guardianContact2; // Remove the guardianContact2 field from values
                }
                if (values.guardianContact2 === '' || values.guardianContact2 === undefined) {
                    delete values.guardianContact2; // Remove the guardianContact2 field from values
                }
                values.doB = doBInput.format('YYYY-MM-DD')
                values.memberId = prop.userDetail?.memberId

                await axios.post('member/update', values, { withCredentials: true });

                setIsLoading(true)
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
                setTimeout(() => {
                    navigate('/user/user-list', { replace: true });
                }, 1300);
            } catch (error) {
                // Handle network errors or other exceptions
                console.error('Error occurred:', error);

                // Optionally, dispatch Snackbar action for error
                dispatch(
                    openSnackbar({
                        open: true,
                        message: 'Error Occurred',
                        variant: 'alert',
                        alert: {
                            color: 'error'
                        },
                        close: true
                    })
                );
                navigate('/user/user-list', { replace: true });
            } finally {
                // Reset form state after submission (if needed)
                setSubmitting(false);
            }
        }
    });

    // Delete action
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleCloseDialog = () => {
        setOpen(false);
    };

    const handleToggleStatus = async () => {
        setIsLoading(true)
        try {
            await axios.post('member/toggleStatus?memberId=' + prop.userDetail?.memberId, { withCredentials: true });

            dispatch(
                openSnackbar({
                    open: true,
                    message: 'Update Success',
                    variant: 'alert',
                    alert: {
                        color: 'success'
                    },
                    close: false
                })
            );

            setTimeout(() => {
                navigate('/user/user-list', { replace: true });
            }, 1300);
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
            navigate('/user/user-list', { replace: true });
        } finally {
            // Reset form state after submission (if needed)
        }
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item sm={6} md={4}>
                <SubCard title={prop.userDetail?.memberName} contentSX={{ textAlign: 'center' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Avatar alt="User 1" src={Avatar1} sx={{ width: 100, height: 100, margin: '0 auto' }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" align="center">
                                {prop.userDetail?.bio ? prop.userDetail?.bio : 'Hello, my name is ' + prop.userDetail?.memberName}
                            </Typography>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item sm={6} md={8}>
                <SubCard title="Edit Account Details">
                    {!isLoading ?
                        <form autoComplete="off" onSubmit={formik.handleSubmit}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="memberName"
                                        fullWidth
                                        label="Name"
                                        name="memberName"
                                        value={formik.values.memberName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.memberName && Boolean(formik.errors.memberName)}
                                        helperText={formik.touched.memberName && formik.errors.memberName}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="email"
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        error={formik.touched.email && Boolean(formik.errors.email)}
                                        helperText={formik.touched.email && formik.errors.email}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="contactNo"
                                        fullWidth
                                        label="Contact Number"
                                        name="contactNo"
                                        value={formik.values.contactNo}
                                        onChange={formik.handleChange}
                                        error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
                                        helperText={formik.touched.contactNo && formik.errors.contactNo}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            id="doB"
                                            renderInput={(props) => <TextField fullWidth {...props} helperText="" />}
                                            label="Birthday"
                                            value={doBInput}
                                            inputFormat="DD-MM-YYYY"
                                            onChange={(newValue) => {
                                                setDoBInput(newValue);
                                            }}
                                            disableFuture
                                            fullWidth
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="address"
                                        fullWidth
                                        label="Address"
                                        name="address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        error={formik.touched.address && Boolean(formik.errors.address)}
                                        helperText={formik.touched.address && formik.errors.address}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="bio"
                                        fullWidth
                                        label="Short Bio"
                                        name="bio"
                                        value={formik.values.bio}
                                        onChange={formik.handleChange}
                                        error={formik.touched.bio && Boolean(formik.errors.bio)}
                                        helperText={formik.touched.bio && formik.errors.bio}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row">
                                        <AnimateButton>
                                            <Button variant="contained" type="submit">Change Details</Button>
                                        </AnimateButton>
                                        {
                                            prop.userDetail?.memberId !== user?.memberId
                                                ?
                                                <AnimateButton>
                                                    <Button sx={{ color: theme.palette.error.main }} onClick={() => { handleClickOpen(); }}>
                                                        {prop.userDetail?.status ? 'Deactivate' : 'Reactivate'}
                                                    </Button>
                                                </AnimateButton>
                                                :
                                                <></>
                                        }
                                    </Stack>
                                </Grid>
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
                                                    Are you sure to {prop.userDetail?.status ? 'deactivate' : 'reactivate'}&nbsp;<Typography component="span" variant="subtitle1" color="secondary">
                                                        {prop.userDetail?.memberName ?? ''}
                                                    </Typography>?
                                                </Typography>
                                            </DialogContentText>
                                        </DialogContent>
                                        <DialogActions sx={{ pr: 2.5 }}>
                                            <Button
                                                sx={{ color: theme.palette.error.dark, borderColor: theme.palette.error.dark }}
                                                onClick={handleToggleStatus}
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
                        </form>
                        :
                        <CustomSkeleton />
                    }
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default Profile;
