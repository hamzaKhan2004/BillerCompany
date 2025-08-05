import CustomerRow from "./CustomerRow";

const CustomerTable = ({ customers, onDelete, onViewDetail }) => (
  <div className="bg-white rounded-xl shadow-xl overflow-x-auto">
    <table className="min-w-full table-auto ">
      <thead>
        <tr className="bg-[#e9f7fc] text-[#1d8599]">
          <th className="p-3 text-center">Avatar</th>
          <th className="p-3 text-left">Name</th>
          <th className="p-3 text-left">Email</th>
          <th className="p-3 text-left">Joined</th>
          <th className="p-3 text-left">Phone</th>
          <th className="p-3 text-left">City</th>
          <th className="p-3 text-center">Orders</th>
          <th className="p-3 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.length === 0 ? (
          <tr>
            <td colSpan={8} className="p-6 text-center text-gray-500">
              No customers found.
            </td>
          </tr>
        ) : (
          customers.map((c) => (
            <CustomerRow
              key={c._id}
              customer={c}
              onDelete={onDelete}
              onViewDetail={onViewDetail}
            />
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default CustomerTable;
