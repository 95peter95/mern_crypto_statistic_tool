import React from "react";

const AddAsset = ({ handleNewCoinChange, handleAddCoin, newCoin }) => {
  return (
    <div>
      <div className="table-responsive small">
        <h4 className="text-left">Add New Asset</h4>
        <table className="table table-striped table-bordered table-sm text-nowrap">
          <tbody>
            <tr className="table-dark">
              <td>
                <input
                  style={{ fontSize: '85%' }}
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={newCoin.name}
                  onChange={(e) => handleNewCoinChange("name", e.target.value)}
                />
              </td>
              <td>
                <input
                style={{ fontSize: '85%' }}
                  type="text"
                  className="form-control"
                  placeholder="API ID"
                  value={newCoin.api_id}
                  onChange={(e) =>
                    handleNewCoinChange("api_id", e.target.value)
                  }
                />
              </td>
              <td className="text-center">
                <button
                  style={{ cursor: "pointer", fontSize: '85%' }}
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
    </div>
  );
};

export default AddAsset;
