import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// material-ui
import {
    Grid,
    TextField,
    FormHelperText,
    Button,
    Stack,
    MenuItem
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'store';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import axios from 'utils/axios';
import useAuth from 'hooks/useAuth';

// assets

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

/**
 * 'Enter your email'
 * yup.string Expected 0 arguments, but got 1 */
const validationSchema = yup.object({
    name: yup.string()
        .required('Class name is required')
        .min(3, 'Class name must be at least 3 characters')
        .max(24, 'Class name must not exceed 24 characters'),
});

// ==============================|| Columns Layouts ||============================== //
function ClassDetails() {
    const { id } = useParams();
    const { logout } = useAuth();
    const [classDetails, setClassDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [day, setDay] = useState(1);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const response = await axios.get('class/getClass?id=' + id, { withCredentials: true });

            setClassDetails(response.data);
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
            navigate('/class/class-list', { replace: true });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const days = [
        { value: 0, label: 'Sunday' },
        { value: 1, label: 'Monday' },
        { value: 2, label: 'Tuesday' },
        { value: 3, label: 'Wednesday' },
        { value: 4, label: 'Thursday' },
        { value: 5, label: 'Friday' },
        { value: 6, label: 'Saturday' },
    ];

    const handleDayChange = (event) => {
        setDay(event.target.value);
    };

    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            name: classDetails?.name ?? ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.id = classDetails?.id
                values.status = true
                values.day = day

                await axios.post('class/update', values, { withCredentials: true });

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
                    navigate('/class/class-list', { replace: true });
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
                navigate('/class/class-list', { replace: true });
            } finally {
                // Reset form state after submission (if needed)
                setSubmitting(false);
            }
        }
    });

    // Watch for classDetails changes since api returns is slower than initial rendering
    useEffect(() => {
        if (classDetails) {
            formik.setValues({
                name: classDetails.name || ''
            });
            setDay(classDetails.day)
        }
    }, [classDetails]);

    return (
        <MainCard title="Class Details">
            {
                !isLoading ?
                    classDetails ?
                        <form onSubmit={formik.handleSubmit}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} lg={6}>
                                    <InputLabel>Name</InputLabel>
                                    <TextField
                                        fullWidth
                                        placeholder="Enter class name"
                                        id="name"
                                        name="name"
                                        label="Class Name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        error={formik.touched.name && Boolean(formik.errors.name)}
                                        helperText={formik.touched.name && formik.errors.name}
                                    />
                                    <FormHelperText>Please enter name</FormHelperText>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <TextField
                                        id="day"
                                        select
                                        value={day}
                                        label="Day"
                                        required
                                        onChange={handleDayChange}
                                    >
                                        {days?.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
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
                        : <></>
                    : <CustomSkeleton />
            }
        </MainCard>
    );
}

export default ClassDetails;
