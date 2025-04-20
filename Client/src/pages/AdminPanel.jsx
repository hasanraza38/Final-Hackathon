// import React, { useState, useEffect } from 'react';
// import api from '../services/api';

// function AdminPanel() {
//   // State for Categories
//   const [categories, setCategories] = useState([]);
//   const [categoryForm, setCategoryForm] = useState({
//     name: '',
//     subcategories: '',
//     maxLoan: '',
//     period: ''
//   });
//   const [editingCategory, setEditingCategory] = useState(null);
//   const [categoryError, setCategoryError] = useState('');

//   // State for Applications
//   const [applications, setApplications] = useState([]);
//   const [filters, setFilters] = useState({ city: '', country: '' });
//   const [appError, setAppError] = useState('');
//   const [loading, setLoading] = useState(false);

//   // Fetch Categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         const { data } = await api.get('/v1/admin/getcategries');
//         setCategories(data);
//       } catch (error) {
//         setCategoryError(error.response?.data?.message || 'Error fetching categories');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Fetch Applications
//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         setLoading(true);
//         const { data } = await api.get('/v1/admin/applications', { params: filters });
//         setApplications(data);
//       } catch (error) {
//         setAppError(error.response?.data?.message || 'Error fetching applications');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchApplications();
//   }, [filters]);

//   // Handle Category Form Submission
//   const handleCategorySubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setCategoryError('');
//       const subcategories = categoryForm.subcategories
//         .split(',')
//         .map(sub => sub.trim())
//         .filter(sub => sub);
//       const payload = {
//         name: categoryForm.name,
//         subcategories,
//         maxLoan: Number(categoryForm.maxLoan),
//         period: Number(categoryForm.period)
//       };

//       if (editingCategory) {
//         // Edit Category
//         const { data } = await api.put(`/v1/admin/editcategory/${editingCategory._id}`, payload);
//         setCategories(categories.map(cat => (cat._id === editingCategory._id ? data.category : cat)));
//         setEditingCategory(null);
//       } else {
//         // Add Category
//         const { data } = await api.post('/v1/admin/addcategory', payload);
//         setCategories([...categories, data.category]);
//       }

//       setCategoryForm({ name: '', subcategories: '', maxLoan: '', period: '' });
//     } catch (error) {
//       setCategoryError(error.response?.data?.message || 'Error saving category');
//     }
//   };

//   // Handle Category Edit
//   const handleEditCategory = (category) => {
//     setEditingCategory(category);
//     setCategoryForm({
//       name: category.name,
//       subcategories: category.subcategories.join(', '),
//       maxLoan: category.maxLoan,
//       period: category.period
//     });
//   };

//   // Handle Category Delete
//   const handleDeleteCategory = async (id) => {
//     try {
//       await api.delete(`/v1/admin/deletecategory/${id}`);
//       setCategories(categories.filter(cat => cat._id !== id));
//     } catch (error) {
//       setCategoryError(error.response?.data?.message || 'Error deleting category');
//     }
//   };

//   // Handle Application Update
//   const updateApplication = async (id, status, tokenNumber) => {
//     try {
//       setAppError('');
//       await api.put(`/admin/applications/${id}/${status}`, { tokenNumber });
//       setApplications(applications.map(app => 
//         app._id === id ? { ...app, status, tokenNumber } : app
//       ));
//     } catch (error) {
//       setAppError(error.response?.data?.message || 'Error updating application');
//     }
//   };

//   return (
//     <div className="p-6 max-w-7xl mx-auto">
//       <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

//       {/* Category Management Section */}
//       <div className="mb-8 bg-white p-6 rounded-lg shadow">
//         <h2 className="text-2xl font-semibold mb-4">
//           {editingCategory ? 'Edit Category' : 'Add New Category'}
//         </h2>
//         {categoryError && <p className="text-red-500 mb-4">{categoryError}</p>}
//         <form onSubmit={handleCategorySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Category Name</label>
//             <input
//               type="text"
//               className="border p-2 w-full rounded"
//               placeholder="e.g., Wedding Loans"
//               value={categoryForm.name}
//               onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Subcategories (comma-separated)</label>
//             <input
//               type="text"
//               className="border p-2 w-full rounded"
//               placeholder="e.g., Valima, Furniture"
//               value={categoryForm.subcategories}
//               onChange={e => setCategoryForm({ ...categoryForm, subcategories: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Max Loan Amount (PKR)</label>
//             <input
//               type="number"
//               className="border p-2 w-full rounded"
//               placeholder="e.g., 500000"
//               value={categoryForm.maxLoan}
//               onChange={e => setCategoryForm({ ...categoryForm, maxLoan: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1">Max Loan Period (Years)</label>
//             <input
//               type="number"
//               className="border p-2 w-full rounded"
//               placeholder="e.g., 3"
//               value={categoryForm.period}
//               onChange={e => setCategoryForm({ ...categoryForm, period: e.target.value })}
//               required
//             />
//           </div>
//           <div className="md:col-span-2">
//             <button
//               type="submit"
//               className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//             >
//               {editingCategory ? 'Update Category' : 'Add Category'}
//             </button>
//             {editingCategory && (
//               <button
//                 type="button"
//                 className="ml-2 bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
//                 onClick={() => {
//                   setEditingCategory(null);
//                   setCategoryForm({ name: '', subcategories: '', maxLoan: '', period: '' });
//                 }}
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>

//         {/* Categories List */}
//         <h2 className="text-2xl font-semibold mt-6 mb-4">Existing Categories</h2>
//         {loading && <p className="text-gray-500">Loading...</p>}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {categories.map(cat => (
//             <div key={cat._id} className="border p-4 rounded">
//               <h3 className="text-lg font-medium">{cat.name}</h3>
//               <p>Subcategories: {cat.subcategories.join(', ') || 'None'}</p>
//               <p>Max Loan: PKR {cat.maxLoan}</p>
//               <p>Max Period: {cat.period} years</p>
//               <div className="mt-2">
//                 <button
//                   className="bg-yellow-500 text-white p-1 rounded mr-2 hover:bg-yellow-600"
//                   onClick={() => handleEditCategory(cat)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
//                   onClick={() => handleDeleteCategory(cat._id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Application Management Section */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-2xl font-semibold mb-4">Loan Applications</h2>
//         {appError && <p className="text-red-500 mb-4">{appError}</p>}
//         <div className="mb-4 flex space-x-4">
//           <input
//             className="border p-2 rounded flex-1"
//             placeholder="Filter by City"
//             value={filters.city}
//             onChange={e => setFilters({ ...filters, city: e.target.value })}
//           />
//           <input
//             className="border p-2 rounded flex-1"
//             placeholder="Filter by Country"
//             value={filters.country}
//             onChange={e => setFilters({ ...filters, country: e.target.value })}
//           />
//         </div>
//         {loading && <p className="text-gray-500">Loading...</p>}
//         <div className="space-y-4">
//           {applications.map(app => (
//             <div key={app._id} className="border p-4 rounded">
//               <p className="font-medium">User: {app.userId.name} ({app.userId.email})</p>
//               <p>Loan: {app.category} - {app.subcategory}</p>
//               <p>Amount: PKR {app.loanAmount}</p>
//               <p>Status: {app.status.charAt(0).toUpperCase() + app.status.slice(1)}</p>
//               <p>Token Number: {app.tokenNumber || 'Not assigned'}</p>
//               <div className="mt-2 flex space-x-2">
//                 <input
//                   className="border p-2 rounded"
//                   placeholder="Set Token Number"
//                   onBlur={e => updateApplication(app._id, app.status, e.target.value)}
//                 />
//                 <select
//                   className="border p-2 rounded"
//                   value={app.status}
//                   onChange={e => updateApplication(app._id, e.target.value, app.tokenNumber)}
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="approved">Approved</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminPanel;