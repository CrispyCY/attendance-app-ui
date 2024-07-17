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

const teacherAttendance = {
    id: 'teacher-attendance',
    title: <FormattedMessage id="teacher-attendance" />,
    icon: icons.IconApps,
    type: 'group',
    children: [
        {
            id: 'mark-teacher-attendance',
            title: (
                <>
                    <FormattedMessage id="mark-teacher-attendance" />
                </>
            ),
            type: 'item',
            icon: icons.IconCalendarPlus,
            url: '/attendance/mark-teacher-attendance'
        },
        {
            id: 'teacher-attendance-list',
            title: (
                <>
                    <FormattedMessage id="teacher-attendance-list" />
                </>
            ),
            type: 'item',
            icon: icons.IconCalendarUser,
            url: '/teacher/attendance/teacher-attendance-list'
        }
    ]
};

export default teacherAttendance;
