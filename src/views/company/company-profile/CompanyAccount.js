import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
    Grid,
    MenuItem,
    TextField,
    Button,
    Stack
} from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { openSnackbar } from 'store/slices/snackbar';
import { PHONE_NO_REGEX } from 'store/constant';
import useAuth from 'hooks/useAuth';
import axios from 'utils/axios';
import { useDispatch } from 'store';

// assets

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

// yup validation
const validationSchema = yup.object({
    organizationName: yup.string().min(1, 'Name should be of minimum 1 characters length').required('Name is required'),
    bio: yup.string().min(8, 'Bio should be of minimum 8 characters length').required('Bio is required'),
});

const validationSchema2 = yup.object({
    email: yup.string().email('Enter a valid email').required('Email is required'),
    contactNo: yup.string()
        .required('At least 1 phone number is required')
        .matches(PHONE_NO_REGEX, 'Phone number is not in correct format'),
    websiteUrl: yup.string().min(8, 'Website Url should be of minimum 8 characters length').required('Website Url is required'),
    address: yup.string().min(8, 'Address should be of minimum 8 characters length').required('Address is required')
});

// select options
const currencies = [
    {
        value: 'Singapore',
        label: 'Singapore'
    },
    {
        value: 'Malaysia',
        label: 'Malaysia'
    }
];

// ==============================|| PROFILE 1 - PROFILE ACCOUNT ||============================== //

const CompanyAccount = (companyDetails) => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [country, setCountry] = useState('Malaysia');
    const handleChange1 = (event) => {
        setCountry(event.target.value);
    };

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            organizationName: companyDetails?.details?.organizationName,
            bio: companyDetails?.details?.bio,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.orgId = companyDetails?.details?.orgId
                values.country = country

                await axios.post('organization/update', values, { withCredentials: true });

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
                    navigate('/dashboard/default', { replace: true });
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
                navigate('/dashboard/default', { replace: true });
            } finally {
                // Reset form state after submission (if needed)
                setSubmitting(false);
            }
        }
    });

    const formik2 = useFormik({
        initialValues: {
            email: companyDetails?.details?.email,
            contactNo: companyDetails?.details?.contactNo,
            websiteUrl: companyDetails?.details?.websiteUrl,
            address: companyDetails?.details?.address,
        },
        validationSchema2,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.orgId = companyDetails?.details?.orgId
                values.country = country

                await axios.post('organization/update', values, { withCredentials: true });

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
                    navigate('/dashboard/default', { replace: true });
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
                navigate('/dashboard/default', { replace: true });
            } finally {
                // Reset form state after submission (if needed)
                setSubmitting(false);
            }
        }
    });

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={6}>
                <SubCard title="Company Information">
                    <form onSubmit={formik.handleSubmit} autoComplete="off">
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12}>
                                <TextField
                                    id="organizationName"
                                    name="organizationName"
                                    fullWidth
                                    label="Name"
                                    value={formik.values.organizationName}
                                    onChange={formik.handleChange}
                                    error={formik.touched.organizationName && Boolean(formik.errors.organizationName)}
                                    helperText={formik.touched.organizationName && formik.errors.organizationName}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="country"
                                    select
                                    fullWidth
                                    label="Country"
                                    value={country}
                                    onChange={handleChange1}
                                >
                                    {currencies.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="bio"
                                    label="Bio"
                                    multiline
                                    fullWidth
                                    rows={3}
                                    value={formik.values.bio}
                                    onChange={formik.handleChange}
                                    error={formik.touched.bio && Boolean(formik.errors.bio)}
                                    helperText={formik.touched.bio && formik.errors.bio}
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
            <Grid item xs={12} md={6}>
                <SubCard title="Contact Information">
                    <form onSubmit={formik2.handleSubmit} autoComplete="off">
                        <Grid container spacing={gridSpacing}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="contactNo"
                                    fullWidth
                                    label="Contact Phone"
                                    value={formik2.values.contactNo}
                                    onChange={formik2.handleChange}
                                    error={formik2.touched.contactNo && Boolean(formik2.errors.contactNo)}
                                    helperText={formik2.touched.contactNo && formik2.errors.contactNo}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="email"
                                    fullWidth label="Email"
                                    value={formik2.values.email}
                                    onChange={formik2.handleChange}
                                    error={formik2.touched.email && Boolean(formik2.errors.email)}
                                    helperText={formik2.touched.email && formik2.errors.email}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="websiteUrl"
                                    fullWidth
                                    label="Website Url"
                                    value={formik2.values.websiteUrl}
                                    onChange={formik2.handleChange}
                                    error={formik2.touched.websiteUrl && Boolean(formik2.errors.websiteUrl)}
                                    helperText={formik2.touched.websiteUrl && formik2.errors.websiteUrl}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="address"
                                    label="Address"
                                    multiline
                                    fullWidth
                                    rows={3}
                                    value={formik2.values.address}
                                    onChange={formik2.handleChange}
                                    error={formik2.touched.address && Boolean(formik2.errors.address)}
                                    helperText={formik2.touched.address && formik2.errors.address}
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
        </Grid>
    );
};

export default CompanyAccount;
