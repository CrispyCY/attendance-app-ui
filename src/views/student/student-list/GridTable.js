import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';

// project imports
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import useAuth from 'hooks/useAuth';
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
    const { logout } = useAuth();
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useDispatch();

    const [studentData, setStudentData] = useState(null);

    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get('student', { withCredentials: true });

            setStudentData(response.data);
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
            field: 'slot_expiry_date',
            headerName: 'Classes Expiry Date',
            type: 'date',
            width: 165,
            align: 'left',
            headerAlign: 'left',
            valueGetter: (params) => formatDateTime(params.row.slot_expiry_date),
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
                        <Typography align="left" variant="subtitle1">
                            No students
                        </Typography>
                    :
                    <CustomSkeleton />
            }
        </Box>
    );
}