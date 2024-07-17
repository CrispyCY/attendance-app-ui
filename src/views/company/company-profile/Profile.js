import PropTypes from 'prop-types';
import * as React from 'react';

// material-ui
import {
    Box,
    Chip,
    Divider,
    Grid,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import useAuth from 'hooks/useAuth';

// assets
import { IconBuilding } from '@tabler/icons-react';


// progress
function LinearProgressWithLabel({ value, ...others }) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    mr: 1
                }}
            >
                <LinearProgress value={value} {...others} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(value)}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number
};

// personal details table
function createData(field, colon, value) {
    return { field, colon, value };
}

// ==============================|| PROFILE 1 - PROFILE ||============================== //

const Profile = (companyDetails) => {
    const { organization } = useAuth();

    const rows = [
        createData('Name', ':', companyDetails.details?.organizationName),
        createData('Address', ':', companyDetails.details?.address ? companyDetails.details?.address : '-'),
        createData('Phone', ':', companyDetails.details?.contactNo),
        createData('Email', ':', companyDetails.details?.email),
        createData('Website Url', ':', companyDetails.details?.websiteUrl ? companyDetails.details?.websiteUrl : '-'),
        createData('User Count', ':', companyDetails.details?.members?.length)
    ];

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item lg={4} xs={12}>
                <SubCard
                    title={
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <IconBuilding />
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <Typography align="left" variant="subtitle1">
                                    {companyDetails.details?.organizationName}
                                </Typography>
                            </Grid>
                            <Grid item>
                                {organization?.subscriptionStatus === 1
                                    ?
                                    <Chip size="small" label="Pro" color="secondary" />
                                    :
                                    <Chip size="small" label="Basic" color="primary" />
                                }
                            </Grid>
                        </Grid>
                    }
                >
                </SubCard>
            </Grid>
            <Grid item lg={8} xs={12}>
                <Grid container spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard
                            title={companyDetails.details?.organizationName}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body2">
                                        {companyDetails.details?.bio}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle1">Company Details</Typography>
                                </Grid>
                                <Divider sx={{ pt: 1 }} />
                                <Grid item xs={12}>
                                    <TableContainer>
                                        <Table
                                            sx={{
                                                '& td': {
                                                    borderBottom: 'none'
                                                }
                                            }}
                                            size="small"
                                        >
                                            <TableBody>
                                                {rows.map((row) => (
                                                    <TableRow key={row.field}>
                                                        <TableCell variant="head">{row.field}</TableCell>
                                                        <TableCell>{row.colon}</TableCell>
                                                        <TableCell>{row.value}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Grid>
                            </Grid>
                        </SubCard>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Profile;
