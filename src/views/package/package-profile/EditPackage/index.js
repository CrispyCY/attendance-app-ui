// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import PackageDetails from './PackageDetails';

// assets

// ==============================|| Columns Layouts ||============================== //
function EditPackage() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <PackageDetails />
            </Grid>
        </Grid>
    );
}

export default EditPackage;
