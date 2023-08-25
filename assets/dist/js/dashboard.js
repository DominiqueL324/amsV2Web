evt = [];
function configCal() {
  calendarEl = document.getElementById("calendar");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locales: "fr",
    themeSystem: "bootstrap",
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    selectable: true,
    nowIndicator: true,
    dayMaxEvents: true,
    headerToolbar: {
      left: "prev,next",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    datesSet: function (info) {
      evt = getEvent(info.startStr.split("T")[0], info.endStr.split("T")[0]);
      $(".fc-dayGridMonth-button").text(" ");
      $(".fc-dayGridMonth-button").text("Mois");
      $(".fc-timeGridDay-button").text(" ");
      $(".fc-timeGridDay-button").text("Jours");
      $(".fc-timeGridWeek-button").text(" ");
      $(".fc-timeGridWeek-button").text("Semaine");
      $(".fc-timegrid-axis-cushion").css("display", "none");

      $(".fc-today-button").text(" ");
      $(".fc-today-button").text("Aujourd'hui");
    },
    eventMouseEnter: function (info) {
      tooltip =
        '<div class="tooltiptopicevent" style="opacity:1;width:auto;height:auto;background:#feb811;position:absolute;z-index:10001;padding:10px 10px 10px 10px ;  line-height: 200%;">' +
        "RDV: " +
        ": " +
        info.event.title +
        "</br>" +
        "Date: " +
        ": " +
        info.event.start +
        "</div>";

      $("body").append(tooltip);
      $(this)
        .mouseover(function (e) {
          $(this).css("z-index", 1);
          $(".tooltiptopicevent").fadeIn("500");
          $(".tooltiptopicevent").fadeTo("10", 1.9);
        })
        .mousemove(function (e) {
          $(".tooltiptopicevent").css("top", e.pageY + 10);
          $(".tooltiptopicevent").css("left", e.pageX + 20);
        });
    },
    eventMouseLeave: function (data, event, view) {
      $(this).css("z-index", 8);
      $(".tooltiptopicevent").remove();
    },
    eventClick: function (arg) {
      //$.cookie("rdv_to_edit", arg.event._def.publicId);
      //window.location.replace("edit_rdv.html");
    },
    eventRender: function (info) {
      var tooltip = new Tooltip(info.el, {
        title: info.event.extendedProps.description,
        placement: "top",
        trigger: "hover",
        container: "body",
      });
    },
  });

  calendar.render();
}
function getEvent(debut, fin) {
  let url_ ="";
  let role = localStorage.getItem('group');
  let user_id = localStorage.getItem("id_user_logged");
  if(role=="Administrateur"){
      url_ = "http://195.15.218.172/edlgateway/api/v1/planif/edl/all?start=12&limit=12&count=12";
  }
  if(role=="Agent secteur"){
    // url_ = "http://195.15.218.172/edlgateway/api/v1/planif/edl/part/?ID=" + user_id;
    url_ = "http://195.15.218.172/rdv_app/rdv/?paginated=t";
  }

  calendar.removeAllEvents();
  $("#waiters").css("display","inline")
  $.ajax({
    type: "GET",
    url: url_,
    data: { debut: debut, fin: fin },
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    success: function (response) {
      response["results"]?.forEach((elt) => {
        ev = {
          id: elt["_id"],
          title:
            elt["client"]["user"]["prenom"] +
            " " +
            elt["client"]["user"]["nom"],
          start: elt["date"],
          backgroundColor: "rgb(245, 196, 61)",
          borderColor: "rgb(245, 196, 61)",
        };
        calendar.addEvent(ev);
        evt.push(ev);
      });
      $("#waiters").css("display","none")
    },
    error: function (response) {
      alert("Echec de récupération des EDL");
    },
  });
  return evt;
}

function loadStat() {
  $.ajax({
    type: "GET",
    url: stat_url,
    headers: {
      Authorization: "Bearer " + token,
    },
    success: function (response) {
      $("#nombre_user").text("");
      $("#nombre_admin").text("");
      $("#agent_nombre").text("");
      $("#nombre_client").text("");
      $("#rdv_attente").text("");
      $("#rdv_valide").text("");
      if (localStorage.getItem("group") == "Administrateur") {
        $("#nombre_user").text(response["stats"]["utilisateurs"]);
        $("#nombre_admin").text(response["stats"]["admin"]);
        $("#agent_nombre").text(response["stats"]["agent"]);
        $("#nombre_client").text(response["stats"]["client"]);
        $("#rdv_attente").text(response["stats"]["rdv_attente"]);
        $("#rdv_valide").text(response["stats"]["rdv_valide"]);
      }
      if (localStorage.getItem("group") == "Client pro") {
        $("#adminbox").remove();
        $("#agentbox").remove();
        $("#clientbox").remove();
        $("#clientbox").remove();
        $("#user_box").remove();
        $("#nombre_user").text(response["stats"]["utilisateurs"]);
        $("#nombre_admin").text(response["stats"]["admin"]);
        $("#agent_nombre").text(response["stats"]["agent"]);
        $("#nombre_client").text(response["stats"]["client"]);
        $("#rdv_attente").text(response["stats"]["rdv_attente"]);
        $("#salarie_nombre").text(response["stats"]["salarie"]);
        $("#rdv_valide").text(response["stats"]["rdv_valide"]);
      }

      if (localStorage.getItem("group") == "Agent constat") {
        $("#adminbox").remove();
        $("#agentbox").remove();
        $("#user_box").remove();
        $("#nombre_user").text(response["stats"]["utilisateurs"]);
        $("#nombre_admin").text(response["stats"]["admin"]);
        $("#agent_nombre").text(response["stats"]["agent"]);
        $("#nombre_client").text(response["stats"]["client"]);
        $("#rdv_attente").text(response["stats"]["rdv_attente"]);
        $("#salarie_nombre").text(response["stats"]["salarie"]);
        $("#rdv_valide").text(response["stats"]["rdv_valide"]);
      }

      if (localStorage.getItem("group") == "Audit planneur") {
        $("#adminbox").remove();
        $("#agentbox").remove();
        $("#user_box").remove();
        $("#nombre_user").text(response["stats"]["utilisateurs"]);
        $("#nombre_admin").text(response["stats"]["admin"]);
        $("#agent_nombre").text(response["stats"]["agent"]);
        $("#nombre_client").text(response["stats"]["client"]);
        $("#rdv_attente").text(response["stats"]["rdv_attente"]);
        $("#salarie_nombre").text(response["stats"]["salarie"]);
        $("#rdv_valide").text(response["stats"]["rdv_valide"]);
      }

      if (localStorage.getItem("group") == "Agent secteur") {
        $("#adminbox").remove();
        $("#user_box").remove();
        $("#nombre_user").text(response["stats"]["utilisateurs"]);
        $("#nombre_admin").text(response["stats"]["admin"]);
        $("#agent_nombre").text(response["stats"]["agent"]);
        $("#nombre_client").text(response["stats"]["client"]);
        $("#rdv_attente").text(response["stats"]["rdv_attente"]);
        $("#salarie_nombre").text(response["stats"]["salarie"]);
        $("#rdv_valide").text(response["stats"]["rdv_valide"]);
      }

      if (localStorage.getItem("group") == "Salarie") {
        $("#adminbox").remove();
        $("#user_box").remove();
        $("#agentbox").remove();
        $("#user_box").remove();
        $("#clientbox").remove();
        $("#salariebox").remove();
        $("#nombre_user").text(response["stats"]["utilisateurs"]);
        $("#nombre_admin").text(response["stats"]["admin"]);
        $("#agent_nombre").text(response["stats"]["agent"]);
        $("#nombre_client").text(response["stats"]["client"]);
        $("#rdv_attente").text(response["stats"]["rdv_attente"]);
        $("#salarie_nombre").text(response["stats"]["salarie"]);
        $("#rdv_valide").text(response["stats"]["rdv_valide"]);
      }

      if (localStorage.getItem("group") == "Client pro") {
        $("#adminbox").remove();
        $("#agentbox").remove();
        $("#clientbox").remove();
        $("#clientbox").remove();
        $("#user_box").remove();
        $("#nombre_user").text(response["stats"]["utilisateurs"]);
        $("#nombre_admin").text(response["stats"]["admin"]);
        $("#agent_nombre").text(response["stats"]["agent"]);
        $("#nombre_client").text(response["stats"]["client"]);
        $("#rdv_attente").text(response["stats"]["rdv_attente"]);
        $("#salarie_nombre").text(response["stats"]["salarie"]);
        $("#rdv_valide").text(response["stats"]["rdv_valide"]);
      }

      if (localStorage.getItem("group") == "Client particulier") {
        $("#adminbox").remove();
        $("#agentbox").remove();
        $("#clientbox").remove();
        $("#clientbox").remove();
        $("#user_box").remove();
        $("#salariebox").remove();
        $("#nombre_user").text(response["stats"]["utilisateurs"]);
        $("#nombre_admin").text(response["stats"]["admin"]);
        $("#agent_nombre").text(response["stats"]["agent"]);
        $("#nombre_client").text(response["stats"]["client"]);
        $("#rdv_attente").text(response["stats"]["rdv_attente"]);
        $("#salarie_nombre").text(response["stats"]["salarie"]);
        $("#rdv_valide").text(response["stats"]["rdv_valide"]);
      }
    },
    error: function (response) {
      alert("Echec de récupération des fichiers");
    },
  });
}
