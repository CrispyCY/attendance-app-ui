import { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import VisibilityTwoToneIcon from '@mui/icons-material/VisibilityTwoTone';
// import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

// project imports
import CustomSkeleton from 'ui-component/custom/CustomSkeleton';
import useAuth from "hooks/useAuth";
import axios from 'utils/axios';

// table columns
const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
        field: 'memberName',
        headerName: 'Full name',
        width: 250
    },
    { field: 'email', headerName: 'Email', width: 220 },
    {
        field: 'status',
        headerName: 'Status',
        width: 80,
        valueGetter: (params) =>
            `${params.row.status ? "Active" : "Inactive"} `
    },
    {
        field: 'action',
        headerName: 'Action',
        width: 90,
        renderCell: (params) => renderActionButtons(params.row.memberId),
        disableExport: true
    }
];

const renderActionButtons = (id) => {
    return (
        <>
            <IconButton color="primary" size="large" aria-label="view" component={Link}
                to={`/user/account-profile/user-profile/${id}`}>
                <VisibilityTwoToneIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton>
            {/* <IconButton color="secondary" size="large" aria-label="edit">
                <EditTwoToneIcon sx={{ fontSize: '1.3rem' }} />
            </IconButton> */}
        </>
    )
}

// ==============================|| TABLE - BASIC DATA GRID ||============================== //

export default function TableDataGrid({ Selected }) {
    const theme = useTheme();
    const [pageSize, setPageSize] = useState(5);

    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuth();

    const updatedColumns = user?.isAdmin
        ? columns
        : columns.filter((column) => column.field !== 'action');

    const fetchData = async () => {
        try {
            const response = await axios.get('member', { withCredentials: true });

            setUserData(response.data);
            setIsLoading(false)
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData(); // Call the API function when the component mounts
    }, []);

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
                    userData?.length ?
                        <DataGrid
                            getRowId={(row) => row.memberId}
                            rows={userData}
                            columns={updatedColumns}
                            onSelectionModelChange={(newSelectionModel) => {
                                const selectedIDs = new Set(newSelectionModel);
                                const selectedRowData = userData.filter((row) => selectedIDs.has(row.memberId));
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
                        />
                        :
                        <Typography align="left" variant="subtitle1">
                            No users
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
