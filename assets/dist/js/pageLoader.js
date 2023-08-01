const loadPage = () => {
  // put code here

  var usrTyp = `${localStorage?.getItem("group")
    .split(" ")
    .join("")
    .toLowerCase()}`;

  var stats = JSON.parse(localStorage.getItem("stats"));

  if (usrTyp === "administrateur" || usrTyp === "agentsecteur") {
    $("#nombre_agent").html(stats.agent);
    $("#nombre_client").html(stats.client);
    $("#nombre_salarie").html(stats.salarie);
    $("#nombre_rdv").html(stats.rdv);
  } else if (usrTyp === "administrateur") {
    $("#nombre_user").html(stats.utilisateurs);
    $("#nombre_admin").html(stats.admin);
  }

  let completeName =
    localStorage.getItem("first_name").charAt(0).toUpperCase() +
    localStorage.getItem("first_name").slice(1).toLowerCase() +
    " " +
    localStorage.getItem("name");

  $("#name_user").html(`${completeName}`).css("text-decoration", "none");
  function protect(usrTyp) {
    $(`.${usrTyp}`).css("display", "inline");
  }
  protect(usrTyp);
};

function resetUserData() {
  var cookies = $.cookie();
  for (var cookie in cookies) {
    $.cookie(cookie);
  }
}

function logout() {
  if (!localStorage.getItem("token")) {
    // alert('no cookie found')
    window.location.replace(
      `${window.location.protocol}//${window.location.host}/amsv2/login.html`
    );
    return;
  }
  localStorage.removeItem("name");
  localStorage.removeItem("first_name");
  localStorage.removeItem("email");
  localStorage.removeItem("group");
  localStorage.removeItem("id_user_logged");

  localStorage.removeItem("refresh");

  localStorage.removeItem("agent_user_logged");
  // //to set
  localStorage.removeItem("id_logged_user_user");

  localStorage.removeItem("adresse");
  localStorage.removeItem("telephone");
  localStorage.removeItem("stats");
  localStorage.removeItem("compte_client_id");
  localStorage.removeItem("compte_client_nom");
  localStorage.removeItem("compte_client_description");
  $.ajax({
    type: "GET",
    url:
      "http://195.15.228.250/manager_app/logout/?token=" +
      localStorage.getItem("refresh"),
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      //resetUserData();
      // $.cookie("token", null);
      localStorage.removeItem("token");
      // alert('successfully and removed cookie');

      window.location.replace(
        `${window.location.protocol}//${window.location.host}/amsv2/login.html`
      );
    },
    error: function (response) {
      resetUserData();
      // alert('not successfully and removed cookie');
      // $.cookie("token", null);
      localStorage.removeItem("token");
      window.location.replace(
        `${window.location.protocol}//${window.location.host}/amsv2/login.html`
      );
    },
  });
}

$("#logout").on("click", (e) => {
  e.preventDefault();
  logout();
});

$("#waiters").load(
  `${window.location.protocol}//${window.location.host}/amsv2/partials/spinner.html`
);

if (localStorage.getItem("token")) loadPage();

$("#copyright_year").html(new Date().getFullYear());
