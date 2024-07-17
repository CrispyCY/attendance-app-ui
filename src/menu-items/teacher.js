// third-party
import { FormattedMessage } from 'react-intl';

// assets
import { IconApps, IconAddressBook, IconCirclePlus } from '@tabler/icons-react';

// constant
const icons = {
    IconApps,
    IconAddressBook,
    IconCirclePlus,
};

// ==============================|| USER MENU ITEMS ||============================== //

const teacher = {
    id: 'teacher',
    title: <FormattedMessage id="teacher" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'teacher-list',
            title: (
                <>
                    <FormattedMessage id="teacher-list" />
                </>
            ),
            type: 'item',
            icon: icons.IconAddressBook,
            url: '/teacher/teacher-list'
        },
        {
            id: 'new-teacher',
            title: (
                <>
                    <FormattedMessage id="new-teacher" />
                </>
            ),
            type: 'item',
            icon: icons.IconCirclePlus,
            url: '/teacher/new-teacher'
        }
    ]
};

export default teacher;
