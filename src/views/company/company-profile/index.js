import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Grid, Tab, Tabs } from '@mui/material';

// project imports
import Profile from './Profile';
import PersonalAccount from './CompanyAccount';
import MainCard from 'ui-component/cards/MainCard';
import { COMPANIES, gridSpacing } from 'store/constant';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import axios from 'utils/axios';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import useAuth from 'hooks/useAuth';

// assets
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import CompanyUsage from './CompanyUsage';
import LibraryBooksTwoToneIcon from '@mui/icons-material/LibraryBooksTwoTone';
import CompanyModuleAccess from './CompanyModuleAccess';

// tabs panel
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}


// ==============================|| PROFILE 1 ||============================== //

const CompanyProfile = () => {
    const { user, logout } = useAuth();
    const theme = useTheme();

    const [value, setValue] = useState(0);
    const dispatch = useDispatch();
    const [companyDetail, setCompanyDetail] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    // tabs option
    let tabsOption = [
        {
            label: 'Company Profile',
            icon: <AccountCircleTwoToneIcon sx={{ fontSize: '1.3rem' }} />
        },
        {
            label: 'Company Details',
            icon: <DescriptionTwoToneIcon sx={{ fontSize: '1.3rem' }} />
        },
        {
            label: 'Company Usage',
            icon: <LibraryBooksTwoToneIcon sx={{ fontSize: '1.3rem' }} />
        },
        {
            label: 'Company Module',
            icon: <LibraryBooksTwoToneIcon sx={{ fontSize: '1.3rem' }} />
        },
    ];

    tabsOption =
        user?.orgId !== COMPANIES.TECHMOU ?
            tabsOption.filter(child => child.label !== 'Company Module') : tabsOption

    const fetchData = async () => {
        try {
            const response = await axios.get('organization/getOrganization?id=' + id, { withCredentials: true });
            setCompanyDetail(response.data);
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
        fetchData(); // Call the API function when the component mounts
    }, []);

    return (
        <MainCard>
            {
                !isLoading ?
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Tabs
                                value={value}
                                indicatorColor="primary"
                                textColor="primary"
                                onChange={handleChange}
                                aria-label="simple tabs example"
                                variant="scrollable"
                                sx={{
                                    mb: 3,
                                    '& a': {
                                        minHeight: 'auto',
                                        minWidth: 10,
                                        py: 1.5,
                                        px: 1,
                                        mr: 2.25,
                                        color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    },
                                    '& a.Mui-selected': {
                                        color: theme.palette.primary.main
                                    },
                                    '& .MuiTabs-indicator': {
                                        bottom: 2
                                    },
                                    '& a > svg': {
                                        marginBottom: '0px !important',
                                        mr: 1.25
                                    }
                                }}
                            >
                                {tabsOption.map((tab, index) => (
                                    <Tab key={index} component={Link} to="#" icon={tab.icon} label={tab.label} {...a11yProps(index)} />
                                ))}
                            </Tabs>
                            <TabPanel value={value} index={0}>
                                <Profile details={companyDetail} />
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <PersonalAccount details={companyDetail} />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                                <CompanyUsage details={companyDetail} />
                            </TabPanel>
                            {
                                user?.orgId === COMPANIES.TECHMOU ?
                                    <TabPanel value={value} index={3}>
                                        <CompanyModuleAccess />
                                    </TabPanel>
                                    :
                                    <></>
                            }
                        </Grid>
                    </Grid>
                    :
                    <CustomSkeleton />
            }
        </MainCard>
    );
};

export default CompanyProfile;
