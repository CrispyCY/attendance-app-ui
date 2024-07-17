import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';

// material-ui
import {
    Avatar, Button, Grid, Stack, TextField, Typography,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// animation
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { PHONE_NO_REGEX } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import useAuth from "hooks/useAuth";
import { useDispatch } from 'store';
import axios from 'utils/axios';

// assets
import Avatar1 from 'assets/images/users/avatar-user.png';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    name: yup.string().min(5, 'Name should be of minimum 5 characters length').required('Name is required'),
    email: yup.string()
        .notRequired()
        .nullable()
        .default(null)
        .email('Email is invalid'),
    contactNo: yup.string()
        .required('At least 1 phone number is required')
        .matches(PHONE_NO_REGEX, 'Phone number is not in correct format'),
});

// ==============================|| PROFILE 3 - PROFILE ||============================== //

const Profile = (prop) => {
    const { logout } = useAuth();
    const theme = useTheme();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: prop.teacherDetail?.name ?? '',
            email: prop.teacherDetail?.email ?? '',
            contactNo: prop.teacherDetail?.contactNo ?? '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.id = prop.teacherDetail?.id
                values.status = true

                await axios.post('teacher/update', values, { withCredentials: true });

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
                    navigate('/teacher/teacher-list', { replace: true });
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
                navigate('/teacher/teacher-list', { replace: true });
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

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            await axios.post('teacher/remove?id=' + prop.teacherDetail?.id, { withCredentials: true });

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
                navigate('/teacher/teacher-list', { replace: true });
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
            navigate('/teacher/teacher-list', { replace: true });
        } finally {
            // Reset form state after submission (if needed)
        }
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item sm={6} md={4}>
                <SubCard title={prop.teacherDetail?.name} contentSX={{ textAlign: 'center' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Avatar alt="User 1" src={Avatar1} sx={{ width: 100, height: 100, margin: '0 auto' }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" align="center">
                                {prop.teacherDetail?.bio ? prop.teacherDetail?.bio : prop.teacherDetail?.name + '...'}
                            </Typography>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
            <Grid item sm={6} md={8}>
                <SubCard title="Edit Profile Details">
                    {!isLoading ?
                        <form autoComplete="off" onSubmit={formik.handleSubmit}>
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <TextField
                                        id="name"
                                        fullWidth
                                        label="Name"
                                        name="name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        id="email"
                                        fullWidth
                                        label="Email address"
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
                                        label="Phone number 1"
                                        name="contactNo"
                                        value={formik.values.contactNo}
                                        onChange={formik.handleChange}
                                        error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
                                        helperText={formik.touched.contactNo && formik.errors.contactNo}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid spacing={2} container justifyContent="flex-end">
                                        <Grid item>
                                            <Stack direction="row">
                                                <AnimateButton >
                                                    <Button variant="contained" type="submit">Change Details</Button>
                                                </AnimateButton>
                                            </Stack>
                                        </Grid>
                                        <Grid item>
                                            <Button sx={{ color: theme.palette.error.main }} onClick={() => { handleClickOpen(); }}>Delete</Button>
                                        </Grid>
                                    </Grid>

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
                                                    Are you sure to delete&nbsp;<Typography component="span" variant="subtitle1" color="secondary">
                                                        {prop.teacherDetail?.name ?? ''}
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
