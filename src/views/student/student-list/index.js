// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import StudentTable from './StudentTable';

// ==============================|| TABLE - BASIC ||============================== //

export default function StudentList() {

    return (
        <Grid container spacing={gridSpacing} justifyContent="center">
            <Grid item xs={12}>
                {/* table data grid */}
                {/* <StudentTable selectedData={handle} /> */}
                <StudentTable />
            </Grid>
        </Grid >
    );
}
