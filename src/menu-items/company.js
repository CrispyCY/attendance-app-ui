// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconApps, IconBuilding, IconBuildingCommunity } from '@tabler/icons-react';

// project imports

// constant
const icons = {
    IconApps,
    IconBuilding,
    IconBuildingCommunity
};

// ==============================|| COMPANY MENU ITEMS ||============================== //

const company = {
    id: 'company',
    title: <FormattedMessage id="company" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'company-profile',
            title: (
                <>
                    <FormattedMessage id="profile" />
                </>
            ),
            type: 'item',
            icon: icons.IconBuilding,
            url: '/company/company-profile/:orgId'
        },
        {
            id: 'company-list',
            title: (
                <>
                    <FormattedMessage id="company-list" />
                </>
            ),
            type: 'item',
            icon: icons.IconBuildingCommunity,
            url: '/company/company-list'
        }
    ]
};

export default company;
