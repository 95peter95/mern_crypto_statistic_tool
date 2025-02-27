import React from "react";

const AddTransaction = ({ coins, newTransaction, handleAddTransaction, handleNewTransactionChange }) => {
  
  return (
    <div style={{ marginTop: "-30px" }} className="table-responsive small">
      <h4 className="text-left mt-4">Execute transaction</h4>
      <table className="table table-striped table-bordered table-sm text-nowrap">
        <tbody>
          <tr className="table-dark">
            <td style={{ paddingRight: "20px" }}>
              <select
                style={{ cursor: "pointer" }}
                className="form-control"
                value={newTransaction.coinId}
                onChange={(e) =>
                  handleNewTransactionChange("coinId", e.target.value)
                }
              >
                <option value="">Choose Asset</option>
                {coins.map((coin) => (
                  <option key={coin._id} value={coin._id}>
                    {coin.name}
                  </option>
                ))}
              </select>
            </td>
            <td style={{ paddingRight: "10px", paddingLeft: "10px" }}>
              <select
                style={{ cursor: "pointer" }}
                className="form-control"
                value={newTransaction.type}
                onChange={(e) =>
                  handleNewTransactionChange("type", e.target.value)
                }
              >
                <option value="deposit">Buy</option>
                <option value="withdraw">Sell</option>
              </select>
            </td>
            <td
              style={{
                paddingRight: "10px",
                paddingLeft: "10px",
                width: "150px",
              }}
            >
              <input
                type="number"
                className="form-control"
                placeholder="Price(€)"
                value={newTransaction.price}
                onChange={(e) =>
                  handleNewTransactionChange("price", e.target.value)
                }
              />
            </td>
            <td
              style={{
                paddingLeft: "10px",
                paddingRight: "10px",
                width: "215px",
              }}
            >
              <input
                type="number"
                className="form-control"
                placeholder="Amount"
                value={newTransaction.amount}
                onChange={(e) =>
                  handleNewTransactionChange("amount", e.target.value)
                }
              />
            </td>
            <td className="text-center">
              <button
                style={{ margin: "3px" }}
                className="btn btn-primary btn-sm"
                onClick={handleAddTransaction}
              >
                Execute
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AddTransaction;
