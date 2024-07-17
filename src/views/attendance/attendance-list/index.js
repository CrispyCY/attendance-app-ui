// import { useState } from 'react';

// material-ui
import { Grid } from '@mui/material';

// project imports
import { gridSpacing } from 'store/constant';
import AttendanceTable from './AttendanceTable';

// ==============================|| TABLE - BASIC ||============================== //

export default function AttendanceList() {
    // const [selectedValue, setSelectedValue] = useState();
    // const handle = (data) => {
    //     setSelectedValue(data);
    // };
    // console.log(selectedValue)
    return (
        <Grid container spacing={gridSpacing} justifyContent="center">
            <Grid item xs={12}>
                {/* table data grid */}
                {/* <AttendanceTable selectedData={handle} /> */}
                <AttendanceTable />
            </Grid>
        </Grid >
    );
}
