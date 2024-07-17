import dashboard from './dashboard';
// import application from './application';
// import forms from './forms';
// import elements from './elements';
// import samplePage from './sample-page';
// import pages from './pages';
// import utilities from './utilities';
// import support from './support';
// import other from './other';
import company from './company';
import user from './user';
import student from './student';
import pack from './package';
import attendance from './attendance';
import classCategory from './class';
// import group from './group';
// import teacher from './teacher';
// import teacherAttendance from './teacher-attendance';

// project imports

// ==============================|| MENU ITEMS ||============================== //

// const defaultItems = [dashboard, attendance, student, teacherAttendance, teacher, group, classCategory, pack, user, company];
const defaultItems = [dashboard, attendance, student, classCategory, pack, user, company];

// Initialize menu items with default values
let menuItems = { items: [...defaultItems] };

export default menuItems;