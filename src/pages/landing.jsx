import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import API from "../api";
import './landing.css'

export default function LandingPage() {
  const [nickname, setNickname] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [amount, setAmount] = useState("");
  const [filter, setFilter] = useState("all");
  const [date, setDate] = useState("");
  const [type, setType] = useState("deposit");
  const [balance, setBalance] = useState(0);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
    fetchTransactions();
  }, []);

  const getUserIdFromToken = () => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub;
    } catch (e) {
      console.error("Invalid token");
      return null;
    }
  };
  
  const fetchUser = async () => {
    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Invalid user token");
      const res = await API.get(`/User/${userId}`);
      setNickname(res.data.nickname || "User");
      setBalance(res.data.balance || 0);
    }catch(error) {
      console.error(error);
      alert("Session expired, please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    }
  }

  const fetchBalance = async () => {
    try{
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Invalid user token");
      const res = await API.get(`/User/${userId}`);
      setBalance(res.data.balance || 0);
    }catch(error) {
      console.error(error);
      setBalance(0);
    }
  }

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/Transaction/user");
      setTransactions(res.data);
      // quick balance calc
      const total = res.data.reduce(
        (sum, t) => (t.transaction_type === "deposit" ? sum + t.transaction_nominal : sum - t.transaction_nominal),
        0
      );
      fetchBalance();
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
    navigate("/login");
  };

  return (
    <div className="landing-container">
      <button onClick={handleLogout} className="logout-btn">
        LOGOUT
      </button>

      <h1 className="user-nickname">WELCOME BACK, {nickname}</h1>
      <h1 className="balance">Balance: Rp.{balance.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>

      <div className="transaction-form">
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="select-filter"
        >
          <option value="all">All</option>
          <option value="months">By Month</option>
        </select>

        <input 
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="Select Date"
          className="input-date"
          disabled={filter !== "months"}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="select-type"
        >
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>

        <input
          type="number"
          className="input-amount"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button onClick={handleAddTransaction} className="add-btn">
          Add
        </button>
      </div>

      <div className="transaction-list">
        {transactions.length === 0 ? (
          <p className="no-tx">No transactions yet</p>
        ) : (
          transactions.map((t) => (
            <div
              key={t.transaction_id}
              className={`transaction-card ${
                t.transaction_type === "deposit" ? "deposit" : "withdraw"
              }`}
            >
              <p className="tx-type">{t.transaction_type}</p>
              <p className="tx-amount">Amount: {t.transaction_nominal}</p>
              <p className="tx-desc">{t.description}</p>
              <p className="tx-date">
                {new Date(t.transaction_date).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
