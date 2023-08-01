var Url = "http://195.15.218.172/edlgateway/api/v1";
let token = localStorage.getItem("token");

function checkLogged() {
 
  let login = parseJwt(localStorage.getItem("token"));
   
  if (!login) {
    window.location.replace(
      `${window.location.protocol}//${window.location.host}/amsWebjquery/login.html`
    );
    return;
  }
  /*if (!parseJwt($.cookie("token"))) {
    window.location.replace(
      `${window.location.protocol}//${window.location.host}/amsWebjquery/login.html`
    );
  }*/
}

// $(document).ready(() => {
  checkLogged();
// });

function parseJwt(accessToken) {
  let token = String(accessToken);
  if (
    typeof token === "undefined" ||
    token.split(".").length <= 1 ||
    token === "null"
  )
    return false;
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  let userData = JSON.parse(jsonPayload);

  if (new Date() > new Date(Number(userData.exp * 1000))) {
    // expired , get new token
    // alert("token expired");
    return false;
  } else {
    // existing token
    //  alert("token valid");
    return true;
  }
}

