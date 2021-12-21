import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import styles from "./Wallet.module.css";
import simple_token_abi from "./Contracts/simple_token_abi.json";
import Interactions from "./Interactions";

export default function Wallet() {
  //Ganache address:
  const contractAddress = "0x453b10cee9520c9323E34636708f8ef2EBC76063";

  const [tokenName, setTokenName] = useState("Token");
  const [connButtonText, setConnButtonText] = useState("Connect Wallet"); //This gonna change to "Wallet connected"
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  const connectWalletHandler = async () => {
    //Check if ethereum is on the browser, and if the provider is metamask.
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        const result = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        console.log(result);

        accountChangedHandler(result[0]);
        setConnButtonText("Wallet Connected");
      } catch (err) {
        setErrorMessage(err.message);
      }
    } else {
      console.log("Need to install Metamask");
      setErrorMessage("Please install Metamask");
    }
  };

  const accountChangedHandler = (newAddress) => {
    setDefaultAccount(newAddress);
    updateEthers();
  };

  //Ethers has providers, signers & contracts. Providers = your MM account.
  //Provider is read only. From the read only provider, we can getSigner, which
  //Is read & write.
  //In the contract objet (tempContract) we can call all the interactions on behalf of the user
  //and they are going to approve the interactions using MetaMask. This schema is achieved using
  //The provider, signer & contract.
  //Everytime the contract is updated, which means, everytime there is a new signer, we are going to repull
  //The contract because we are going to have a new Address.
  const updateEthers = () => {
    let tempProvider = new ethers.providers.Web3Provider(window.ethereum); //read access

    let tempSigner = tempProvider.getSigner(); //write access

    let tempContract = new ethers.Contract(
      contractAddress,
      simple_token_abi,
      tempSigner
    ); //contract. Built using address, abi & signer.

    setProvider(tempProvider);
    setSigner(tempSigner);
    setContract(tempContract);
  };

  //Everytime the contract object is updated useEffect is gonna run the side effect.
  useEffect(() => {
    if (contract != null) {
      // console.log("useEffect");

      updateBalance();
      updateTokenName();
    }
  }, [contract]);

  const updateBalance = async () => {
    // console.log("updateBalance");
    // console.log(defaultAccount);

    let balanceBigN = await contract.balanceOf(defaultAccount);
    console.log(balanceBigN);

    let balanceNumber = balanceBigN.toNumber();

    let decimals = await contract.decimals();

    let tokenBalance = balanceNumber / Math.pow(10, decimals);

    setBalance(tokenBalance);
  };

  const updateTokenName = async () => {
    setTokenName(await contract.name());
  };

  return (
    <div>
      <h2>{tokenName} ERC-20 Wallet</h2>
      <button className={styles.button6} onClick={connectWalletHandler}>
        {connButtonText}
      </button>

      <div className={styles.walletCard}>
        <div>
          <h3>Address: {defaultAccount}</h3>
        </div>

        <div>
          <h3>
            {tokenName} Balance: {balance}
          </h3>
        </div>
        {errorMessage}
      </div>
      <Interactions contract={contract} />
    </div>
  );
}
