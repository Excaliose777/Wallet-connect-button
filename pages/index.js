import Head from "next/head";
import styles from "../styles/Home.module.css";
import React, { useEffect, useRef, useState } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import { providers } from "ethers";

export default function Home() {

  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 1) {
      window.alert("Change the network to Ethereum");
      throw new Error("Change network to Ethereum");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      setLoading(true);
    } catch (err) {
      console.error(err);
    }
  };

  const providerOptions = {
    binancechainwallet: {
      package:true,
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: "73f2f3d82b1e486cbbdacb05c6927cb8"
      }
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mainnet",
        providerOptions,
        cacheProvider: false,
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);


  return (
    <div>
      <Head>
        <title>WALLETCONNECT TEST</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.page}>
        <nav className={styles.navbar}>
            <div className={styles.logo}>
              <h1>HOME</h1>
            </div>
            <ul className={styles.navItems}>
              <li>About</li>
              <li>Contact</li>
              <li>Documentation</li>
              <li>Features</li>
            </ul>
          </nav>
        <div className={styles.main}>
          <h1>THIS IS HOW TO CONNECT WALLET</h1>
          <p>CLICK THE BUTTON BELOW</p>
          {walletConnected ? "Wallet Connected successfully!" : <button onClick={connectWallet} className={styles.connectBtn}>CONNECT WALLET</button>}
        </div>
      </div>
    </div>
  )
}
