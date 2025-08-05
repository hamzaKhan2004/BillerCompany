import AdminProductRow from "./AdminProductRow";

const AdminProductTable = ({ products, onDelete, onEdit }) => (
  <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
    <table className="min-w-full table-auto">
      <thead>
        <tr className="bg-[#e9f7fc] text-[#1d8599]">
          <th className="p-3 text-left">Img</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Brand</th>
          <th className="p-3 text-left">Type</th>
          <th className="p-3 text-left">Size</th>
          <th className="p-3 text-left">Material</th>
          <th className="p-3 text-left">Price</th>
          <th className="p-3 text-left">MRP</th>
          <th className="p-3 text-left">Stock</th>
          <th className="p-3 text-left">Slug</th>
          <th className="p-3 text-left">Created</th>
          <th className="p-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan={12} className="p-6 text-center text-gray-500">
              No products found.
            </td>
          </tr>
        ) : (
          products.map((product) => (
            <AdminProductRow
              key={product._id}
              product={product}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default AdminProductTable;
