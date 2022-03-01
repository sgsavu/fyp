import store from "./store"

export const getWeb3 = async () => {
    return await store.getState().blockchain.web3
}

export const getWalletProvider = async () => {
    return await store.getState().blockchain.walletProvider
}

export const getNetworkTables = async () => {
    return await store.getState().blockchain.networkTables
}

export const getCurrentNetwork = async () => {
    return await store.getState().blockchain.currentNetwork
}

export async function getUserAccount() {
    return await store
        .getState()
        .blockchain.account
}