import { useEffect, useState } from 'react';
import { useDispatch } from 'store';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import {
    Grid,
    TextField,
    Button,
    Stack,
    InputLabel,
    Autocomplete,
    FormHelperText
} from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import { COMPANIES, gridSpacing } from 'store/constant';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from 'hooks/useAuth';
import axios from 'utils/axios';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';

// assets

// third-party
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
});

// ==============================|| PROFILE 1 - PROFILE ACCOUNT ||============================== //

const CompanyModuleAccess = () => {
    const { user, logout } = useAuth();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Get Module Data
    const [moduleData, setModuleData] = useState([]);
    const [moduleValues, setModuleValues] = useState([]);

    const dispatch = useDispatch();

    const fetchModuleData = async () => {
        try {
            const response = await axios.get('accessModule/getAccess?orgId=' + id, { withCredentials: true });

            const filteredData = moduleData.filter(item => response.data.some(resItem => resItem.id === item.id));

            setModuleValues(filteredData);
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
        if (user?.orgId === COMPANIES.TECHMOU && moduleData.length !== 0) {
            fetchModuleData(); // Call the API function when the component mounts
        }
    }, [moduleData]);

    const fetchModules = async () => {
        try {
            const response = await axios.get('accessModule/listModules', { withCredentials: true });

            setModuleData(response.data);
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
        if (user?.orgId === COMPANIES.TECHMOU) {
            fetchModules(); // Call the API function when the component mounts
        }
    }, []);

    const handleOnChange = (event, newValue) => {
        console.log(newValue)
        setModuleValues(newValue)
    };

    const formik = useFormik({
        initialValues: {
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                values.moduleIds = moduleValues.map(item => item.id)
                values.orgId = id

                await axios.post('accessModule/updateAccess', values, { withCredentials: true });

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
            <Grid item xs={12} md={6}>
                <SubCard title="Company Module Access">
                    {!isLoading ?
                        <form onSubmit={formik.handleSubmit} autoComplete="off">
                            <Grid container spacing={gridSpacing}>
                                <Grid item xs={12}>
                                    <InputLabel>Module</InputLabel>
                                    <Autocomplete
                                        id="module"
                                        name="module"
                                        multiple
                                        options={moduleData}
                                        getOptionLabel={(option) => option.name}
                                        value={moduleValues}
                                        onChange={handleOnChange}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                    <FormHelperText>Please select module</FormHelperText>
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
                        :
                        <CustomSkeleton />
                    }
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default CompanyModuleAccess;
