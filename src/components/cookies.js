/* Gestionnaire RGPD */
export class cookiesManager {
    static useCookie = localStorage.getItem("useCookies") !== undefined ? localStorage.getItem("useCookies") : false;
    static get(name) {
        if (this.useCookie) {
            return this.__realCookie(name);
        } else {
            const tmp = this.__falseCookie(name);
            const val = this.__realCookie(name);
            if (!tmp && val) {
                localStorage.setItem(name, val);
                deleteCookie(name);
            }
            return this.__falseCookie(name);
        }
    }

    static setUseCookie(val) {
        //alert("debug");
        this.useCookie = Boolean(val).valueOf();
        localStorage.setItem("useCookies", Boolean(val).valueOf());
        if (val)
            setCookie("useCookies", Boolean(val).valueOf(), 365);
    }

    static __realCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    static __falseCookie(name) {
        return localStorage.getItem(name);
    }
}

export function getCookie(name) {
    return cookiesManager.get(name);
}

export function setCookie(cname, cvalue, exdays) {
    if (!cookiesManager.useCookie)
        return;
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;sameSite=Lax";
}

export function deleteCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}