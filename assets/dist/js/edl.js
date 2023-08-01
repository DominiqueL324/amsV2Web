function getAllMyEdl() {
  $("#waiters").css("display", "inline");
  $("#table-content").css("display", "none");

  getClientOfEdl()
 
  $.ajax({
    type: "GET",
    url:
      "http://195.15.218.172/edlgateway/api/v1/planif/edl/edl/compte_client?ID=" +
      $.cookie("id_Client"),
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      $("#waiters").css("display", "none");
      $("#table-content").css("display", "block");
      
      var i = 1;
      response["results"].forEach((elt) => {
        $("#contentTableUser").append(`
          <tr>
          <td>${i}</td>
            <td>${elt["date_edl"]}</td>
            <td>${elt["type_edl"]}</td>
            <td>${elt["date_entree"]}</td>
            <td>${elt["date_sortie"]}</td> 
            <td>${elt["heure"]}</td>
            <td>${elt["avancement"]}</td>
            <td class="text-center">${Object.keys(elt["rdvs"]).length}</td>
            <td class="text-center">${Object.keys(elt["signataires"]).length}</td>
           
          </tr>
        `);
        i++;
      });
    },
    error: function (response) {
      $("#waiters").css("display", "none");
      alert("error");
    },
  });
}

function getClientOfEdl(){
  $.ajax({
    type: "GET",
    url:
      "http://195.15.218.172/edlgateway/api/v1/planif/edl/single_logement/?ID=" +
      $.cookie("id_logement_edl"),
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      $.cookie('id_logement',response.results['id'],{ path: '/' })
      $.cookie('id_Client',response.results['client']['_id'],{ path: '/' })
      $.cookie('nom_client',response.results['client']['nom'],{ path: '/' })
      $.cookie('info_logement',"Type de logement: "+response.results["type_log"]["nom"]+"; Secteur: "+response.results["secteur"]+"; Ville: "+response.results["ville"],{ path: '/' })
      $('#nomClient').text($.cookie('nom_client'));
    },
    error: function (response) {
      
    },
  });
}

function goView (id) {
  $.cookie("view_edl_id", id);
  window.location.replace("./../edl/edlLogement/view.html");
}

function getSingleLogement () {
  $("#waiters").css("display", "block");

  $.ajax({
    method: "GET",
    url: "http://195.15.218.172/edlgateway/api/v1/planif/edl/indivi?start=0&limit=0&count=0&ID=" + $.cookie("view_edl_id"),
    success: (response) => {
      
    },
    error: () => {}
  })
}

function getAllLogement () {
  $.ajax({
    method: "GET",
    url: "http://195.15.218.172/edlgateway/api/v1/planif/edl/logement/compte_client?ID=" + $.cookie("compte_client_id"),
    success: (response) => {
      
      response["results"].forEach(elt => {
        $("#logement").append(
          `<option value="${elt['_id']}"> ${elt["type_log"]["nom"]} - ${elt["ville"]} - ${elt["voie"]["nom"]} - ${elt["postal_code"]} </option>`
        )
      })
    },
    error: (response) => {
      
    }
  })
}

function formatDateEdl(date_="date"){
  return date_.split('-')[2]+"/"+date_.split('-')[1]+"/"+date_.split('-')[0]
}

function getEdlConstates() {
  
      $("#waiters").css("display", "inline");
      $("#table-content").css("display", "none");
  $.ajax({
    type: "GET",
    url: "http://195.15.218.172/edlgateway/api/v1/planif/edl/constate?start=1&limit=10&count=10&ID=1",
    headers: {
      "Authorization": "Bearer " + localStorage.getItem("token"),
      "Content-Type":"",
    },
    success: function (response) {
      $("#waiters").css("display", "none");
      $("#table-content").css("display", "block");
      
      var i = 1;
      console.log()
      response["results"].forEach((elt) => {
        $("#contentTableUser").append(`
          <tr>
          <td>${i}</td>
            <td>${elt["logement"]['client']['nom']}</td>
            <td>${elt["logement"]['type_log']['nom']}</td>
            <td>${formatDateEdl(elt["date_edl"])}  ${elt["heure"]}</td>
            <td>${elt["type_edl"]}</td>
            <td>${formatDateEdl(elt["date_entree"])}</td>
            <td>${formatDateEdl(elt["date_sortie"])}</td> 
            <td class="text-center">${Object.keys(elt["rdvs"]).length}</td>
            <td class="text-center">${Object.keys(elt["signataires"]).length}</td>
            <td class="text-center"><a href=${elt["pdf"]}><i class="fa fa-download" aria-hidden="true"></i></a></td>
          </tr>
        `);
        i++;
      });
    },
    error: function (response) {
      $("#waiters").css("display", "none");
      alert("error");
    },
  });
}
