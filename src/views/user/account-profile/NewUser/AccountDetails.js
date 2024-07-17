import { useDispatch } from 'store';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// material-ui
import {
    Grid,
    InputAdornment,
    TextField,
    FormHelperText,
    Button,
    Stack
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { openSnackbar } from 'store/slices/snackbar';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import axios from 'utils/axios';

// assets
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    name: yup.string().min(5, 'Name should be of minimum 5 characters length').required('Name is required'),
    email: yup.string().email('Enter a valid email').required('Email is required'),
    password: yup.string().min(8, 'Password should be of minimum 8 characters length').required('Password is required')
});

// ==============================|| Columns Layouts ||============================== //
function AccountDetails() {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            memberName: '',
            email: '',
            password: ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.status = true

                await axios.post('member/add', values, { withCredentials: true });

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
                }, 1370);
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

    return (
        <MainCard title="Account Details">
            {!isLoading ?
                <form autoComplete="off" onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} lg={6}>
                            <InputLabel>Name</InputLabel>
                            <TextField
                                fullWidth
                                placeholder="Enter full name"
                                id="memberName"
                                name="memberName"
                                label="Name"
                                value={formik.values.memberName}
                                onChange={formik.handleChange}
                                error={formik.touched.memberName && Boolean(formik.errors.memberName)}
                                helperText={formik.touched.memberName && formik.errors.memberName}
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
                            <InputLabel>Password</InputLabel>
                            <TextField
                                type="password"
                                fullWidth
                                placeholder="Enter Password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <LockTwoToneIcon />
                                        </InputAdornment>
                                    )
                                }}
                                id="password"
                                name="password"
                                label="Password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            <FormHelperText>Password should be of minimum 8 characters length</FormHelperText>
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

export default AccountDetails;
