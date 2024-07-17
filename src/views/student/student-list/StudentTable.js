// import { useState } from 'react';
// material-ui

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TableDataGrid from './GridTable';

// ==============================|| TABLE - BASIC ||============================== //

// export default function StudentTable({ selectedData }) {
export default function StudentTable() {
    // const [selectedValue, setSelectedValue] = useState([]);
    // const handlerClick = (data) => {
    //     setSelectedValue(data);
    // };
    // selectedData(selectedValue)

    return (
        <MainCard
            content={false}
            title="Students"
        >
            {/* table data grid */}
            <TableDataGrid
            // Selected={handlerClick}
            />
        </MainCard>
    );
}