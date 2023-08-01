var Url = "http://195.15.218.172/edlgateway/api/v1";

function checkLogedForLoginPage() {
  let login = parseJwt(localStorage.getItem("token"));
  
  if (login) {

    window.location.replace(
      `${window.location.protocol}//${window.location.host}/amsv2/index.html`
    );
  }
}

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

function login() {
  $("#login_error").css("display", "none");
  $("#goLogin").html("Connexion en cours...");
  $("#goLogin").prop("disabled", true);

  $.ajax({
    type: "POST",
    crossDomain: true,
    dataType: "json",
    url: Url + "/auth/login",
    data: JSON.stringify({
      username: $("#username").val(),
      password: $("#password").val(),
    }),
    headers: {
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    success: function (res) {
      let response = res.res;

      $.cookie("agent_user_logged");
      console.log(response)

      localStorage.setItem("name", response["user"]["nom"]);
      localStorage.setItem("first_name", response["user"]["prenom"]);
      localStorage.setItem("id_logged_user_user", response["user"]["id"]);
      localStorage.setItem("email", response["user"]["email"]);

      localStorage.setItem("adresse", response["user"]["adresse"]);
      localStorage.setItem("telephone", response["user"]["telephone"]);

      localStorage.setItem("group", response["user"]["group"]);
      localStorage.setItem("id_user_logged", response["id"]);
      localStorage.setItem("stats", JSON.stringify(response["stats"]));

      localStorage.setItem("token", response["tokens"]["access"]);
      localStorage.setItem("token", response["tokens"]["access"]);
      localStorage.setItem("refresh", response["tokens"]["refresh"]);

      if (!!response["client_data"]) {
        localStorage.setItem("compte_client_id", response["client_data"]["id"]);
        localStorage.setItem("compte_client_nom", response["client_data"]["nom"]);
        localStorage.setItem(
          "compte_client_description",
          response["client_data"]["description"]
        );
      }

      $.toaster({
        priority: "success",
        title: "success",
        message: "Connexion réussie... Redirection en cours...",
      });

      setInterval(
        () =>
          window.location.replace(
            `${window.location.protocol}//${window.location.host}/amsv2/index.html`
          ),
        3000
      );
    },
    error: function (response) {
      $("#goLogin").html("Connexion");
      $("#goLogin").prop("disabled", false);
      $.toaster({
        priority: "danger",
        title: "Mauvaise identification",
        message: "Échec de la connexion. Réessayez...",
        duration: "5000",
      });
    },
  });
}
