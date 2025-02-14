import express from 'express';
import { getCoins, getCoinById, createCoin, updateCoin, deleteCoin, addTransaction } 
from '../controllers/coinController.js';
const router = express.Router();

// 📌 Získať všetky coiny
router.get("/", getCoins);

// 📌 Vytvoriť nový coin
router.post("/", createCoin);

// 📌 Získať coin podľa ID
router.get("/:id", getCoinById);

// 📌 Aktualizovať existujúci coin
router.patch("/:id", updateCoin);

// 📌 Pridať transakciu k coinu
router.patch("/:id/transactions", addTransaction);

// 📌 Vymazať coin
router.delete("/:id", deleteCoin);

export default router;
