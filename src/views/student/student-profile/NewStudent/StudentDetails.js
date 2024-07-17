import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// material-ui
import {
    Grid,
    // InputAdornment,
    TextField,
    FormHelperText,
    Button,
    Stack,
    Autocomplete,
    MenuItem
} from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import InputLabel from 'ui-component/extended/Form/InputLabel';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { COMPANIES, PHONE_NO_REGEX } from 'store/constant';
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
    phone_no1: yup.string()
        .required('At least 1 phone number is required')
        .matches(PHONE_NO_REGEX, 'Phone number is not in correct format'),
    phone_no2: yup.string()
        .notRequired()
        .nullable(),
});

// ==============================|| Columns Layouts ||============================== //
function StudentDetails() {
    const { logout, user } = useAuth();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Get Group Data
    const [groupData, setGroupData] = useState([]);
    const [groupValue, setGroupValue] = useState(1);

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

    const handleOnChangeGroup = (event) => {
        setGroupValue(event.target.value);
    };

    // Get Class Data
    const [classData, setClassData] = useState([]);
    const [classValues, setClassValues] = useState([]);

    const fetchClassData = async () => {
        try {
            const response = await axios.get('class/list', { withCredentials: true });

            setClassData(response.data);
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
            name: '',
            email: '',
            phone_no1: '',
            phone_no2: ''
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                // Check if email and phone_no2 are empty or undefined
                if (values.email === '' || values.email === undefined) {
                    delete values.email; // Remove the email field from values
                }
                if (values.phone_no2 === '' || values.phone_no2 === undefined) {
                    delete values.phone_no2; // Remove the phone_no2 field from values
                }
                values.status = true
                if (user?.orgId === COMPANIES.WUSHU) {
                    values.studentGroupId = groupValue
                }

                if (user?.orgId === COMPANIES.DVOTION) {
                    values.classIds = classValues.map(item => item.id)
                }
                values.slot_count = 0
                await axios.post('student', values, { withCredentials: true });

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

    return (
        <MainCard title="Student Details">
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
                                id="phone_no1"
                                name="phone_no1"
                                label="Phone No"
                                value={formik.values.phone_no1}
                                onChange={formik.handleChange}
                                error={formik.touched.phone_no1 && Boolean(formik.errors.phone_no1)}
                                helperText={formik.touched.phone_no1 && formik.errors.phone_no1}
                            />
                            <FormHelperText>Please enter your phone number</FormHelperText>
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <InputLabel>Phone Number 2</InputLabel>
                            <TextField
                                fullWidth
                                placeholder="Enter your phone number"
                                id="phone_no2"
                                name="phone_no2"
                                label="Phone No 2"
                                value={formik.values.phone_no2}
                                onChange={formik.handleChange}
                                error={formik.touched.phone_no2 && Boolean(formik.errors.phone_no2)}
                                helperText={formik.touched.phone_no2 && formik.errors.phone_no2}
                            />
                            <FormHelperText>Please enter your phone number</FormHelperText>
                        </Grid>
                        {user?.orgId === COMPANIES.WUSHU ?
                            <Grid item md={6} xs={12}>
                                <TextField
                                    id="groupValue"
                                    select
                                    fullWidth
                                    label="Group"
                                    value={groupValue}
                                    onChange={handleOnChangeGroup}
                                >
                                    {groupData?.map((groupItem) => (
                                        <MenuItem key={groupItem.id} value={groupItem.id}>
                                            {groupItem.groupName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            : <></>}
                        {user?.orgId === COMPANIES.DVOTION ?
                            <Grid item md={6} xs={12}>
                                <InputLabel>Class</InputLabel>
                                <Autocomplete
                                    id="classes"
                                    name="classes"
                                    multiple
                                    options={classData}
                                    getOptionLabel={(option) => option.name}
                                    value={classValues}
                                    onChange={handleOnChange}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <FormHelperText>Please select class</FormHelperText>
                            </Grid>
                            : <></>}
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
