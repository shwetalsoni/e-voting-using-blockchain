var name, party, candidate_id, imgSrc




function showConfirmModal(i) {
    var candidate_div = $("#candidate-div-" + i)
    name = candidate_div.children('.name').html()
    party = candidate_div.children('.party').html()
    candidate_id = candidate_div.children('.candidate-id').html()
    imgSrc = candidate_div.children('.img').attr('src')
    var confirmModal = $('#confirm-modal')
    $('#confirm-name').html(name)
    $('#confirm-party').html(party)
    $('#confirm-candidate-id').html(candidate_id)
    $('#confirm-ing').attr('src', imgSrc)
    confirmModal.modal()
}

function showKeyModal() {
    $('#confirm-modal').modal('hide')
    var keyModal = $('#key-modal')
    $('#key-name').html(name)
    $('#key-party').html(party)
    $('#key-candidate-id').html(candidate_id)
    $('#key-ing').attr('src', imgSrc)
    keyModal.modal({backdrop: 'static', keyboard: false})
}

function cancelConfirmModal() {
    $("#confirm-modal").modal('hide')
}

function cancelKeyModal() {
    $("#key-modal").modal('hide')
    $('#key').val('')
}

function castVote() {
    $('#key-modal').modal('hide')
    $('#key').val('')
    $('#vote-status-modal').modal({backdrop: 'static', keyboard: false})
    var voter_id = $('#voter_id').html()
    var key = $('#key').val()
    servers = []
    for(server of $(".server")){
        servers.push(server.innerHTML)
    }
    data = {
        'voter_id': voter_id,
        'key': key,
        'candidate_id': candidate_id
    }
    var success = 0
    var error = ''
    $.when(
        $.post(servers[0] + '/cast_vote', data, function(response) {
            if(response['status'] == 1){
                success++
            }else{
                error = response['error']
            }
        }),
        $.post(servers[1] + '/cast_vote', data, function(response) {
            if(response['status'] == 1){
                success++
            }else{
                error = response['error']
            }
        }),
        $.post(servers[2] + '/cast_vote', data, function(response) {
            if(response['status'] == 1){
                success++
            } else {
                error = response['error']
            }
        })
    ).done(
        function(res1, res2, res3) {
            if(success > servers.length / 2){
                voteCastSuccess()
            }else{
                voteCastFailure(error)
            }
        }
    )
}

function voteCastSuccess() {
    $('#vote-status-modal').modal('hide')
    $('#success-modal').modal()
}

function voteCastFailure(error) {
    $('#vote-status-modal').modal('hide')
    $('#failure-error').html(error)
    $('#failure-modal').modal()
}