import React from "react";

const AddTransaction = ({ coins, newTransaction, handleAddTransaction, handleNewTransactionChange }) => {
  
  return (
    <div className="table-responsive small">
      <h4 className="text-left">Execute transaction</h4>
      <table className="table table-striped table-bordered table-sm text-nowrap">
        <tbody>
          <tr className="table-dark">
            <td>
              <select
                style={{ cursor: "pointer", fontSize: '85%' }}
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
            <td>
              <select
                style={{ cursor: "pointer", fontSize: '85%' }}
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
            <td>
              <input
              style={{ fontSize: '85%' }}
                type="number"
                className="form-control"
                placeholder="Price(€)"
                value={newTransaction.price}
                onChange={(e) =>
                  handleNewTransactionChange("price", e.target.value)
                }
              />
            </td>
            <td>
              <input
              style={{ fontSize: '85%' }}
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
              style={{ cursor: "pointer", fontSize: '85%' }}
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
