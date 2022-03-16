import Dashboard from "./views/Dashboard.js";
import TableList from "./views/Tables.js";

var routes = [
  {
//    path: "/dashboard",
    name: "User Profile",
     icon: "nc-icon nc-single-02",
    component: Dashboard,
//    layout: "/admin",
  },
  {
//    path: "/tables",
    name: "Table List",
    // icon: "nc-icon nc-tile-56",
    component: TableList,
//    layout: "/admin",
  },
];
export default routes;
