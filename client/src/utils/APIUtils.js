
    const apiupdateEventStatus = async (id, statusState) => {
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

    const apihandleLogout = async () => {
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

    const apihandleLogin = async (formData) => {
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

    const apihandleSignUp = async (formData) => {
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

    const apifetchEvents = async () => {
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



export { apiupdateEventStatus, apihandleLogout, apihandleLogin, apihandleSignUp, apifetchEvents};