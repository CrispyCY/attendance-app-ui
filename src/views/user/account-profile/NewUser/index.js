// material-ui
import {
    Grid
} from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AccountDetails from './AccountDetails';

// assets


// ==============================|| Columns Layouts ||============================== //
function NewUser() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <AccountDetails></AccountDetails>
            </Grid>
        </Grid>
    );
}

export default NewUser;
