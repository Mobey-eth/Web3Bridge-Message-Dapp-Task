import React, { useState } from 'react';
import { ethers } from 'ethers';
import abi from "./abi"


const contractABI = abi; // Fill this with the ABI of your contract
const contractAddress = '0xd6D91B6fc3ce43462a93FAbaf326D72651FDA99e';

const App = () => {
    const [currentAccount, setCurrentAccount] = useState(null);
    const [message, setMessage] = useState('');
    const [newMessage, setNewMessage] = useState('');

    const checkWalletIsConnected = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log('Make sure you have MetaMask!');
                return;
            } else {
                console.log('Ethereum object found', ethereum);
            }

            const accounts = await ethereum.request({ method: 'eth_accounts' });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log('Found an authorized account:', account);
                setCurrentAccount(account);
            } else {
                console.log('No authorized account found');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWalletHandler = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                alert('Please install MetaMask!');
                return;
            }

            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Connected', accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const getMessage = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const myMessageContract = new ethers.Contract(contractAddress, contractABI, signer);

                const message = await myMessageContract.getMessage();
                setMessage(message);
                console.log('Retrieved message:', message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const setMessageHandler = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const myMessageContract = new ethers.Contract(contractAddress, contractABI, signer);

                const txn = await myMessageContract.setMessage(newMessage);
                console.log('Setting message...');
                await txn.wait();
                console.log('Message set:', newMessage);

                getMessage(); // Refresh the displayed message
            }
        } catch (error) {
            console.log(error);
        }
    };

    React.useEffect(() => {
        checkWalletIsConnected();
    }, []);

    return (
        <div>
            <h1>Message DApp</h1>
            {currentAccount ? (
                <div>
                    <button onClick={getMessage}>Get Message</button>
                    <p>Message: {message}</p>
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                    <button onClick={setMessageHandler}>Set Message</button>
                </div>
            ) : (
                <button onClick={connectWalletHandler}>Connect Wallet</button>
            )}
        </div>
    );
};

export default App;
