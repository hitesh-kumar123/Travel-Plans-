import React from "react";

const ExpenseCard = ({ title, amount }) => {
  return (
    <div className="expense-card">
      <h3>{title}</h3>
      <p>{amount.toLocaleString()}</p>
    </div>
  );
};

export default ExpenseCard;
