import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// attendance
const MarkAttendance = Loadable(lazy(() => import('views/teacher-attendance/mark')));
const AttendanceList = Loadable(lazy(() => import('views/teacher-attendance/attendance-list')));
const Placeholder = Loadable(lazy(() => import('views/placeholder')));

// ==============================|| ATTENDANCE ROUTING ||============================== //

const TeacherAttendanceRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/attendance/mark-teacher-attendance',
            element: <MarkAttendance />
        },
        {
            path: '/teacher/attendance/teacher-attendance-list',
            element: <AttendanceList />
        },
    ]
};

export default TeacherAttendanceRoutes;

export const TeacherAttendancePlaceholderRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/attendance/mark-teacher-attendance',
            element: <Placeholder />
        },
        {
            path: '/teacher/attendance/teacher-attendance-list',
            element: <Placeholder />
        },
    ]
};