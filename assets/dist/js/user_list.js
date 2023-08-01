//import {asurl_not_paginated,token,admin_add,agent_add,client_add,salarie_add,user_all,base_local,base_online} from "./url";
//import {asurl_not_paginated,token,admin_add,agent_add,client_add,salarie_add,user_all,base_local,base_online} from "./url";
var pg = "";
var i = 1;
var max = 0;
var k = 0;
var next = "";
var prev = "";

var url = "http://195.15.218.172/edlgateway/api/v1/users/all?start=0&limit=100";

function getAllUsers() {
  $("#waiters").css("display", "inline");
  $("#table-content").css("display", "none");
  var content = "";

  $.ajax({
    type: "GET",
    url: url,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      $("#waiters").css("display", "none");
      $("#table-content").css("display", "block");
      // var cas_ = "";
      // var classe = "";
      // var societe = "";
      // var i = 1;
      // max_ = Math.round(parseInt(response["count"]) / 10) + 1;
      next = response["next"];
      prev = response["previous"];
      // $("#total").text(max_);
      $("#contentTableUser").empty();
     

      response["results"].forEach((elt) => {
        societe = "RAS";

        if (elt["is_active"] == true) {
          cas_ = "activé";
          classe = "badge badge-success";
        } else {
          cas_ = "désactivé";
          classe = "badge badge-danger";
        }
        $("#contentTableUser").append(
          `<tr>
            <td>${i}</td>
            <td>${elt["prenom"]} ${elt["nom"]}</td>
            <td>${elt["email"]}</td>
            <td class="text-center">
              <span class="badge badge-success">${elt["role"]}</span>
            </td>
            <td>${elt["telephone"]}</td>
            <td><span class="${classe}">${cas_}</span></td>
            <td style='display: flex;'>
              <a onclick='goWhereEdit("${elt["id"]}")'>
              <i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>
            
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
$("#next").on("click", function () {
  if (next === null) {
    alert("Dernière page");
    return;
  }
  v = next.split("?")[1];
  if (cas_user == 1) {
    url = filtre_url_user + "?" + v;
  } else {
    url = user_all + "?" + v;
  }
  if (k <= max_) {
    k = k + 1;
    code(url);
    $("#actuel").text("");
    $("#actuel").text(k);
  } else if (k == max_) {
    code(url);
    $("#actuel").text("");
    $("#actuel").text(k);
  } else {
    alert("Dernière page");
    return;
  }
});

$("#prev").on("click", function () {
  if (prev === null) {
    alert("Dernière page");
    return;
  }
  v = prev.split("?")[1];
  if (cas_user == 1) {
    url = filtre_url_user + "?" + v;
  } else {
    url = user_all + "?" + v;
  }
  if (k == 0) {
    alert("Première page");
  }
  if (k < max_ && k > 0) {
    k = k - 1;
    code(url);
    $("#actuel").text("");
    $("#actuel").text(k);
  }
  if (k == max_) {
    k = k - 1;
    code(url);
    $("#actuel").text("");
    $("#actuel").text(k);
  }
});

/*function getPrev(url_) {
  code(url_);
}

function getNext() {
  if (i < max_) {
    usr = base_local + "/admin_app/users/?page=" + i.toString();
    code(usr);
  } else {
    alert("Dernière page");
    return;
  }
}*/

function code(url_) {
  $.ajax({
    type: "GET",
    url: url_,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      $("#contentTableUser").empty();
      var cas_ = "";
      var classe = "";
      var societe = "";
      var i = 1;
      max_ = Math.round(parseInt(response["count"]) / 10) + 1;
      next = response["next"];
      prev = response["previous"];
      response["results"].forEach((elt) => {
        var id_toget = 0;
        if (elt["role"] == "Administrateur") {
          id_toget = elt["administrateur"];
        }
        if (elt["role"] == "Salarie") {
          id_toget = elt["salarie"]["id"];
        }
        if (elt["role"] == "Client particulier") {
          id_toget = elt["client"]["id"];
        }
        if (
          elt["role"] == "Agent secteur" ||
          elt["role"] == "Agent constat" ||
          elt["role"] == "Audit planneur"
        ) {
          id_toget = elt["agent"];
        }
        if (elt["role"] == "Client pro") {
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
            elt["role"] +
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
              <a  onclick='goWhereEdit(" +
            id_toget +
            ',"' +
            elt["role"] +
            '"' +
            ')\' ><i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>&nbsp;<a  onclick=\'goWhereEdit1(' +
            id_toget +
            ',"' +
            elt["role"] +
            '"' +
            ')\' ><i class="bi bi-eye" style="color: rgb(136, 102, 119)"></i></a>\
                          </td>\
                      </tr>'
        );
        i++;
      });
    },
    error: function (response) {
     
    },
  });
}
$("#filtre").on("keyup", function () {
  var val = $("#filtre").val();
  var url_ = base_local + "/admin_app/users/?value=" + val;
  code(url_);
});

function goWhereEdit(id) {
  $.cookie("id_user_edit", id);
  window.location.replace("./../utilisateurs/modifier.html");
}
