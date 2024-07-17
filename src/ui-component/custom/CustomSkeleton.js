// material-ui
import { Grid } from '@mui/material';

// project imports
import SkeletonTotalIncomeCard from 'ui-component/cards/Skeleton/TotalIncomeCard';
import { gridSpacing } from 'store/constant';

const CustomSkeleton = ({ count }) => {
    const renderSkeletonCards = () => {
        const skeletonCards = [];
        for (let i = 0; i < count; i++) {
            skeletonCards.push(
                <Grid key={i} item xs={12}>
                    <SkeletonTotalIncomeCard />
                </Grid>
            );
        }
        return skeletonCards;
    };

    return (
        <Grid container spacing={gridSpacing}>
            {renderSkeletonCards()}
        </Grid>
    );
};

// Set default prop value for count
CustomSkeleton.defaultProps = {
    count: 3,
};

export default CustomSkeleton;