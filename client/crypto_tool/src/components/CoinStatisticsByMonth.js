import React from "react";

// Funkcia na konverziu timestamp do formátu "mm-yyyy"
const getMonthYear = (timestamp) => {
  const date = new Date(timestamp);
  const month = String(date.getMonth() + 1).padStart(2, "0"); // mesiace sú indexované od 0
  const year = date.getFullYear();
  return `${month}-${year}`;
};

// Funkcia na zoskupenie transakcií podľa mesiacov
const groupTransactionsByMonth = (coin) => {
  const groupedTransactions = {};
  coin.transactions.forEach((transaction) => {
    const monthYear = getMonthYear(transaction.timestamp);
    if (!groupedTransactions[monthYear]) {
      groupedTransactions[monthYear] = { deposit: 0, withdraw: 0, total: 0 };
    }
    // Rozdelenie na vklady a výbery
    if (transaction.type === "deposit") {
      groupedTransactions[monthYear].deposit += transaction.price;
    } else if (transaction.type === "withdraw") {
      groupedTransactions[monthYear].withdraw += transaction.price;
    }
    groupedTransactions[monthYear].total =
      groupedTransactions[monthYear].deposit -
      groupedTransactions[monthYear].withdraw;
  });
  return groupedTransactions;
};

const CoinStatisticsByMonth = ({ coins }) => {
  return (
    <div>
      <h3 className="text-left" style={{ marginLeft: "20px"}}>
        Total statistics by Month
      </h3>
      {coins.length === 0 ? (
        <p>Loading Assets...</p>
      ) : (
        <div className="table-responsive small">
          <table
            style={{ fontSize: "14px", cursor: "pointer" }}
            className="table table-dark table-striped table-bordered table-sm text-nowrap"
          >
            <thead className="table-dark">
              <tr>
                <th>Month-Year</th>
                {coins.map((coin) => (
                  <th key={coin._id}>{coin.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {coins
                .flatMap((coin) => Object.keys(groupTransactionsByMonth(coin)))
                .filter((value, index, self) => self.indexOf(value) === index)
                .sort()
                .map((monthYear) => (
                  <tr key={monthYear}>
                    <td style={{ paddingTop: "15px" }}>{monthYear}</td>
                    {coins.map((coin) => {
                      const groupedTransactions = groupTransactionsByMonth(coin);
                      const transactions = groupedTransactions[monthYear] || {
                        deposit: 0,
                        withdraw: 0,
                        total: 0,
                      };
                      transactions.total = transactions.withdraw - transactions.deposit;

                      return (
                        <td key={coin._id}>
                          <div style={{ color: "white" }}>
                            Deposits: {transactions.deposit.toFixed(2)}€
                          </div>
                          <div style={{ color: "white" }}>
                            Withdrawals: {transactions.withdraw.toFixed(2)}€
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              {/* Total Profit/Loss row */}
              <tr style={{ fontWeight: "bold", backgroundColor: "#222" }}>
                <td>Total Profit/Loss</td>
                {coins.map((coin) => {
                  const groupedTransactions = groupTransactionsByMonth(coin);
                  const totalProfitLoss = Object.values(groupedTransactions).reduce(
                    (sum, transaction) => sum + (transaction.withdraw - transaction.deposit),
                    0
                  );
                  return (
                    <td key={coin._id}>
                      <div
                        style={{
                          color: totalProfitLoss >= 0 ? "lightgreen" : "red",
                          fontSize: "16px",
                        }}
                      >
                        {totalProfitLoss.toFixed(2)}€
                      </div>
                    </td>
                  );
                })}
              </tr>
              {/* Grand Total Profit/Loss row */}
              <tr style={{ fontWeight: "bold", backgroundColor: "#333" }}>
                <td>Grand Total Profit/Loss</td>
                <td colSpan={coins.length} style={{ textAlign: "center" }}>
                  {(() => {
                    const grandTotalProfitLoss = coins.reduce((totalSum, coin) => {
                      const groupedTransactions = groupTransactionsByMonth(coin);
                      const totalProfitLoss = Object.values(groupedTransactions).reduce(
                        (sum, transaction) => sum + (transaction.withdraw - transaction.deposit),
                        0
                      );
                      return totalSum + totalProfitLoss;
                    }, 0);
                    return (
                      <div
                        style={{
                          color: grandTotalProfitLoss >= 0 ? "lightgreen" : "red",
                          fontSize: "18px",
                          fontWeight: "bold",
                        }}
                      >
                        {grandTotalProfitLoss.toFixed(2)}€
                      </div>
                    );
                  })()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoinStatisticsByMonth;