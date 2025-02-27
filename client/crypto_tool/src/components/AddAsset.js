import React from "react";

const AddAsset = ({ handleNewCoinChange, handleAddCoin, newCoin }) => {
  return (
    <div>
      <div style={{ marginTop: "0px" }} className="table-responsive small">
        <h4 className="text-left mt-4">Add New Asset</h4>
        <table className="table table-striped table-bordered table-sm text-nowrap">
          <tbody>
            <tr className="table-dark">
              <td style={{ paddingRight: "10px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  value={newCoin.name}
                  onChange={(e) => handleNewCoinChange("name", e.target.value)}
                />
              </td>
              <td style={{ paddingRight: "10px", paddingLeft: "10px" }}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="API ID"
                  value={newCoin.api_id}
                  onChange={(e) =>
                    handleNewCoinChange("api_id", e.target.value)
                  }
                />
              </td>
              <td style={{ paddingRight: "20px" }} className="text-center">
                <button
                  style={{
                    margin: "3px",
                    marginLeft: "20px",
                    paddingLeft: "50px",
                    paddingRight: "50px",
                  }}
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
