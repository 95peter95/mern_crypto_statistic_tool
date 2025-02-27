import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CoinStatisticsByMonth from "./components/CoinStatisticsByMonth";
import ActualStatistics from "./components/ActualStatistics";
import AddAsset from "./components/AddAsset";
import AddTransaction from "./components/AddTransaction";

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
      toast.success("Asset was successfully added!");
      setNewCoin({ name: "", api_id: "" });
      fetchCoins();
    } catch (error) {
      console.error("Error: asset wasnt added", error);
      toast.error("Error while adding asset!");
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
        <p>Do you really want to delete this Asset?</p>
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
      toast.success("Asset deleted successfully!");
      fetchCoins();
    } catch (error) {
      console.error("Error deleting Asset:", error);
      toast.error("Failed to delete Asset.");
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <div>
        <div
          style={{ background: "#211f1f",width: "140.2%",height: "100px",marginLeft: "-551px",marginTop: "-20px",padding: "0px",color: "#f4f4f4" }}>
          <h1 style={{ paddingTop: "30px", paddingLeft: "750px" }} className="text-left mb-4">
            Crypto Dashboard
          </h1>
        </div>
        <AddAsset
          newCoin={newCoin}
          handleAddCoin={handleAddCoin}
          handleNewCoinChange={handleNewCoinChange}
        />
        <AddTransaction
          coins={coins}
          newTransaction={newTransaction}
          handleAddTransaction={handleAddTransaction}
          handleNewTransactionChange={handleNewTransactionChange}
        />
        <ActualStatistics
          coins={coins}
          prices={prices}
          onDelete={handleDeleteCoin}
        />
        <CoinStatisticsByMonth coins={coins} />
      </div>
    </div>
  );
}
export default App;
