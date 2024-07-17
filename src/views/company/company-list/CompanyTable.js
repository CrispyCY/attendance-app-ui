// material-ui

// project imports
import MainCard from 'ui-component/cards/MainCard';
import TableDataGrid from './GridTable';

// ==============================|| TABLE - BASIC ||============================== //

export default function CompanyTable() {
    const handlerClick = (data) => {
        setSelectedValue(data);
    };

    return (
        <MainCard
            content={false}
            title="Companies"
        >
            {/* table data grid */}
            <TableDataGrid
                Selected={handlerClick}
            />
        </MainCard>
    );
}
