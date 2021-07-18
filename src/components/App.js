import React, {Component} from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import brain from '../brain.png'

const CARD_ARRAY = [
    {
        name: 'fries',
        img: '/images/fries.png'
    },
    {
        name: 'cheeseburger',
        img: '/images/cheeseburger.png'
    },
    {
        name: 'ice-cream',
        img: '/images/ice-cream.png'
    },
    {
        name: 'pizza',
        img: '/images/pizza.png'
    },
    {
        name: 'milkshake',
        img: '/images/milkshake.png'
    },
    {
        name: 'hotdog',
        img: '/images/hotdog.png'
    },
    {
        name: 'fries',
        img: '/images/fries.png'
    },
    {
        name: 'cheeseburger',
        img: '/images/cheeseburger.png'
    },
    {
        name: 'ice-cream',
        img: '/images/ice-cream.png'
    },
    {
        name: 'pizza',
        img: '/images/pizza.png'
    },
    {
        name: 'milkshake',
        img: '/images/milkshake.png'
    },
    {
        name: 'hotdog',
        img: '/images/hotdog.png'
    }
]

class App extends Component {

    async loadWeb3() {
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();

        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
    }

    componentDidMount() {
        this.loadWeb3()
        this.loadBlockingChainData()
        this.setState({cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random())})
    }

    async loadBlockingChainData() {
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})

        const networkId = await web3.eth.net.getId()
        const networkData = MemoryToken.networks[networkId]

        console.log('Network ID ', networkId)
        if (networkData) {
            const abi = MemoryToken.abi
            const address = networkData.address
            const token = web3.eth.Contract(abi, address)
            this.setState({token})
            const totalSupply = await token.methods.totalSupply().call();
            this.setState({totalSupply})

            // it increments owner balance
            const balanceOf = await token.methods.balanceOf(accounts[0]).call();

            for (let i = 0; i < balanceOf; i++) {
                //tokenIds.push((await token.tokenOfOwnerByIndex(accounts[0], i)).toString())
                const id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
                const tokenURI = await token.methods.tokenURI(id).call();
                this.setState({
                    tokenURIs: [...this.state.tokenURIs, tokenURI]
                })
            }

        } else {
            alert('Smart contract not deployed on the network')
        }
    }

    chooseImage(cardId) {
        cardId = cardId.toString();
        if (this.state.cardsWon.includes(cardId))
            return window.location.origin + '/images/white.png';
        if (this.state.cardsChosenId.includes(cardId))
            return CARD_ARRAY[cardId].img
        return window.location.origin + '/images/blank.png';
    }

    flipCard(cardId) {
        let alreadyChosen = this.state.cardsChosen.length

        this.setState({
            cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
            cardsChosenId: [...this.state.cardsChosenId, cardId]
        })

        if (alreadyChosen === 1) {
            setTimeout(() => this.checkForMatch(), 100)
        }
    }

    checkForMatch() {
        const optionOneId = this.state.cardsChosenId[0]
        const optionTwoId = this.state.cardsChosenId[1]
        if (optionOneId === optionTwoId) {
            // flip back the card
            alert('Same Image clicked')
        } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
            alert('Found a match ')

            this.state
                .token
                .methods
                .mint(this.state.account, window.location.origin + CARD_ARRAY[optionOneId].img.toString())
                .send({from: this.state.account})
                .on('transactionHash', () => {
                    this.setState({
                        cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId],
                        tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img]
                    })
                })
                .on('error', (error)=>{
                    console.log(error)
                })
        } else {
            // alert('Sorry dude, try again')

        }

        setTimeout(() => {
            this.setState({
                cardsChosen: [],
                cardsChosenId: []
            })
        }, 1000)

        if (this.state.cardsWon.length === CARD_ARRAY.length) {
            alert('Congratulations! You are the big name who found all of them')
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '0x0',
            token: null,
            totalSupply: 0,
            tokenURIs: [],
            cardArray: [],
            cardsChosen: [],
            cardsChosenId: [],
            cardsWon: [],
        }
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                    <a
                        className="navbar-brand col-sm-3 col-md-2 mr-0"
                        href="/"
                        rel="noopener noreferrer"
                    >
                        <img src={brain} width="30" height="30" className="d-inline-block align-top" alt=""/>
                        &nbsp; Memory Tokens
                    </a>
                    <ul className="navbar-nav px-3">
                        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
                            <small className="text-muted"><span id="account">{this.state.account}</span></small>
                        </li>
                    </ul>
                </nav>
                <div className="container-fluid mt-5">
                    <div className="row">
                        <main role="main" className="col-lg-12 d-flex text-center">
                            <div className="content mr-auto ml-auto">
                                <h1 className="d-4">Play Nos!</h1>

                                <div className="grid mb-4">

                                    {this.state.cardArray.map((card, key) => {
                                        return (
                                            <img
                                                key={key}
                                                src={this.chooseImage(key)}
                                                data-id={key}
                                                onClick={(e) => {
                                                    let cardId = e.target.getAttribute('data-id')
                                                    if (!this.state.cardsWon.includes(cardId.toString())) {
                                                        this.flipCard(cardId);
                                                    }
                                                }}
                                            />
                                        )
                                    })}

                                </div>

                                <div>

                                    <h5>Token Collected: <span id="result">&nbsp;  {this.state.tokenURIs.length}</span>
                                    </h5>

                                    <div className="grid mb-4">

                                        {this.state.tokenURIs.map((tokenURI, key) => {
                                            return <img key={key} src={tokenURI}/>
                                        })}

                                    </div>

                                </div>

                            </div>

                        </main>
                    </div>
                </div>
            </div>
        );
    }

}

export default App;
