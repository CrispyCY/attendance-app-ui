import PropTypes from 'prop-types';
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

const renderActionButtons = (id) => {
    return (
        <>
            <IconButton color="primary" size="large" aria-label="view" component={Link}
                to={`/teacher/teacher-profile/${id}`}
            >
                <VisibilityTwoToneIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
        </>
    )
}

// ==============================|| TABLE - BASIC DATA GRID ||============================== //

export default function TableDataGrid({ Selected }) {
    const theme = useTheme();
    const { logout } = useAuth();
    const [pageSize, setPageSize] = useState(10);
    const dispatch = useDispatch();

    const [teacherData, setTeachserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get('teacher/list', { withCredentials: true });

            setTeachserData(response.data);
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
            field: 'contactNo',
            headerName: 'Contact No',
            width: 135,
            valueGetter: (params) =>
                `${params.row.contactNo ? params.row.contactNo : "-"} `
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
                height: 400,
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
                    teacherData?.length ?
                        <DataGrid
                            getRowId={(row) => row.id}
                            rows={teacherData}
                            columns={columns}
                            onSelectionModelChange={(newSelectionModel) => {
                                const selectedIDs = new Set(newSelectionModel);
                                const selectedRowData = teacherData.filter((row) => selectedIDs.has(row.studentId));
                                Selected(selectedRowData);
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
                            No teachers
                        </Typography>
                    :
                    <CustomSkeleton />
            }
        </Box>
    );
}
TableDataGrid.propTypes = {
    Selected: PropTypes.func
};
