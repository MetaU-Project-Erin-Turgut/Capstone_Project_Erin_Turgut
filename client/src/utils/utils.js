//enums for tabs
const Tab = Object.freeze({
    EVENTS: "Events",
    GROUPS: "Groups"
});

//enums for user's status for an event or group
const Status = Object.freeze({
    NONE: "NONE", //used for when no filter is applied
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED"
});

//const form value defaults used in login and sign up
const DEFAULT_FORM_VALUE = {
    first_name: "",
    last_name: "",
    address: "",
    username: "",
    password: "",
    email: ""
}


export { Tab, Status, DEFAULT_FORM_VALUE };