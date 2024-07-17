// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconApps, IconUserCheck, IconUsers, IconUserPlus } from '@tabler/icons-react';

// project imports

// constant
const icons = {
    IconApps,
    IconUserCheck,
    IconUsers,
    IconUserPlus
};

// ==============================|| USER MENU ITEMS ||==============================

const user = {
    id: 'user',
    title: <FormattedMessage id="user" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'user-profile',
            title: (
                <>
                    <FormattedMessage id="profile" />
                </>
            ),
            type: 'item',
            icon: icons.IconUserCheck,
            url: '/user/account-profile/user-profile/:memberId'
        },
        // {
        //     id: 'editProfile',
        //     title: (
        //         <>
        //             <FormattedMessage id="Edit profile" />
        //         </>
        //     ),
        //     type: 'item',
        //     icon: icons.IconUserCheck,
        //     url: '/user/account-profile/edit-profile'
        // },
        {
            id: 'user-list',
            title: (
                <>
                    <FormattedMessage id="user-list" />
                </>
            ),
            type: 'item',
            icon: icons.IconUsers,
            url: '/user/user-list'
        },
        {
            id: 'new-user',
            title: (
                <>
                    <FormattedMessage id="new-user" />
                </>
            ),
            type: 'item',
            icon: icons.IconUserPlus,
            url: '/user/account-profile/new-user'
        }
    ]
};

export default user;