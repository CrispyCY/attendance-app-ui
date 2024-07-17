// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import TeacherTable from './TeacherTable';

// ==============================|| TABLE - BASIC ||============================== //

export default function TeacherList() {

    return (
        <Grid container spacing={gridSpacing} justifyContent="center">
            <Grid item xs={12}>
                {/* table data grid */}
                {/* <TeacherTable selectedData={handle} /> */}
                <TeacherTable />
            </Grid>
        </Grid >
    );
}
