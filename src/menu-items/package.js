// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconApps, IconBox, IconCubePlus } from '@tabler/icons-react';

// constant
const icons = {
    IconApps,
    IconBox,
    IconCubePlus
};

// ==============================|| USER MENU ITEMS ||============================== //

const pack = {
    id: 'package',
    title: <FormattedMessage id="package" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'package-list',
            title: (
                <>
                    <FormattedMessage id="package-list" />
                </>
            ),
            type: 'item',
            icon: icons.IconBox,
            url: '/package/package-list'
        },
        {
            id: 'new-package',
            title: (
                <>
                    <FormattedMessage id="new-package" />
                </>
            ),
            type: 'item',
            icon: icons.IconCubePlus,
            url: '/package/new-package'
        }
    ]
};

export default pack;
