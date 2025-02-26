const ActualStatistics = ({
  totals,
  totalDepositAll,
  totalProfitLossAll,
  handleDeleteCoin,
}) => {
  return (
    <div>
      <div className="table-responsive small">
        <h3 className="text-left mt-4">Actual Statistics</h3>
        <table className="table table-dark table-striped table-bordered table-sm text-nowrap">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Actual Deposit</th>
              <th>Actual Amount</th>
              <th>Actual Price</th>
              <th>Profit/Loss</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {totals.map((coin) => (
              <tr key={coin.id}>
                <td>{coin.name}</td>
                <td className="text-end">{coin.totalDeposit.toFixed(2)}€</td>
                <td className="text-end">{coin.totalAmount.toFixed(8)}</td>
                <td className="text-end">{coin.price.toFixed(2)}€</td>
                <td
                  className="text-end"
                  style={{ color: coin.profitLoss >= 0 ? "lightgreen" : "red" }}
                >
                  {coin.profitLoss.toFixed(2)}€
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteCoin(coin.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            <tr className="fw-bold table-secondary table-dark">
              <td>Placed value</td>
              <td className="text-end">{totalDepositAll.toFixed(2)}€</td>
              <td className="text-end">—</td>
              <td className="text-end">—</td>
              <td className="text-end">{totalProfitLossAll.toFixed(2)}€</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActualStatistics;
