{
  const teamPage = document.querySelector("#teamHeader");
  const teamBtns = document.querySelectorAll("#btn-box button");
  const btnInsert = document.querySelector("#btn-insert");
  const btnRelease = document.querySelector("#btn-release");
  const inputReview = document.querySelector("#input-review");
  const reviews = document.querySelector("#reviews");

  //페이지 로딩 후 리뷰가져오기
  (() => {
    $.ajax({
      type: "GET",
      url: "/fourglass/team4_read_review",
      data: {},
      success: (response) => {
        for (const review of response.reviews) {
          const num = review.num;
          const element = document.createElement("li");
          const btnDel = document.createElement("button");
          const btnUpdate = document.createElement("button");
          element.textContent = review.review;
          btnDel.textContent = "삭제";
          btnUpdate.textContent = "수정";
          reviews.appendChild(element);
          element.appendChild(btnDel);
          element.appendChild(btnUpdate);

          //삭제버튼 클릭시 삭제
          btnDel.addEventListener("click", () => {
            $.ajax({
              type: "POST",
              url: "/fourglass/team4_delete_review",
              data: { num_give: num },
              success: (response) => {
                window.location.reload();
              },
            });
          });

          btnUpdate.addEventListener("click", () => {
            const modiInput = prompt("수정하실 내용을 적어주세요.");
            console.log(modiInput);
            $.ajax({
              type: "POST",
              url: "/fourglass/team4_update_review",
              data: { num_give: num, input_give: modiInput },
              success: (response) => {
                window.location.reload();
              },
            });
          });
        }
      },
    });
  })();

  document.addEventListener('contextmenu',(event)=>{
    event.preventDefault();
    alert('zzz');
  })
  // 화면 상단 팀소개페이지 영역을 누르면 메인페이지로 이동
  teamPage.addEventListener("click", () => {
    window.location.href = "/";
  });

  // 팀원 버튼을 누르면 팀원소개페이지로 이동
  for (const btn of teamBtns) {
    btn.addEventListener("click", () => {
      const name = btn.textContent.trim();
      let url;
      if (name === "길재형") {
        url = "/team1";
      } else if (name === "유상우") {
        url = "/team2";
      } else {
        url = "/team3";
      }
      accessURL(url);
    });
  }

  // 댓글등록 버튼을 누르면 DB에 저장
  btnInsert.addEventListener("click", () => insertDB(inputReview.value));

  // 모두삭제 버튼을 누르면 DB에서 모두 삭제
  btnRelease.addEventListener("click", () => {
    $.ajax({
      type: "GET",
      url: "/fourglass/team4_release_review",
      data: {},
      success: (response) => {
        window.location.reload();
      },
    });
  });

  // 댓글 input에서 enter키 활성
  inputReview.addEventListener("keydown", (event) => {
    const ENTER = 13;
    if (event.keyCode === ENTER) {
      insertDB(inputReview.value);
    }
  });

  // url을 받아 이동
  function accessURL(url) {
    window.location.href = url;
  }

  //DB에 저장하는 함수
  function insertDB(review) {
    // 값이 공백일 경우
    if (review === "") {
      alert("입력해주세요");
      inputReview.focus();
      return;
    }

    $.ajax({
      type: "POST",
      url: "/fourglass/team4_insert_review",
      data: { review_give: review },
      success: (response) => {
        console.log("test");
        window.location.reload();
      },
    });
  }
}
