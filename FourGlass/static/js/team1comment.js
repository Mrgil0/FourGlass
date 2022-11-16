function isDefined(value){
    if(value === "" || value === undefined || value === null){ //value가 비정상적인 값이면 false를 반환
        return false
    }
    return true
}

function create_comment(get_url, add_url){ //리스트 가져오기 위한 get_url, 추가할 add_url
    if($('.name').val()=="" || $('.team1comment').val()=="" || $('#pass').val()==""){ //유효성 검사
        alert('이름이나 내용을 입력해주세요.');
        return;
    }
    let idx
    function create_index(callbackfunc){ //db의 comment리스트 가져오기
        $.ajax({
            type : "GET",
            url : get_url,
            data : {},
            success : function(response){
                let rows = response['comments']

                callbackfunc(rows)
            },
            error : function(response) {
                console.log(response)
            }
        });
    }
    create_index(function(rows){ //콜백함수 create_index가 성공해야 실행됨
        console.log(rows)
        isDefined(rows[0]['idx']) ? idx=0 : idx=1 //db에 아무것도 없을 경우 idx가 undefined가 되어 1로 지정
        for(let i=0; i<rows.length; i++) {
            let temp = rows[i]['idx']
            if(temp>idx) {idx=temp}  //db의 제일 큰값이 idx가 됨
        }
        idx++
        let name = $('#name').val();
        let comment = $('#comment').val();
        let pass = $('.pass').val();
        $.ajax({    //댓글 추가
            type : 'POST',
            url : add_url,          //클릭한 버튼의 url
            data : {'idx_give':idx, 'name_give':name, 'comment_give':comment, 'pass_give':pass},
            success: function(response){
                alert("추가되었습니다.")
                location.reload()
            },
            error : function(response){
                console.log(response);
            }
        });
    })
}

function show_comment(show_url, add_tag){
    $(add_tag).empty() // 댓글칸 비우기
    $.ajax({
        type : 'get',
        url : show_url,
        data : {},
        success : function (response){
            let rows = response['comments']
            for(let i=0; i<rows.length; i++){
                let idx = rows[i]['idx']
                let name = rows[i]['name']
                let comment = rows[i]['comment']
                let temp_div = `<div style="overflow: hidden" id="replyCmt">
                                    <p style="float:left; margin:0 3px; padding:10px; border: 1px;">${name}</p>
                                    <p style="float:left; margin:0 3px; padding:10px; border: 1px;">${comment}</p>
                                    <button class="${idx}" id="delBtn" type="button" style="float:right; margin:0 3px; padding:10px; border: 1px;">삭제</button>
                                </div>`
                $(add_tag).append(temp_div)
            }
        }
    })
}

