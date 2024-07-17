// material-ui

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import GroupDetailsCard from './GroupDetailsCard';

// ===============================|| UI CARDS ||=============================== //

const GroupList = () => {
    return (
        <>
            <MainCard title="Groups">
                <GroupDetailsCard />
            </MainCard>
        </>
    );
};

export default GroupList;
