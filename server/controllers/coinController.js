import asyncHandler from "../middleware/asyncHandler.js";
import Coin from "../models/coin.model.js";

// 📌 Získať všetky coiny (GET /api/coins)
const getCoins = asyncHandler(async (req, res) => {
    const coins = await Coin.find({});
    res.json(coins);
});

// 📌 Získať coin podľa ID (GET /api/coins/:id)
const getCoinById = asyncHandler(async (req, res) => {
    const coin = await Coin.findById(req.params.id);
    if (!coin) {
        res.status(404);
        throw new Error("Coin not found");
    }
    res.json(coin);
});

// 📌 Vytvoriť nový coin (POST /api/coins)
const createCoin = asyncHandler(async (req, res) => {
    const { name, api_id } = req.body;

    // Overíme, či už coin existuje
    const existingCoin = await Coin.findOne({ api_id });
    if (existingCoin) {
        res.status(400);
        throw new Error("Coin already exists");
    }

    // Vytvoríme nový coin s prázdnymi transakciami
    const coin = new Coin({
        name,
        api_id,
        transactions: []
    });

    await coin.save();
    res.status(201).json({ message: "Coin created successfully!", coin });
});

// 📌 Pridať transakciu k coinu (PATCH /api/coins/:id/transactions)
const addTransaction = asyncHandler(async (req, res) => {
    const { type, amount, price } = req.body;
    const coin = await Coin.findById(req.params.id);

    if (!coin) {
        res.status(404);
        throw new Error("Coin not found");
    }

    // Pridanie transakcie
    coin.transactions.push({
        timestamp: Date.now(), // UNIX timestamp v milisekundách
        type,
        amount,
        price
    });

    await coin.save();
    res.status(200).json({ message: "Transaction added successfully", coin });
});

// 📌 Aktualizovať existujúci coin (PATCH /api/coins/:id)
const updateCoin = asyncHandler(async (req, res) => {
    const { name, api_id } = req.body;
    const coin = await Coin.findById(req.params.id);

    if (!coin) {
        res.status(404);
        throw new Error("Coin not found");
    }

    // Aktualizujeme len zadané polia
    if (name !== undefined) coin.name = name;
    if (api_id !== undefined) coin.api_id = api_id;

    const updatedCoin = await coin.save();
    res.status(200).json({ message: "Coin updated successfully", updatedCoin });
});

// 📌 Vymazať coin (DELETE /api/coins/:id)
const deleteCoin = asyncHandler(async (req, res) => {
    const coin = await Coin.findById(req.params.id);

    if (!coin) {
        res.status(404);
        throw new Error("Coin not found");
    }

    await coin.deleteOne();
    res.json({ message: "Coin removed successfully" });
});

export { getCoins, getCoinById, createCoin, addTransaction, updateCoin, deleteCoin };
