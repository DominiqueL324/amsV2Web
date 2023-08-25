let url = "http://195.15.218.172/rdv_app/rdv/";

let page = 1;

function getAllRdv() {
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
        console.log(response["results"]);

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
        
      $("#page_actuelle").val("Page actuelle: " + currentPage.toString());
      $("#total_page").val("Total pages: " + totalPage.toString());
      $("#total_data").val(
        "Nombre total de données: " + table.length.toString()
      );
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
    error: function (response) {},
  });
}