AOS.init();

const year = 2025;
const month = 7; // 7월

// 1. 필요한 DOM 요소 선택
const calendarGrid = document.querySelector('.calendar-grid');

// 2. 특정 월의 정보 계산
// 월은 0부터 시작하므로 month - 1을 해줍니다.
const firstDay = new Date(year, month - 1, 1);
const lastDay = new Date(year, month, 0); // 다음 달의 0일 = 이번 달의 마지막 날
const startDayOfWeek = firstDay.getDay(); // 1일의 요일 (0=일 ~ 6=토)
const lastDate = lastDay.getDate(); // 마지막 날짜

// 3. 달력 HTML 생성 시작
let html = '';

// 요일 이름 추가
const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
dayNames.forEach(name => {
    html += `<div class="day-name">${name}</div>`;
});

// 1일 시작 전까지 빈 칸(div) 추가
for (let i = 0; i < startDayOfWeek; i++) {
    html += `<div></div>`;
}


const weddingDay = 14;

// 1일부터 마지막 날까지 날짜 추가
for (let i = 1; i <= lastDate; i++) {
    let dayClass = 'day';
    if (i === weddingDay) {
        dayClass += ' wedding-day';
    }
    html += `<div class="${dayClass}">${i}</div>`;
}

// 4. 생성된 HTML을 실제 페이지에 삽입
calendarGrid.innerHTML = html;


// 계좌 아코디언 기능

const accordionItems = document.querySelectorAll('.accordion-item');

accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
        // 'active' 클래스를 토글 (추가/제거)
        item.classList.toggle('active');
    });
});

// 계좌번호 복사 기능
const copyButtons = document.querySelectorAll('.copy-btn');

copyButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        // 바로 옆 계좌번호 텍스트를 찾음
        const accountNumberSpan = e.target.previousElementSibling;
        const textToCopy = accountNumberSpan.textContent;

        // 클립보드에 복사
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('계좌번호가 복사되었습니다.');
        }).catch(err => {
            console.error('복사 실패:', err);
            alert('복사에 실패했습니다.');
        });
    });
});