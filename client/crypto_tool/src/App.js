import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddAsset from "./Components/AddAsset";
import ExecuteTransaction from "./Components/ExecuteTransaction";
import ActualStatistics from "./Components/ActualStatistics";
import TotalStatisticsByMonth from "./Components/TotalStatisctics";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";


const App = () => {
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
      console.error("Error fetching assets:", error);
    }
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

  const handleAddCoin = async () => {
    if (!newCoin.name || !newCoin.api_id) {
      toast.warn("Fill out Name and API ID!");
      return;
    }

    try {
      await axios.post("/api/coins", newCoin);
      toast.success("Asset added successfully!");
      setNewCoin({ name: "", api_id: "" });
      fetchCoins();
    } catch (error) {
      console.error("Error: asset wasn't added", error);
      toast.error("Error adding asset!");
    }
  };

  const handleAddTransaction = async () => {
    if (!newTransaction.coinId || !newTransaction.amount || !newTransaction.price) {
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
        <button className="btn btn-success btn-sm" onClick={() => confirmDelete(coinId)} style={{ marginRight: "10px" }}>
          Yes
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => toast.dismiss()}>No</button>
      </div>,
      { autoClose: false }
    );
  };

  const confirmDelete = async (coinId) => {
    try {
      await axios.delete(`/api/coins/${coinId}`);
      toast.dismiss();
      toast.success("Asset deleted successfully!");
      fetchCoins();
    } catch (error) {
      console.error("Error deleting asset:", error);
      toast.error("Failed to delete asset.");
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
          if (totalDeposit <= 0) totalDeposit = 0;
          if (totalAmount <= 0) {
            totalAmount = 0;
            totalDeposit = 0;
          }
        }
      });

      const price = prices[coin.api_id]?.eur || 0;
      const value = totalAmount * price;
      const profitLoss = value - totalDeposit;

      totalDepositAll += totalDeposit;
      totalProfitLossAll += profitLoss;

      return { name: coin.name, id: coin._id, totalDeposit, totalAmount, price, profitLoss };
    });

    return { totals, totalDepositAll, totalProfitLossAll };
  };

  const getMonthYear = (timestamp) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${year}`;
  };

  const groupTransactionsByMonth = (coin) => {
    const groupedTransactions = {};

    coin.transactions.forEach((transaction) => {
      const monthYear = getMonthYear(transaction.timestamp);
      if (!groupedTransactions[monthYear]) {
        groupedTransactions[monthYear] = { deposit: 0, withdraw: 0, total: 0 };
      }

      if (transaction.type === "deposit") {
        groupedTransactions[monthYear].deposit += transaction.price;
      } else if (transaction.type === "withdraw") {
        groupedTransactions[monthYear].withdraw += transaction.price;
      }
      groupedTransactions[monthYear].total =
        groupedTransactions[monthYear].deposit - groupedTransactions[monthYear].withdraw;
    });

    return groupedTransactions;
  };

  const { totals, totalDepositAll, totalProfitLossAll } = calculateTotals();

  return (
    <div className="container mt-4">
      <h2 style={{marginLeft:'100px'}} className="text-left">Crypto Portfolio Tracker</h2>

      <AddAsset newCoin={newCoin} setNewCoin={setNewCoin} handleAddCoin={handleAddCoin} />
      <ExecuteTransaction
        coins={coins}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        handleAddTransaction={handleAddTransaction}
      />
      <ActualStatistics
        totals={totals}
        totalDepositAll={totalDepositAll}
        totalProfitLossAll={totalProfitLossAll}
        handleDeleteCoin={handleDeleteCoin}
      />
      <TotalStatisticsByMonth coins={coins} groupTransactionsByMonth={groupTransactionsByMonth} />
    </div>
  );
};

export default App;