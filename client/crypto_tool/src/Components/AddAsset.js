const AddAsset = ({ newCoin, handleNewCoinChange, handleAddCoin }) => {
  return (
    <div className="table-responsive small">
      <h4 className="text-left mt-4">Add New Asset</h4>
      <table className="table table-striped table-bordered table-sm text-nowrap">
        <tbody>
          <tr className="table-dark">
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={newCoin.name}
                onChange={(e) => handleNewCoinChange("name", e.target.value)}
              />
            </td>
            <td>
              <input
                type="text"
                className="form-control"
                placeholder="API ID"
                value={newCoin.api_id}
                onChange={(e) => handleNewCoinChange("api_id", e.target.value)}
              />
            </td>
            <td className="text-center">
              <button
                className="btn btn-success btn-sm"
                onClick={handleAddCoin}
              >
                Add Asset
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AddAsset;
