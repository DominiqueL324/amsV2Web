url =
  "http://195.15.218.172/edlgateway/api/v1/participant/client/all?start=1&limit=1&count=10";

var i = 1;

function getAllCompteClients() {
  $("#waiters").css("display", "inline");
  $("#table-content").css("display", "none");

  $.ajax({
    type: "GET",
    url: url,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      $("#waiters").css("display", "none");
      $("#table-content").css("display", "block");

      response["results"].forEach((elt) => {
        $("#contentTableUser").append(
          `<tr>
          <td>${i}</td>
          <td class="text-center">
             ${elt["nom"]}
          </td>
          <td class='text-center'>
              ${elt["description"]}
          </td>
          <td style="display: flex;">
              <a onclick=goWhereEdit('${elt["id"]}')>
                  <i class="bi bi-pencil" style="color: rgb(0, 0, 0)"></i>
              </a>
          </td>
      </tr>`
        );
        i++;
      });
    },
    error: function (response) {
      
    },
  });
}

function addCompteClient() {
  $("#go").html("Enregistrement en cours...");

  var data = {};

  if (!$("#nom").val() || !$("#description").val()) {
    $("#error_form").css("display", "inline");
    $("#champ_absent").css("display", "inline");
    $("#editForm").modal("hide");
    return;
  }

  //chargement info basic de l'objet à POST
  data["nom"] = $("#nom").val();
  data["description"] = $("#description").val();

  $.ajax({
    type: "POST",
    crossDomain: true,
    dataType: "json",
    url: "http://195.15.218.172/edlgateway/api/v1/participant/client/add",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify(data),
    success: function () {
      $.toaster({
        priority: "success",
        title: "success",
        message: "Compte client crée avec succès.",
      });
      window.location.replace("./../compteClient/index.html");
    },
    error: function () {
      $("#go").html("Enregistrer");
      $.toaster({
        priority: "error",
        title: "error",
        message: "Une erreur c'est produite.",
      });
    },
  });
}

function goWhereEdit(id) {
  $.cookie("id_bibliotheque_compteClient_edit", $.trim(id));
  window.location.replace("./../compteClient/modifier.html");
}

function getSingleCompteClient() {
  let compteCLientId = $.cookie("id_bibliotheque_compteClient_edit");
  $("#form-content").css("display", "none");

  $.ajax({
    type: "GET",
    url:
      "http://195.15.218.172/edlgateway/api/v1/participant/single/client/?ID=" +
      compteCLientId,
    success: (response) => {
      $("#waiters").css("display", "none");
      $("#form-content").css("display", "block");

      let compteClient = response.results;

      $("#nom").val(compteClient.nom).trigger("change");
      $("#description").val(compteClient.description).trigger("change");
      compteClient.status === "on"
        ? $("#status").attr("checked", true).trigger("change")
        : $("#status").attr("checked", false).trigger("change");
    },
    error: (response) => {
      $("#waiters").css("display", "none");
    },
  });
}

function editCompteClient() {
  let compteCLientId = $.cookie("id_bibliotheque_compteClient_edit");

  $("#go").html("Enregistement en cours");

  let data = {};

  data["nom"] = $("#nom").val();
  data["description"] = $("#description").val();
  data["id"] = compteCLientId;

  $.ajax({
    type: "PUT",
    url: "http://195.15.218.172/edlgateway/api/v1/participant/client/update",
    data: JSON.stringify(data),
    headers: {
      "Authorization":  "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    success: () => {
      $("#go").html("Enregistrer");

      $.toaster({
        priority: "success",
        title: "success",
        message: "Compte client modifier avec succès.",
      });

      setInterval(() => (window.location.replace("./../compteClient/index.html")), 3000);
    },
    error: (response) => {
      $("#go").html("Enregistrer");

      $.toaster({
        priority: "danger",
        title: "danger",
        message: "Oops une erreur c'est produite.",
      });
    },
  });
}
