// material-ui
import {
    Grid
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import StudentDetails from './StudentDetails';

// assets


// ==============================|| Columns Layouts ||============================== //
function NewUser() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <StudentDetails></StudentDetails>
            </Grid>
        </Grid>
    );
}

export default NewUser;
