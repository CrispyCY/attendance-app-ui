import {
    // useEffect,
    useState
} from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
// import EarningCard from './EarningCard';
// import PopularCard from './PopularCard';
// import TotalOrderLineChartCard from './TotalOrderLineChartCard';
// import TotalIncomeDarkCard from './TotalIncomeDarkCard';
// import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
// import axios from 'utils/axios';
// import { useDispatch } from 'store';
// import { openSnackbar } from 'store/slices/snackbar';
// import useAuth from 'hooks/useAuth';
// import StudentCard from './StudentCard';
// import AttendanceCard from './AttendanceCard';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    // const { logout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    // const dispatch = useDispatch();

    // const [details, setDashboardDetails] = useState(null);
    // const fetchDashboardData = async () => {
    //     try {
    //         const response = await axios.get('dashboard/getDetails', { withCredentials: true });

    //         setDashboardDetails(response.data);
    //         setIsLoading(false)
    //     } catch (error) {
    //         if (error?.response?.status === 401) {
    //             dispatch(
    //                 openSnackbar({
    //                     open: true,
    //                     message: 'Login Expired! Please re-login!',
    //                     variant: 'alert',
    //                     alert: {
    //                         color: 'error'
    //                     },
    //                     close: true
    //                 })
    //             );
    //             await logout();
    //         } else {
    //             dispatch(
    //                 openSnackbar({
    //                     open: true,
    //                     message: 'Error Occurred!',
    //                     variant: 'alert',
    //                     alert: {
    //                         color: 'error'
    //                     },
    //                     close: true
    //                 })
    //             );
    //         }
    //         console.log(error)
    //     }
    // };

    // useEffect(() => {
    //     fetchDashboardData(); // Call the API function when the component mounts
    // }, []);

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <Grid container spacing={gridSpacing}>
                    {/* <Grid item lg={4} md={6} sm={6} xs={12}>
                        <StudentCard isLoading={isLoading} value={details?.totalStudent} />
                    </Grid>
                    <Grid item lg={4} md={6} sm={6} xs={12}>
                        <AttendanceCard isLoading={isLoading} value={details?.totalAttendance} />
                    </Grid> */}
                    {/* <Grid item lg={4} md={6} sm={6} xs={12}>
                        <EarningCard isLoading={isLoading} />
                    </Grid> */}
                    {/* <Grid item lg={4} md={6} sm={6} xs={12}>
                        <TotalOrderLineChartCard isLoading={isLoading} />
                    </Grid> */}
                    <Grid item lg={4} md={12} sm={12} xs={12}>
                        <Grid container spacing={gridSpacing}>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                {/* <TotalIncomeDarkCard isLoading={isLoading} value={details?.companyUsage?.dataUsage} /> */}
                            </Grid>
                            <Grid item sm={6} xs={12} md={6} lg={12}>
                                {/* <TotalIncomeLightCard isLoading={isLoading} value={details?.companyUsage?.userUsage} /> */}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <TotalGrowthBarChart isLoading={isLoading} />
                {/* <Grid container spacing={gridSpacing}>
                    <Grid item xs={12} md={8}>
                        <TotalGrowthBarChart isLoading={isLoading} />
                    </Grid>
                <Grid item xs={12} md={4}>
                        <PopularCard isLoading={isLoading} />
                    </Grid>
                </Grid> */}
            </Grid>
        </Grid>
    );
};

export default Dashboard;
