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

const classCategory = {
    id: 'class',
    title: <FormattedMessage id="class" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'class-list',
            title: (
                <>
                    <FormattedMessage id="class-list" />
                </>
            ),
            type: 'item',
            icon: icons.IconBook2,
            url: '/class/class-list'
        },
        {
            id: 'new-class',
            title: (
                <>
                    <FormattedMessage id="new-class" />
                </>
            ),
            type: 'item',
            icon: icons.IconBookUpload,
            url: '/class/new-class'
        }
    ]
};

export default classCategory;
