//enums for tabs
const Tab = Object.freeze({
    EVENTS: "Events",
    GROUPS: "Groups",
    INTERESTS: "Interests"
});

//enums for user's status for an event or group
const Status = Object.freeze({
    NONE: "NONE", //used for when no filter is applied
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    DROPPED: "DROPPED"
});

//const form value defaults used in login and sign up
const DEFAULT_FORM_VALUE = {
    firstName: "",
    lastName: "",
    address: "",
    username: "",
    password: "",
    email: ""
}

//enums for all possible card data options
const CardFields = Object.freeze({
    TITLE: "title",
    DESCRIPTION: "desc",
    STATUS: "status",
    COMPATIBILITY: "compatibility",
    DATEANDTIME: "dateAndTime"
});

//enums for all possible modal data options
const ModalFields = Object.freeze({
    TITLE: "title",
    DESCRIPTION: "desc",
    INTERESTS: "interests",
    PEOPLE: "people",
    ATTENDEES: "attendees",
    INTEREST: "interest",
    EVENT_PREFERENCES: "eventTypePreferences"
});

//array used to map index to event type string
const EventTypeArr = ["Just Meet", "Entertainment", "Eating", "Active"]

//for use in modal event type distribution pie charts
const EventTypePreferenceColors = Object.freeze({
    JUSTMEET: 'red',
    ENTERTAINMENT: 'green',
    EATING: 'blue',
    ACTIVE: '#9929EA',
});


export { Tab, Status, DEFAULT_FORM_VALUE, CardFields, ModalFields, EventTypeArr, EventTypePreferenceColors };