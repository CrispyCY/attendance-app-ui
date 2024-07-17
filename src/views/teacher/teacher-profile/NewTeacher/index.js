// material-ui
import {
    Grid
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import TeacherDetails from './TeacherDetails';

// assets


// ==============================|| Columns Layouts ||============================== //
function NewTeacher() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <TeacherDetails></TeacherDetails>
            </Grid>
        </Grid>
    );
}

export default NewTeacher;
