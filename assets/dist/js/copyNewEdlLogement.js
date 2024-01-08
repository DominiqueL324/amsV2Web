var i = 1;
var compte_client_id;
var utilisateurs = {};
// var param_utilisateurs = {};
var currentUser = {};

const u = new Map();

function getSingleRdv() {
  $("#waiters").css("display", "inline");
  $("#form-content").css("display", "none");

  $.ajax({
    type: "GET",
    url: online_route + "/rdv_app/rdv/" + localStorage.getItem("id_cmd_id"),
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: async function (response) {
      $("#waiters").css("display", "none");
      $("#form-content").css("display", "block");

      console.log(response);

      compte_client_id = response[0].client.id;
      let data = await getClientLogement();

      data.results.forEach((ele) => {
        $("#logement_of_edl").append(`
          <option value='${ele._id}'>TYPE DE LOGEMENT: ${ele.type_log.nom}, Secteur: ${ele.secteur}, Ville: ${ele.ville}</option>
          `);
      });

      var logement = data.results.find((elt) => {
        return elt.ref_lot_client == response[0].ref_lot;
      });
      $("#logement_of_edl").val(logement._id);
      $("#logement_of_edl").prop("disabled", "disabled");
      const bailleur = (utilisateurs["bailleur"] = {
        ...response[0].propriete.bailleur,
        id: response[0].propriete.id,
        table: "CMD",
        role: "bailleur",
      });

      // signataire_list.set(`signataire_${signataire_list.size + 1}`, signataire);
      u.set(`signataire_${u.size + 1}`, bailleur);
      const locataire = (utilisateurs["locataire"] = {
        ...response[0].propriete.locataire,
        id: response[0].propriete.id,
        table: "CMD",
        role: "locataire",
      });

      u.set(`signataire_${u.size + 1}`, locataire);

      const agentSecteur = (utilisateurs["agent_secteur"] = {
        ...response[0].agent.user,
        table: "CMD",
        role: "agent secteur",
      });

      if (agentSecteur) u.set(`signataire_${u.size + 1}`, agentSecteur);

      const agentConstat = (utilisateurs["agent_constat"] = {
        ...response[0].agent_constat,
        table: "CMD",
        role: "agent constat",
      });

      u.set(`signataire_${u.size + 1}`, agentConstat);

      // param_utilisateurs = u;

      localStorage.setItem(
        "signataire_list",
        JSON.stringify(Array.from(u.entries()))
      );

      await loadUsers();

      $("#compte_client_of_edl").val(response[0].client.ref_societe);
      // store client id in localstorage
      response[0].intervention.type === "Constat sortant"
        ? $("#type_de_edl").val("sortant")
        : $("#type_de_edl").val("entrant");
      $("#type_de_edl").attr("disabled", true);
      let date_entrant = $("#date_d_entrer");
      let date_sortant = $("#date_de_sortir");

      if (response[0].intervention.type === "Constat sortant") {
        date_sortant.attr("disabled", false);
        date_entrant.attr("disabled", false);
      } else {
        date_sortant.attr("disabled", true);
        date_entrant.attr("disabled", false);
      }

      let date = new Date(response[0].date);

      $("#edl_realiser_le").val(date.toISOString().split("T")[0]);

      $("#heure").val(date.toISOString().slice(11, 16));
    },

    error: function (response) {
      $("#waiters").css("display", "none");
      $("#form-content").css("display", "block");
    },
  });
}

async function showDefaultDropdownList() {
  u.forEach((value, key) => {
    const option = document.createElement("option");

    // Determine the name based on available properties
    let name = "";
    if (value?.prenom || value?.user?.prenom || value?.first_name) {
      name += (value?.prenom || value?.user?.prenom || value?.first_name) + " ";
    }
    if (value?.nom || value?.user?.nom || value?.last_name) {
      name += value?.nom || value?.user?.nom || value?.last_name;
    }

    // Determine the role/group
    let role = "";
    if (value?.role?.toUpperCase()) {
      role = value.role.toUpperCase();
    } else if (value?.groups[0]?.group) {
      role = value.groups[0].group;
    }
    if (
      role == "AGENT CONSTAT" ||
      role == "AGENT SECTEUR" ||
      role == "AUDIT PLANNEUR"
    ) {
      option.value = key;
      option.textContent = role + "--" + name;
      $("#nom_du_signatatire").append(option);
    }

    //option.value = key;
    //option.textContent = role + "--" + name;
    //$("#nom_du_signatatire").append(option);
  });
}

async function getClientLogement() {
  return await $.ajax({
    type: "GET",
    url: `http://195.15.218.172/edlgateway/api/v1/planif/edl/logement/compte_client?ID=${compte_client_id}`,
    success: (response) => {
      return response;
    },
    error: (error) => {
      console.log(error);
    },
  });
}

function goWhereEdit(id) {
  $.cookie("id_edl_edit", id);
  window.location.replace("./../edl/edlLogement/modifier.html");
}

function getSingleEdlLogement() {
  let edlLogementId = $.cookie("id_edl_logement_edit");

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

async function loadUser() {
  // charger tout les AC de l'utilisateur connecter. Données proviennent de CMD.
  $("#nom_du_signatatire").html();
  await $.ajax({
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    url:
      "http://195.15.218.172/manager_app/user/tri/?agent=" +
      localStorage.getItem("id_user_logged") +
      "&role=Agent%20constat",
    success: (response) => {
      let users = response["results"];

      users.forEach((elt) => {
        u.set(`signataire_${u.size + 1}`, {
          ...elt,
          role: elt.groups[0].group,
        });
      });

      // localStorage.setItem(
      //   "signataire_list",
      //   JSON.stringify(Array.from(u.entries()))
      // );
    },
    error: (response) => {},
  });
}

async function loadParticipants() {
  // charger les participant creer par l'utilisateur connecté. Données proviennent de AMSV2
  url =
    "http://195.15.218.172/edlgateway/api/v1/planif/edl/signataire/particpant/?ID=";
  $.ajax({
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
    url:
      "http://195.15.218.172/edlgateway/api/v1/participant/client/indivi/tous?ID=" +
      compte_client_id,
    success: (response) => {
      let users = response["results"];

      users.forEach((elt) => {
        u.set(`signataire_${u.size + 1}`, elt);
      });
    },
    error: (response) => {},
  });
}

async function loadUsers() {
  await loadParticipants();
  await loadUser();
  showDefaultDropdownList();
  await renderSignataireList();
}

async function getLoggedUserData() {
  let racine = "http://195.15.218.172";
  let user_id = localStorage.getItem("id_user_logged");
  let role = localStorage.getItem("group");
  let url = "";
  if (role == "Agent secteur" || role == "Agent constat") {
    url = racine + "/agent_app/agent/" + user_id;
  }

  if (role == "Administrateur") {
    url = racine + "/admin_app/admin/" + user_id;
  }

  await $.ajax({
    type: "GET",
    url: url,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      currentUser = response[0];
    },
    error: function () {},
  });
}

getLoggedUserData();

function loadSignataires() {
  $.ajax({
    method: "GET",
    url:
      "http://195.15.218.172/edlgateway/api/v1/planif/edl/part/?ID=" +
      localStorage.getItem("id_user_logged"),
    headers: {
      Authorization: localStorage.getItem("token"),
    },
    success: (response) => {
      response["results"].forEach((elt) => {
        // $("#nom_du_signatatire").append(`
        // <option value="${elt["id"]}">${elt["nom"]}</option>
        // `);
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
    !$("#type_de_edl").val()
    // !$("#date_d_entrer").val() ||
    // !$("#date_de_sortir").val() ||
    // !$("#motif").val()
  ) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Veuillez saisir les champs obligatoire...Fiche EDL",
    });
    $("#go").html("Enregistrer");
    return;
  }

  if (!$("#logement_of_edl").val()) {
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Veuiller ajouter un logement.",
    });
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

  const splittedArrays = Array.from(rdv_edl_signataire.values()).map(
    (obj) => obj.role
  );

  const existsLocataire = splittedArrays.some(
    (str) => str.trim() === "locataire"
  );

  if (!existsLocataire) {
    $("#go").html("Enregistrer");
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Vous devez ajouter un Locataire pour creer un EDL.",
    });
    return;
  }
  if (rdv_edl_list.size < 1) {
    $("#go").html("Enregistrer");
    $.toaster({
      priority: "danger",
      title: "error",
      message: "Au moin 1 rdv est requise pour un EDL...RDV",
    });
    return;
  }
  $("#go").attr("disabled", true);
  data["date_edl"] = $("#edl_realiser_le").val();
  data["heure"] = $("#heure").val();
  data["type_edl"] = $("#type_de_edl").val();
  data["date_entree"] = $("#date_d_entrer").val();
  data["date_sortie"] = $("#date_de_sortir").val();
  data["motif_depart"] = $("#motif").val();
  data["logement"] = $("#logement_of_edl").val();
  data["rdvs"] = Object.fromEntries(rdv_edl_list);
  data["signataires"] = Object.fromEntries(rdv_edl_signataire);
  data["avancement"] = $("#avancement").val();
  data["created_by"] = currentUser;
  data["id_cmd_id"] = localStorage.getItem("id_cmd_id");

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
    success: () => {
      $("#go").html("Enregistrer");
      $("#go").attr("disabled", false);
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
        () => window.location.replace("./../../rdv/index.html"),
        3000
      );
    },
    error: (response) => {
      $("#go").attr("disabled", false);
      $("#go").html("Enregistrer");
    },
  });
}

function goWhereEdit(id) {
  $.cookie("id_edl_logement_edit", id);
  window.location.replace("./../edl/edlLogement/modifier.html");
}

function getSingleEdlLogement() {
  let edl_logement_edit_id = $.cookie("id_edl_logement_edit");

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

  if ($.cookie("rdv_edl_list")) {
    rdv_edl_list = new Map(JSON.parse($.cookie("rdv_edl_list")));
  } else {
    rdv_edl_list = new Map();
  }

  if ($.cookie("rdv_edl_signataire")) {
    rdv_edl_signataire = new Map(JSON.parse($.cookie("rdv_edl_signataire")));
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
          (value["intervenant"]["prenom"] ||
            value["intervenant"]["user"]["prenom"] ||
            value["intervenant"]["first_name"]) +
          "  " +
          (value["intervenant"]["nom"] || value["intervenant"]["user"]["nom"])
        }</td>
        <td>${value["avancement"].split("_").join(" ").toUpperCase()}</td>
        <td>${value["motif_annulation"]}</td>
        <td><i class="bi bi-trash3" onclick="deleteRdv('${key}')"></i></td>
    </tr>
  `);
    i++;
  });
}

function addRdv() {
  console.log("hmmm");
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

  console.log(signataire_list.get($("#intervenant").val()));

  rdv_edl["intervenant"] = signataire_list.get($("#intervenant").val());

  var exists = Array.from(rdv_edl_list.values()).some(function (item) {
    return JSON.stringify(item) === JSON.stringify(rdv_edl);
  });

  if (!exists) {
    rdv_edl_list.set(`rdv_${rdv_edl_list.size + 1}`, rdv_edl);
    localStorage.setItem(
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

async function renderSignataireList() {
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
    const prenom =
      value["prenom"]?.toString() ||
      value["user"]?.prenom ||
      value["first_name"]?.toString() ||
      "";
    const nom =
      value["nom"]?.toString() ||
      value["user"]?.nom ||
      value["last_name"]?.toString() ||
      "";
    const role =
      value["role"]?.toString().split("_").join(" ").toUpperCase() || "";

    const table = value["table"]?.toString();
    const roles = ["bailleur", "locataire"];
    $("#signataire_list_tbody").append(`
      <tr>
        <td>${i}</td>
        <td>${prenom} ${nom}</td>
        <td>${role}</td>
        <td>${
          roles.includes(role.toLowerCase()) && table === "CMD"
            ? ""
            : `<i class="bi bi-trash3" onclick="deleteSignataire('${key}')"></i>`
        }</td>
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
    console.log(value);
    if (value.role == "agent secteur" || value.role == "agent constat") {
      $("#intervenant").append(
        `<option value="${key}">${
          value["nom"] || value["last_name"] || value["user"]["nom"]
        }</option>`
      );
    }
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

  let signataire = {};

  signataire = u.get($("#nom_du_signatatire"));

  var exists = Array.from(signataire_list.values()).some(function (item) {
    return JSON.stringify(item) === JSON.stringify(signataire);
  });

  const roleExist = doesRoleExist(
    u.get($("#nom_du_signatatire").val()).role.toLowerCase()
  );

  if (roleExist) {
    $.toaster({
      priority: "danger",
      title: "danger",
      message: `Le rôle ${u
        .get($("#nom_du_signatatire").val())
        .role.toUpperCase()} existe déjà parmis les signataire.`,
    });
    return;
  }

  var ExistAC = Array.from(signataire_list.values()).some(function (val) {
    return (
      val["role"].toString().toLowerCase() === "Agent constat".toLowerCase()
    );
  });

  if (ExistAC) {
    $.toaster({
      priority: "danger",
      title: "danger",
      message: "Un agent de constat est obligatoire",
    });
    return;
  }

  if (!exists) {
    signataire_list.set(
      `signataire_${signataire_list.size + 1}`,
      u.get($("#nom_du_signatatire").val())
    );
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

  return;
}

function doesRoleExist(roleToCheck) {
  const signataires = new Map(
    JSON.parse(localStorage.getItem("signataire_list"))
  );
  for (const [key, value] of signataires) {
    if (value.role === roleToCheck) {
      return true; // Role exists
    }
  }
  return false; // Role does not exist
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
