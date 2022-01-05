export const alerts = (payload) => {
    return {
        type: "ALERT",
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

export const entryDataState = (payload) => {
    return {
        type: "ENTRY_DATA_STATE",
        payload: payload,
    }
}

export const deleteFieldKey = (payload) => {
    return {
        type: "DELETE_FIELD_KEY",
        payload: payload,
    }
}

