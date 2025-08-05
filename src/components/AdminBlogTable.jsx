import AdminBlogRow from "./AdminBlogRow";

const AdminBlogTable = ({ blogs, onDelete, onEdit }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-[#e9f7fc] text-[#1d8599]">
          <th className="p-3 text-left">Cover Image</th>
          <th className="p-3 text-left">Title</th>
          <th className="p-3 text-left">Slug</th>
          <th className="p-3 text-left">Created</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {blogs.length === 0 ? (
          <tr>
            <td colSpan={5} className="p-6 text-center text-gray-500">
              No blogs found.
            </td>
          </tr>
        ) : (
          blogs.map((blog) => (
            <AdminBlogRow
              key={blog._id}
              blog={blog}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default AdminBlogTable;
