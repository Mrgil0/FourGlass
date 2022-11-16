const teamPage = document.querySelector("#teamHeader");
const teamBtns = document.querySelectorAll("#btn-box button");
const btnReview = document.querySelector("#btn-review");
const inputReview = document.querySelector("#input-review");
const reviews = document.querySelector("#reviews");

//페이지 로딩 후 리뷰가져오기
(() => {
  $.ajax({
    type: "GET",
    url: "/jh/review",
    data: {},
    success: (response) => {
      for (const review of response.reviews) {
        const element = document.createElement("li");
        element.textContent = review.review;
        reviews.appendChild(element);
      }
    },
  });
})();

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
      url = "/team2";
    } else if (name === "유상우") {
      url = "/team0";
    } else {
      url = "/team1";
    }
    accessURL(url);
  });
}

// 댓글등록 버튼을 누르면 DB에 저장
btnReview.addEventListener("click", () => insertDB(inputReview.value));

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
    url: "/jh/review",
    data: { review_give: review },
    success: (response) => {
      window.location.reload();
    },
  });
}
