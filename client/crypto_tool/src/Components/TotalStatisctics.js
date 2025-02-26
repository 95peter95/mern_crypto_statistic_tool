const TotalStatisticsByMonth = ({ coins, groupTransactionsByMonth }) => {
  return (
    <div>
      <div className="table-responsive small">
        <h3 className="text-left mt-4">Total Statistics by Month</h3>
        <table className="table table-dark table-striped table-bordered table-sm text-nowrap">
          <thead>
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
                  <td>{monthYear}</td>
                  {coins.map((coin) => {
                    const transactions = groupTransactionsByMonth(coin)[
                      monthYear
                    ] || { deposit: 0, withdraw: 0, total: 0 };
                    return (
                      <td key={coin._id}>
                        <div>Deposits: {transactions.deposit.toFixed(2)}€</div>
                        <div>
                          Withdrawals: {transactions.withdraw.toFixed(2)}€
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TotalStatisticsByMonth;
