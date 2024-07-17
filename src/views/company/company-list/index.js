// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import CompanyTable from './CompanyTable';

// ==============================|| TABLE - BASIC ||============================== //

export default function CompanyList() {
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <CompanyTable />
            </Grid>
        </Grid>
    );
}