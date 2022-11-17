$(document).ready(function(){
    show_comment('/fourglass/team1_get_cmt', '#sampleDiv') //댓글을 보일 리스트
});

$(document).on('click', '#delBtn', function(){
    let num = prompt('비밀번호를 입력하세요.')
    let id = $(this).attr('class')
    function find_cmt(callbackfunc) {
        $.ajax({
            type : 'POST',
            url : '/fourglass/team1_find_cmt',
            data : {'id_give': id},
            success : function (response){
                console.log(response['result'])
                let result = response['result']
                if(num === result[0]['pass']){
                    callbackfunc(result[0]['idx'])
                } else{
                    alert("비밀번호가 일치하지 않습니다.")
                }
            }
        })
    }
    find_cmt(function(idx){
         $.ajax({
            type: 'POST',
            url: 'fourglass/team1_del_cmt',
            data: {'id_give': idx},
            success: function (response) {
                alert(response['msg'])
                location.reload()
            }
        });
    });
});

$(document).on('click', '#modifyBtn', function(){
    let num = prompt('비밀번호를 입력하세요.')
    let id = $(this).attr('class')
    function find_cmt(callbackfunc) {
        $.ajax({
            type : 'POST',
            url : '/fourglass/team1_find_cmt',
            data : {'id_give': id},
            success : function (response){
                let result = response['result']
                if(num === result[0]['pass']){
                    callbackfunc(result[0]['idx'])
                } else{
                    alert("비밀번호가 일치하지 않습니다.")
                }
            }
        })
    }
    find_cmt(function(idx){
        alert("비밀번호가 일치합니다. 댓글을 수정 후 확인 버튼을 클릭하세요")
        $('#comment'+idx).attr('readonly', false)
        $('#comment'+idx).attr('onfocus', this.value=$('#comment'+idx).val())
        $('#name'+idx).attr('readonly', false)
        $('#name'+idx).attr('onfocus', this.value=$('#name'+idx).val())
        $("#modifyCheckBtn").attr('style', 'visibility:visible')
    })
})

$(document).on('click', '#modifyCheckBtn', function(){
    let id = $(this).attr('class')
    let name = $('#name'+id).val()
    let comment = $('#comment'+id).val()
    $.ajax({
        type : 'POST',
        url : "/fourglass/team1_update_cmt",
        data : {'id_give': id, 'name_give': name, 'comment_give': comment},
        success : function(response){
            alert(response['msg'])
            location.reload()
        }
    })
})