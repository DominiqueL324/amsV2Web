var next = ""
var prev = ""
var max = 0;
function filtreRdv() {
  var i = 1;
  data = {};
  message = "Rendez-vous répondant aux critères suivant; ";
  if ($("#etat").val() != "0") {
    data["statut"] = $("#etat").val();
    message = message + "statut: " + $("#etat option:selected").text();
  }

  if ($("#debut").val() != "") {
    data["debut"] = $("#debut").val();
    var formattedDate = new Date($("#debut").val());
    var d = formattedDate.getDate();
    var m = formattedDate.getMonth();
    m += 1; // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    message =
      message +
      " date debut: " +
      String(d).padStart(2, "0") +
      "/" +
      String(m).padStart(2, "0") +
      "/" +
      y;
  }
  if ($("#fin").val() != "") {
    data["fin"] = $("#fin").val();
    var formattedDate = new Date($("#fin").val());
    var d = formattedDate.getDate();
    var m = formattedDate.getMonth();
    m += 1; // JavaScript months are 0-11
    var y = formattedDate.getFullYear();
    message =
      message +
      " date fin: " +
      String(d).padStart(2, "0") +
      "/" +
      String(m).padStart(2, "0") +
      "/" +
      y;
  }

  if (localStorage.getItem("group") == "Salarie") {
    data["salarie"] = $.cookie("id_logged_user_user");
    message =
      message + " passeur : " + $("#passeur_val option:selected").text();
  }
  if (
    localStorage.getItem("group") == "Agent constat" ||
    localStorage.getItem("group") == "Agent secteur"
  ) {
    data["agent"] = $.cookie("id_logged_user_user");

    if ($("#client_val").val() != 0) {
      data["client"] = $("#client_val").val();
      message = message + " client: " + $("#client_val option:selected").text();
    }

    if ($("#role").val() != 0) {
      data["role"] = $("#role").val();
      message = message + " role: " + $("#role option:selected").text();
    }
  }
  if (localStorage.getItem("group") == "Administrateur" || localStorage.getItem("group") == "Audit planneur")
   {
    if ($("#client_val").val() != 0) {
      data["client"] = $("#client_val").val();
      message = message + "client: " + $("#client_val option:selected").text();
    }

    if ($("#agent_val").val() != 0) {
      data["agent"] = $("#agent_val").val();
      message = message + " agent: " + $("#agent_val option:selected").text();
    }

    if ($("#passeur_val").val() != 0) {
      data["salarie"] = $("#passeur_val").val();
      message =
        message + " passeur : " + $("#passeur_val option:selected").text();
    }
  }

  if (
    localStorage.getItem("group") == "Client pro" ||
    localStorage.getItem("group") == "Client particulier"
  ) {
    data["client"] = localStorage.getItem("id_user_logged");
  }
  data["user"] = data["role"] = $.ajax({
    type: "GET",
    url: tri_url,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
    success: function (response) {
      max_ = Math.round(parseInt(response["count"]) / 10) + 1;
      next = response["next"]
      prev = response["previous"]	    
      $("#contentTableRdv").empty();
      response["results"].forEach((elt) => {
        var formattedDate = new Date(elt["date"]);
        var d = formattedDate.getDate();
        var m = formattedDate.getMonth();
        m += 1; // JavaScript months are 0-11
        var y = formattedDate.getFullYear();
        var couleur;
        if (parseInt(elt["edl"]) == "1") {
          couleur = "rgb(241, 67, 67)";
        } else {
          couleur = "rgb(255, 166, 93)";
        }

        let addEdlOption;

        if (elt["edl"] !== "1") {
          addEdlOption = `<a onclick='addEdl("${elt["id"]}")'>
                <i class="fa fa-plus" aria-hidden="true" style="color: rgb(136, 102, 119)"></i>
              </a>`;
        }

        $("#contentTableRdv").append(`
          <tr style="background-color: ${couleur}; color:white;">
            <td>${i}</td>
            <td>${String(d).padStart(2, "0")} / ${String(m).padStart(
          2,
          "0"
        )} / ${y}</td>
            <td>${elt["client"]["societe"]}</td>
            <td>${elt["ref_lot"] || ""}</td>
            <td>${elt["ref_rdv_edl"] || ""}</td>
            <td class="text-center">
              <span class="badge badge-success">
                ${elt["intervention"]["type"]} 
              </span>
            </td>
            <td class="text-center">
              <span class="badge badge-primary">
                ${elt["propriete"]["type_propriete"]["type"]} 
              </span>
            </td>
            <td>
              ${addEdlOption || ""}
            </td>
          </tr>
        `);
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
  cas_rdv = 1
  filtreRdv();
});
function getClientF() {
  var content = "";
  $.ajax({
    type: "GET",
    url: client_add_not_pg,
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      content = "<option value='0'>***********************</option>";
      var r = "";
      if (typeof response["results"] === "undefined") {
        r = response;
      } else {
        r = response["results"];
      }
      r.forEach((elt) => {
        content =
          content +
          "<option value = " +
          elt["user"]["id"] +
          ">" +
          elt["societe"] +
          " --- " +
          elt["user"]["nom"] +
          " " +
          elt["user"]["prenom"] +
          "</option>";
      });
      $("#client").empty();
      $("#client").append(
        "<select  class='form-select form-control form-select-lg' id='client_val'> " +
          content +
          "</select>"
      );
    },
    error: function (response) {
      
    },
  });
  if (
    localStorage.getItem("group") == "Client particulier" ||
    localStorage.getItem("group") == "Client pro"
  ) {
    content = "<option value='0'>***********************</option>";
    content =
      content +
      "<option value = " +
      localStorage.getItem("id_user_logged") +
      ">" +
      localStorage.getItem("name") +
      " " +
      localStorage.getItem("first_name") +
      "</option>";
    $("#client").empty();
    $("#client").append(
      "<select  class='form-select form-control form-select-lg' id='client_val'> " +
        content +
        "</select>"
    );
  }
  if (localStorage.getItem("group") == "Salarie") {
    content = "<option value='0'>***********************</option>";
    content =
      content +
      "<option value = " +
      $.cookie("id_client_sal") +
      ">" +
      $.cookie("nom_client_sal") +
      " " +
      $.cookie("prenom_client_sal") +
      "</option>";
    $("#client").empty();
    $("#client").append(
      "<select  class='form-select form-control form-select-lg' id='client_val'> " +
        content +
        "</select>"
    );
  }
}
function getPasseurF() {
  var crt = "";
  data = {};
  if (localStorage.getItem("group") == "Salarie") {
    crt =
      "<option value = " +
      $.cookie("id_logged_user_user") +
      ">" +
      localStorage.getItem("name") +
      "  " +
      localStorage.getItem("first_name") +
      "</option>";
    $("#passeur").empty();
    $("#passeur").append(
      " <label for='exampleInputEmail1'>Passeur</label>\
          <select  class='form-select form-control form-select-lg' id='passeur_val'> " +
        crt +
        "</select>"
    );
    var content = "";
    content = "<option value='0'>***********************</option>";
    content =
      content +
      "<option value = " +
      $.cookie("id_client_sal") +
      ">" +
      $.cookie("nom_client_sal") +
      " " +
      $.cookie("prenom_client_sal") +
      "</option>";
    $("#client").empty();
    $("#client").append(
      "<select  class='form-select form-control form-select-lg' id='client_val'> " +
        content +
        "</select>"
    );
    return;
  }
  if (
    localStorage.getItem("group") == "Agent secteur" ||
    localStorage.getItem("group") == "Agent constat" ||
    localStorage.getItem("group") == "Audit planneur"
  ) {
    data["agent"] = localStorage.getItem("id_user_logged");
    //alert(localStorage.getItem('id_user_logged'))
  }

  if (localStorage.getItem("group") == "Client pro") {
    data["client"] = localStorage.getItem("id_user_logged");
  }
  $.ajax({
    type: "GET",
    url: salarie_add_not_pg,
    data: data,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
    success: function (response) {
      content =
        "<option value='0'>****************************************</option>";
      response.forEach((elt) => {
        content =
          content +
          "<option value = " +
          elt["user"]["id"] +
          ">" +
          elt["user"]["nom"] +
          "  " +
          elt["user"]["prenom"] +
          "</option>";
      });
      $("#passeur").empty();
      $("#passeur").append(
        " <label for='exampleInputEmail1'>Passeur</label>\
                    <select  class='form-select form-control form-select-lg' id='passeur_val'> " +
          content +
          "</select>"
      );
    },
    error: function (response) {
      
    },
  });
}

function getAgentF() {
  data = {};
  if (
    localStorage.getItem("group") == "Agent secteur" ||
    localStorage.getItem("group") == "Agent constat" ||
    localStorage.getItem("group") == "Audit planneur"
  ) {
    data["agent"] = localStorage.getItem("id_user_logged");
  }
  $.ajax({
    type: "GET",
    url: asurl_paginated,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
    success: function (response) {
  
      content =
        "<option value='0'>****************************************</option>";
        var r
        if(typeof(response['results'])==="undefined"){
          r = response
        }else{
          r = response['results']
        }
      r.forEach((elt) => {
        content =
          content +
          "<option value = " +
          elt["user"]["id"] +
          ">" +
          elt["user"]["nom"] +
          "  " +
          elt["user"]["prenom"] +
          "</option>";
      });

      $("#agent").empty();
      $("#agent").append(
        " <label for='exampleInputEmail1'>Agent de secteur</label>\
            <select class='form-select form-control form-select-lg' id='agent_val'> " +
          content +
          "</select>"
      );
    },
    error: function (response) {
      
    },
  });
}

function onload() {
  if (localStorage.getItem("group") == "Administrateur") {
    getClientF();
    getAgentF();
    getPasseurF();
    /*$('#role_group').empty()
      $('#role_group').css("display",'none')*/
  }
  if (
    localStorage.getItem("group") == "Agent secteur" ||
    localStorage.getItem("group") == "Agent constat" ||
    localStorage.getItem("group") == "Audit planneur"
  ) {
    getClientF();
    getAgentF();
    getPasseurF();
  }
  if (localStorage.getItem("group") == "Client pro") {
    getPasseurF();
  }
  if (localStorage.getItem("group") == "Salarie") {
    getPasseurF();
  }
}
