// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconApps, IconBook2, IconBookUpload } from '@tabler/icons-react';

// constant
const icons = {
    IconApps,
    IconBook2,
    IconBookUpload,
};

// ==============================|| USER MENU ITEMS ||============================== //

const group = {
    id: 'group',
    title: <FormattedMessage id="group" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'group-list',
            title: (
                <>
                    <FormattedMessage id="group-list" />
                </>
            ),
            type: 'item',
            icon: icons.IconBook2,
            url: '/group/group-list'
        },
        {
            id: 'new-group',
            title: (
                <>
                    <FormattedMessage id="new-group" />
                </>
            ),
            type: 'item',
            icon: icons.IconBookUpload,
            url: '/group/new-group'
        }
    ]
};

export default group;
