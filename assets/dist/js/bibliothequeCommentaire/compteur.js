url = "http://195.15.228.250/amscommentaire/import_app/commentaires/?nature=compteur&page=1";
var page_actuelle = 0;
var total_page = 0;
var suivant=false;
var precedent=false;
var total_element_en_bd = 0
var compteur_={};

let table = [];
let page = 0;

let totalPage = 0;

function getAllCompteur() {
  $("#waiters").css("display", "inline");
  $("#table-content").css("display", "none");
  $("#contentTableUser").html("");

  let start = page * 10 + page - page;
  let end = page * 10 + 10;

  var content = "";
  var i = 1;
  $.ajax({
    type: "GET",
    url: url,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      
      $("#waiters").css("display", "none");
      $("#table-content").css("display", "block");

      //$("#precedent").attr("disabled", true);
      page_actuelle = response["info_pagination"]['current_page']
      precedent = response["info_pagination"]['has_previous']
      suivant = response["info_pagination"]['has_next']
      total_page = response["info_pagination"]['num_pages']
      total_element_en_bd = response["info_pagination"]['total_items']
      $('#page_actuelle').val('Page actuelle: '+page_actuelle.toString())
      $('#total_page').val('Total pages: '+total_page.toString())
      $('#total_data').val('Nombre total de données: '+total_element_en_bd.toString())

      table = response["results"];
      totalPage = Math.ceil(table.length / 10);
      /*if (totalPage === 1) {
        $("#suivant").attr("disabled", true);
      }*/

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
                    <span class="text-center">${elt["type"]}</span>
                </td>
                <td class="text-center">
                    <span class="text-center">${elt["commentaire"]}</span>
                </td>
               
                <td class='text-center'>
                    <span class="${className}">${value}</span>
                </td>
                <td style="display: flex;">
                    <a onclick=openEditCommentModal('${elt["id"]}') title="modifier un commentaire">
                        <i class="bi bi-pencil-square" style="color: rgb(0, 0, 0)"></i>
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
  
  if (direction === "next") {
    if(suivant==true){
     url = "http://195.15.228.250/amscommentaire/import_app/commentaires/?nature=compteur&page="+(page_actuelle+1).toString();
     getAllCompteur();
    }else{
     alert('Dernière page')
    }
 }

 if (direction === "previous") {
   if(precedent==true){
     url = "http://195.15.228.250/amscommentaire/import_app/commentaires/?nature=compteur&page="+(page_actuelle-1).toString();
     getAllCompteur();
   }else{
     alert('Première page')
   }
 }

  /*let start = page * 10 + page - page;
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
          <span class="text-center">${elt["type"]}</span>
      </td>
      <td class="text-center">
          <span class="text-center">${elt["commentaire"]}</span>
      </td>
     
      <td class='text-center'>
          <span class="${className}">${value}</span>
      </td>
      <td style="display: flex;">
          <a onclick=openEditCommentModal('${
            elt["id"]
          }') title="modifier un commentaire">
              <i class="bi bi-pencil-square" style="color: rgb(0, 0, 0)"></i>
          </a>
      </td>
      </tr>`
    );
  });*/
}

async function openEditCommentModal(id) {
  
  $("#editComment").toggleClass("show");
  $("#modify-form").css("display", "none");
  $("#loadingText").css("display", "block");

  await $.ajax({
    type: "GET",
    url: "http://195.15.228.250/amscommentaire/import_app/commentaires/" + id,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      compteur_ = response[0];
      let commentaire = response[0];

      
      $("#modify-form #commentaire").val($.trim(commentaire.commentaire));
      $("#modify-form #type").val(commentaire.type);
      $("#modify-form #nature").val(commentaire.nature);
      $("#modify-form #id").val(id);

      commentaire.status === "on"
        ? $("#status").attr("checked", true)
        : $("#status").attr("checked", false);

      return commentaire;
    },
    error: function () {},
  }).then(async function (commentaire) {
    $("#key").html("");
    $.ajax({
      type: "GET",
      url: "http://195.15.218.172/edlgateway/api/v1/compteurs/all?start=0&limit=10&count=100",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function (response) {
        $("#modify-form").css("display", "block");
        $("#loadingText").css("display", "none");

        response["results"].forEach((ele) => {
          $("#modify-form  #key").append(
            `<option value="${ele["id"]}">${ele["nom"]}</option>`
          );
        });
          $("#modify-form #key").val(compteur_['key']);
        //$("#modify-form #key").val(commentaire["results"].key_);
      },
    });
  });
}

function addComment() {
  var data = {};

  if (
    !$("#addComment #key_add").val() ||
    !$("#addComment #nature_add").val() ||
    !$("#addComment #commentaire_add").val() ||
    !$("#addComment #type_add").val()
  ) {
    
    $("#error_form").css("display", "inline");
    $("#champ_absent").css("display", "inline");
    $("#editForm").modal("hide");

    $.toaster({
      priority: "danger",
      title: "danger",
      message: "Remplicer touts les champs",
    });

    return;
  }

  data["key"] = $("#addComment #key_add").val();
  data["nature"] = $("#addComment #nature_add").val();
  data["status"] = $("#addComment #status_add").is(":checked") ? "on" : "off";
  data["commentaire"] = $("#addComment #commentaire_add").val();
  data["type"] = $("#addComment #type_add").val();
  data["numero_ordre"] = total_element_en_bd+1;
  var firstThreeChars = data['type'].toString().substring(0, 3);
  data["code"] = firstThreeChars.toString().toUpperCase()+(total_element_en_bd+1).toString();

  $.ajax({
    type: "POST",
    crossDomain: true,
    dataType: "json",
    url: "http://195.15.228.250/amscommentaire/import_app/commentaires/",
    headers: {
      //Authorization: "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      //"Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify(data),
    success: function () {
      $("input").not("#nature_add, #key_add").val("");
      $("select").prop("selectedIndex", 0);
      $("textarea").val("");
      i = 0;
      getAllCompteur();
      $.toaster({
        priority: "success",
        title: "success",
        message: "Commentaire crée avec succès.",
      });
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

function editComment() {
  var data = {};

  if (
    !$("#editComment #key").val() ||
    !$("#editComment #nature").val() ||
    !$("#editComment #commentaire").val() ||
    !$("#editComment #type").val() ||
    !$("#editComment #id").val()
  ) {
    $("#error_form").css("display", "inline");
    $("#champ_absent").css("display", "inline");
    $("#editForm").modal("hide");

    return;
  }

  data["key"] = $("#editComment #key").val();
  data["nature"] = $("#editComment #nature").val();
  data["status"] = $("#editComment #status").is(":checked") ? "on" : "off";
  data["commentaire"] = $("#editComment #commentaire").val();
  data["type"] = $("#editComment #type").val();
  data["id"] = $("#editComment #id").val();
  data["code"] = compteur_['code'];
  data["numero_ordre"] = compteur_['numero_ordre'];

  $.ajax({
    type: "PUT",
    crossDomain: true,
    dataType: "json",
    url: "http://195.15.228.250/amscommentaire/import_app/commentaires/"+data["id"].toString(),
    headers: {
      //Authorization: "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      //"Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify(data),
    success: function () {
      getAllCompteur();

      $.toaster({
        priority: "success",
        title: "success",
        message: "Commentaire modifier avec succès.",
      });
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

function goWhereEdit(id) {
  $.cookie("id_bibliotheque_commentaire_cle_edit", id);
  $("#main-content").load(
    "pages/bibliothequeLogement/cles/modifier.html",
    function () {
      $("#waiters").load("partials/spinner.html");
    }
  );
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

    $.ajax({
      type: "GET",
      url: "http://195.15.228.250/amscommentaire/import_app/commentaires/filter/?nature=compteur&to_find="+value.toString(),
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      success: function(response){
        if(response.length > 0){
        response.forEach((elt)=>{
          $("#search--results").empty();
          let htmlString = "";
          $("#search--box").css("display", "block");
            let className =
              elt.status === "on" ? "badge badge-success" : "badge badge-danger";
            let value = elt.status === "on" ? "active" : "désactivé";
            let cle = elt.cle === "cles" ? "Clés" : "";
    
            htmlString += `
              <tr>
                <td class="text-center">
                  <span class="text-center">${elt.type}</span>
                </td>
                <td class="text-center">
                  <span class="text-center">${elt.commentaire}</span>
                </td>
                <td class='text-center'>
                  <span class="${className}">${value}</span>
                </td>
                <td style="display: flex;">
                  <a onclick="openEditCommentModal('${elt.id}')" title="modifier un commentaire">
                    <i class="bi bi-pencil-square" style="color: rgb(0, 0, 0)"></i>
                  </a>
                </td>
              </tr>`;
    
          // Append the HTML strings to the table
          $("#search--results").append(htmlString);

        });
          }else{
            $("#search--box").css("display", "none");
          }
      }
    });

    // Clear previous search results
    $("#search--results").empty();

  /*if (uniqueResults.size > 0) {
     
  }*/
    /*let filteredResults = table.filter((element) => {
      const typeMatch = element.type
        .toLowerCase()
        .startsWith(value.toLowerCase());
      const commentaireMatch = element.commentaire
        .toLowerCase()
        .includes(value.toLowerCase());

      const inactiveMatch =
        value === "désactivé" && element.status.toLowerCase().includes("off");

      const activeMatch =
        value === "activé" && element.status.toLowerCase().includes("on");

      return typeMatch || commentaireMatch || activeMatch || inactiveMatch;
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
              <span class="text-center">${elt.type}</span>
            </td>
            <td class="text-center">
              <span class="text-center">${elt.commentaire}</span>
            </td>
            <td class='text-center'>
              <span class="${className}">${value}</span>
            </td>
            <td style="display: flex;">
              <a onclick="openEditCommentModal('${elt.id}')" title="modifier un commentaire">
                <i class="bi bi-pencil-square" style="color: rgb(0, 0, 0)"></i>
              </a>
            </td>
          </tr>`;
      });

      // Append the HTML strings to the table
      $("#search--results").append(htmlString);
    }*/
  } else {
    $("#search--box").css("display", "none");
  }
});

$("#search--box").css("display", "none");

$("#search--box").on("mousedown", function (e) {
  e.preventDefault();
});
