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
    find_cmt(function(id){
         $.ajax({
            type: 'POST',
            url: 'fourglass/team1_del_cmt',
            data: {'id_give': id},
            success: function (response) {
                alert(response['msg'])
                location.reload()
            }
        });
    });
});

$(document).on('click', '#modifyBtn', function(){   //수정 버튼 클릭
    let num = prompt('비밀번호를 입력하세요.')
    let id = $(this).attr('class')    //댓글의 id번호 가져오기
    function find_cmt(callbackfunc) {       //수정한 댓글의 비밀번호 확인
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
    find_cmt(function(idx){     //댓글의 내용을 가져온 후 수정할수 있게 변경
        alert("비밀번호가 일치합니다. 댓글을 수정 후 확인 버튼을 클릭하세요")
        $('#comment'+idx).attr('readonly', false)
        $('#comment'+idx).attr('onfocus', this.value=$('#comment'+idx).val())
        $('#name'+idx).attr('readonly', false)
        $('#name'+idx).attr('onfocus', this.value=$('#name'+idx).val())
        $("#modifyCheckBtn"+idx).attr('style', 'visibility:visible')
    })
})
function modifyCheck(id){
    let name = $('#name'+id).val()
    let comment = $('#comment'+id).val()
    alert(id)
    $.ajax({
        type : 'POST',
        url : "/fourglass/team1_update_cmt",
        data : {'id_give': id, 'name_give': name, 'comment_give': comment},
        success : function(response){
            alert(response['msg'])
            location.reload()
        }
    })
}