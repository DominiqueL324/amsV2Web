function tarifaction() {
  var content = "";
  var url_go = base_local + "/cmdplannif/all/tarif/";
  data = {
    start: "1",
    count: "50",
    user: $.cookie("id_user_edit"),
  };
  /* alert($.cookie("id_user_edit"));*/
  $.ajax({
    type: "GET",
    url: url_go,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
    success: function (response) {
      $("#tableTarif").empty();
      var i = 0;
      response["document"].forEach((elt) => {
        var formattedDate = new Date(elt["created"]);
        var d = formattedDate.getDate();
        var m = formattedDate.getMonth();
        m += 1; // JavaScript months are 0-11
        var y = formattedDate.getFullYear();
        $("#tableTarif").append(
          "<tr>\
                        <td>" +
            i +
            "</td>\
                        <td>" +
            elt["name"] +
            " </td>\
                        <td>" +
            elt["price"] +
            "</td>\
                        <td>" +
            elt["Type"] +
            "</td>\
                        <td>" +
            elt["comment"] +
            "</td>\
                        <td>" +
            String(d).padStart(2, "0") +
            "/" +
            String(m).padStart(2, "0") +
            "/" +
            y +
            "</td>\
                       </tr>"
        );
        i++;
      });
    },
    error: function (response) {
     
    },
  });
}
function tarifaction() {
  var content = "";
  var url_go = base_local + "/cmdplannif/all/tarif/";
  data = {
    start: "1",
    count: "50",
    user: $.cookie("id_user_edit"),
  };
  /* alert($.cookie("id_user_edit"));*/
  $.ajax({
    type: "GET",
    url: url_go,
    headers: {
      Authorization: "Bearer " + token,
    },
    data: data,
    success: function (response) {
      $("#tableTarif").empty();
      var i = 0;
      response["document"].forEach((elt) => {
        var formattedDate = new Date(elt["created"]);
        var d = formattedDate.getDate();
        var m = formattedDate.getMonth();
        m += 1; // JavaScript months are 0-11
        var y = formattedDate.getFullYear();
        $("#tableTarif").append(
          "<tr>\
                        <td>" +
            i +
            "</td>\
                        <td>" +
            elt["name"] +
            " </td>\
                        <td>" +
            elt["price"] +
            "</td>\
                        <td>" +
            elt["Type"] +
            "</td>\
                        <td>" +
            elt["comment"] +
            "</td>\
                        <td>" +
            String(d).padStart(2, "0") +
            "/" +
            String(m).padStart(2, "0") +
            "/" +
            y +
            "</td>\
                       </tr>"
        );
        i++;
      });
    },
    error: function (response) {
    },
  });
}
