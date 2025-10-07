import { useState, useEffect } from "react";
import API from "../api";

export default function LandingPage() {
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("deposit");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transaction/user");
      setTransactions(res.data);
      // quick balance calc
      const total = res.data.reduce(
        (sum, t) => (t.transaction_type === "deposit" ? sum + t.transaction_nominal : sum - t.transaction_nominal),
        0
      );
      setBalance(total);
    } catch {
      setTransactions([]);
    }
  };

  const handleAddTransaction = async () => {
    try {
      await API.post("/transaction/add", {
        transaction_type: type,
        transaction_nominal: parseFloat(amount),
      });
      setAmount("");
      fetchTransactions();
    } catch {
      alert("Transaction failed!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <button onClick={handleLogout} className="absolute top-4 right-4 text-red-600 font-semibold">
        Logout
      </button>
      <h1 className="text-4xl font-bold mt-6 mb-8">Balance: ${balance.toFixed(2)}</h1>

      <div className="flex gap-2 mb-6">
        <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 rounded">
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          onClick={handleAddTransaction}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      <div className="grid gap-3 w-full max-w-md">
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions yet</p>
        ) : (
          transactions.map((t) => (
            <div
              key={t.transaction_id}
              className={`p-4 rounded shadow-md ${
                t.transaction_type === "deposit" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <p className="font-semibold capitalize">{t.transaction_type}</p>
              <p>Amount: {t.transaction_nominal}</p>
              <p className="text-sm text-gray-500">{new Date(t.transaction_date).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
