export const AVALANCHE_MAINNET_PARAMS = {
    chainId: '0xA86A',
    chainName: 'Avalanche Mainnet C-Chain',
    nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://snowtrace.io/']
}

export const AVALANCHE_TESTNET_PARAMS = {
    chainId: '0xA869',
    chainName: 'Avalanche Testnet C-Chain',
    nativeCurrency: {
        name: 'Avalanche',
        symbol: 'AVAX',
        decimals: 18
    },
    rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
    blockExplorerUrls: ['https://testnet.snowtrace.io/']
}

export const POLYGON_MAINNET_PARAMS = {
    chainId: '0x89',
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
        name: 'Polygon',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: ['https://rpc-mainnet.maticvigil.com'],
    blockExplorerUrls: ['https://explorer.matic.network/']
}

export const POLYGON_MUMBAI_PARAMS = {
    chainId: '0x13881',
    chainName: 'Polygon Mumbai',
    nativeCurrency: {
        name: 'Polygon',
        symbol: 'MATIC',
        decimals: 18
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
    blockExplorerUrls: ['https://polygonscan.com/']
}

export const FANTOM_MAINNET_PARAMS = {
    chainId: '0xFA',
    chainName: 'Fantom Opera',
    nativeCurrency: {
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18
    },
    rpcUrls: ['https://rpc.ftm.tools/'],
    blockExplorerUrls: ['https://ftmscan.com/']
}

export const FANTOM_TESTNET_PARAMS = {
    chainId: '0xFA2',
    chainName: 'Fantom Testnet',
    nativeCurrency: {
        name: 'Fantom',
        symbol: 'FTM',
        decimals: 18
    },
    rpcUrls: ['https://rpc.testnet.fantom.network/'],
    blockExplorerUrls: ['https://polygonscan.com/']
}

export const LOCAL_TESTNET_PARAMS = {
    chainId: '0x1691',
    chainName: 'localhost',
    nativeCurrency: {
        name: 'localhost',
        symbol: 'VHC',
        decimals: 18
    },
    rpcUrls: ['HTTP://127.0.0.1:7545'],
    blockExplorerUrls: ['https://polygonscan.com/']
}



export const ALL_TEMPLATES = {
    "5777": LOCAL_TESTNET_PARAMS,
    "4002": FANTOM_TESTNET_PARAMS,
    "250": FANTOM_MAINNET_PARAMS,
    "80001": POLYGON_MUMBAI_PARAMS,
    "137":POLYGON_MAINNET_PARAMS,
    "43113":AVALANCHE_TESTNET_PARAMS,
    "43114":AVALANCHE_MAINNET_PARAMS
}
