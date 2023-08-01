url =
  "http://195.15.218.172/edlgateway/api/v1/clefs/all?start=0&limit=1&count=10";

var i = 1;
let table = [];
let page = 0;

let totalPage = 0;
let currentPage = 1;

function getAllCle() {
  $("#waiters").css("display", "inline");
  $("#table-content").css("display", "none");

  let start = page * 10 + page - page;
  let end = page * 10 + page + 10;

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
      $("#precedent").attr("disabled", true);
      
      table = response["results"];
       table.sort(function (a, b) {
         var nameA = a.nom.toUpperCase(); // Convert names to uppercase for case-insensitive sorting
         var nameB = b.nom.toUpperCase();
         if (nameA < nameB) {
           return -1; // nameA comes before nameB
         }
         if (nameA > nameB) {
           return 1; // nameA comes after nameB
         }
         return 0; // names are equal
       });
      totalPage = Math.ceil(table.length / 10);
      $('#page_actuelle').val('Page actuelle: '+currentPage.toString())
      $('#total_page').val('Total pages: '+totalPage.toString())
      $('#total_data').val('Nombre total de données: '+table.length.toString())
      if (totalPage === 1) {
        $("#suivant").attr("disabled", true);
      }
      table.slice(start, end).forEach((elt) => {
        let className = "";
        let value = "";

        if (elt["status"] === "on") {
          className = "badge badge-success";
          value = "active";
        } else {
          className = "badge badge-danger";
          value = "désactivé";
        }

        $("#contentTableUser").append(
          `<tr>
                <td>${i}</td>
                <td class="text-center">
                    <span class="text-center">${elt["nom"]}</span>
                </td>
                <td class='text-center'>
                    ${elt["description"]}
                </td>
                <td class='text-center'>
                    <span class="${className}">${value}</span>
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

function paginate(direction) {
  if (direction === "next" && page <= totalPage) {
    page = page + 1;
    currentPage++
    $('#page_actuelle').val('Page actuelle: '+currentPage.toString())
    if (page === totalPage - 1) {
      $("#suivant").attr("disabled", true);
      $("#precedent").attr("disabled", false);
    } else {
      $("#suivant").attr("disabled", false);
      $("#precedent").attr("disabled", false);
    }
  }

  if (direction === "previous") {
    page = page - 1;
    currentPage--;
    $('#page_actuelle').val('Page actuelle: '+currentPage.toString())
    if (page === 0 && page + 1 < totalPage) {
      $("#suivant").attr("disabled", false);
      $("#precedent").attr("disabled", true);
    }
  }

  let start = page * 10 + page - page;
  let end = page * 10 + 10;

  $("#contentTableUser").html("");

  table.slice(start, end).forEach((elt, index) => {
    let className = "";
    let value = "";
    let cle = "";

    if (elt["status"] === "on") {
      className = "badge badge-success";
      value = "active";
    } else {
      className = "badge badge-danger";
      value = "désactivé";
    }

    if (elt["cle"] === "cles") {
      cle = "Clés";
    }

    $("#contentTableUser").append(
      `<tr>
                <td>${start + index + 1}</td>
                <td class="text-center">
                    <span class="text-center">${elt["nom"]}</span>
                </td>
                <td class='text-center'>
                    ${elt["description"]}
                </td>
                <td class='text-center'>
                    <span class="${className}">${value}</span>
                </td>
                <td style="display: flex;">
                    <a onclick=goWhereEdit('${elt["id"]}')>
                        <i class="bi bi-pencil" style="color: rgb(0, 0, 0)"></i>
                    </a>
                </td>
            </tr>`
    );
  });
}

function goWhereEdit(id) {
  $.cookie("id_bibliotheque_compteur_edit", id);
  window.location.replace("./../../bibliothequeLogement/cles/modifier.html");
}

function addCle() {
  $("#go").html("Enregistrement en cours...");

  var data = {};

  if (!$("#nom").val() || !$("#description").val() || !$("#status").val()) {
    $("#error_form").css("display", "inline");
    $("#champ_absent").css("display", "inline");
    $("#editForm").modal("hide");
    return;
  }

  //chargement info basic de l'objet à POST
  data["nom"] = $("#nom").val();
  data["description"] = $("#description").val();
  data["status"] = $("#status").is(":checked") ? "on" : "off";
  data["numero_d_ordre"] = $("#numero_d_ordre").val();

  $.ajax({
    type: "POST",
    crossDomain: true,
    dataType: "json",
    url: "http://195.15.218.172/edlgateway/api/v1/clefs/add",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify(data),
    success: function () {
      $("input").empty();
      $("select").empty();
      $("#go").html("Enregistrer");
      $.toaster({
        priority: "success",
        title: "success",
        message: "Clé crée avec succès...Redirection en cours...",
      });
      setInterval(
        () =>
          window.location.replace(
            "./../../bibliothequeLogement/cles/index.html"
          ),
        2000
      );
    },
    error: function () {
      $.toaster({
        priority: "error",
        title: "error",
        message: "Une erreur c'est produite.",
      });
    },
  });
}

function getSingleCle() {
  let rubriqueId = $.cookie("id_bibliotheque_compteur_edit");

  $("#form-content").css("display", "none");

  $.ajax({
    type: "GET",
    url:
      "http://195.15.218.172/edlgateway/api/v1/single/clefs/?ID=" + rubriqueId,
    success: (response) => {
      $("#waiters").css("display", "none");
      $("#form-content").css("display", "block");

      let compteur = response.results;

      $("#nom").val(compteur.nom).trigger("change");
      $("#description").val(compteur.description).trigger("change");
      $("#numero_d_ordre").val(compteur.numero_d_ordre).trigger("change");

      if (compteur.status === "on")
        $("#status").attr("checked", true).trigger("change");
    },
    error: (response) => {
    },
  });
}

function editCle() {
  $("#go").html("Enregistrement en cours...");

  var data = {};

  if (!$("#nom").val() || !$("#description").val() || !$("#status").val()) {
    $("#error_form").css("display", "inline");
    $("#champ_absent").css("display", "inline");
    $("#editForm").modal("hide");
    return;
  }

  //chargement info basic de l'objet à POST
  data["nom"] = $("#nom").val();
  data["description"] = $("#description").val();
  data["status"] = $("#status").is(":checked") ? "on" : "off";
  data["numero_d_ordre"] = $("#numero_d_ordre").val();

  data["numero_d_ordre"] = $("#numero_d_ordre").val();

  data["id"] = $.cookie("id_bibliotheque_compteur_edit");

  $.ajax({
    type: "PUT",
    crossDomain: true,
    dataType: "json",
    url: "http://195.15.218.172/edlgateway/api/v1/clefs/modify",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify(data),
    success: function () {
      $("#go").html("Enregistrer");

      $.toaster({
        priority: "success",
        title: "success",
        message: "Clé crée avec succès...Redirection en cours...",
      });

      setInterval(
        () =>
          window.location.replace(
            "./../../bibliothequeLogement/cles/index.html"
          ),
        2000
      );
    },
    error: function () {
      $.toaster({
        priority: "danger",
        title: "danger",
        message: "Une erreur c'est produite.",
      });
    },
  });
}


function filter(event) {
  let value = event.target.value;
  if (value.length > 3) {
    let searchResult = table.filter((element, index) => {
      return element.type === value || element.commentaire === value;
    });
  }
}

$("#search--input").on("blur", function () {
  $("#search--box").css("display", "none");
});

$("#search--input").on("input", function (e) {
  let value = e.target.value;
  let activeMatch;
  let inactiveMatch;

  if (value.length > 2) {
     let filteredResults = table.filter((element) => {
       const nomMatch = element.nom
         .toLowerCase()
         .startsWith(value.toLowerCase());
       const descriptionMatch = element.description
         .toLowerCase()
         .includes(value.toLowerCase());

       const inactiveMatch =
         value === "désactivé" && element.status.toLowerCase().includes("off");

       const activeMatch =
         value === "activé" && element.status.toLowerCase().includes("on");

       return nomMatch || descriptionMatch || activeMatch || inactiveMatch;
     });

    // Create a Set to store unique objects
    let uniqueResults = new Set();

    filteredResults.forEach((elt) => {
      uniqueResults.add(elt);
    });

    // Clear previous search results
    $("#search--results").empty();

    if (uniqueResults.size > 0) {
      let htmlString = "";
      $("#search--box").css("display", "block");

      uniqueResults.forEach((elt) => {
        let className =
          elt.status === "on" ? "badge badge-success" : "badge badge-danger";
        let value = elt.status === "on" ? "active" : "désactivé";
        let cle = elt.cle === "cles" ? "Clés" : "";

        htmlString += `
          <tr>
            <td class="text-center">
              <span class="text-center">${elt.nom}</span>
            </td>
            <td class="text-center">
              <span class="text-center">${elt.description}</span>
            </td>
            <td class='text-center'>
              <span class="${className}">${value}</span>
            </td>
            <td style="display: flex;">
              <a onclick="goWhereEdit('${elt.id}')" title="modifier un commentaire">
                <i class="bi bi-pencil-square" style="color: rgb(0, 0, 0)"></i>
              </a>
            </td>
          </tr>`;
      });

      // Append the HTML strings to the table
      $("#search--results").append(htmlString);
    }
  } else {
    $("#search--box").css("display", "none");
  }
});

$("#search--box").css("display", "none");

$("#search--box").on("mousedown", function (e) {
  e.preventDefault();
});