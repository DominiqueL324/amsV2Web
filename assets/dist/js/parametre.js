function param() {
    data = {}
    if (!$("#inter_id").val() || !$("#stat_id").val()) {
        alert("veuillez remplir ce champs")
        return
    }
    data["type"] = $('#inter_id').val()
    data["statut"] = $('#stat_id').val()
    $.ajax({
        type: 'POST',
        url: base_local + "/config_app/intervention/",
        data: data,
        headers: {
            'Authorization': "Bearer " + token
        },
        success: function(response) {
            alert("type d'intervention enregisté avec succèss")
            $('#inter_id').val("")
            $('#stat_id').val("s")
            getInterventionAndStatut()


        },
        error: function(response) {
            
        }
    })
}
$('#param_id').on('click', function() {
    param()
})

function getInterventionAndStatut() {
    var content = ""
    var url_go = base_local + "/config_app/intervention/"
    $.ajax({
        type: 'GET',
        url: url_go,
        headers: {
            'Authorization': "Bearer " + token
        },
        success: function(response) {
            var type_inter = ""
            var statut = 0
            var i = 1
            $('#tableInte').empty()
            var r = ""
            if (typeof(response['results']) === "undefined") {
                r = response
            } else {
                r = response['results']
            }
            r.forEach(elt => {
                if (parseInt(elt['statut']) == 1) {
                    statut = "actif"
                } else {
                    statut = "inactif"
                }

                $('#tableInte').append(
                    '<tr>\
                        <td>' + i + '</td>\
                        <td>' + elt["type"] + ' </td>\
                        <td>' + statut + '</td>\
                        <td>\
                        <a onclick=getToEdit(' + elt["id"] + ')><i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>&nbsp;<a href="#"><i class="bi bi-eye" style="color: rgb(136, 102, 119)"></i></a>\
                        </td>\
                    </tr>'
                )
                i++
            });
        },
        error: function(response) {
            
        }
    })
}

function getToEdit(id) {
    var url_go = base_local + "/config_app/intervention/"
    $.ajax({
        type: 'GET',
        url: url_go + id.toString(),
        headers: {
            'Authorization': "Bearer " + token
        },
        success: function(response) {
            $("#inter_idE").val(response[0]['type'])
            $("#stat_idE").val(response[0]['statut'])
            $("#idToEdit").val(response[0]['id'])
            $("#editForm").modal('show')
        },
        error: function(response) {
            
        }
    })

}

function editIntervention() {
    id = $('#idToEdit').val()
    data = {}
    if (!$("#inter_idE").val() || !$("#stat_idE").val()) {
        alert("veuillez remplir ce champs")
        return
    }
    data["type"] = $('#inter_idE').val()
    data["statut"] = $('#stat_idE').val()
    $.ajax({
        type: 'PUT',
        url: base_local + "/config_app/intervention/" + id.toString(),
        data: data,
        headers: {
            'Authorization': "Bearer " + token
        },
        success: function(response) {
            alert("type d'intervention modifié avec succèss")
            $('#inter_idE').val("")
            $('#stat_idE').val("s")
            $("#editForm").modal('hide')
            getInterventionAndStatut()


        },
        error: function(response) {
            
        }
    })
}
$('#param_idE').on('click', function() {
    editIntervention()
})

$('#close_btn').on('click',function(){
    $("#editForm").modal('hide')
})
function param() {
    data = {}
    if (!$("#inter_id").val() || !$("#stat_id").val()) {
        alert("veuillez remplir ce champs")
        return
    }
    data["type"] = $('#inter_id').val()
    data["statut"] = $('#stat_id').val()
    $.ajax({
        type: 'POST',
        url: base_local + "/config_app/intervention/",
        data: data,
        headers: {
            'Authorization': "Bearer " + token
        },
        success: function(response) {
            alert("type d'intervention enregisté avec succèss")
            $('#inter_id').val("")
            $('#stat_id').val("s")
            getInterventionAndStatut()


        },
        error: function(response) {
            
        }
    })
}
$('#param_id').on('click', function() {
    param()
})

function getInterventionAndStatut() {
    var content = ""
    var url_go = base_local + "/config_app/intervention/"
    $.ajax({
        type: 'GET',
        url: url_go,
        headers: {
            'Authorization': "Bearer " + token
        },
        success: function(response) {
            var type_inter = ""
            var statut = 0
            var i = 1
            $('#tableInte').empty()
            var r = ""
            if (typeof(response['results']) === "undefined") {
                r = response
            } else {
                r = response['results']
            }
            r.forEach(elt => {
                if (parseInt(elt['statut']) == 1) {
                    statut = "actif"
                } else {
                    statut = "inactif"
                }

                $('#tableInte').append(
                    '<tr>\
                        <td>' + i + '</td>\
                        <td>' + elt["type"] + ' </td>\
                        <td>' + statut + '</td>\
                        <td>\
                        <a onclick=getToEdit(' + elt["id"] + ')><i class="bi bi-pencil-square"style="color: rgb(0, 0, 0)"></i></a>&nbsp;<a href="#"><i class="bi bi-eye" style="color: rgb(136, 102, 119)"></i></a>\
                        </td>\
                    </tr>'
                )
                i++
            });
        },
        error: function(response) {
            
        }
    })
}

function getToEdit(id) {
    var url_go = base_local + "/config_app/intervention/"
    $.ajax({
        type: 'GET',
        url: url_go + id.toString(),
        headers: {
            'Authorization': "Bearer " + token
        },
        success: function(response) {
            $("#inter_idE").val(response[0]['type'])
            $("#stat_idE").val(response[0]['statut'])
            $("#idToEdit").val(response[0]['id'])
            $("#editForm").modal('show')
        },
        error: function(response) {
            
        }
    })

}

function editIntervention() {
    id = $('#idToEdit').val()
    data = {}
    if (!$("#inter_idE").val() || !$("#stat_idE").val()) {
        alert("veuillez remplir ce champs")
        return
    }
    data["type"] = $('#inter_idE').val()
    data["statut"] = $('#stat_idE').val()
    $.ajax({
        type: 'PUT',
        url: base_local + "/config_app/intervention/" + id.toString(),
        data: data,
        headers: {
            'Authorization': "Bearer " + token
        },
        success: function(response) {
            alert("type d'intervention modifié avec succèss")
            $('#inter_idE').val("")
            $('#stat_idE').val("s")
            $("#editForm").modal('hide')
            getInterventionAndStatut()


        },
        error: function(response) {
            
        }
    })
}
$('#param_idE').on('click', function() {
    editIntervention()
})

$('#close_btn').on('click',function(){
    $("#editForm").modal('hide')
})
