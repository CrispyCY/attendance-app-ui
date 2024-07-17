// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import UserTable from './UserTable';

export const header = [
    { label: 'Name', key: 1 },
    { label: 'Email', key: 2 },
    { label: 'Status', key: 3 },
    { label: 'Action', key: 4 },
    { label: 'Protein (g)', key: 5 },
    { label: 'Protein (g)', key: 6 }
];
// ==============================|| TABLE - BASIC ||============================== //


export default function UserList() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <UserTable />
            </Grid>
        </Grid>
    );
}