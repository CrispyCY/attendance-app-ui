import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// attendance
const MarkAttendance = Loadable(lazy(() => import('views/attendance/mark')));
const AttendanceList = Loadable(lazy(() => import('views/attendance/attendance-list')));
const Placeholder = Loadable(lazy(() => import('views/placeholder')));

// ==============================|| ATTENDANCE ROUTING ||============================== //

const AttendanceRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/attendance/mark-attendance',
            element: <MarkAttendance />
        },
        {
            path: '/attendance/attendance-list',
            element: <AttendanceList />
        },
    ]
};

export default AttendanceRoutes;

export const AttendancePlaceholderRoutes = {
    path: '/',
    element: (
        <AuthGuard>
            <MainLayout />
        </AuthGuard>
    ),
    children: [
        {
            path: '/attendance/mark-attendance',
            element: <Placeholder />
        },
        {
            path: '/attendance/attendance-list',
            element: <Placeholder />
        },
    ]
};