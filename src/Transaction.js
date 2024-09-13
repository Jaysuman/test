import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => (
  <footer className="bg-secondary text-light py-4 mt-auto">
    <div className="container">
      <div className="row">
        <div className="col-md-4">
          <h5>Contact Us</h5>
          <ul className="list-unstyled">
            <li><a href="#" className="text-light">Login</a></li>
          </ul>
        </div>
        <div className="col-md-4">
          <h5>Special Offers</h5>
          <ul className="list-unstyled">
            <li><a href="#" className="text-light">Business Banking</a></li>
            <li><a href="#" className="text-light">Commercial</a></li>
            <li><a href="#" className="text-light">About Us</a></li>
          </ul>
        </div>
        <div className="col-md-4">
          <h5>Mortgages and Other Rates</h5>
          <ul className="list-unstyled">
            <li><a href="#" className="text-light">TD Websites</a></li>
            <li><a href="#" className="text-light">Investor's Edge</a></li>
            <li><a href="#" className="text-light">New to Canada</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

const Transaction = ({ onLogout }) => {
  const [accountNumber, setAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [formType, setFormType] = useState('');
  const [senderAccount, setSenderAccount] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [currentBalance, setCurrentBalance] = useState('0.00');
  const [currentAccount, setCurrentAccount] = useState('');
  const [transactionProcessed, setTransactionProcessed] = useState(false);
  const navigate = useNavigate();

  const clearForm = () => {
    setAccountNumber('');
    setAmount('');
    setSenderAccount('');
    setRecipientAccount('');
  };

  const updateBalance = (accountNum, amount) => {
    setBalance(prevBalance => {
      const currentBalance = prevBalance[accountNum] || 0;
      return { ...prevBalance, [accountNum]: currentBalance + amount };
    });
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    const depositAmount = parseFloat(amount);
    if (depositAmount > 0) {
      updateBalance(accountNumber, depositAmount);
      setTransactions([...transactions, `Deposited $${depositAmount.toFixed(2)} to account ${accountNumber}`]);
      setCurrentAccount(accountNumber);
      setTransactionProcessed(true);
      clearForm();
    }
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount > 0 && withdrawAmount <= (balance[accountNumber] || 0)) {
      updateBalance(accountNumber, -withdrawAmount);
      setTransactions([...transactions, `Withdrew $${withdrawAmount.toFixed(2)} from account ${accountNumber}`]);
      setCurrentAccount(accountNumber);
      setTransactionProcessed(true);
      clearForm();
    }
  };

  const handleInterac = (e) => {
    e.preventDefault();
    const interacAmount = parseFloat(amount);
    if (interacAmount > 0 && senderAccount && recipientAccount) {
      setTransactions([...transactions, `Sent $${interacAmount.toFixed(2)} via Interac from ${senderAccount} to ${recipientAccount}`]);
      // Assuming Interac transactions do not affect balance in this simple example
      clearForm();
    }
  };

  const handleFormTypeChange = (type) => {
    setFormType(type);
    clearForm();
    setTransactions([]); // Clear transaction history when changing form type
    setTransactionProcessed(false); // Reset the transaction processed flag
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  useEffect(() => {
    if (transactionProcessed && currentAccount) {
      setCurrentBalance((balance[currentAccount] || 0).toFixed(2));
    }
  }, [balance, currentAccount, transactionProcessed]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="container my-5">
        
        <div className="mb-3">
          <button className="btn btn-primary me-2" onClick={() => handleFormTypeChange('deposit')}>Deposit</button>
          <button className="btn btn-warning me-2" onClick={() => handleFormTypeChange('withdraw')}>Withdraw</button>
          <button className="btn btn-info" onClick={() => handleFormTypeChange('interac')}>Interac</button>
        </div>

        {/* Deposit Form */}
        {formType === 'deposit' && (
          <form onSubmit={handleDeposit}>
            <div className="mb-3">
              <label htmlFor="accountNumber" className="form-label">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                className="form-control"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input
                type="number"
                id="amount"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Deposit</button>
          </form>
        )}

        {/* Withdraw Form */}
        {formType === 'withdraw' && (
          <form onSubmit={handleWithdraw}>
            <div className="mb-3">
              <label htmlFor="accountNumber" className="form-label">Account Number</label>
              <input
                type="text"
                id="accountNumber"
                className="form-control"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input
                type="number"
                id="amount"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-warning">Withdraw</button>
          </form>
        )}

        {/* Interac Form */}
        {formType === 'interac' && (
          <form onSubmit={handleInterac}>
            <div className="mb-3">
              <label htmlFor="senderAccount" className="form-label">From (Sender Account No.)</label>
              <input
                type="text"
                id="senderAccount"
                className="form-control"
                value={senderAccount}
                onChange={(e) => setSenderAccount(e.target.value)}
                placeholder="Sender Account No."
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="recipientAccount" className="form-label">To (Recipient Account No.)</label>
              <input
                type="text"
                id="recipientAccount"
                className="form-control"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
                placeholder="Recipient Account No."
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">Amount</label>
              <input
                type="number"
                id="amount"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-info">Send via Interac</button>
          </form>
        )}

        <div className="mt-4">
          {transactionProcessed && currentAccount && formType !== 'interac' && (
            <>
              <h4>Account Number: {currentAccount}</h4>
              <h4>Current Balance: ${currentBalance}</h4>
            </>
          )}
          <h5>Transaction History:</h5>
          <ul>
            {transactions.map((transaction, index) => (
              <li key={index}>{transaction}</li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Transaction;
