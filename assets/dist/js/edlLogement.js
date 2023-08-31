var i = 1;
function getAllEDLLogement() {
  $("#waiters").css("display", "inline");
  $("#table-content").css("display", "none");

  $.ajax({
    type: "GET",
    url: "http://195.15.218.172/edlgateway/api/v1/planif/rdv/all?start=1&limit=10&count=10&category=1",
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
                <td>${elt["ref"]}</td>
                <td>${elt["type_edl"]}</td>
                <td>${elt["date_edl"]}</td>
                <td>${elt["date_entree"]}</td>
                <td>${elt["date_sortie"]}</td>
                <td>${elt["motif_depart"]}</td>
                <td style="display: flex;">
                    <a onclick=goWhereEdit("${elt["id"]}")><i class="bi bi-pencil" style="color: rgb(0, 0, 0)"></i></a>
                </td>
              </tr>`
        );
        i++;
      });
    },

    error: function (response) {
      $("#waiters").css("display", "none");
      $("#table-content").css("display", "block");
    },
  });
}

function goWhereEdit(id) {
  localStorage.setItem("id_edl_edit", id);
  window.location.replace("./../edl/edlLogement/modifier.html");
}

function getSingleEdlLogement() {
  let edlLogementId = localStorage.getItem("id_edl_logement_edit");

  $("#form-content").css("display", "none");
  $("#waiters").css("display", "block");

  $.ajax({
    type: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    url:
      "http://195.15.218.172/edlgateway/api/v1/single/edl/logement/?ID=" +
      edlLogementId,
    success: (response) => {
      $("#waiters").css("display", "none");
      $("#form-content").css("display", "block");

      let edlLogement = response.results;
    },
    error: (response) => {
      $("#waiters").css("display", "none");
      $("#error-loading-data").css("display", "block");
    },
  });
}

function loadSignataires() {
  $.ajax({
    method: "GET",
    url:
      "http://195.15.218.172/edlgateway/api/v1/planif/edl/part/?ID=" +
      localStorage.getItem("id_Client"),
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    success: (response) => {
      response["results"].forEach((elt) => {
        $("#nom_du_signatatire").append(`
        <option value="${elt["id"]}">${elt["nom"]}</option>
        `);
      });
    },
    error: (response) => {},
  });
}

function addEDLLogement() {
  var data = {};
  $("#go").html("Enregistrement en cours...");

  let rdv_edl_list;
  let rdv_edl_signataire;
  let intervenant;

  if (localStorage.getItem("rdv_edl_list")) {
    rdv_edl_list = new Map(JSON.parse(localStorage.getItem("rdv_edl_list")));
  } else {
    rdv_edl_list = new Map();
  }

  if (localStorage.getItem("signataire_list")) {
    rdv_edl_signataire = new Map(
      JSON.parse(localStorage.getItem("signataire_list"))
    );
  } else {
    rdv_edl_signataire = new Map();
  }

  if (localStorage.getItem("intervenant")) {
    intervenant = JSON.parse(localStorage.getItem("intervenant"));
  }

  if (
    !$("#edl_realiser_le").val() ||
    !$("#heure").val() ||
    !$("#type_de_edl").val() ||
    !$("#date_d_entrer").val() ||
    !$("#date_de_sortir").val() ||
    !$("#motif").val()
  ) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Veuillez saisir les champs obligatoire...Fiche EDL",
    });
    $("#go").html("Enregistrer");
    return;
  }

  if (rdv_edl_signataire.size < 2) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Au moin 2 signataire sont requises pour un EDL...Signataire",
    });
    $("#go").html("Enregistrer");
    return;
  }

  const splittedArrays = Array.from(rdv_edl_signataire.values()).map((obj) =>
    obj.nom.split("___")
  );
  const lastArray = splittedArrays[splittedArrays.length - 1];
  const existsLocataire = lastArray.some((str) => str.trim() === "locataire");

  if (!existsLocataire) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Vous devez ajouter un Locataire pour creer un EDL.",
    });
    return;
  }
  if (rdv_edl_list.size < 1) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Au moin 1 rdv est requise pour un EDL...RDV",
    });
    return;
  }

  data["date_edl"] = $("#edl_realiser_le").val();
  data["heure"] = $("#heure").val();
  data["type_edl"] = $("#type_de_edl").val();
  data["date_entree"] = $("#date_d_entrer").val();
  data["date_sortie"] = $("#date_de_sortir").val();
  data["motif_depart"] = $("#motif").val();
  data["logement"] = localStorage.getItem("id_logement_edl");
  data["rdvs"] = Object.fromEntries(rdv_edl_list);
  data["signataires"] = Object.fromEntries(rdv_edl_signataire);
  data["avancement"] = $("#avancement").val();
  data["created_by"] = localStorage.getItem("id_user_logged");

  $.ajax({
    method: "POST",
    url: "http://195.15.218.172/edlgateway/api/v1/planif/edl/add",
    crossDomain: true,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify(data),
    success: async () => {
      $("#go").html("Enregistrer");
      $.ajax({
        method: "PUT",
        url: `http://195.15.218.172/rdv_app/rdv/${localStorage.getItem(
          "id_cmd_id"
        )}`,
        crossDomain: true,
        dataType: "json",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        data: JSON.stringify({
          edl: "1",
        }),
        success: () => {
          $.toaster({
            priority: "success",
            title: "success",
            message: "EDL crée avec succès... Redirection en cours",
          });

          if (localStorage.getItem("rdv_edl_list"))
            localStorage.getItem("rdv_edl_list");
          if (localStorage.getItem("signataire_list"))
            localStorage.getItem("signataire_list");
          if (localStorage.getItem("intervenant"))
            localStorage.getItem("intervenant");

          setInterval(
            () => window.location.replace("./../../../rdv/index.html"),
            3000
          );
        },
      });
    },
    error: (response) => {
      $("#go").html("Enregistrer");
    },
  });
}



function goWhereEdit(id) {
  localStorage.getItem("id_edl_logement_edit", id);
  window.location.replace("./../edl/edlLogement/modifier.html");
}

function getSingleEdlLogement() {
  let edl_logement_edit_id = localStorage.getItem("id_edl_logement_edit");

  $.ajax({
    method: "GET",
    url: "",
    success: (response) => {
      let edl = response["result"];
    },
    error: () => {},
  });
}

function editEDLLogement() {
  var data = {};
  $("#go").html("Enregistrement en cours...");

  let rdv_edl_list;
  let rdv_edl_signataire;

  if (localStorage.getItem("rdv_edl_list")) {
    rdv_edl_list = new Map(JSON.parse(localStorage.getItem("rdv_edl_list")));
  } else {
    rdv_edl_list = new Map();
  }

  if (localStorage.getItem("rdv_edl_signataire")) {
    rdv_edl_signataire = new Map(
      JSON.parse(localStorage.getItem("rdv_edl_signataire"))
    );
  } else {
    rdv_edl_signataire = new Map();
  }

  if (
    $("#edl_realiser_le").val() ||
    $("#heure").val() ||
    $("#type_de_edl").val() ||
    $("#date_d_entrer").val() ||
    $("#date_de_sortir").val() ||
    $("#motif").val()
  ) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Veuillez saisir les champs obligatoire...",
    });
    return;
  }

  if (rdv_edl_signataire.size < 2) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Au moin 2 signataire sont requises pour un EDL...",
    });
    return;
  }

  if (rdv_edl_list.size < 1) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Au moin 1 rdv est requise pour un EDL...",
    });
    return;
  }

  data["date_edl"] = $("#edl_realiser_le").val();
  data["heure"] = $("#heure").val();
  data["type_edl"] = $("#type_de_edl").val();
  data["date_entree"] = $("#date_d_entrer").val();
  data["date_sortie"] = $("#date_de_sortir").val();
  data["motif_depart"] = $("#motif").val();
  data["logement"] = "";
  data["rdvs"] = rdv_edl_list;
  data["signataires"] = rdv_edl_signataire;
  data["user"] = "";

  $.ajax({
    method: "POST",
    url: "",
    crossDomain: true,
    dataType: "json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    data: JSON.stringify(data),
    success: () => {},
    error: () => {},
  });
}

function renderRdvList() {
  $("#rdv_edl_list_tbody").html("");
  let edl_list = new Map();

  if (localStorage.getItem("rdv_edl_list")) {
    edl_list = new Map(JSON.parse(localStorage.getItem("rdv_edl_list")));
  }

  if (edl_list.size === 0) {
    $("#rdv_edl_list").css("display", "none");
    return;
  }
  $("#rdv_edl_list").css("display", "block");
  var i = 1;

  edl_list.forEach((value, key) => {
    $("#rdv_edl_list_tbody").append(`
  <tr>
      <td>${i}</td>
      <td>${value["date"]} - ${value["heure"]}</td>
      <td>${
        value["intervenant"]["nom"].split("___")[0].toString() +
          "  " +
          value["intervenant"]["nom"].split("___")[1].toString() || ""
      }</td>
      <td>${value["avancement"]}</td>
      <td>${value["motif_annulation"]}</td>
      <td> <i class="bi bi-trash3" onclick="deleteRdv('${key}')"></i> </td>
  </tr>
`);
    i++;
  });
}

function addRdv() {
  let rdv_edl_list;
  if (localStorage.getItem("rdv_edl_list")) {
    rdv_edl_list = new Map(JSON.parse(localStorage.getItem("rdv_edl_list")));
  } else {
    rdv_edl_list = new Map();
  }

  if (
    !$("#date_rdv").val() ||
    !$("#heure_rdv").val() ||
    !$("#avancement_rdv").val() ||
    !$("#motif_annulation").val()
  ) {
    $.toaster({
      priority: "danger",
      title: "danger",
      message: "Veuiller saisir tous les champs",
    });

    return;
  }
  let rdv_edl = {};

  rdv_edl["avancement"] = $("#avancement_rdv").val();
  rdv_edl["motif_annulation"] = $("#motif_annulation").val();

  rdv_edl["date"] = $("#date_rdv").val();
  rdv_edl["heure"] = $("#heure_rdv").val();

  signataire_list = new Map(
    JSON.parse(localStorage.getItem("signataire_list"))
  );

  let table = signataire_list.get($("#intervenant").val())["table"];
  let id = signataire_list.get($("#intervenant").val())["id"];
  let nom = signataire_list.get($("#intervenant").val())["nom"];

  data = { table: table, id: id, nom: nom };
  rdv_edl["intervenant"] = data;

  var exists = Array.from(rdv_edl_list.values()).some(function (item) {
    return JSON.stringify(item) === JSON.stringify(rdv_edl);
  });

  if (!exists) {
    rdv_edl_list.set(`rdv_${rdv_edl_list.size + 1}`, rdv_edl);
    localStorage.getItem(
      "rdv_edl_list",
      JSON.stringify(Array.from(rdv_edl_list.entries()))
    );
    $("#date_rdv").val("");
    $("#heure_rdv").val("");
    $("#motif_annulation").val("");
    $("#avancement_rdv").val("annuler");
  } else {
    $.toaster({
      priority: "danger",
      title: "danger",
      message: "Ce rdv existe déjà",
    });
  }
}

function deleteRdv(key) {
  let edl_list = new Map();
  if (localStorage.getItem("rdv_edl_list")) {
    edl_list = new Map(JSON.parse(localStorage.getItem("rdv_edl_list")));
  }
  edl_list.delete(key);
  localStorage.setItem(
    "rdv_edl_list",
    JSON.stringify(Array.from(edl_list.entries()))
  );

  renderRdvList();
}

function renderSignataireList() {
  $("#signataire_list_tbody").html("");
  let signataire_list = new Map();

  if (localStorage.getItem("signataire_list")) {
    signataire_list = new Map(
      JSON.parse(localStorage.getItem("signataire_list"))
    );
  }

  if (signataire_list.size === 0) {
    $("#signataire_list").css("display", "none");
    return;
  }
  renderIntervenantOption();
  $("#signataire_list").css("display", "block");
  var i = 1;

  signataire_list.forEach((value, key) => {
    $("#signataire_list_tbody").append(`
  <tr>
      <td>${i}</td>
      <td>${value["nom"].split("___")[0].toString() || ""}</td>
      <td>${value["nom"].split("___")[1].toString()}</td>
      <td> <i class="bi bi-trash3" onclick="deleteSignataire('${key}')"></i> </td>
  </tr>
`);
    i++;
  });
}

function renderIntervenantOption() {
  $("#intervenant").html("");
  let signataire_list = new Map();

  if (localStorage.getItem("signataire_list")) {
    signataire_list = new Map(
      JSON.parse(localStorage.getItem("signataire_list"))
    );
  }

  if (signataire_list.size === 0) {
    $("#intervenant").html("");
    return;
  }

  signataire_list.forEach((value, key) => {
    $("#intervenant").append(`<option value="${key}">${value["nom"]}</option>`);
  });
}

function addSignataire() {
  let signataire_list;
  if (localStorage.getItem("signataire_list")) {
    signataire_list = new Map(
      JSON.parse(localStorage.getItem("signataire_list"))
    );
  } else {
    signataire_list = new Map();
  }

  if (!$("#role").val() || !$("#nom_du_signatatire").val()) {
    $.toaster({
      priority: "danger",
      title: "danger",
      message: "Veuiller saisir tous les champs",
    });

    return;
  }
  let signataire = {};

  signataire["table"] = $.trim($("#role").val().toLowerCase());
  signataire["id"] = $.trim($("#nom_du_signatatire").val());
  signataire["nom"] = $.trim(
    $("#nom_du_signatatire").find("option:selected").text()
  );

  var exists = Array.from(signataire_list.values()).some(function (item) {
    return JSON.stringify(item) === JSON.stringify(signataire);
  });

  var role = signataire["nom"].split("___")[1].toString();
  var ExistAC = Array.from(signataire_list.values()).some(function (val) {
    return (
      val["nom"].split("___")[1].toString() === role &&
      role === " Agent constat"
    );
  });
  if (ExistAC) {
    $.toaster({
      priority: "danger",
      title: "danger",
      message: "Un agent de constat est déjà présent",
    });
    return;
  }

  if (!exists) {
    signataire_list.set(`signataire_${signataire_list.size + 1}`, signataire);
    localStorage.setItem(
      "signataire_list",
      JSON.stringify(Array.from(signataire_list.entries()))
    );
  } else {
    $.toaster({
      priority: "danger",
      title: "danger",
      message: "Ce signataire existe déjà",
    });
  }
}

function deleteSignataire(key) {
  let signataire_list = new Map();
  if (localStorage.getItem("signataire_list")) {
    signataire_list = new Map(
      JSON.parse(localStorage.getItem("signataire_list"))
    );
  }
  signataire_list.delete(key);
  localStorage.setItem(
    "signataire_list",
    JSON.stringify(Array.from(signataire_list.entries()))
  );
  renderSignataireList();
}
