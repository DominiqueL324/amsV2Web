var i = 1;
function getAllLogement(idClient=0) {
  $("#waiters").css("display", "inline");
  $("#table-content").css("display", "none");
  let url = ""
  if(localStorage.getItem("group").toLowerCase() === "agent secteur"){
    url = idClient != "0"
      ? "http://195.15.218.172/edlgateway/api/v1/planif/edl/logement/compte_client?ID=" + idClient
      : "http://195.15.218.172/edlgateway/api/v1/logement/by/user_id/?ID="+localStorage.getItem("id_user_logged");
  }
  
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
        //console.log(elt);
        let type_de_constat;
        if (elt["type_de_constat"] === "avenant_constat") {
          type_de_constat = "AVENANT AU CONSTAT";
        } else if (elt["type_de_constat"] === "avenant_av_travaux") {
          type_de_constat = "AVENANT AVANT TRAVAUX";
        } else if (elt["type_de_constat"] === "avenant_ap_travaux") {
          type_de_constat = "AVENANT APRES TRAVAUX";
        }
        let elT = {
          "client" : elt["client"]['_id'],
          "logement":elt["_id"]
        };
        $("#contentTableUser").append(
          `<tr>
            <td>${i}</td>
            <td>${elt["nom_de_la_voie"]} - ${elt["numero_de_la_voie"]} - ${elt["voie"]['nom']} - ${elt["postal_code"]} - ${elt["ville"]}</td>
            <td>${elt['type_log']['nom']}</td>
            <td>${type_de_constat || ""}</td>
            <td>${elt["client"]["nom"] || ""}</td>
            <td style="display: flex;">
                <a onclick=goWhereEdit("${
                  elt["_id"]
                }")><i class="bi bi-pencil" style="color: rgb(0, 0, 0)"></i></a>&nbsp;
                <a onclick=getEdlList('${elt["_id"]}','${elt["client"]['_id']}')><i class="bi bi-house" style="color: rgb(0, 0, 0)" title="Liste des Rdv EDL du logement"></i></a>
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

$('#compte_client_index').on('change',function(){
  if($('#compte_client_index').val() == "-1"){
    getAllLogement();
  }else{
    localStorage.setItem("id_Client", $('#compte_client_index').val());
    getAllLogement($('#compte_client_index').val());
  }
  
})

function goWhereEdit(id) {
  localStorage.setItem("id_logement_edit", id,{ path: '/' });
  window.location.replace("./../logements/modifier.html");
}

function getEdlList(id,id_Client) {
  
  // get the EDL list of a house 
  localStorage.setItem("id_logement_edl", id);
  localStorage.setItem("id_Client",id_Client);
  //alert()
  window.location.replace("./../edl/edlLogement/index.html");
}

async function getSingleLogement() {
  let logementId = localStorage.getItem("id_logement_edit");

  $("#form-content").css("display", "none");
  $("#waiters").css("display", "block");
  await loadConfigData();
  $.ajax({
    type: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    url:
      "http://195.15.218.172/edlgateway/api/v1/logement/single/logement/?ID=" +
      logementId,
    success: (response) => {
      
      $("#waiters").css("display", "none");
      $("#form-content").css("display", "block");

      let logement = response.results;
      localStorage.getItem("id_type_logement",logement.type_log['_id']);
      $("#compte_client").val(logement.client["nom"]).trigger("change");
      localStorage.getItem('idClient',logement.client["_id"])
      //$("#hidden_compte_client").val(logement.client["_id"]).trigger("change");
      $("#numero_de_la_voie").val(logement.numero_de_la_voie).trigger("change");
      $("#extension_de_la_voie")
        .val(logement.extenssion["_id"])
        .trigger("change");
      $("#type_de_la_voie").val(logement.voie["_id"]).trigger("change");
      $("#nom_de_la_voie").val(logement.nom_de_la_voie).trigger("change");
      $("#information_complementaire")
        .val(logement.information_complementaire)
        .trigger("change");
      $("#postal_code").val(logement.postal_code).trigger("change");
      $("#ville").val(logement.ville).trigger("change");
      $("#n_logement").val(logement.n_logement).trigger("change");
      $("#type_de_logement").val(logement.type_log["_id"]).trigger("change");
      $("#mise_en_service_le")
        .val(logement.mise_en_service_le)
        .trigger("change");
      $("#batiment").val(logement.batiment).trigger("change");
      $("#etage").val(logement.etage).trigger("change");
      $("#escalier").val(logement.etage).trigger("change");
      $("#group").val(logement.group).trigger("change");
      $("#secteur").val(logement.secteur).trigger("change");
      $("#surface").val(logement.surface).trigger("change");
      $("#code_fact").val(logement.code_fact).trigger("change");
      $("#ref_lot_client").val(logement.ref_lot_client).trigger("change");
      $("#cave").val(logement.cave).trigger("change");
      $("#parking").val(logement.parking).trigger("change");
      $("#n_porte").val(logement.n_porte).trigger("change");
      $("#code_access").val(logement.code_access).trigger("change");
      $("#autres").val(logement.autres).trigger("change");
      $("#proprietaire").val(logement.proprietaire).trigger("change");
      $("#type_de_constat").val(logement.type_de_constat).trigger("change");
      $("#compte_client_id").val(logement.client._id);
     
    },
    error: (response) => {
      $("#waiters").css("display", "none");
      $("#error-loading-data").css("display", "block");
      
    },
  });
}

function addLogement(compteclient) {
  var data = {};
  $("#go").html("Enregistrement en cours...");

  if (
    !$("#compte_client").val() ||
    !$("#numero_de_la_voie").val() ||
    !$("#extension_de_la_voie").val() ||
    !$("#type_de_la_voie").val() ||
    !$("#nom_de_la_voie").val() ||
    !$("#information_complementaire").val() ||
    !$("#postal_code").val() ||
    !$("#ville").val() ||
    !$("#n_logement").val() ||
    !$("#type_de_logement").val() ||
    !$("#mise_en_service_le").val() ||
    !$("#batiment").val() ||
    !$("#etage").val() ||
    !$("#escalier").val() ||
    !$("#group").val() ||
    !$("#secteur").val() ||
    !$("#surface").val() ||
    !$("#code_fact").val() ||
    !$("#ref_lot_client").val() ||
    !$("#cave").val() ||
    !$("#parking").val() ||
    !$("#n_porte").val() ||
    !$("#code_access").val() ||
    !$("#autres").val() ||
    !$("#proprietaire").val() ||
    !$("#type_de_constat").val()
  ) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Veuillez saisir les champs obligatoire...",
    });
    return;
  }

  //chargement info basic de l'objet à POST
  data["client"] = compteclient;
  data["numero_de_la_voie"] = $("#numero_de_la_voie").val();
  data["extenssion"] = $("#extension_de_la_voie").val();
  data["voie"] = $("#type_de_la_voie").val();
  data["nom_de_la_voie"] = $("#nom_de_la_voie").val();
  data["information_complementaire"] = $("#information_complementaire").val();
  data["postal_code"] = $("#postal_code").val();
  data["ville"] = $("#ville").val();
  data["n_logement"] = $("#n_logement").val();
  data["type_log"] = $("#type_de_logement").val();
  data["mise_en_service_le"] = $("#mise_en_service_le").val();
  data["batiment"] = $("#batiment").val();
  data["etage"] = $("#etage").val();
  data["escalier"] = $("#escalier").val();
  data["group"] = $("#group").val();
  data["secteur"] = $("#secteur").val();
  data["surface"] = $("#surface").val();
  data["code_fact"] = $("#code_fact").val();
  data["ref_lot_client"] = $("#ref_lot_client").val();
  data["cave"] = $("#cave").val();
  data["parking"] = $("#parking").val();
  data["n_porte"] = $("#n_porte").val();
  data["code_access"] = $("#code_access").val();
  data["autres"] = $("#autres").val();
  data["proprietaire"] = $("#proprietaire").val();
  data["type_de_constat"] = $("#type_de_constat").val();
  data["iduser"] = localStorage.getItem("id_user_logged");

  $.ajax({
    type: "POST",
    crossDomain: true,
    dataType: "json",
    url: "http://195.15.218.172/edlgateway/api/v1/logement/logement/add",
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
        message: "Logement crée avec succès... Redirection en cours",
      });
      setInterval(() => window.location.replace("./../logements/index.html"), 2000);
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

function editLogement(compteclient) {
  let logementId = localStorage.getItem("id_logement_edit");
  let data = {};
  $("#go").html("Enregistrement en cours...");
  if (
    !$("#compte_client").val() ||
    !$("#numero_de_la_voie").val() ||
    !$("#extension_de_la_voie").val() ||
    !$("#type_de_la_voie").val() ||
    !$("#nom_de_la_voie").val() ||
    !$("#information_complementaire").val() ||
    !$("#postal_code").val() ||
    !$("#ville").val() ||
    !$("#n_logement").val() ||
    !$("#type_de_logement").val() ||
    !$("#mise_en_service_le").val() ||
    !$("#batiment").val() ||
    !$("#etage").val() ||
    !$("#escalier").val() ||
    !$("#group").val() ||
    !$("#secteur").val() ||
    !$("#surface").val() ||
    !$("#code_fact").val() ||
    !$("#ref_lot_client").val() ||
    !$("#cave").val() ||
    !$("#parking").val() ||
    !$("#n_porte").val() ||
    !$("#code_access").val() ||
    !$("#autres").val() ||
    !$("#proprietaire").val() ||
    !$("#type_de_constat").val()
  ) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Veuillez saisir les champs obligatoire...",
    });
    return;
  }

  data["client"] = compteclient;
  data["numero_de_la_voie"] = $("#numero_de_la_voie").val();
  data["extenssion"] = $("#extension_de_la_voie").val();
  data["voie"] = $("#type_de_la_voie").val();
  data["nom_de_la_voie"] = $("#nom_de_la_voie").val();
  data["information_complementaire"] = $("#information_complementaire").val();
  data["postal_code"] = $("#postal_code").val();
  data["ville"] = $("#ville").val();
  data["n_logement"] = $("#n_logement").val();
  data["type_log"] = $("#type_de_logement").val();
  data["mise_en_service_le"] = $("#mise_en_service_le").val();
  data["batiment"] = $("#batiment").val();
  data["etage"] = $("#etage").val();
  data["escalier"] = $("#escalier").val();
  data["group"] = $("#group").val();
  data["secteur"] = $("#secteur").val();
  data["surface"] = $("#surface").val();
  data["code_fact"] = $("#code_fact").val();
  data["ref_lot_client"] = $("#ref_lot_client").val();
  data["cave"] = $("#cave").val();
  data["parking"] = $("#parking").val();
  data["n_porte"] = $("#n_porte").val();
  data["code_access"] = $("#code_access").val();
  data["autres"] = $("#autres").val();
  data["proprietaire"] = $("#proprietaire").val();
  data["type_de_constat"] = $("#type_de_constat").val();
  data["id"] = logementId;
  data["iduser"] = localStorage.getItem("id_user_logged");
  $.ajax({
    type: "PUT",
    crossDomain: true,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    url: "http://195.15.218.172/edlgateway/api/v1/logement/logement/modify",
    data: JSON.stringify(data),
    success: (response) => {
      $.toaster({
        priority: "success",
        title: "success",
        message: "Logement modifier avec succès... Redirection en cours",
      });

      setInterval(
        () => window.location.replace("./../logements/index.html"),
        2000
      );
    },
    error: (response) => {
      $("#go").html("Enregistrer");
      
    },
  });
}

async function loadConfigData() {
  // load extension
  await $.ajax({
    type: "GET",
    url: "http://195.15.218.172/edlgateway/api/v1/logement/extension/all?start=0&limit=10&count=10",
    success: (response) => {
      response["results"].forEach((elt) => {
        if(elt['status']=="on"){
          $("#extension_de_la_voie").append(`
                <option value="${elt["_id"]}">${elt["nom"]}</option>
            `);
        }
      });
    },
    error: (response) => {
      
    },
  });

  // load type de voie
  await $.ajax({
    type: "GET",
    url: "http://195.15.218.172/edlgateway/api/v1/logement/voie/all?start=0&limit=10&count=10",
    success: (response) => {
      response["results"].forEach((elt) => {
        if(elt['status']=="on"){
          $("#type_de_la_voie").append(`
                  <option value="${elt["_id"]}">${elt["nom"]}</option>
              `);
        }
      });
    },
    error: (response) => {
      
    },
  });

  // load type de logement
  await $.ajax({
    method: "GET",
    url: "http://195.15.218.172/edlgateway/api/v1/logement/type_log/all?start=0&limit=10&count=10",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    success: (response) => {
      response["results"].forEach((elt) => {
        if(elt['status']=="on"){
          $("#type_de_logement").append(`
                  <option value="${elt["_id"]}">${elt["nom"]}</option>
              `);
        }
      });
    },
    error: () => {},
  });
}

function fetchData(id) {

  $.ajax({
    method: "GET",
    url:
      "http://195.15.218.172/edlgateway/api/v1/logement/single/type_log/?ID=" +
      id,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: (response) => {
      let cles = response["results"]["cles"];
      let compteurs = response["results"]["compteurs"];
      let pieces = response["results"]["pieces"];
      
      let i = 1;

      $("#pieces_").html("");
      $("#contentTableCle").html("");
      $("#contentTableCompteur").html("");

      console.log(response)

      Object.values(cles).forEach((value, key) => {
        $("#contentTableCle").append(`
          <tr key="${key}">
            <td>${i}</td>
            <td>${value.nom}</td>
            <td>${value.description}</td>
            <td></td>
          </tr>
        `);
        i++;
      });

      let j = 1;
      Object.values(compteurs).forEach((value, key) => {
        $("#contentTableCompteur").append(`
          <tr key="${key}">
            <td>${j}</td>
            <td>${value.nom}</td>
            <td>${value.description}</td>
            <td></td>
          </tr>
        `);
        j++;
      });

      Object.values(pieces).forEach((value, key) => {
        let rubriques = JSON.stringify(value["rubriques"]);
        let className;
        className = key === 0 ? "active-piece p-piece" : "p-piece";
        $("#pieces_").append(
          `<p key="${key}" class="${className}" onclick='getRubriques(${rubriques})' style="cursor: pointer; cursor: pointer;
          padding: 10px 7px;">${value.nom}</p>`
        );
      });
      $("#rubriques_").html("");
      Object.values(Object.values(pieces)[0]["rubriques"]).forEach(
        (value, key) => {
          $("#rubriques_").append(`
          <p key="${key}" style="cursor: pointer; cursor: pointer;
          padding: 10px 7px;
          background: #f3f8fb;">
            ${value.nom}
          </p>
        `);
        }
      );

      $(".p-piece").on("click", function (e) {
        $(".p-piece").removeClass("active-piece");
        $(this).addClass("active-piece");
      });

      // localStorage.getItem("type_logement_pieces", JSON.stringify(pieces));
    },
    error: (response) => {
      
    },
  });
}

const getRubriques = (rubriques) => {
  $("#rubriques_").html("");
  Object.values(rubriques).forEach((value, key) => {
    $("#rubriques_").append(`
      <p key="${key}" style="cursor: pointer; cursor: pointer;
      padding: 10px 7px;
      background: #f3f8fb;">
        ${value.nom}
      </p>
    `);
  });
};
