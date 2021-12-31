export const alerts = (alert,payload) => {
    return {
        type: "ALERT",
        alert: alert,
        payload: payload,
    }
}

export const updateDataState = (payload) => {
    return {
        type: "UPDATE_DATA_STATE",
        payload: payload,
    }
}

export const updateBlockchainState = (payload) => {
    return {
        type: "UPDATE_BLOCKCHAIN_STATE",
        payload: payload,
    }
}

export const updateAppState = (payload) => {
    return {
        type: "UPDATE_APP_STATE",
        payload: payload,
    }
}