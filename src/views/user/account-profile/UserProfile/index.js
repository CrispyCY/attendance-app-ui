import PropTypes from 'prop-types';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs } from '@mui/material';

// project imports
import Profile from './Profile';
import Security from './Security';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'utils/axios';
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import useAuth from 'hooks/useAuth';

// tabs
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

// ==============================|| PROFILE 3 ||============================== //

const UserProfile = () => {
    const { user } = useAuth();
    const theme = useTheme();
    const { id } = useParams();
    const [value, setValue] = useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const [userDetail, setUserDetail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get('member/getMember?id=' + id, { withCredentials: true });

            setUserDetail(response.data);
            setIsLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData(); // Call the API function when the component mounts
    }, []);

    return (
        <MainCard title="Account">
            {
                !isLoading ?
                    <div>
                        <Tabs
                            value={value}
                            indicatorColor="primary"
                            onChange={handleChange}
                            sx={{
                                mb: 3,
                                minHeight: 'auto',
                                '& button': {
                                    minWidth: 100
                                },
                                '& a': {
                                    minHeight: 'auto',
                                    minWidth: 10,
                                    py: 1.5,
                                    px: 1,
                                    mr: 2.25,
                                    color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900'
                                },
                                '& a.Mui-selected': {
                                    color: 'primary.main'
                                }
                            }}
                            aria-label="simple tabs example"
                            variant="scrollable"
                        >
                            <Tab component={Link} to="#" label="Profile" {...a11yProps(0)} />
                            {
                                user?.memberId === parseInt(id)
                                    ?
                                    <Tab component={Link} to="#" label="Security" {...a11yProps(2)} />
                                    : <></>
                            }
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <Profile userDetail={userDetail} />
                        </TabPanel>
                        {
                            user?.memberId === parseInt(id)
                                ?
                                <TabPanel value={value} index={1}>
                                    <Security userDetail={userDetail} />
                                </TabPanel>
                                : <></>
                        }
                    </div>
                    :
                    <CustomSkeleton />
            }
        </MainCard>
    );
};

export default UserProfile;
