import React from "react";

const ActualStatistics = ({ coins, prices, onDelete }) => {

  const calculateTotals = () => {
    let totalDepositAll = 0;
    let totalProfitLossAll = 0;
    const totals = coins.map((coin) => {
      let totalDeposit = 0;
      let totalAmount = 0;
      coin.transactions.forEach((transaction) => {
        if (transaction.type === "deposit") {
          totalDeposit += transaction.price;
          totalAmount += transaction.amount;
        } else if (transaction.type === "withdraw") {
          totalDeposit -= transaction.price;
          totalAmount -= transaction.amount;
          if (totalDeposit <= 0) {
            totalDeposit = 0;
          }
          if (totalAmount <= 0) {
            totalAmount = 0;
          }
        }
      });
      const price = prices[coin.api_id]?.eur || 0;
      const value = totalAmount * price;
      const profitLoss = value - totalDeposit;
      totalDepositAll += totalDeposit;
      totalProfitLossAll += profitLoss;
      return {
        name: coin.name,
        id: coin._id,
        totalDeposit,
        totalAmount,
        price,
        profitLoss,
      };
    });
    return { totals, totalDepositAll, totalProfitLossAll };
  };
  const { totals, totalDepositAll, totalProfitLossAll } = calculateTotals();
    
  return (
    <div>
      <div className="table-responsive small">
      <h4 className="text-left">Actual statistics</h4>
            <table className="table table-dark table-striped table-bordered table-sm text-nowrap">
              <thead className="table-dark text-center">
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
                    <td className="text-end">
                      {coin.totalDeposit.toFixed(2)}€
                    </td>
                    <td className="text-end">{coin.totalAmount.toFixed(8)}</td>
                    <td className="text-end">{coin.price.toFixed(2)}€</td>
                    <td
                      className="text-end"
                      style={{
                        color: coin.profitLoss >= 0 ? "lightgreen" : "red",
                      }}
                    >
                      {coin.profitLoss.toFixed(2)}€
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => onDelete(coin.id)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
                {/* CELKOVÉ SUMY */}
                <tr className="fw-bold table-secondary table-dark">
                  <td>Placed value</td>
                  <td className="text-end">{totalDepositAll.toFixed(2)}€</td>
                  <td className="text-end">—</td>
                  <td className="text-end">—</td>
                  <td
                    className={`text-end ${
                      totalProfitLossAll >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {totalProfitLossAll.toFixed(2)}€
                  </td>
                  <td></td> {/* Prázdny stĺpec na zarovnanie */}
                </tr>
              </tbody>
            </table>
          </div>
    </div>
  );
};

export default ActualStatistics;
