// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconApps, IconCalendarPlus, IconCalendarUser } from '@tabler/icons-react';

// constant
const icons = {
    IconApps,
    IconCalendarPlus,
    IconCalendarUser
};

// ==============================|| USER MENU ITEMS ||============================== //

const attendance = {
    id: 'attendance',
    title: <FormattedMessage id="attendance" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'mark-attendance',
            title: (
                <>
                    <FormattedMessage id="mark-attendance" />
                </>
            ),
            type: 'item',
            icon: icons.IconCalendarPlus,
            url: '/attendance/mark-attendance'
        },
        {
            id: 'attendance-list',
            title: (
                <>
                    <FormattedMessage id="attendance-list" />
                </>
            ),
            type: 'item',
            icon: icons.IconCalendarUser,
            url: '/attendance/attendance-list'
        }
    ]
};

export default attendance;
