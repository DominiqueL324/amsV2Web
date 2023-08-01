url =
  "http://195.15.218.172/edlgateway/api/v1/participant/all?start=1&limit=1&count=10";

var i = 1;

function getAllParticipants(idClient=0) {
  $("#waiters").css("display", "inline");
  $("#table-content").css("display", "none");
  url = idClient != "0"
      ? "http://195.15.218.172/edlgateway/api/v1/participant/client/indivi/tous?ID=" + idClient
      : "http://195.15.218.172/edlgateway/api/v1/participant/user/indivi/tous?ID="+localStorage.getItem("id_user_logged");

  $.ajax({
    type: "GET",
    url: url,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
     
      $("#waiters").css("display", "none");
      $("#table-content").css("display", "block");
      $("#contentTableUser").empty();
      response["results"].forEach((elt) => {
        $("#contentTableUser").append(
          `<tr>
             <td>${i}</td>
            <td class='text-center'>${elt["prenom"]} ${elt["nom"]} </td>
            <td class='text-center'>${elt["email"]}</td>
            <td class="text-center"><span class="badge badge-success">${elt["role"]}</span></td>
            <td class='text-center'>${elt["adresse"]}</td>
            <td class='text-center'>${elt["compte_client"]['nom']}</td>
            <td style="display: flex;">
              <a onclick=goWhereEdit("${elt["id"]}")><i class="bi bi-pencil" style="color: rgb(0, 0, 0)"></i></a>&nbsp;
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

function addParticipant(compteclient) {
  var data = {};
  var tri = "";

  if (
    !$("#nom").val() ||
    !$("#prenom").val() ||
    !$("#email").val() ||
    !$("#telephone").val() ||
    !$("#type_user").val() ||
    !$("#numero_de_la_voie").val() ||
    !$("#nom_de_la_voie").val() ||
    !$("#type_de_voie").val() ||
    !$("#extension_de_la_voie").val() ||
    !$("#ville").val() ||
    !$("#code_postal").val() ||
    !$("#complement_d_adresse").val()
  ) {
    $("#error_form").css("display", "inline");
    $("#champ_absent").css("display", "inline");
    $("#editForm").modal("hide");
    return;
  }

  //chargement info basic de l'objet à POST
  data["nom"] = $("#nom").val();
  data["prenom"] = $("#prenom").val();
  data["email"] = $("#email").val();
  data["telephone"] = $("#telephone").val();
  data["role"] = $("#type_user").val();
  tri = data["nom"][0] + data["prenom"][0] + data["prenom"][1];
  data["trigramme"] = tri.toUpperCase();
  data["status"] = $("#status").is(":checked") ? "on" : "off";
  data["bancaire_data"] = {
    iban: $("#iban").val(),
    numeroDeCompte: $("#numeroDeCompte").val(),
    bank: $("#bank").val(),
    bic: $("#bic").val(),
  };
  data["numero_de_la_voie"] = $("#numero_de_la_voie").val();
  data["nom_de_la_voie"] = $("#nom_de_la_voie").val();
  data["type_de_voie"] = $.trim($("#type_de_voie").val());
  data["extension_de_la_voie"] = $.trim($("#extension_de_la_voie").val());
  data["ville"] = $("#ville").val();
  data["code_postal"] = $("#code_postal").val();
  data["complement_d_adresse"] = $("#complement_d_adresse").val();
  data["iduser"] = localStorage.getItem("id_user_logged");
  data["compte_client"] = compteclient;
  // data["creator_id"] = $.cookie("");

  $.ajax({
    type: "POST",
    crossDomain: true,
    dataType: "json",
    url: "http://195.15.218.172/edlgateway/api/v1/participant/add",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify(data),
    success: function () {
      $("input").empty();
      $("select").empty();

      $.toaster({
        priority: "success",
        title: "success",
        message: "Participant crée avec succès... Redirection en cours",
      });
      setInterval(() => (window.location.replace("./../participants/index.html")), 3000);
    },
    error: function () {
      $.toaster({
        priority: "danger",
        title: "error",
        message: "Une erreur c'est produite...",
      });

      $.toaster({
        priority: "danger",
        title: "error",
        message:
          "Veuillez verifier votre connexion internet ou contacter le service de maintenance",
      });
    },
  });
}

function goWhereEdit(id) {
  $.cookie("id_participant_edit", id);
  window.location.replace("./../participants/modifier.html");
}

async function getSingleParticipant() {
  let participantId = $.cookie("id_participant_edit");
  $("#form-content").css("display", "none");
  $("#waiters").css("display", "block");

  await getAllCompteClient();
  await getAllTypeDeVoie();
  await getAllTypeDExtension();

  $.ajax({
    type: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    url:
      "http://195.15.218.172/edlgateway/api/v1/single/participant/?ID=" +
      participantId,
    success: (response) => {
     
      $("#waiters").css("display", "none");
      $("#form-content").css("display", "block");

      let participant = response.results;
      $("#nom").val(participant.nom).trigger("change");
      $("#prenom").val(participant.prenom).trigger("change");
      $("#email").val(participant.email).trigger("change");
      $("#telephone").val(participant.telephone).trigger("change");
      
      $("#type_user").val(participant.role).trigger("change");

      $("#bank").val(participant.bancaire_data.bank).trigger("change");
      $("#iban").val(participant.bancaire_data.iban).trigger("change");
      $("#bic").val(participant.bancaire_data.bic).trigger("change");
      $("#numeroDeCompte")
        .val(participant.bancaire_data.numeroDeCompte)
        .trigger("change");

      $("#numero_de_la_voie")
        .val(participant.numero_de_la_voie)
        .trigger("change");
      $("#nom_de_la_voie").val(participant.nom_de_la_voie).trigger("change");
      $("#type_de_voie").val(participant.type_de_voie).trigger("change");
      $("#extension_de_la_voie")
        .val(participant.extension_de_la_voie)
        .trigger("change");
      $("#ville").val(participant.ville).trigger("change");
      $("#code_postal").val(participant.code_postal).trigger("change");
      $("#complement_d_adresse")
        .val(participant.complement_d_adresse)
        .trigger("change");
      $("#compte_client").val(participant.compte_client["nom"]).trigger("change");
      if (participant.status === "on") $("#status").attr("checked", true).trigger("change");
      $.cookie('idclient',participant.compte_client["_id"]) 
    },
    error: (response) => {
      $("#waiters").css("display", "none");
      $("#error-loading-data").css("display", "block");
     
    },
  });
}

function editParticipant() {
  var data = {};
  var tri = "";

  $("#go").html("Enregistrement en cours...");

  if (
    !$("#nom").val() ||
    !$("#prenom").val() ||
    !$("#email").val() ||
    !$("#telephone").val() ||
    !$("#type_user").val() ||
    !$("#numero_de_la_voie").val() ||
    !$("#nom_de_la_voie").val() ||
    !$("#type_de_voie").val() ||
    !$("#extension_de_la_voie").val() ||
    !$("#ville").val() ||
    !$("#code_postal").val() ||
    !$("#complement_d_adresse").val()
  ) {
    $("#error_form").css("display", "inline");
    $("#champ_absent").css("display", "inline");
    $("#editForm").modal("hide");
    return;
  }

  //chargement info basic de l'objet à POST
  data["nom"] = $("#nom").val();
  data["prenom"] = $("#prenom").val();
  data["email"] = $("#email").val();
  data["telephone"] = $("#telephone").val();
  data["role"] = $("#type_user").val();
  tri = data["nom"][0] + data["prenom"][0] + data["prenom"][1];
  data["trigramme"] = tri.toUpperCase();
  data["status"] = $("#status").is(":checked") ? "on" : "off";

  data["bancaire_data"] = {
    iban: $("#iban").val(),
    numeroDeCompte: $("#numeroDeCompte").val(),
    bank: $("#bank").val(),
    bic: $("#bic").val(),
  };

  data["numero_de_la_voie"] = $("#numero_de_la_voie").val();
  data["nom_de_la_voie"] = $("#nom_de_la_voie").val();
  data["type_de_voie"] = $.trim($("#type_de_voie").val());
  data["extension_de_la_voie"] = $.trim($("#extension_de_la_voie").val());
  data["ville"] = $("#ville").val();
  data["code_postal"] = $("#code_postal").val();
  data["complement_d_adresse"] = $("#complement_d_adresse").val();
  data["compte_client"] = {
    _id:$.cookie('idclient') ,
    nom: $("#compte_client").val()
  };

  data["id"] = $.cookie("id_participant_edit");
  $.ajax({
    type: "PUT",
    crossDomain: true,
    dataType: "json",
    url: "http://195.15.218.172/edlgateway/api/v1/participant/parti/update",
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
        message: "Participant modifier avec succès... Redirection en cours",
      });

      setInterval(() => window.location.replace("./../participants/index.html"), 2000);
    },
    error: function () {
      $("#go").html("Enregistrer");
      $.toaster({
        priority: "danger",
        title: "error",
        message: "Une erreur c'est produite...",
      });

      $.toaster({
        priority: "danger",
        title: "error",
        message:
          "Veuillez verifier votre connexion internet ou contacter le service de maintenance",
      });
    },
  });
}

async function getAllCompteClient() {
  $.ajax({
    type: "GET",
    url: "http://195.15.218.172/manager_app/user/tri/?agent="+localStorage.getItem("id_user_logged")+"&role=Client%20pro",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      response["results"].forEach((elt) => {
        $("#compte_client").append(`
            <option value="${elt["client"]["id"]}">${elt["first_name"]+" "+ elt["last_name"]+"   "+elt["client"]["societe"]}</option>
        `)
      });
    },
    error: function (response) {
     
    },
  });
}

async function getAllTypeDeVoie() {
  $.ajax({
    type: "GET",
    url: "http://195.15.218.172/edlgateway/api/v1/participant/voie/all?start=0&limit=100&count=1",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
     
      response["results"].forEach((elt) => {
        $("#type_de_voie").append(
          `<option value="${$.trim(elt["id"])}">${elt["nom"]}</option>`
        );
      });
    },
    error: function (response) {
     
    },
  });
}

$('#compte_client_index').on('change',function(){
  if($('#compte_client_index').val() == "-1"){
    getAllParticipants();
  }else{
    getAllParticipants($('#compte_client_index').val());
  }
  
})

async function getAllTypeDExtension() {
  $.ajax({
    type: "GET",
    url: "http://195.15.218.172/edlgateway/api/v1/participant/extension/all?start=0&limit=100&count=1",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
     
      response["results"].forEach((elt) => {
        $("#extension_de_la_voie").append(
          `<option value='${$.trim(elt["id"])}'>${elt["nom"]}</option>`
        );
      });
    },
    error: function (response) {
     
    },
  });
}
