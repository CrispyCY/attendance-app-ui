import { useState } from "react";
import { useNavigate } from "react-router-dom";

// material-ui
// import { useTheme } from '@mui/material/styles';
import {
    Button, Grid, Stack, TextField,
    // Typography
} from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { openSnackbar } from 'store/slices/snackbar';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import { useDispatch } from 'store';
import axios from 'utils/axios';

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
    currentPwd: yup.string().required('Current Password is required'),
    password: yup.string().min(8, 'Password should be of minimum 8 characters length').required('New Password is required'),
    repeatPwd: yup
        .string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Repeat Password is required')
});

// ==============================|| PROFILE 3 - SECURITY ||============================== //

const Security = (prop) => {
    // const theme = useTheme();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            currentPwd: '',
            password: '',
            repeatPwd: ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                delete values.repeatPwd;
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

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item sm={6} md={8}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard title="Change Password">
                            {!isLoading ?
                                <form autoComplete="off" onSubmit={formik.handleSubmit}>
                                    <Grid container spacing={gridSpacing}>
                                        <Grid item xs={12}>
                                            <TextField
                                                type="password"
                                                id="currentPwd"
                                                fullWidth
                                                label="Current Password"
                                                name="currentPwd"
                                                value={formik.values.currentPwd}
                                                onChange={formik.handleChange}
                                                error={formik.touched.currentPwd && Boolean(formik.errors.currentPwd)}
                                                helperText={formik.touched.currentPwd && formik.errors.currentPwd}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                type="password"
                                                id="password"
                                                fullWidth
                                                label="New Password"
                                                name="password"
                                                value={formik.values.password}
                                                onChange={formik.handleChange}
                                                error={formik.touched.password && Boolean(formik.errors.password)}
                                                helperText={formik.touched.password && formik.errors.password}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                type="password"
                                                id="repeatPwd"
                                                fullWidth
                                                label="Re-enter New Password"
                                                name="repeatPwd"
                                                value={formik.values.repeatPwd}
                                                onChange={formik.handleChange}
                                                error={formik.touched.repeatPwd && Boolean(formik.errors.repeatPwd)}
                                                helperText={formik.touched.repeatPwd && formik.errors.repeatPwd}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Stack direction="row">
                                                <AnimateButton>
                                                    <Button variant="contained" type="submit">Change Password</Button>
                                                </AnimateButton>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </form>
                                :
                                <CustomSkeleton />
                            }
                        </SubCard>
                    </Grid>
                </Grid>
            </Grid>
            {/* <Grid item sm={6} md={4}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard title="Delete Account">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body1">
                                        To deactivate your account, first delete its resources. If you are the only owner of any teams,
                                        either assign another owner or deactivate the team.
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack direction="row">
                                        <AnimateButton>
                                            <Button
                                                sx={{
                                                    color: theme.palette.error.main,
                                                    borderColor: theme.palette.error.main,
                                                    '&:hover': {
                                                        background: theme.palette.error.light + 25,
                                                        borderColor: theme.palette.error.main
                                                    }
                                                }}
                                                variant="outlined"
                                                size="small"
                                            >
                                                Deactivate Account
                                            </Button>
                                        </AnimateButton>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                </Grid>
            </Grid> */}
        </Grid>
    );
};

export default Security;
