// material-ui

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import ClassDetailsCard from './ClassDetailsCard';

// ===============================|| UI CARDS ||=============================== //

const ClassList = () => {
    return (
        <>
            <MainCard title="Classes">
                <ClassDetailsCard />
            </MainCard>
        </>
    );
};

export default ClassList;
