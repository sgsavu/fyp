const initialState = {
    alerts: {
        error: [],
        loading: [],
        other: []
    },
    initializedApp: false,
};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_APP_STATE":
            return {
                ...state,
                [action.payload.field]: action.payload.value,
            };
        case "ALERT":
            const field = state.alerts[action.alert]
            if (action.payload)
                field.push(action.payload)
            else
                field.pop()
            console.log(field)
            return {
                ...state,
                alerts: {
                    ...state.alerts,
                    [action.alert]: field
                }
            }
        default:
            return state;
    }
};

export default appReducer;
