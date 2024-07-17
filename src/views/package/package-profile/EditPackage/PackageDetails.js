import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// material-ui
import {
    Grid,
    TextField,
    FormHelperText,
    Button,
    Stack
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { useDispatch } from 'store';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from "hooks/useAuth";
import { COMPANIES } from "store/constant";
import axios from 'utils/axios';

// assets

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

/**
 * 'Enter your email'
 * yup.string Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
    packageName: yup.string()
        .required('Package name is required')
        .min(4, 'Package name must be at least 3 characters')
        .max(24, 'Package name must not exceed 24 characters'),
    packagePrice: yup.number()
        .required('Package price is required')
        .typeError('Price number must be a number')
        .positive('Price number is invalid')
        .min(1, "minimum 1")
        .max(999, "maximum 999"),
    packageSlot: yup.number()
        .required('Package class is required')
        .typeError('Package class must be a number')
        .integer("Package class must be an integer")
        .positive('Package class is invalid')
        .min(1, "minimum 1")
        .max(999, "maximum 999"),
    packageExpiry: yup.number()
        .required('Package expiry days is required')
        .typeError('Package expiry days must be a number')
        .integer("Package class must be an integer")
        .positive('Package expiry days is invalid')
        .min(1, "minimum 1")
        .max(999, "maximum 999"),
});

// ==============================|| Columns Layouts ||============================== //
function PackageDetails() {
    const { user, logout } = useAuth();
    const { id } = useParams();
    const [packageDetails, setPackageDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get('package/getPackage?id=' + id, { withCredentials: true });

            setPackageDetails(response.data);
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
            navigate('/package/package-list', { replace: true });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            packageName: packageDetails?.packageName || '',
            packagePrice: packageDetails?.packagePrice || 1,
            packageSlot: packageDetails?.packageSlot || 0,
            packageExpiry: packageDetails?.packageExpiry || 1
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.packageId = packageDetails?.packageId
                values.status = true

                await axios.post('package/update', values, { withCredentials: true });

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
                    navigate('/package/package-list', { replace: true });
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
                navigate('/package/package-list', { replace: true });
            } finally {
                // Reset form state after submission (if needed)
                setSubmitting(false);
            }
        }
    });

    // Watch for packageDetails changes since api returns is slower than initial rendering
    useEffect(() => {
        if (packageDetails) {
            if (user?.orgId === COMPANIES.WUSHU) {
                formik.setValues({
                    packageName: packageDetails.packageName || '',
                    packagePrice: packageDetails.packagePrice || 1,
                    packageSlot: packageDetails.packageSlot || 0,
                    packageExpiry: packageDetails.packageExpiry ?? 1,
                });
            } else {
                formik.setValues({
                    packageName: packageDetails.packageName || '',
                    packagePrice: packageDetails.packagePrice || 1,
                    packageSlot: packageDetails.packageSlot || 0,
                    packageExpiry: 1,
                });
            }
        }
    }, [packageDetails]);

    return (
        <MainCard title="Package Details">
            {
                !isLoading ?
                    packageDetails ?
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Name</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter package name"
                                        id="packageName"
                                        name="packageName"
                                        label="Package Name"
                                        value={formik.values.packageName}
                                        onChange={formik.handleChange}
                                        error={formik.touched.packageName && Boolean(formik.errors.packageName)}
                                        helperText={formik.touched.packageName && formik.errors.packageName}
                                    />
                                    <FormHelperText>Please enter name</FormHelperText>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Price</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter package price"
                                        id="packagePrice"
                                        name="packagePrice"
                                        label="Package Price"
                                        value={formik.values.packagePrice}
                                        onChange={formik.handleChange}
                                        error={formik.touched.packagePrice && Boolean(formik.errors.packagePrice)}
                                        helperText={formik.touched.packagePrice && formik.errors.packagePrice}
                                    />
                                    <FormHelperText>Please enter price</FormHelperText>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Class Count</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter package class count"
                                        id="packageSlot"
                                        name="packageSlot"
                                        label="Package Class Count"
                                        value={formik.values.packageSlot}
                                        onChange={formik.handleChange}
                                        error={formik.touched.packageSlot && Boolean(formik.errors.packageSlot)}
                                        helperText={formik.touched.packageSlot && formik.errors.packageSlot}
                                    />
                                    <FormHelperText>Please enter class count</FormHelperText>
                                </Grid>
                                {
                                    user?.orgId === COMPANIES.WUSHU ?
                                        <Grid item xs={12} lg={6}>
                                            <InputLabel>Expiry Days</InputLabel>
                                            <TextField
                                                fullWidth
                                                placeholder="Enter package expiry days"
                                                id="packageExpiry"
                                                name="packageExpiry"
                                                label="Package Expiry Days"
                                                value={formik.values.packageExpiry}
                                                onChange={formik.handleChange}
                                                error={formik.touched.packageExpiry && Boolean(formik.errors.packageExpiry)}
                                                helperText={formik.touched.packageExpiry && formik.errors.packageExpiry}
                                            />
                                            <FormHelperText>Please enter expiry days</FormHelperText>
                                        </Grid>
                                        :
                                        <></>
                                }
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
                        : <></>
                    : <CustomSkeleton />
            }
        </MainCard>
    );
}

export default PackageDetails;
