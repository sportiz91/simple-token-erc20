import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "./Wallet.module.css";

export const Interactions = ({ contract }) => {
  const [transferHash, setTransferHash] = useState(null);

  const transferHandler = async (e) => {
    e.preventDefault();

    // console.log(e.target);
    // console.log(e.target.sendAmount);

    let transferAmount = e.target.sendAmount.value;
    let receiverAddress = e.target.receiverAddress.value;

    let txt = await contract.transfer(receiverAddress, transferAmount);

    setTransferHash(txt.hash);
  };

  return (
    <div className={styles.interactionsCard}>
      <form onSubmit={transferHandler}>
        <h3>Transfer Coins</h3>
        <p>Receiver Address</p>
        <input
          type="text"
          id="receiverAddress"
          className={styles.addressInput}
        />

        <p>Send Amount</p>
        <input type="number" id="sendAmount" min="0" step="1" />

        <button type="submit" className={styles.button6}>
          Send
        </button>

        <div>{transferHash}</div>

        <p></p>
      </form>
    </div>
  );
};

export default Interactions;
