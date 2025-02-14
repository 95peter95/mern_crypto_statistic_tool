import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [coins, setCoins] = useState([]);
  const [prices, setPrices] = useState({});
  const [newCoin, setNewCoin] = useState({ name: "", api_id: "" });
  const [newTransaction, setNewTransaction] = useState({
    coinId: "",
    type: "deposit",
    amount: "",
    price: "",
  });

  useEffect(() => {
    fetchCoins();
  }, []);

  const fetchCoins = async () => {
    try {
      const response = await axios.get("/api/coins");
      setCoins(response.data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
  };

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

  useEffect(() => {
    if (coins.length > 0) {
      fetchPrices();
    }
  }, [coins]);

  const fetchPrices = async () => {
    try {
      const coinIds = coins.map((coin) => coin.api_id).join(",");
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=eur`
      );
      setPrices(response.data);
    } catch (error) {
      console.error("Error fetching prices:", error);
    }
  };

  const handleNewCoinChange = (field, value) => {
    setNewCoin((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCoin = async () => {
    if (!newCoin.name || !newCoin.api_id) {
      toast.warn("Fill out Name and API ID!");
      return;
    }

    try {
      await axios.post("/api/coins", newCoin);
      toast.success("Coin was successfully added!");
      setNewCoin({ name: "", api_id: "" });
      fetchCoins();
    } catch (error) {
      console.error("Error: coin wasnt added", error);
      toast.error("Error while adding coin!");
    }
  };

  const handleNewTransactionChange = (field, value) => {
    setNewTransaction((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTransaction = async () => {
    if (
      !newTransaction.coinId ||
      !newTransaction.amount ||
      !newTransaction.price
    ) {
      toast.warn("Fill all fields");
      return;
    }

    try {
      await axios.patch(`/api/coins/${newTransaction.coinId}/transactions`, {
        type: newTransaction.type,
        amount: parseFloat(newTransaction.amount),
        price: parseFloat(newTransaction.price),
      });
      toast.success("Transaction added successfully");
      setNewTransaction({ coinId: "", type: "deposit", amount: "", price: "" });
      fetchCoins();
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Error adding transaction");
    }
  };

  const handleDeleteCoin = async (coinId) => {
    toast.warn(
      <div>
        <p>Do you really want to delete this coin?</p>
        <button
          className="btn btn-success btn-sm"
          onClick={() => confirmDelete(coinId)}
          style={{ marginRight: "10px" }}
        >
          Yes
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => toast.dismiss()}
        >
          No
        </button>
      </div>,
      { autoClose: false }
    );
  };

  const confirmDelete = async (coinId) => {
    try {
      await axios.delete(`/api/coins/${coinId}`);
      toast.dismiss();
      toast.success("Coin deleted successfully!");
      fetchCoins();
    } catch (error) {
      console.error("Error deleting coin:", error);
      toast.error("Failed to delete coin.");
    }
  };

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
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <div>
        <div
          style={{
            background: "#211f1f",
            width: "140.2%",
            height: "100px",
            marginLeft: "-551px",
            marginTop: "-20px",
            padding: "0px",
            color: "#f4f4f4",
          }}
        >
          <h1
            style={{
              paddingTop: "30px",
              paddingLeft: "750px",
            }}
            className="text-left mb-4"
          >
            Crypto Dashboard
          </h1>
        </div>

        {/* Pridanie noveho coinu */}
        <div style={{ marginTop: "0px" }} className="table-responsive small">
          <h4 className="text-left mt-4">Add new coin</h4>
          <table className="table table-striped table-bordered table-sm text-nowrap">
            <tbody>
              <tr className="table-dark">
                <td style={{ paddingRight: "10px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={newCoin.name}
                    onChange={(e) =>
                      handleNewCoinChange("name", e.target.value)
                    }
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
                    Add Coin
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pridanie transakcie */}
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
                    <option value="">Choose coin</option>
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
        {/* Nová tabuľka pre celkové súčty depositov */}
        <div style={{ marginTop: "-30px" }}>
          <h3 style={{ marginLeft: "20px" }} className="text-left mt-4">
            Total statistics
          </h3>
          <div className="table-responsive small">
            <table
              style={{ fontSize: "14px", cursor: "pointer" }}
              className="table table-dark table-striped table-bordered table-sm text-nowrap"
            >
              <thead className="table-dark text-center">
                <tr>
                  <th>Coin</th>
                  <th>Total Deposit</th>
                  <th>Total Amount</th>
                  <th>Actual price(EUR)</th>
                  <th>Profit/Loss(€)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {totals.map((coin) => (
                  <tr key={coin.id}>
                    <td>{coin.name}</td>
                    <td className="text-end">{coin.totalDeposit.toFixed(2)}</td>
                    <td className="text-end">{coin.totalAmount.toFixed(7)}</td>
                    <td className="text-end">{coin.price.toFixed(2)}</td>
                    <td
                      className="text-end"
                      style={{
                        color: coin.profitLoss >= 0 ? "lightgreen" : "red",
                      }}
                    >
                      {coin.profitLoss.toFixed(2)}
                    </td>
                    <td className="text-center">
                      <button
                        style={{
                          fontSize: "12px",
                          marginLeft: "5px",
                          marginRight: "5px",
                        }}
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteCoin(coin.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {/* CELKOVÉ SUMY */}
                <tr className="fw-bold table-secondary table-dark">
                  <td>TOTAL</td>
                  <td className="text-end">{totalDepositAll.toFixed(2)}</td>
                  <td className="text-end">—</td>
                  <td className="text-end">—</td>
                  <td
                    className={`text-end ${
                      totalProfitLossAll >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {totalProfitLossAll.toFixed(2)}
                  </td>
                  <td></td> {/* Prázdny stĺpec na zarovnanie */}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Zobrazenie transakcii*/}

        <div>
          <h3 style={{ marginLeft: "20px" }} className="text-left mt-4">
            Crypto Transactions by Month
          </h3>
          {coins.length === 0 ? (
            <p>Loading coins...</p>
          ) : (
            <div className="table-responsive small">
              {/* Zobrazenie transakcií v tabuľke */}
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
                  {/* Zobrazenie mesiacov a transakcií */}
                  {coins
                    .flatMap((coin) =>
                      Object.keys(groupTransactionsByMonth(coin))
                    ) // Získame všetky mesiace
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    ) // Unikátne mesiace
                    .sort() // Zoradenie mesiacov
                    .map((monthYear) => (
                      <tr key={monthYear}>
                        <td style={{ paddingTop: "25px" }}>{monthYear}</td>
                        {coins.map((coin) => {
                          const groupedTransactions =
                            groupTransactionsByMonth(coin);
                          const transactions = groupedTransactions[
                            monthYear
                          ] || { deposit: 0, withdraw: 0, total: 0 }; // Ošetrenie neexistujúcich transakcií

                          // Vypočítať celkový výnos/stratu
                          transactions.total =
                            transactions.deposit - transactions.withdraw;

                          return (
                            <td key={coin._id}>
                              <tr>
                                <div style={{ color: "dark" }}>
                                  Deposits: {transactions.deposit.toFixed(2)}€
                                </div>
                              </tr>
                              <tr>
                                <div style={{ color: "lightgrey" }}>
                                  Withdrawals:{" "}
                                  {transactions.withdraw.toFixed(2)}€
                                </div>
                              </tr>
                              <tr>
                                <div style={{ color: "lightgreen" }}>
                                  Invested: {transactions.total.toFixed(2)}€
                                </div>
                              </tr>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Zobrazenie transakcii*/}
      </div>
    </div>
  );
}

export default App;
