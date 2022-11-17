$(document).ready(function(){
    show_comment('/fourglass/team2_get_cmt', '#comment-list') //댓글을 보일 리스트
});

$(document).on('click', '#delbtn', function () {
    let num = prompt('비밀번호를 입력하세요.')
    let id = $(this).attr('class')

    function find_comment(callbackfunc) {
        $.ajax({
            type: 'POST',
            url: '/fourglass/team2_find_cmt',
            data: {'id_give': id},
            success: function (response) {
                console.log(response['result'])
                let result = response['result']
                if (num === result[0]['pass']) {
                    callbackfunc(result[0]['idx'])
                } else {
                    alert("비밀번호가 일치하지 않습니다.")
                }
            }
        })
    }

    find_comment(function (idx) {
        $.ajax({
            type: 'POST',
            url: 'fourglass/team2_del_cmt',
            data: {'id_give': idx},
            success: function (response) {
                alert(response['msg'])
                location.reload()
            }
        })
    })
})