import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from 'react';

// material-ui
import {
    Avatar, Button, Grid, Stack, TextField, Typography,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, Autocomplete, MenuItem
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
import { COMPANIES, gridSpacing } from 'store/constant';
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
import dayjs from 'dayjs';

const validationSchema = yup.object({
    studentName: yup.string().min(5, 'Name should be of minimum 5 characters length').required('Name is required'),
    email: yup.string()
        .notRequired()
        .nullable()
        .email('Email is invalid'),
    guardianContact1: yup.string()
        .required('At least 1 phone number is required')
        .matches(PHONE_NO_REGEX, 'Phone number is not in correct format'),
    guardianContact2: yup.string()
        .notRequired()
        .nullable(),
    address: yup.string()
        .notRequired()
        .nullable(),
    bio: yup.string()
        .notRequired()
        .nullable(),
    slot: yup.number()
});

// ==============================|| PROFILE 3 - PROFILE ||============================== //

const Profile = (prop) => {
    const { logout, user } = useAuth();
    const theme = useTheme();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [doBInput, setDoBInput] = useState(prop.studentDetail?.doB ? dayjs(prop.studentDetail?.doB) : dayjs());

    // Get Group Data
    const [groupData, setGroupData] = useState([]);
    const [groupValue, setGroupValue] = useState(prop.studentDetail?.studentGroupId ?? 1);

    const fetchGroupData = async () => {
        try {
            const response = await axios.get('studentGroup', { withCredentials: true });

            setGroupData(response.data);
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
        if (user?.orgId === COMPANIES.WUSHU) {
            fetchGroupData(); // Call the API function when the component mounts
        }
    }, []);

    const handleChangeGroup = (event) => {
        setGroupValue(event.target.value);
    };

    // Get Class Data
    const [classData, setClassData] = useState([]);
    const [classValues, setClassValues] = useState([]);

    const fetchClassData = async () => {
        try {
            const response = await axios.get('class/list', { withCredentials: true });

            setClassData(response.data);
            setClassValues(response.data.filter(item => prop.studentDetail?.classIds.includes(item.id)))

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

    const handleOnChange = (event, newValue) => {
        setClassValues(newValue)
    };

    const formik = useFormik({
        initialValues: {
            studentName: prop.studentDetail?.studentName ?? '',
            email: prop.studentDetail?.email ?? '',
            guardianContact1: prop.studentDetail?.guardianContact1 ?? '',
            guardianContact2: prop.studentDetail?.guardianContact2 ?? '',
            doB: dayjs(prop.studentDetail?.doB) ?? dayjs(),
            address: prop.studentDetail?.address ?? '',
            bio: prop.studentDetail?.bio ?? '',
            slot: prop.studentDetail?.slot ?? 0,
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
                values.doB = doBInput.format('YYYY-MM-DD')
                values.studentId = prop.studentDetail?.studentId
                values.status = true

                if (user?.orgId === COMPANIES.DVOTION) {
                    values.classIds = classValues.map(item => item.id)
                }
                if (user?.orgId === COMPANIES.WUSHU) {
                    values.studentGroupId = groupValue
                }

                await axios.post('student/update', values, { withCredentials: true });

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
                    navigate('/student/student-list', { replace: true });
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
                navigate('/student/student-list', { replace: true });
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
            await axios.post('student/delete?studentId=' + prop.studentDetail?.studentId, { withCredentials: true });

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
                navigate('/student/student-list', { replace: true });
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
            navigate('/student/student-list', { replace: true });
        } finally {
            // Reset form state after submission (if needed)
        }
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item sm={6} md={4}>
                <SubCard title={prop.studentDetail?.studentName} contentSX={{ textAlign: 'center' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Avatar alt="User 1" src={Avatar1} sx={{ width: 100, height: 100, margin: '0 auto' }} />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle2" align="center">
                                {prop.studentDetail?.bio ? prop.studentDetail?.bio : prop.studentDetail?.studentName + '...'}
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
                                        id="studentName"
                                        fullWidth
                                        label="Name"
                                        name="studentName"
                                        value={formik.values.studentName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.studentName && Boolean(formik.errors.studentName)}
                                        helperText={formik.touched.studentName && formik.errors.studentName}
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
                                        id="guardianContact1"
                                        fullWidth
                                        label="Phone number 1"
                                        name="guardianContact1"
                                        value={formik.values.guardianContact1}
                                        onChange={formik.handleChange}
                                        error={formik.touched.guardianContact1 && Boolean(formik.errors.guardianContact1)}
                                        helperText={formik.touched.guardianContact1 && formik.errors.guardianContact1}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        id="guardianContact2"
                                        fullWidth label="Phone number 2"
                                        name="guardianContact2"
                                        value={formik.values.guardianContact2}
                                        onChange={formik.handleChange}
                                        error={formik.touched.guardianContact2 && Boolean(formik.errors.guardianContact2)}
                                        helperText={formik.touched.guardianContact2 && formik.errors.guardianContact2}
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
                                {user?.orgId === COMPANIES.WUSHU ?
                                    <>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                id="slot"
                                                fullWidth
                                                label="Class"
                                                name="slot"
                                                value={formik.values.slot}
                                                onChange={formik.handleChange}
                                                error={formik.touched.slot && Boolean(formik.errors.slot)}
                                                helperText={formik.touched.slot && formik.errors.slot}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                id="groupValue"
                                                select
                                                fullWidth
                                                label="Group"
                                                value={groupValue}
                                                onChange={handleChangeGroup}
                                            >
                                                {groupData?.map((groupItem) => (
                                                    <MenuItem key={groupItem.id} value={groupItem.id}>
                                                        {groupItem.groupName}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                    </>
                                    : <></>}
                                {user?.orgId === COMPANIES.DVOTION ?
                                    <Grid item md={6} xs={12}>
                                        <Autocomplete
                                            id="classes"
                                            name="classes"
                                            multiple
                                            options={classData}
                                            getOptionLabel={(option) => option.name}
                                            value={classValues}
                                            onChange={handleOnChange}
                                            renderInput={(params) => <TextField label="Class"{...params} />}
                                        />
                                    </Grid>
                                    : <></>}
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
                                                        {prop.studentDetail?.studentName ?? ''}
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
