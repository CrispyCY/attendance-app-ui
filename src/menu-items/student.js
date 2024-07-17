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

const student = {
    id: 'student',
    title: <FormattedMessage id="student" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'student-list',
            title: (
                <>
                    <FormattedMessage id="student-list" />
                </>
            ),
            type: 'item',
            icon: icons.IconAddressBook,
            url: '/student/student-list'
        },
        {
            id: 'new-student',
            title: (
                <>
                    <FormattedMessage id="new-student" />
                </>
            ),
            type: 'item',
            icon: icons.IconCirclePlus,
            url: '/student/new-student'
        }
    ]
};

export default student;
