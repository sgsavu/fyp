const initialState = {
    alerts: {
        error: [],
        loading: [],
        other: []
    },
    initializedApp: false,
};

/**
 * The app reducer.
 * Used to manage alerts and queue them in a stack last in first out
 * system.
 */
const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_APP_STATE":
            return {
                ...state,
                [action.payload.field]: action.payload.value,
            };
        case "ALERT":
            const field = state.alerts[action.payload.alert]
            if (action.payload.message)
                if (action.payload.alert == "other")
                    field.push({url: action.payload.url, message: action.payload.message})
                else
                field.push(action.payload.message)
            else
                field.pop()
            return {
                ...state,
                alerts: {
                    ...state.alerts,
                    [action.payload.alert]: field
                }
            }
        default:
            return state;
    }
};

export default appReducer;
