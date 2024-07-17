import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import { ListItemIcon, MenuItem, Menu, Grid, } from '@mui/material';

// assets
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

const DropDownActions = (prop) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Grid item>
                <MoreHorizOutlinedIcon
                    fontSize="small"
                    sx={{
                        color: theme.palette.primary[200],
                        cursor: 'pointer'
                    }}
                    aria-controls="menu-followers-card"
                    aria-haspopup="true"
                    onClick={handleClick}
                />
                <Menu
                    id="menu-followers-card"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    variant="selectedMenu"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                >
                    <MenuItem component={Link}
                        to={`/class/edit-class/${prop.prop.id}`}>
                        <ListItemIcon >
                            <EditTwoToneIcon fontSize="small" />
                        </ListItemIcon>
                        Edit
                    </MenuItem>
                </Menu>
            </Grid>
        </>
    )
}
export default DropDownActions;