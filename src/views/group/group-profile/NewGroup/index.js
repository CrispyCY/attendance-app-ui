// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import GroupDetails from './GroupDetails';

// assets

// ==============================|| Columns Layouts ||============================== //
function NewGroup() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <GroupDetails />
            </Grid>
        </Grid>
    );
}

export default NewGroup;
