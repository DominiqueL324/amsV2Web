//import {asurl_not_paginated,token,admin_add,agent_add,client_add,salarie_add} from "./url";

function getClient(cas = 0, val = "", val_ = 1, data = {}) {
  var content = "";
  $.ajax({
    type: "GET",
    url: client_add,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
    success: function (response) {
      content =
        "<option value='0'>****************************************</option>";
      if (typeof response["results"] === "undefined") {
        r = response;
      } else {
        r = response["results"];
      }
      r.forEach((elt) => {
        content =
          content +
          "<option value = " +
          elt["id"] +
          ">" +
          elt["user"]["nom"] +
          "  " +
          elt["user"]["prenom"] +
          "</option>";
      });
      $("#client").empty();
      $("#client").append(
        " <label for='exampleInputEmail1'>Client</label>\
                    <select onchange='getboyCl()' class='form-select form-control form-select-lg' id='client_val'> " +
          content +
          "</select>"
      );
      if (cas == 1) {
        $("#client_val").val(val);
      }
      if (val_ != 1) {
        $("#client").empty();
        $("#client").append(
          " <label for='exampleInputEmail1'>Client</label>\
                    <select disabled='' class='form-select form-control form-select-lg' id='client_val'> " +
            content +
            "</select>"
        );
      }
    },
    error: function (response) {
     
    },
  });
}

function addUser() {
  //purification des erreurs du formulaire

  var url = "";
  var data = {};
  var tri = "";
  //controle des champs basic
  if (
    !$("#login").val() ||
    !$("#nom").val() ||
    !$("#prenom").val() ||
    !$("#mdp").val() ||
    !$("#email").val() ||
    !$("#telephone").val() ||
    !$("#adresse").val() ||
    !$("#type_user").val()
  ) {
    $.toaster({
      priority: "danger",
      title: "Erreur",
      message:
        "Veuillez saisir le service de maintenance pour cette erreur de validation de vos données.",
    });
    return;
  }
  $("#go").html("Enregistrement en cours...");
  //chargement info basic de l'objet à POST
  data["nom"] = $("#nom").val();
  data["prenom"] = $("#prenom").val();
  data["login"] = $("#login").val();
  data["mdp"] = $("#mdp").val();
  data["email"] = $("#email").val();
  data["adresse"] = $("#adresse").val();
  data["telephone"] = $("#telephone").val();
  data["role"] = parseInt($("#type_user").val());
   
  data["compte_client"] =
    $("#type_user").val() === "1" || $("#type_user").val() === "2"
      ? $("#compte_client_list").val()
      : null;
  data["secteur_primaire"] = "";
  data["secteur_secondaire"] = "";

  //generation trigramme
  tri = data["nom"][0] + data["prenom"][0] + data["prenom"][1];
  data["trigramme"] = tri.toUpperCase();

  if ($("#type_user") === "Agent constat") {
    let user = {
      id: $.cookie("id_user_logged"),
      email: $.cookie("email"),
      name: $.cookie("name"),
      group: $.cookie("group"),
      client_data: {
        id: $.cookie("compte_client_id"),
        nom: $.cookie("compte_client_nom"),
        description: $.cookie("compte_client_description"),
      },
    };
    data["user"] = { ...user };
  }
  
  $.ajax({
    type: "POST",
    crossDomain: true,
    dataType: "json",
    url: "http://195.15.218.172/edlgateway/api/v1/auth/signup",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify(data),
    success: function (response) {
      clearForm();
      $("#go").html("Enregistre");
      $.toaster({
        priority: "success",
        title: "success",
        message: "Utilisateur crée avec succès... Redirection en cours...",
      });
      window.location.replace("./../utilisateurs/index.html");
    },
    error: function (response) {
      $("#go").html("Enregistre");
      $.toaster({
        priority: "danger",
        title: "error",
        message:
          "Une erreur c'est produite. Veuillez verifier votre connexion internet ou contacter le service de maintenance",
      });
    },
  });
}

function getSingleUser() {
  let userId = $.cookie("id_user_edit");
  $("#form-content").css("display", "none");

  $.ajax({
    type: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    url: "http://195.15.218.172/edlgateway/api/v1/single/usera/?ID=" + userId,
    success: (response) => {
      $("#waiters").css("display", "none");
      $("#form-content").css("display", "block");

      let user = response.results;
      $("#login").val(user.login).trigger("change");
      $("#prenom").val(user.prenom).trigger("change");
      $("#nom").val(user.nom).trigger("change");
      $("#email").val(user.email).trigger("change");
      $("#telephone").val(user.telephone).trigger("change");
      if (user.role == "Agent secteur") {
        $("#type_user").val(1).trigger("change");
        $("#compte_client_list").val(user.compte_client).trigger("change");
      } else if (user.role == "Agent constat") {
        $("#type_user").val(2).trigger("change");
        $("#compte_client_list").val(user.compte_client).trigger("change");
      } else {
        $("#type_user").val(3).trigger("change");
      }
    },
    error: (response) => {
      $("#waiters").css("display", "none");
      $("#error-loading-data").css("display", "block");
     
    },
  });
}

function clearForm() {
  $("#error_form").css("display", "none");
  $("#champ_absent").css("display", "none");
  $("#s1_error").css("display", "none");
  $("#s2_error").css("display", "none");
  $("#as_error").css("display", "none");
  $("#nom").val("");
  $("#prenom").val("");
  $("#login").val("");
  $("#mdp").val("");
  $("#email").val("");
  $("#adresse").val("");
  $("#telephone").val("");
  $("#trigramme").val("");
  $("#statut").val("1").change();
  $("#as").empty();
  $("#secteur").css("display", "none");
  $("#as").css("display", "none");
  $("#type_user").val("1");
}

$("#leave").on("click", function () {
  clearForm();
});

function getUserToEdit() {
  toEdit = $.cookie("id_user_edit");
  Edition = parseInt($.cookie("road"));
  var url = "";
  $("#tri").css("display", "none");
  if (Edition == 1) {
    //cas agent
    url = agent_add + toEdit.toString();
  } else if (Edition == 2) {
    //cas admin
    url = admin_add + toEdit.toString();
  } else if (Edition == 3) {
    //cas client pro
    url = client_add + toEdit.toString();
  } else if (Edition == 4) {
    //cas client part
    url = client_add + toEdit.toString();
  } else {
    //cas salarié
    url = salarie_add + toEdit.toString();
  }
  $.ajax({
    type: "GET",
    url: url,
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      $("#role").val(response[0]["user"]["group"]);
      $("#boy").val("");
      $("#boy").val(response[0]["id"]);
      if (response[0]["user"]["is_active"] == true) {
        $("#statut").val("1").change();
      } else {
        $("#statut").val("0").change();
      }
      if (Edition == 1) {
        $("#tri").css("display", "inline");
        $("#cas").val(1);
        //cas AP AS AC
        $("#nom").val(response[0]["user"]["nom"]);
        $("#prenom").val(response[0]["user"]["prenom"]);
        $("#login").val(response[0]["user"]["login"]);
        $("#email").val(response[0]["user"]["email"]);
        $("#telephone").val(response[0]["telephone"]);
        $("#adresse").val(response[0]["adresse"]);
        $("#trigramme").val(response[0]["trigramme"]);

        var nom =
          response[0]["user"]["nom"] + " " + response[0]["user"]["prenom"];
        $("#nom_edit").text(nom);
        if ($.cookie("group") == "Agent secteur") {
          $("#goEdit").css("display", "none");
          var label = "Visualisation de " + nom;
          $("#titre_pg").html(label);
          $("#sous_titre_page").html(label);
        }
        if (response[0]["user"]["group"] == "Agent secteur") {
          $("#as").empty();
          $("#as").css("display", "none");
          $("#secteur_primaire").val(response[0]["secteur_primaire"]);
          $("#secteur_secondaire").val(response[0]["secteur_secondaire"]);
          $("#secteur").css("display", "inline");
        } else if (response[0]["user"]["group"] == "Agent constat") {
          //getAs()
          //$("#secteur").empty();
          $("#secteur").css("display", "none");
          $("#as").css("display", "inline");

          getAs(
            2,
            response[0]["agent_secteur"]["id"],
            response[0]["agent_secteur"]["id"]
          );
        } else {
          $("#as").css("display", "none");
        }
      } else if (Edition == 2) {
        $("#cas").val(2);
        //cas administrateur
        $("#nom").val(response[0]["user"]["nom"]);
        $("#prenom").val(response[0]["user"]["prenom"]);
        $("#login").val(response[0]["user"]["login"]);
        $("#email").val(response[0]["user"]["email"]);
        $("#telephone").val(response[0]["telephone"]);
        $("#adresse").val(response[0]["adresse"]);
      } else if (Edition == 3) {
        $("#cas").val(3);
        //cas client Pro
        $("#complement_adresse").val(response[0]["complement_adresse"]);
        $("#nom").val(response[0]["user"]["nom"]);
        $("#prenom").val(response[0]["user"]["prenom"]);
        $("#login").val(response[0]["user"]["login"]);
        $("#email").val(response[0]["user"]["email"]);
        $("#telephone").val(response[0]["telephone"]);
        $("#adresse").val(response[0]["adresse"]);
        $("#titre").val(response[0]["titre"]);
        $("#code_postal").val(response[0]["code_postal"]);
        $("#ville").val(response[0]["ville"]);
        $("#societe").val(response[0]["societe"]);
        $("#reference_societe").val(response[0]["ref_societe"]);
        $("#siret").val(response[0]["siret"]);
        $("#tva_inter").val(response[0]["tva_intercommunautaire"]);
        $("#tel_agence").val(response[0]["telephone_agence"]);
        $("#email_agence").val(response[0]["email_agence"]);
        $("#code").val(response[0]["code_client"]);
        $("#fonction").val(response[0]["fonction"]);
        //$('#statut').val(response[0]["statut_client"])
        $("#mobile").val(response[0]["mobile"]);
        //info concession
        $("#secteur").val(
          response[0]["info_concession"]["agent_rattache"]["secteur"] +
            " " +
            response[0]["info_concession"]["agent_rattache"][
              "secteur_secondaire"
            ]
        );
        $("#nom_concessionanire").val(
          response[0]["info_concession"]["nom_concessionnaire"]
        );
        $("#suive_technique").val(
          response[0]["info_concession"]["suivie_technique_client"]
        );
        $("#origine_client").val(
          response[0]["info_concession"]["origine_client"]
        );
        $("#numero_proposition").val(
          response[0]["info_concession"]["numero_proposition_prestation"]
        );
        $("#asclient").val(response[0]["info_concession"]["as_client"]);
        //info compta
        if (response[0]["ref_comptable"] != null) {
          $("#nom_comptable").val(response[0]["ref_comptable"]["nom"]);
          $("#mobile_comptable").val(response[0]["ref_comptable"]["mobile"]);
          $("#email_envoi_facture").val(
            response[0]["ref_comptable"]["email_envoi_facture"]
          );
          $("#telephone_comptable").val(
            response[0]["ref_comptable"]["telephone"]
          );
        }

        //info gestion
        if (response[0]["ref_service_gestion"] != null) {
          $("#nom_gestionnaire").val(
            response[0]["ref_service_gestion"]["nom_complet"]
          );
          $("#mobile_service_gestion").val(
            response[0]["ref_service_gestion"]["mobile"]
          );
          $("#email_gestionnaire").val(
            response[0]["ref_service_gestion"]["email"]
          );
          $("#telephone_service_gestion").val(
            response[0]["ref_service_gestion"]["telephone"]
          );
        }
        getAs(2);
        $("#as").css("display", "inline");
        getAs(2, 2, response[0]["info_concession"]["agent_rattache"]["id"]);
      } else if (Edition == 4) {
        $("#cas").val(4);
        //client part
        $("#nom").val(response[0]["user"]["nom"]);
        $("#prenom").val(response[0]["user"]["prenom"]);
        $("#login").val(response[0]["user"]["login"]);
        $("#email").val(response[0]["user"]["email"]);
        $("#telephone").val(response[0]["telephone"]);
        $("#adresse").val(response[0]["adresse"]);
        $("#titre").val(response[0]["titre"]);
        $("#code_postal").val(response[0]["code_postal"]);
        $("#ville").val(response[0]["ville"]);
        //$('#code').val(response[0]['code_client'])
        $("#complement_adresse").val(response[0]["complement_adresse"]);
        $("#secteur").val(
          response[0]["info_concession"]["agent_rattache"]["secteur"] +
            " " +
            response[0]["info_concession"]["agent_rattache"][
              "secteur_secondaire"
            ]
        );
        $("#nom_concessionanire").val(
          response[0]["info_concession"]["nom_concessionnaire"]
        );
        $("#suivie_technique").val(
          response[0]["info_concession"]["suivie_technique_client"]
        );
        $("#origine_client").val(
          response[0]["info_concession"]["origine_client"]
        );
        $("#numero_proposition").val(
          response[0]["info_concession"]["numero_proposition_prestation"]
        );
        $("#asclient").val(response[0]["info_concession"]["as_client"]);
        //$('#statut').val(response[0]["statut_client"])
        $("#mobile").val(response[0]["mobile"]);
        getAs(2, 2, response[0]["info_concession"]["agent_rattache"]["id"]);
        $("#as").css("display", "inline");
      } else {
        //cas Salarie
        $("#cas").val(5);
        $("#nom").val(response[0]["user"]["nom"]);
        $("#prenom").val(response[0]["user"]["prenom"]);
        $("#login").val(response[0]["user"]["login"]);
        $("#email").val(response[0]["user"]["email"]);
        $("#telephone").val(response[0]["telephone"]);
        $("#adresse").val(response[0]["adresse"]);
        $("#titre").val(response[0]["titre"]);
        $("#fonction").val(response[0]["fonction"]);
        $("#mobile").val(response[0]["mobile"]);
        $("#code").val(response[0]["code"]);
        $("#company").val(response[0]["compani"]);
        getClient(
          1,
          response[0]["client"]["id"],
          (val_ = 1),
          (data = { paginated: "t" })
        );
        $("#sal_bloc2").css("display", "inline");
        $("#sal_bloc3").css("display", "inline");
        $("#as").empty();
        $("#as").css("display", "none");
        $("#users_edit").remove();
        $("#secteur").css("display", "none");
        $("#sal_bloc1").css("display", "inline");
      }
    },
    error: function (response) {
     
    },
  });
}

function editUser() {
  id = $.cookie("id_user_edit");

  var url = "";
  var data = {};

  if (
    !$("#nom").val() ||
    !$("#prenom").val() ||
    !$("#email").val() ||
    !$("#telephone").val()
  ) {
    $("#error_form").css("display", "inline");
    $("#champ_absent").css("display", "inline");
    return;
  }

  data["nom"] = $("#nom").val();
  data["prenom"] = $("#prenom").val();
  data["email"] = $("#email").val();
  data["adresse"] = $("#adresse").val();
  data["telephone"] = $("#telephone").val();
  data["role"] =
    $("#type_user").val() === "1"
      ? "Agent secteur"
      : $("#type_user").val() === "2"
      ? "Agent constat"
      : "Administrateur";
  data["compte_client"] =
    $("#type_user").val() === "1" || $("#type_user").val() === "2"
      ? $("#compte_client_list").val()
      : null;
  data["secteur_primaire"] = "";
  data["secteur_secondaire"] = "";
  data["id"] = id;

  if ($("#type_user") === "Agent constat") {
    let user = {
      id: $.cookie("id_user_logged"),
      email: $.cookie("email"),
      name: $.cookie("name"),
      group: $.cookie("group"),
      client_data: {
        id: $.cookie("compte_client_id"),
        nom: $.cookie("compte_client_nom"),
        description: $.cookie("compte_client_description"),
      },
    };
    data["user"] = { ...user };
  }


  $.ajax({
    type: "PUT",
    crossDomain: true,
    dataType: "json",
    url: "http://195.15.218.172/edlgateway/api/v1/update/users",
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
        message: "Utilisateur crée avec succès.",
      });
      clearForm();
      window.location.replace("./../utilisateurs/index.html");
    },
    error: function (response) {
     
      $.toaster({
        priority: "danger",
        title: "danger",
        message: "Une erreur c'est produite.",
      });
    },
  });
}

$("#goEdit").on("click", function () {
  var cas = parseInt($("#cas").val());
  editUser(cas);
});
$("#LeaveEdit").on("click", function () {
  window.location.replace("list.html");
});
