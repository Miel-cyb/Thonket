// import { mockUsers } from "../users.mock";




// const BASE_URL = "https://thonket-sales-order-system.onrender.com/users";


// // get all users
// export const getUsers = async () => {
//   

//   const res = await fetch(BASE_URL);
//   if (!res.ok) {
//     throw new Error("Failed to fetch users");
//   }
//   return res.json();
// };


// export const getUserByAuthId = async (authId) => {
//    
//     const res = await fetch(`${BASE_URL}/${authId}`);
//     if (!res.ok) {
//       throw new Error("User not found");
//     }
//     return res.json();
// };  


// // CREATE A NEW USER
// export const createUser = async ({ name, role, authId }) => {

//     const res = await fetch(`${BASE_URL}/users`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         name,
//         role,
//         authId,
//       }),
//     });
  
//     if (!res.ok) {
//       const error = await res.text();
//       throw new Error(error || "Failed to create user");
//     }
//   return res.json();
// };



export const updateUserRole = async (authId, role) => {
 
  // await fetch(`${BASE_URL}/${authId}/role`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ role }),
  // });
};

// export async function updateUserName(authId, newName) {
//   const res = await fetch(`${BASE_URL}/${authId}/name`, {
//     method: "PATCH",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ name: newName }),
//   });

//   if (!res.ok) {
//     throw new Error("Failed to update user name");
//   }

//   return res.json();
// }


// export const deleteUser = async (authId) => {
// //   await fetch(`${BASE_URL}/${authId}`, {
// //     method: "DELETE",
// //   });
// };














import {api} from "./authService"; 

// GET all users
export const getUsers = async (limit = 30, offset = 0) => {
  const response = await api.get("/api/users/", { params: { limit, offset } });
  return response.data;
};

// GET single user by ID
export const getUserById = async (id) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

// CREATE new user (admin)
export const createUser = async ({ email, password, role }) => {
  const response = await api.post(
    "/api/users/admin",
    new URLSearchParams({ email, password, confirm_password: password, role }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );
  return response.data;
};

// UPDATE user by ID
export const updateUser = async (id, { email, role }) => {
  const response = await api.put(`/api/users/${id}`, { email, role });
  return response.data;
};

// DELETE user by ID
export const deleteUser = async (id) => {
  await api.delete(`/api/users/${id}`);
};
