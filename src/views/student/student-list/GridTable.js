import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Typography, AppBar, Tabs, Tab } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

// project imports
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import useAuth from 'hooks/useAuth';
import { COMPANIES, SUBSCRIPTION_STATUSES } from 'store/constant';
import axios from 'utils/axios';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const formatDateTime = (params) => {
    params = new Date(params)
    let formattedDate = params.getDate() + "-" + (params.getMonth() + 1) + "-" + params.getFullYear()

    return formattedDate
}

const renderActionButtons = (id) => {
    return (
        <>
            <IconButton color="primary" size="large" aria-label="view" component={Link}
                to={`/student/student-profile/${id}`}>
                <VisibilityTwoToneIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
        </>
    )
}

// ==============================|| TABLE - BASIC DATA GRID ||============================== //

export default function TableDataGrid() {
    const theme = useTheme();
    const { user, organization, logout } = useAuth();
    const premium = organization?.subscriptionStatus === SUBSCRIPTION_STATUSES.PREMIUM ? true : true;
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useDispatch();

    const [studentData, setStudentData] = useState(null);
    const [studentGroup1, setStudentGroup1] = useState();
    const [studentGroup2, setStudentGroup2] = useState();
    const [studentGroup3, setStudentGroup3] = useState();

    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get('student', { withCredentials: true });
            if (user?.orgId === COMPANIES.DVOTION) {
                for (const key in response.data) {
                    for (const key2 in response.data[key]) {
                        if (key2 === 'classes') {
                            const namesArray = response.data[key][key2].map(item => item.name);
                            const mergedNamesString = namesArray.join(', ');
                            response.data[key].classNames = mergedNamesString
                        }
                    }
                }
            }

            setStudentData(response.data);

            const group1Data = [];
            const group2Data = [];
            const group3Data = [];

            if (user?.orgId === COMPANIES.WUSHU) {
                for (const key in response.data) {
                    if (response.data[key].studentGroupId === 1) {
                        group1Data.push(response.data[key]);
                    } else if (response.data[key].studentGroupId === 2) {
                        group2Data.push(response.data[key]);
                    } else if (response.data[key].studentGroupId === 3) {
                        group3Data.push(response.data[key]);
                    }
                }
            }

            setStudentGroup1(group1Data);
            setStudentGroup2(group2Data);
            setStudentGroup3(group3Data);

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

    // table columns
    const columns = [
        {
            field: 'name',
            headerName: 'Full name',
            width: 250,
        },
        {
            field: 'studentCode',
            headerName: 'ID',
            width: 110,
            align: 'left',
            headerAlign: 'left',
            hide: true,
        },
        {
            field: 'studentGroupName',
            headerName: 'Group',
            width: 135,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row.studentGroupName,
        },
        {
            field: 'email',
            headerName: 'Email',
            width: 220,
            valueGetter: (params) =>
                `${params.row.email ? params.row.email : "-"} `
        },
        {
            field: 'slot_count',
            headerName: 'Classes',
            width: 70,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'overallClasses',
            headerName: 'Total Classes',
            width: 120,
            align: 'left',
            headerAlign: 'left',
        },
        {
            field: 'slot_expiry_date',
            headerName: 'Classes Expiry Date',
            type: 'date',
            width: 165,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => formatDateTime(params.row.slotExpiryDate),
        },
        {
            field: 'classNames',
            headerName: 'Class Names',
            width: 450,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => params.row.classNames,
        },
        { field: 'phone_no1', headerName: 'Contact 1', width: 135 },
        {
            field: 'phone_no2',
            headerName: 'Contact 2',
            width: 135,
            valueGetter: (params) =>
                `${params.row.phone_no2 ? params.row.phone_no2 : "-"} `,
            hide: true
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 90,
            renderCell: (params) => renderActionButtons(params.row.id),
            disableExport: true
        }
    ];

    if (!premium) {
        const fieldsToFilter = ['slot', 'overallClasses', 'slotExpiryDate', 'studentGroupName', 'classNames', 'studentCode'];
        fieldsToFilter.forEach((fieldToRemove) => {
            const fieldIndex = columns.findIndex((column) => column.field === fieldToRemove);
            if (fieldIndex !== -1) {
                columns.splice(fieldIndex, 1);
            }
        });
    } else {
        if (user?.orgId === COMPANIES.DVOTION) {
            const fieldsToFilter = ['slot', 'slotExpiryDate'];
            fieldsToFilter.forEach((fieldToRemove) => {
                const fieldIndex = columns.findIndex((column) => column.field === fieldToRemove);
                if (fieldIndex !== -1) {
                    columns.splice(fieldIndex, 1);
                }
            });
        }

        if (user?.orgId === COMPANIES.WUSHU) {
            const fieldsToFilter = ['classNames'];
            fieldsToFilter.forEach((fieldToRemove) => {
                const fieldIndex = columns.findIndex((column) => column.field === fieldToRemove);
                if (fieldIndex !== -1) {
                    columns.splice(fieldIndex, 1);
                }
            });
        }
    }

    // Wushu tab display
    const [tabValue, setTabValue] = useState(0);

    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`full-width-tabpanel-${index}`}
                aria-labelledby={`full-width-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 0 }}>
                        {/* <Typography>{children}</Typography> */}
                        {children}
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `full-width-tab-${index}`,
            'aria-controls': `full-width-tabpanel-${index}`,
        };
    }
    const [selectionModel, setSelectionModel] = useState([]);

    return (
        <Box
            sx={{
                height: 650,
                width: '100%',
                '& .MuiDataGrid-root': {
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                    },
                    '& .MuiDataGrid-columnsContainer': {
                        color: theme.palette.mode === 'dark' ? 'grey.600' : 'grey.900',
                        borderColor: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                    },
                    '& .MuiDataGrid-columnSeparator': {
                        color: theme.palette.mode === 'dark' ? theme.palette.text.primary + 15 : 'grey.200'
                    }
                }
            }}
        >
            {
                !isLoading ?
                    studentData?.length ?
                        user?.orgId !== COMPANIES.WUSHU ?
                            <DataGrid
                                getRowId={(row) => row.id}
                                rows={studentData}
                                columns={columns}
                                onSelectionModelChange={(newSelectionModel) => {
                                    const selectedIDs = new Set(newSelectionModel);
                                    const selectedRowData = studentData.filter((row) => selectedIDs.has(row.id));
                                    setSelectedValue(selectedRowData);
                                }}
                                pageSize={pageSize}
                                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                rowsPerPageOptions={[5, 10, 20]}
                                checkboxSelection
                                disableSelectionOnClick
                                components={{
                                    Toolbar: GridToolbar,
                                }}
                                density="compact"
                            />
                            :
                            <>
                                <AppBar position="static" sx={{ height: 50 }}>
                                    <Tabs
                                        value={tabValue}
                                        onChange={handleChange}
                                        indicatorColor="secondary"
                                        textColor="inherit"
                                        variant="scrollable"
                                        aria-label="full width tabs example"
                                    >
                                        <Tab label="Group A" {...a11yProps(0)} />
                                        <Tab label="Group B" {...a11yProps(1)} />
                                        <Tab label="Group C" {...a11yProps(2)} />
                                    </Tabs>
                                </AppBar>
                                <TabPanel value={tabValue} index={0} dir={theme.direction}>
                                    <DataGrid
                                        style={{ height: 600 }}
                                        getRowId={(row) => row.id}
                                        rows={studentGroup1}
                                        columns={columns}
                                        onSelectionModelChange={(newSelectionModel) => {
                                            setSelectionModel(newSelectionModel);
                                            const selectedIDs = new Set(newSelectionModel);
                                            const selectedRowData = studentGroup1.filter((row) => selectedIDs.has(row.id));
                                            setSelectedValue(selectedRowData);
                                        }}
                                        pageSize={pageSize}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        rowsPerPageOptions={[5, 10, 20]}
                                        checkboxSelection
                                        disableSelectionOnClick
                                        components={{
                                            Toolbar: GridToolbar,
                                        }}
                                        density="compact"
                                        selectionModel={selectionModel}
                                    />
                                </TabPanel>
                                <TabPanel value={tabValue} index={1} dir={theme.direction}>
                                    <DataGrid
                                        style={{ height: 600 }}
                                        getRowId={(row) => row.id}
                                        rows={studentGroup2}
                                        columns={columns}
                                        onSelectionModelChange={(newSelectionModel) => {
                                            setSelectionModel(newSelectionModel);
                                            const selectedIDs = new Set(newSelectionModel);
                                            const selectedRowData = studentGroup2.filter((row) => selectedIDs.has(row.id));
                                            setSelectedValue(selectedRowData);
                                        }}
                                        pageSize={pageSize}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        rowsPerPageOptions={[5, 10, 20]}
                                        checkboxSelection
                                        disableSelectionOnClick
                                        components={{
                                            Toolbar: GridToolbar,
                                        }}
                                        density="compact"
                                        selectionModel={selectionModel}
                                    />
                                </TabPanel>
                                <TabPanel value={tabValue} index={2} dir={theme.direction}>
                                    <DataGrid
                                        style={{ height: 600 }}
                                        getRowId={(row) => row.id}
                                        rows={studentGroup3}
                                        columns={columns}
                                        onSelectionModelChange={(newSelectionModel) => {
                                            setSelectionModel(newSelectionModel);
                                            const selectedIDs = new Set(newSelectionModel);
                                            const selectedRowData = studentGroup3.filter((row) => selectedIDs.has(row.id));
                                            setSelectedValue(selectedRowData);
                                        }}
                                        pageSize={pageSize}
                                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                                        rowsPerPageOptions={[5, 10, 20]}
                                        checkboxSelection
                                        disableSelectionOnClick
                                        components={{
                                            Toolbar: GridToolbar,
                                        }}
                                        density="compact"
                                        selectionModel={selectionModel}
                                    />
                                </TabPanel>
                            </>
                        :
                        <Typography align="left" variant="subtitle1">
                            No students
                        </Typography>
                    :
                    <CustomSkeleton />
            }
        </Box>
    );
}