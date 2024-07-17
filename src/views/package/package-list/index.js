// material-ui

// project imports
import MainCard from 'ui-component/cards/MainCard';

// assets
import PackageDetailsCard from './PackageDetailsCard';

// ===============================|| UI CARDS ||=============================== //

const PackageList = () => {
    return (
        <>
            <MainCard title="Packages">
                <PackageDetailsCard />
            </MainCard>
        </>
    );
};

export default PackageList;
