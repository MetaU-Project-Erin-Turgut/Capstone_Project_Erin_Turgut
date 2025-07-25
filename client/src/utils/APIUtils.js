
export default class APIUtils {

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

    static fetchUserEventTypeTallies = async () => {
        const response = await fetch("http://localhost:3000/user/tallies", {
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

    static updateEventStatus = async (id, statusState) => {
        const response = await fetch(`http://localhost:3000/user/events/${id}/status`, { //path param is event id
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

    static fetchGroups = async () => {
        const response = await fetch("http://localhost:3000/user/groups/", {
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

    static updateGroupStatus = async (id, newStatus) => {
        const response = await fetch(`http://localhost:3000/user/groups/${id}/${newStatus}`, { //path param is group id
            method: "PUT",
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

    static fetchUserInterests = async () => {
        const response = await fetch('http://localhost:3000/user/interests', {
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

    static updateUserInterests = async (newInterests) => {
        const response = await fetch('http://localhost:3000/user/interests', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newInterests),
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw {status: response.status, message: data.error};
        }
    }

    //this will be called after the above method so that new groups are retrieved for user when their interests change
    static getNewGroupRecs = async () => {
        const response = await fetch('http://localhost:3000/user/groups/new', {
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

    static userSearch = async (searchQuery, pageMarker, userInterests) => {
        const response = await fetch(`http://localhost:3000/search/users/?searchQuery=${searchQuery}&pageMarker=${pageMarker}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(userInterests),
        });

        const data = await response.json();

        if (response.ok) {
            return data;
        } else {
            throw {status: response.status, message: data.error};
        }

    }

    static userSearchTypeAhead = async () => {
        const response = await fetch('http://localhost:3000/search/users/typeahead', {
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
