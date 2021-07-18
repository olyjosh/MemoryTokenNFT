const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Memory Token', (accounts) => {
    let token;

    before(async ()=>{
        token = await MemoryToken.deployed()
    })

    describe('deployment', async ()=>{
        it('deploys successfully', async ()=>{
            token = await MemoryToken.deployed()
            const address = token.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has name', async ()=>{
            const name = await token.name()
            assert.equal(name, "Memory Token")
        })

        it('has symbol', async ()=>{
            const symbol = await token.symbol()
            assert.equal(symbol, "MEMORY")
        })
    })

    describe('token distribution', async () => {

        it('it mint tokens', async ()=>{
            await token.mint(accounts[0], 'https://www.token-uri.com/nft');

            // it should increase total supply
            const totalSupply = await token.totalSupply();
            assert.equal(totalSupply.toString(), '1', 'total Supply is correct')

            // it increments owner balance
            const balanceOf = await token.balanceOf(accounts[0]);
            assert.equal(balanceOf.toString(), '1', 'balanceOf is correct')

            // token should belong to owner
            const owner = await token.ownerOf('1')
            assert.equal(owner.toString(), accounts[0], 'ownerOf is correct')

            // const ownerByIndex = await token.tokenOfOwnerByIndex(accounts[0], 0)
            // owner can see all their token
            let tokenIds = []
            for (let i = 0; i < balanceOf; i++) {
                tokenIds.push((await token.tokenOfOwnerByIndex(accounts[0], i)).toString())
            }
            assert.equal(tokenIds.toString(), ['1'].toString(), 'tokenIds are correct')

            // token uri is correct
            const tokenURI = await token.tokenURI('1')
            assert.equal(tokenURI, 'https://www.token-uri.com/nft', 'token URI is  correct')
        })


    })
})
