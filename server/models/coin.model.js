import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  timestamp: { type: Number, required: true }, // Uložený čas ako UNIX timestamp (milisekundy)
  type: { type: String, enum: ["deposit", "withdraw"], required: true }, // Typ transakcie
  amount: { type: Number, required: true }, // Množstvo coinu
  price: { type: Number, required: true } // Cena v EUR pri transakcii
});

const CoinSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  api_id: { type: String, required: true, unique: true },
  transactions: [TransactionSchema] // Pole transakcií
});

export default mongoose.model("Coin", CoinSchema);
