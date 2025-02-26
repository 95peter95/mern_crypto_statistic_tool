const ExecuteTransaction = ({
  coins,
  newTransaction,
  handleNewTransactionChange,
  handleAddTransaction,
}) => {
  return (
    <div className="table-responsive small">
      <h4 className="text-left mt-4">Execute Transaction</h4>
      <table className="table table-striped table-bordered table-sm text-nowrap">
        <tbody>
          <tr className="table-dark">
            <td>
              <select
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

export default ExecuteTransaction;
