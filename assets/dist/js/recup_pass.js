var Url = "http://195.15.228.250/manager_app/backup/password/?email=";
function getData() {
  $("#suivant").html("Requêtes en cours...");
  if (!$("#email").val()) {
    $.toaster({
      priority: "danger",
      title: "danger",
      message:
        "Erreur de saisir... Veuillez entrer votre email. Pour récuperer votre mot de pass.",
    });
  }
  $.ajax({
    type: "GET",
    url:
      "http://195.15.228.250/manager_app/backup/password/?email=" +
      $("#email").val(),
    success: function (response) {
      $("#suivant").html("Suivant");
      $.cookie("email_to_backup", response["email"]);
      $.cookie("nom_to_backup", response["last_name"]);
      $.cookie("prenom_to_backup", response["first_name"]);

      $("#suivant").css("display", "none");

      $("#user_nom").css("display", "flex");
      $("#user_prenom").css("display", "flex");

      $("#resetPassword").css("display", "block");

      $("#nom").val(response.last_name).trigger("change");
      $("#prenom").val(response.first_name).trigger("change");
    },
    error: function () {
      $("#suivant").html("Suivant");
      $.toaster({
        priority: "danger",
        title: "danger",
        message: "Ooops cette email n'existe pas.",
      });
    },
  });
}

function resetPass() {
  $("#resetPassword").html("Requêtes en cours...");
  $.ajax({
    type: "POST",
    url: "http://195.15.228.250/manager_app/backup/password/",
    data: { email: $("#email").val() },
    success: function () {
      $.toaster({
        priority: "success",
        title: "succes",
        message: "Reussir... Redirection en cours...",
      });
      setInterval(() => window.location.replace("login.html"), 3000);
    },
    error: function () {
      $("#resetPassword").html("Recupérer");
      $.toaster({
        priority: "danger",
        title: "danger",
        message: "Ooops une erreur c'est produite.",
      });
    },
  });
}
