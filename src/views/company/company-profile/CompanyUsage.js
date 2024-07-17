import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// material-ui
import {
    Box,
    Button,
    Grid,
    LinearProgress,
    Stack,
    TextField,
    Typography
} from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import { COMPANIES, gridSpacing } from 'store/constant';
import { useDispatch } from 'store';
import axios from 'utils/axios';
import useAuth from 'hooks/useAuth';
import { openSnackbar } from 'store/slices/snackbar';
import AnimateButton from 'ui-component/extended/AnimateButton';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';

// assets

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// yup validation
const validationSchema = yup.object({
    dataCount: yup.number()
        .required('Data count is required')
        .typeError('Data count must be a number')
        .integer("Data count must be an integer")
        .positive('Data count is invalid')
        .min(1, "Minimum 1")
        .max(999, "Maximum 999"),
    userCount: yup.number()
        .required('Data count is required')
        .typeError('Data count must be a number')
        .integer("Data count must be an integer")
        .positive('Data count is invalid')
        .min(1, "Minimum 1")
        .max(999, "Maximum 999")
});

// progress
function LinearProgressWithLabel({ value, ...others }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    mr: 1
                }}
            >
                <LinearProgress value={value} {...others} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(value)}`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number
};

// ==============================|| PROFILE 1 - PROFILE ||============================== //

const CompanyUsage = (companyDetails) => {
    const { user, logout } = useAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [dataUsage, setDataUsage] = useState(0);
    const [userUsage, setUserUsage] = useState(0);

    const fetchCompanyUsage = async () => {
        try {
            const response = await axios.get('organization/getLimiter', { withCredentials: true });

            setDataUsage(response.data?.dataUsage);
            setUserUsage(response.data?.userUsage);
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
        fetchCompanyUsage(); // Call the API function when the component mounts
    }, []);

    const formik = useFormik({
        initialValues: {
            dataCount: companyDetails?.details?.dataCount,
            userCount: companyDetails?.details?.userCount,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.orgId = companyDetails?.details?.orgId

                await axios.post('organization/updateLimiter', values, { withCredentials: true });

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
                setTimeout(() => {
                    navigate('/company/company-list', { replace: true });
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
                navigate('/company/company-list', { replace: true });
            } finally {
                // Reset form state after submission (if needed)
                setSubmitting(false);
            }
        }
    });

    return (
        <Grid container spacing={gridSpacing}>
            {!isLoading
                ?
                <>
                    <Grid item xs={12} md={6}>
                        <SubCard title="System Usage">
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2">Data Usage</Typography>
                                    <LinearProgressWithLabel
                                        color="primary"
                                        variant="determinate"
                                        value={dataUsage}
                                        aria-label="Data usage progress"
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2">User Usage</Typography>
                                    <LinearProgressWithLabel
                                        color="primary"
                                        variant="determinate"
                                        value={userUsage}
                                        aria-label="User usage progress"
                                    />
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                    {
                        user?.orgId === COMPANIES.TECHMOU
                            ?
                            <Grid item xs={12} md={6}>
                                <SubCard title="Update Company Count">
                                    <form onSubmit={formik.handleSubmit} autoComplete="off">
                                        <Grid container spacing={gridSpacing}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="dataCount"
                                                    name="dataCount"
                                                    fullWidth
                                                    label="Data Count"
                                                    type="number"
                                                    value={formik.values.dataCount}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.dataCount && Boolean(formik.errors.dataCount)}
                                                    helperText={formik.touched.dataCount && formik.errors.dataCount}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    id="userCount"
                                                    name="userCount"
                                                    fullWidth
                                                    label="User Count"
                                                    type="number"
                                                    value={formik.values.userCount}
                                                    onChange={formik.handleChange}
                                                    error={formik.touched.userCount && Boolean(formik.errors.userCount)}
                                                    helperText={formik.touched.userCount && formik.errors.userCount}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Stack direction="row" justifyContent="flex-end">
                                                    <AnimateButton>
                                                        <Button variant="contained" type="submit">
                                                            Save
                                                        </Button>
                                                    </AnimateButton>
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </SubCard>
                            </Grid>
                            :
                            <></>
                    }
                </>
                : <CustomSkeleton></CustomSkeleton>
            }
        </Grid>
    );
};

export default CompanyUsage;
