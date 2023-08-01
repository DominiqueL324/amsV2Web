var next = "";
var prev = "";
var max = 0;
function filtreUser() {
  var i = 1;
  data = {};
  message = "Utilisateurs répondant aux critères suivant; ";

  if (
    $.cookie("group") == "Agent constat" ||
    $.cookie("group") == "Agent secteur"
  ) {
    data["agent"] = $.cookie("id_user_logged");
    if ($("#role").val() != 0) {
      data["role"] = $("#role").val();
      message = message + " role: " + $("#role option:selected").text();
    }
    if ($("#etat").val() != "-1") {
      data["etat"] = $("#etat").val();
      message = message + " Etat: " + $("#etat option:selected").text();
    }
  }
  if (
    $.cookie("group") == "Administrateur" ||
    $.cookie("group") == "Audit planneur"
  ) {
    data["administrateur"] = $.cookie("id_user_logged");
    if ($("#role").val() != 0) {
      data["role"] = $("#role").val();
      message = message + " role: " + $("#role option:selected").text();
    }
    if ($("#etat").val() != "-1") {
      data["etat"] = $("#etat").val();
      message = message + " Etat: " + $("#etat option:selected").text();
    }
  }

  if (
    $.cookie("group") == "Client pro" ||
    $.cookie("group") == "Client particulier"
  ) {
    data["client"] = $.cookie("id_user_logged");
    if ($("#etat").val() != "-1") {
      data["etat"] = $("#etat").val();
      message = message + " Etat: " + $("#etat option:selected").text();
    }
  }
  $.ajax({
    type: "GET",
    url: filtre_url_user,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
    success: function (response) {
      var cas_ = "";
      var classe = "";
      var societe = "";
      var i = 1;
      max_ = Math.round(parseInt(response["count"]) / 10) + 1;
      next = response["next"];
      prev = response["previous"];
      $("#contentTableUser").empty();
      response["results"].forEach((elt) => {
        var id_toget = 0;
        if (elt["groups"][0]["group"] == "Administrateur") {
          id_toget = elt["administrateur"]["id"];
        }
        if (elt["groups"][0]["group"] == "Salarie") {
          id_toget = elt["salarie"]["id"];
        }
        if (elt["groups"][0]["group"] == "Client particulier") {
          id_toget = elt["client"]["id"];
        }
        if (
          elt["groups"][0]["group"] == "Agent secteur" ||
          elt["groups"][0]["group"] == "Agent constat" ||
          elt["groups"][0]["group"] == "Audit planneur"
        ) {
          id_toget = elt["agent"];
        }
        if (elt["groups"][0]["group"] == "Client pro") {
          societe = elt["client"]["societe"];
          id_toget = elt["client"]["id"];
        } else {
          societe = "RAS";
        }
        if (elt["is_active"] == true) {
          cas_ = "activé";
          classe = "badge badge-success";
        } else {
          cas_ = "désactivé";
          classe = "badge badge-danger";
        }
        $("#contentTableUser").append(
          "<tr>\
        <td>" +
            i +
            "</td>\
        <td>" +
            elt["first_name"] +
            " " +
            elt["last_name"] +
            "</td>\
        <td>" +
            elt["email"] +
            '</td>\
        <td class="text-center">\
            <span class="badge badge-success">' +
            elt["groups"][0]["group"] +
            "</span>\
        </td>\
        <td>" +
            societe +
            '</td>\
        <td>\
            <span class="' +
            classe +
            '" >' +
            cas_ +
            "</span>\
        </td>\
        <td>\
            <a onclick='goWhereEdit(" +
            id_toget +
            ',"' +
            elt["groups"][0]["group"] +
            '"' +
            ')\' ><i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>&nbsp;;<a  onclick=\'goWhereEdit1(' +
            id_toget +
            ',"' +
            elt["groups"][0]["group"] +
            '"' +
            ')\' ><i class="bi bi-eye" style="color: rgb(136, 102, 119)"></i></a>\
        </td>\
        </tr>'
        );
        i++;
      });
      $("#text_ok").text("");
      $("#text_ok").text(message);
      $("#result").css("display", "inline");
    },
    error: function (response) {
      alert("Echec de récupération des rendez-vous");
    },
  });
}
$("#find").on("click", function () {
  cas_user = 1;
  filtreUser();
});

function onload() {
  if (
    $.cookie("group") == "Administrateur" ||
    $.cookie("group") == "Audit planneur"
  ) {
    $("#role_list").empty();
    $("#role_list").append(
      '\
                        <label for="ref_edl">Statut</label>\
                          <select class="form-control" name="role" id="role">\
                            <option value="0">Role</option>\
                            <option value="Administrateur">Administrateur</option>\
                            <option value="Agent secteur">Agent secteur</option>\
                            <option value="Agent constat">Agent Constat</option>\
                            <option value="Audit planneur">Audit planneur</option>\
                            <option value="Client pro">Client Pro</option>\
                            <option value="Client particulier">Client particulier</option>\
                            <option value="Salarie">Salarié </option>\
                          </select>'
    );
  }
  if (
    $.cookie("group") == "Agent secteur" ||
    $.cookie("group") == "Agent constat"
  ) {
    $("#role_list").empty();
    $("#role_list").append(
      '\
                    <label for="ref_edl">Statut</label>\
                      <select class="form-control" name="role" id="role">\
                        <option value="0">Role</option>\
                        <option value="Agent constat">Agent Constat</option>\
                        <option value="Audit planneur">Audit planneur</option>\
                        <option value="Client pro">Client Pro</option>\
                        <option value="Salarie">Salarié </option>\
                      </select>'
    );
  }
  if (
    $.cookie("group") == "Client pro" ||
    $.cookie("group") == "Client particulier"
  ) {
    $("#role_list").remove();
  }
}
var next = "";
var prev = "";
var max = 0;
function filtreUser() {
  $("#waiters").css("display","inline")
  var i = 1;
  data = {};
  message = "Utilisateurs répondant aux critères suivant; ";

  if (
    $.cookie("group") == "Agent constat" ||
    $.cookie("group") == "Agent secteur"
  ) {
    data["agent"] = $.cookie("id_user_logged");
    if ($("#role").val() != 0) {
      data["role"] = $("#role").val();
      message = message + " role: " + $("#role option:selected").text();
    }
    if ($("#etat").val() != "-1") {
      data["etat"] = $("#etat").val();
      message = message + " Etat: " + $("#etat option:selected").text();
    }
  }
  if (
    $.cookie("group") == "Administrateur" ||
    $.cookie("group") == "Audit planneur"
  ) {
    data["administrateur"] = $.cookie("id_user_logged");
    if ($("#role").val() != 0) {
      data["role"] = $("#role").val();
      message = message + " role: " + $("#role option:selected").text();
    }
    if ($("#etat").val() != "-1") {
      data["etat"] = $("#etat").val();
      message = message + " Etat: " + $("#etat option:selected").text();
    }
  }

  if (
    $.cookie("group") == "Client pro" ||
    $.cookie("group") == "Client particulier"
  ) {
    data["client"] = $.cookie("id_user_logged");
    if ($("#etat").val() != "-1") {
      data["etat"] = $("#etat").val();
      message = message + " Etat: " + $("#etat option:selected").text();
    }
  }
  $.ajax({
    type: "GET",
    url: filtre_url_user,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
    success: function (response) {
      $("#waiters").css("display","none")
      var cas_ = "";
      var classe = "";
      var societe = "";
      var i = 1;
      max_ = Math.round(parseInt(response["count"]) / 10) + 1;
      next = response["next"];
      prev = response["previous"];
      $("#contentTableUser").empty();
      response["results"].forEach((elt) => {
        var id_toget = 0;
        if (elt["groups"][0]["group"] == "Administrateur") {
          id_toget = elt["administrateur"]["id"];
        }
        if (elt["groups"][0]["group"] == "Salarie") {
          id_toget = elt["salarie"]["id"];
        }
        if (elt["groups"][0]["group"] == "Client particulier") {
          id_toget = elt["client"]["id"];
        }
        if (
          elt["groups"][0]["group"] == "Agent secteur" ||
          elt["groups"][0]["group"] == "Agent constat" ||
          elt["groups"][0]["group"] == "Audit planneur"
        ) {
          id_toget = elt["agent"];
        }
        if (elt["groups"][0]["group"] == "Client pro") {
          societe = elt["client"]["societe"];
          id_toget = elt["client"]["id"];
        } else {
          societe = "RAS";
        }
        if (elt["is_active"] == true) {
          cas_ = "activé";
          classe = "badge badge-success";
        } else {
          cas_ = "désactivé";
          classe = "badge badge-danger";
        }
        $("#contentTableUser").append(
          "<tr>\
        <td>" +
            i +
            "</td>\
        <td>" +
            elt["first_name"] +
            " " +
            elt["last_name"] +
            "</td>\
        <td>" +
            elt["email"] +
            '</td>\
        <td class="text-center">\
            <span class="badge badge-success">' +
            elt["groups"][0]["group"] +
            "</span>\
        </td>\
        <td>" +
            societe +
            '</td>\
        <td>\
            <span class="' +
            classe +
            '" >' +
            cas_ +
            "</span>\
        </td>\
        <td>\
            <a onclick='goWhereEdit(" +
            id_toget +
            ',"' +
            elt["groups"][0]["group"] +
            '"' +
            ')\' ><i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>&nbsp;;<a  onclick=\'goWhereEdit1(' +
            id_toget +
            ',"' +
            elt["groups"][0]["group"] +
            '"' +
            ')\' ><i class="bi bi-eye" style="color: rgb(136, 102, 119)"></i></a>\
        </td>\
        </tr>'
        );
        i++;
      });
      $("#text_ok").text("");
      $("#text_ok").text(message);
      $("#result").css("display", "inline");
    },
    error: function (response) {
      alert("Echec de récupération des rendez-vous");
    },
  });
}
$("#find").on("click", function () {
  cas_user = 1;
  filtreUser();
});

function onload() {
  if (
    $.cookie("group") == "Administrateur" ||
    $.cookie("group") == "Audit planneur"
  ) {
    $("#role_list").empty();
    $("#role_list").append(
      '\
                        <label for="ref_edl">Statut</label>\
                          <select class="form-control" name="role" id="role">\
                            <option value="0">Role</option>\
                            <option value="Administrateur">Administrateur</option>\
                            <option value="Agent secteur">Agent secteur</option>\
                            <option value="Agent constat">Agent Constat</option>\
                            <option value="Audit planneur">Audit planneur</option>\
                            <option value="Client pro">Client Pro</option>\
                            <option value="Client particulier">Client particulier</option>\
                            <option value="Salarie">Salarié </option>\
                          </select>'
    );
  }
  if (
    $.cookie("group") == "Agent secteur" ||
    $.cookie("group") == "Agent constat"
  ) {
    $("#role_list").empty();
    $("#role_list").append(
      '\
                    <label for="ref_edl">Statut</label>\
                      <select class="form-control" name="role" id="role">\
                        <option value="0">Role</option>\
                        <option value="Agent constat">Agent Constat</option>\
                        <option value="Audit planneur">Audit planneur</option>\
                        <option value="Client pro">Client Pro</option>\
                        <option value="Salarie">Salarié </option>\
                      </select>'
    );
  }
  if (
    $.cookie("group") == "Client pro" ||
    $.cookie("group") == "Client particulier"
  ) {
    $("#role_list").remove();
  }
}
