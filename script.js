/* script.js 파일의 모든 내용을 이 코드로 교체하세요. */

document.addEventListener('DOMContentLoaded', () => {

    // -------------------- AOS 라이브러리 초기화 --------------------
    AOS.init();

    // -------------------- 달력 기능 --------------------
    const year = 2025;
    const month = 7; // 7월
    const calendarGrid = document.querySelector('.calendar-grid');
    if (calendarGrid) {
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const startDayOfWeek = firstDay.getDay();
        const lastDate = lastDay.getDate();

        let calendarHTML = '';
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        dayNames.forEach(name => {
            calendarHTML += `<div class="day-name">${name}</div>`;
        });
        for (let i = 0; i < startDayOfWeek; i++) {
            calendarHTML += `<div></div>`;
        }
        const weddingDay = 14;
        for (let i = 1; i <= lastDate; i++) {
            let dayClass = 'day';
            if (i === weddingDay) dayClass += ' wedding-day';
            calendarHTML += `<div class="${dayClass}">${i}</div>`;
        }
        calendarGrid.innerHTML = calendarHTML;
    }

    // -------------------- 아코디언 기능 --------------------
    const accordionItems = document.querySelectorAll('.accordion-item');
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            item.classList.toggle('active');
        });
    });

    // -------------------- 계좌번호 복사 기능 --------------------
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const parentP = e.target.closest('.account-number');
            const accountNumberSpan = parentP.querySelector('span');
            navigator.clipboard.writeText(accountNumberSpan.textContent).then(() => {
                alert('계좌번호가 복사되었습니다.');
            });
        });
    });

    // -------------------- 하단 고정 바 및 모달 기능 --------------------
    // --- 요소 가져오기 ---
    const bgmPlayer = document.getElementById('bgm-player');
    const soundBtn = document.getElementById('sound-btn');
    const tocBtn = document.getElementById('toc-btn');
    const tocModal = document.getElementById('toc-modal');
    const tocLinks = document.querySelectorAll('.toc-link');
    const shareBtn = document.getElementById('share-btn');
    const shareOptionsModal = document.getElementById('share-options-modal');
    const closeShareModalBtn = document.getElementById('close-share-modal-btn');
    const kakaoShareBtn = document.getElementById('kakao-share-btn');
    const urlCopyBtn = document.getElementById('url-copy-btn');
    const qrCodeBtn = document.getElementById('qr-code-btn');
    const qrCodeModal = document.getElementById('qr-code-modal');
    const qrCodeDisplay = document.getElementById('qr-code-display');

    // --- 카카오 SDK 초기화 (⭐ 본인의 키로 꼭 교체하세요!) ---
    try {
        Kakao.init('c107792fb1ee4e1fffe1ff7c78a53d6d');
    } catch (e) { console.error("Kakao SDK 초기화 실패:", e); }

    // --- BGM 기능 ---
    if (soundBtn && bgmPlayer) {
        const soundIcon = soundBtn.querySelector('i');
        let isPlaying = false;
        document.body.addEventListener('click', () => {
            if (!isPlaying) {
                bgmPlayer.play().catch(e => console.error("BGM 자동재생 실패:", e));
                isPlaying = true;
            }
        }, { once: true });

        soundBtn.addEventListener('click', () => {
            if (bgmPlayer.paused) {
                bgmPlayer.play();
                soundIcon.className = 'fa-solid fa-volume-high';
            } else {
                bgmPlayer.pause();
                soundIcon.className = 'fa-solid fa-volume-xmark';
            }
        });
    }

    // --- 목차(TOC) 기능 ---
    if (tocBtn && tocModal) {
        tocBtn.addEventListener('click', () => tocModal.classList.add('active'));
        tocModal.addEventListener('click', (e) => {
            if (e.target === tocModal) tocModal.classList.remove('active');
        });
        tocLinks.forEach(link => {
            link.addEventListener('click', () => tocModal.classList.remove('active'));
        });
    }

    // --- 공유 기능 ---
    if (shareBtn && shareOptionsModal) {
        shareBtn.addEventListener('click', () => shareOptionsModal.classList.add('active'));
        closeShareModalBtn.addEventListener('click', () => shareOptionsModal.classList.remove('active'));
        shareOptionsModal.addEventListener('click', (e) => {
            if (e.target === shareOptionsModal) shareOptionsModal.classList.remove('active');
        });

        // 카카오톡 공유
        kakaoShareBtn.addEventListener('click', () => {
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                title: '재혁과 진영의 결혼식에 초대합니다', // 1. 청첩장에 맞는 제목으로 수정
                description: '#결혼 #청첩장 #초대 #사랑의결실', // 2. 원하는 해시태그나 문구로 수정
                imageUrl:
                'https://your-domain.com/images/main-image.jpg', // 3. 가장 예쁜 대표 사진 주소 넣기 (필수)
                link: {
                    mobileWebUrl: window.location.href, // 4. 실제 청첩장 주소
                    webUrl: window.location.href,
                },
            },
            social: { // 5. 이 부분은 카카오톡에 표시될 소셜 정보 (없어도 됨)
                likeCount: 2025,
                commentCount: 7,
                sharedCount: 18,
            },
            buttons: [
                {
                    title: '청첩장 보러가기', // 6. 버튼 이름
                    link: {
                        mobileWebUrl: window.location.href, // 7. 실제 청첩장 주소
                        webUrl: window.location.href,
                    },
                },
                // 버튼은 필요에 따라 추가하거나 제거할 수 있습니다.
            ],
        });
    });
        // URL 복사
        urlCopyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('주소가 복사되었습니다.');
                shareOptionsModal.classList.remove('active');
            });
        });

        // QR코드 생성
        qrCodeBtn.addEventListener('click', () => {
            if (typeof QRCode === 'undefined') {
                alert('QR 코드 기능을 잠시 후 다시 시도해 주세요.');
                return;
            }
            qrCodeDisplay.innerHTML = '';
            new QRCode(qrCodeDisplay, { text: window.location.href, width: 200, height: 200 });
            shareOptionsModal.classList.remove('active');
            qrCodeModal.classList.add('active');
        });

        qrCodeModal.addEventListener('click', (e) => {
            if (e.target === qrCodeModal) qrCodeModal.classList.remove('active');
        });
    }
});

// -------------------- QR코드 라이브러리 로드 --------------------
const qrCodeScript = document.createElement('script');
qrCodeScript.src = 'https://cdn.rawgit.com/davidshimjs/qrcodejs/gh-pages/qrcode.min.js';
document.head.appendChild(qrCodeScript);