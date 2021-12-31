export const alerts = (alert,payload) => {
    return {
        type: "ALERT",
        alert: alert,
        payload: payload,
    }
}