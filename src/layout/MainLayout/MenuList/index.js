import { memo, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Divider, List, Typography, useMediaQuery } from '@mui/material';

// project imports
import NavItem from './NavItem';
import menuItem from 'menu-items';
import NavGroup from './NavGroup';

import useConfig from 'hooks/useConfig';
// import { Menu } from 'menu-items/widget';

import LAYOUT_CONST from 'constant';
import { HORIZONTAL_MAX_ITEM } from 'config';
import { useSelector } from 'store';
import useAuth from 'hooks/useAuth';
import { COMPANIES, MODULES, SUBSCRIPTION_STATUSES } from 'store/constant';

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
    const { user, organization, modules } = useAuth();
    const userId = user?.memberId;
    const userOrgId = user?.orgId;
    const isAdmin = user?.isAdmin;
    const theme = useTheme();
    const { layout } = useConfig();
    const { drawerOpen } = useSelector((state) => state.menu);
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    // Check subscription status
    const premium = organization?.subscriptionStatus === SUBSCRIPTION_STATUSES.PREMIUM ? true : true;

    // const getMenu = Menu();
    const handlerMenuItem = async () => {
        // const isFound = menuItem.items.some((element) => {
        //     if (element.id === 'widget') {
        //         return true;
        //     }
        //     return false;
        // });

        // if (getMenu?.id !== undefined && !isFound) {
        //     menuItem.items.splice(1, 0, getMenu);
        // }

        // Remove Module
        // Company Admin
        if (isAdmin === false) {
            menuItem.items = menuItem.items.filter(item => item.id !== 'company');
        }

        // Remove Module for Permium company only
        if (premium === true) {
            // Find the module from Constants that the current organization does not have
            const missingModules = Object.keys(MODULES).filter(moduleKey =>
                !modules.some(orgModule => orgModule.id === MODULES[moduleKey])
            );

            // Convert missingModules to lowercase
            const missingModulesLowerCase = missingModules.map(module => module.toLowerCase());

            missingModulesLowerCase.forEach(missingModule => {
                menuItem.items = menuItem.items.filter(item => item.id !== missingModule);
            });

            // Remove Module based on company
            // // Robin's WUSHU Company
            // if (userOrgId === COMPANIES.WUSHU) {
            //     menuItem.items = menuItem.items.filter(item => item.id !== 'class');
            // }

            // // Dvotion Company
            // if (userOrgId === COMPANIES.DVOTION) {
            //     menuItem.items = menuItem.items.filter(item => item.id !== 'group');
            // }
        } else {
            // Class Module
            const classObject = menuItem.items.find(item => item.id === 'class');
            if (classObject) {
                classObject.children = classObject.children.filter(item => item.id !== 'new-class');
            }

            // Group Module
            const groupObject = menuItem.items.find(item => item.id === 'group');
            if (groupObject) {
                groupObject.children = groupObject.children.filter(item => item.id !== 'new-group');
            }

            // Package Module
            const packageObject = menuItem.items.find(item => item.id === 'package');
            if (packageObject) {
                packageObject.children = packageObject.children.filter(item => item.id !== 'new-package');
            }
        }

        // Add Auth to URL
        const userObject = menuItem.items.find(item => item.id === 'user');

        // Check if 'user' object is found
        if (userObject) {
            // Find the 'user-profile' object in the children array of 'user' object
            const userProfileObject = userObject.children.find(item => item.id === 'user-profile');

            // Check if 'user-profile' object is found
            if (userProfileObject) {
                // Update the URL of 'user-profile' object with the user.memberId
                userProfileObject.url = `/user/account-profile/user-profile/${userId}`;
            }

            // Remove create user item
            if (isAdmin === false) {
                userObject.children = userObject.children.filter(item => item.id !== 'new-user');
            }
        }

        const companyObject = menuItem.items.find(item => item.id === 'company');

        // Check if 'company' object is found
        if (companyObject) {
            // Find the 'company-profile' object in the children array of 'company' object
            const companyProfileObject = companyObject.children.find(item => item.id === 'company-profile');

            // Check if 'company-profile' object is found
            if (companyProfileObject) {
                // Update the URL of 'company-profile' object with the company.orgId
                companyProfileObject.url = `/company/company-profile/${userOrgId}`;
            }

            // Company list item for Techmou only
            if (userOrgId !== COMPANIES.TECHMOU) {
                companyObject.children = companyObject.children.filter(item => item.id !== 'company-list');
            }
        }
    };

    useEffect(() => {
        handlerMenuItem();
        // eslint-disable-next-line
    }, []);

    // last menu-item to show in horizontal menu bar
    const lastItem = layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && !matchDownMd ? HORIZONTAL_MAX_ITEM : null;

    let lastItemIndex = menuItem.items.length - 1;
    let remItems = [];
    let lastItemId;

    if (lastItem && lastItem < menuItem.items.length) {
        lastItemId = menuItem.items[lastItem - 1].id;
        lastItemIndex = lastItem - 1;
        remItems = menuItem.items.slice(lastItem - 1, menuItem.items.length).map((item) => ({
            title: item.title,
            elements: item.children,
            icon: item.icon,
            ...(item.url && {
                url: item.url
            })
        }));
    }

    const navItems = menuItem.items.slice(0, lastItemIndex + 1).map((item) => {
        switch (item.type) {
            case 'group':
                if (item.url && item.id !== lastItemId) {
                    return (
                        <List key={item.id}>
                            <NavItem item={item} level={1} isParents />
                            {layout !== LAYOUT_CONST.HORIZONTAL_LAYOUT && <Divider sx={{ py: 0.5 }} />}
                        </List>
                    );
                }
                return <NavGroup key={item.id} item={item} lastItem={lastItem} remItems={remItems} lastItemId={lastItemId} />;
            default:
                return (
                    <Typography key={item.id} variant="h6" color="error" align="center">
                        Menu Items Error
                    </Typography>
                );
        }
    });

    return layout === LAYOUT_CONST.VERTICAL_LAYOUT || (layout === LAYOUT_CONST.HORIZONTAL_LAYOUT && matchDownMd) ? (
        <Box {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>
    ) : (
        <>{navItems}</>
    );
};

export default memo(MenuList);
