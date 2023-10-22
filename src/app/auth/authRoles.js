export const authRoles = {
    sa: ['Admin'], // Only Super Admin has access
    admin: ["Admin", "Staff"], // Only SA & Admin has access
    editor: ["Admin", 'Staff'], // Only SA & Admin & Editor has access
    guest: ["Admin", 'Staff', 'Guest'], // Everyone has access
}

// Check out app/views/dashboard/DashboardRoutes.js
// Only SA & Admin has dashboard access

// const dashboardRoutes = [
//   {
//     path: "/dashboard/analytics",
//     component: Analytics,
//     auth: authRoles.admin <===============
//   }
// ];

// Check navigaitons.js

// {
//   name: "Dashboard",
//   path: "/dashboard/analytics",
//   icon: "dashboard",
//   auth: authRoles.admin <=================
// }
