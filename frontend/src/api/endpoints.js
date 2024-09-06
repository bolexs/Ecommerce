export const endpoints = {
  auth: {
    register: "auth/register",
    login: "auth/login",
    dashboard: "auth/dashboard",
  },
  products: {
    allproducts: "auth/products",
    createproduct: "auth/create-product",
    updateproduct: "auth/product",
    deleteproduct: "auth/product",
    singleproduct: "auth/product",
  },
  admin: {
    allusers: "auth/admin-get-allusers",
    createuser: "auth/admin-user-creation",
    updateuser: "auth/admin-user-edit",
    deleteuser: "auth/admin-user-delete",
  },
  settings: {
    updateprofile: "auth/update-profile",
    updatepassword: "auth/update-password",
    getprofile: "auth/get-profile",
  },
};
