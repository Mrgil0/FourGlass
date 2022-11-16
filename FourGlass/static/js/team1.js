$(document).ready(function(){
    show_comment('/fourglass/team1_get_cmt') //댓글을 보일 리스트
});


function show_reply(){
    $.ajax({
       type : 'get',
       url :  '/fourglass/findReply',
       data : {},
       success : function (response){
           let rows = response['reply']
           for(let i=0; i<rows.length; i++){
               let idx = rows[i]['idx']
               let name = rows[i]['name']
               let reply = rows[i]['reply']
               $('replyCmt').find('')
           }
       }
    });
}


/*$(document).on('click', '#openReply', function() {
    let tk = true
    let idx = $(this).attr("class")
    if(tk){
        $('.modal'+ idx).attr('style', 'display:inline-block')
        tk = false
    } else{
        $(".modal"+ idx).attr('style', 'display:none')
        tk = true
    }
});*/

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



$(document).one('click', '#replyBtn', function (){
    let idx = $(this).attr('class')
    $('#replyCmt').prepend('<form name="reply" action="fourglass/addReply" method="POST" style="display:inline-block">' +
        '<input name="idx" value="' + idx + '" type="hidden">' +
        '<input class="name" type="text" id="replyName" name="name" placeholder="이름 입력" maxlength="3" style="margin:0 3px; padding:10px; border: 5px;">' +
        '<input type="text" id="replyTxt" name="text", placeholder="내용" style="margin:0 3px; padding:10px; border: 5px;">' +
        '<button id="addReplyBtn" type="submit">추가</button></form>')
});

function showReply(){
    let temp_html = '<p style="float:left; margin:0 3px; padding:10px; border: 1px;">${name}</p>\n                                    ' +
                '            <p style="float:left; margin:0 3px; padding:10px; border: 1px;">${text}</p>'
    $('.replyCmt').append(temp_html)
}