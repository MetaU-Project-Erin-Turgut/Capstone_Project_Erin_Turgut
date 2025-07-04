
export default class APIUtils {

    static updateEventStatus = async (id, statusState) => {
        const response = await fetch(`http://localhost:3000/user/events/${id}`, { //path param is event id
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "updatedStatus": statusState
            }),
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw {status: response.status, message: data.error};
        }
   
    }

    static handleLogout = async () => {
        const response = await fetch("http://localhost:3000/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw {status: response.status, message: data.error};
        }
    }

    static handleLogin = async (formData) => {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw {status: response.status, message: data.error};
        }

    }

    static handleSignUp = async (formData) => {
        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw {status: response.status, message: data.error};
        }

    }

    static fetchEvents = async () => {
        const response = await fetch("http://localhost:3000/user/events/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw {status: response.status, message: data.error};
        }

    }

    static fetchRootInterests = async () => {
        const response = await fetch("http://localhost:3000/interests/", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw {status: response.status, message: data.error};
        }
    }

    static fetchImmediateChildren = async (interestId) => {
        const response = await fetch(`http://localhost:3000/interests/${interestId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw {status: response.status, message: data.error};
        }
    }
}
