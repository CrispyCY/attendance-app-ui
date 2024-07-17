// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import ClassDetails from './ClassDetails';

// assets

// ==============================|| Columns Layouts ||============================== //
function EditClass() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <ClassDetails />
            </Grid>
        </Grid>
    );
}

export default EditClass;
