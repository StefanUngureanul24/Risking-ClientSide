import React from "react";
import {cookiesManager} from "./cookies.js";
import {ModaleLegal} from "./Legal";

require("./cookiesFooter.css");

export function CookiesFooter() {
    const [modalShow, setModalShow] = React.useState(false);
    //console.log((localStorage.getItem("useCookies") === null) || (localStorage.getItem("useCookies") == false))
    const [footerShow, setFooterShow] = React.useState((localStorage.getItem("useCookies") === null) || (localStorage.getItem("useCookies") === "false"));
    return (
        <>
            <div id="cookieConsent" style={{display: (footerShow ? 'block' : 'none') }}>
                <div id="closeCookieConsent" onClick={() => {cookiesManager.setUseCookie(false); setFooterShow(false);}}>x</div>
                Nous utilisons les cookies uniquement pour vous authentifier <a href="https://gdpr.eu/cookies/">Plus
                d'infos</a>. <a id="cookieConsentOK" href="#!"  onClick={() => { cookiesManager.setUseCookie(true); setFooterShow(false);} }>D'accord</a> <a
                id="cookieConsentML" href="#!" onClick={() => setModalShow(true)}>Mentions Légales</a>
            </div>
            <ModaleLegal show={modalShow} onHide={() => setModalShow(false)}/>
        </>
    );
}

export default CookiesFooter