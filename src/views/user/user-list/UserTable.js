// material-ui

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TableDataGrid from './GridTable';

// ==============================|| TABLE - BASIC ||============================== //

export default function UserTable() {
    const handlerClick = (data) => {
        setSelectedValue(data);
    };

    return (
        <MainCard
            content={false}
            title="Users"
        >
            {/* table data grid */}
            <TableDataGrid
                Selected={handlerClick}
            />
        </MainCard>
    );
}
