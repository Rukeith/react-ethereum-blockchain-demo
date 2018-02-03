import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";

class App extends Component {
    constructor() {
        super();
        this.state = { accounts: [] };
    }

    componentDidMount() {
        const provider = new Web3.providers.HttpProvider(
            "http://localhost:8545"
        );
        this.web3 = new Web3(provider);
        this.refreshUI();   
    }

    refreshUI() {
        const accounts = this.web3.eth.accounts.map(account => {
            let balance = this.web3.eth.getBalance(account);
            balance = this.web3.fromWei(balance, "ether").toNumber();
            return { account, balance };
        });
        this.setState({ accounts });
    }

    handleTransfer() {
        const from = this.web3.eth.accounts[0];
        const to = this.web3.eth.accounts[1];
        const value = this.web3.toWei(1, "ether");
        const txnHash = this.web3.eth.sendTransaction({ from, to, value });
        const handle = setInterval(() => {
            const txn = this.web3.eth.getTransaction(txnHash);
            if (txn) {
                clearInterval(handle);
                this.refreshUI();
            }
        }, 100);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Blockchain Demo</h1>
                </header>
                <table
                    border="1"
                    cellPadding="8"
                    cellSpacing="0"
                    style={{ border: "1px solid black", margin: 30 }}
                >
                    <thead>
                        <tr>
                            <th>Account</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.accounts.map(accountItem => (
                            <tr key={accountItem.account}>
                                <td>{accountItem.account}</td>
                                <td>{accountItem.balance}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={this.handleTransfer.bind(this)}>
                    Transfer
                </button>
            </div>
        );
    }
}

export default App;