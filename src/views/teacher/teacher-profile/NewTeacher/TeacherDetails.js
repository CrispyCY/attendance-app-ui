import { useState } from "react";
import { useNavigate } from "react-router-dom";

// material-ui
import {
    Grid,
    // InputAdornment,
    TextField,
    FormHelperText,
    Button,
    Stack
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { PHONE_NO_REGEX } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import { useDispatch } from 'store';
import axios from 'utils/axios';
import useAuth from "hooks/useAuth";

// assets

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

// ==============================|| Columns Layouts ||============================== //
function StudentDetails() {
    const { logout } = useAuth();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            contactNo: '',
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.status = true

                await axios.post('teacher/add', values, { withCredentials: true });

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

    return (
        <MainCard title="Teacher Details">
            {!isLoading ?
                <form autoComplete="off" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} lg={6}>
                            <InputLabel>Name</InputLabel>
                            <TextField
                                fullWidth
                                placeholder="Enter full name"
                                id="name"
                                name="name"
                                label="Name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                            />
                            <FormHelperText>Please enter your full name</FormHelperText>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <InputLabel>Email</InputLabel>
                            <TextField
                                fullWidth
                                placeholder="Enter email"
                                id="email"
                                name="email"
                                label="Email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <FormHelperText>Please enter your Email</FormHelperText>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <InputLabel>Phone Number</InputLabel>
                            <TextField
                                fullWidth
                                placeholder="Enter your phone number"
                                id="contactNo"
                                name="contactNo"
                                label="Phone No"
                                value={formik.values.contactNo}
                                onChange={formik.handleChange}
                                error={formik.touched.contactNo && Boolean(formik.errors.contactNo)}
                                helperText={formik.touched.contactNo && formik.errors.contactNo}
                            />
                            <FormHelperText>Please enter your phone number</FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" justifyContent="flex-end">
                                <AnimateButton>
                                    <Button variant="contained" type="submit">
                                        Verify & Submit
                                    </Button>
                                </AnimateButton>
                            </Stack>
                        </Grid>
                    </Grid>
                </form>
                :
                <CustomSkeleton />
            }
        </MainCard>
    );
}

export default StudentDetails;
