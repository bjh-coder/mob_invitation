/* script.js 파일의 모든 내용을 이 코드로 교체하세요. */

document.addEventListener('DOMContentLoaded', () => {

    // -------------------- AOS 라이브러리 초기화 --------------------
    try { AOS.init(); } catch (e) { console.error("AOS Init Error:", e); }

    // -------------------- 달력 기능 --------------------
    (function () {
        const calendarGrid = document.querySelector('.calendar-grid');
        if (!calendarGrid) return;

        const year = 2025;
        const month = 7;
        const weddingDay = 14;
        const firstDay = new Date(year, month - 1, 1);
        const lastDay = new Date(year, month, 0);
        const startDayOfWeek = firstDay.getDay();
        const lastDate = lastDay.getDate();
        
        let calendarHTML = '';
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        dayNames.forEach(name => { calendarHTML += `<div class="day-name">${name}</div>`; });
        for (let i = 0; i < startDayOfWeek; i++) { calendarHTML += `<div></div>`; }
        for (let i = 1; i <= lastDate; i++) {
            let dayClass = 'day';
            if (i === weddingDay) dayClass += ' wedding-day';
            calendarHTML += `<div class="${dayClass}">${i}</div>`;
        }
        calendarGrid.innerHTML = calendarHTML;
    })();

    // -------------------- 아코디언 기능 --------------------
    (function () {
        const accordionItems = document.querySelectorAll('.accordion-item');
        if (!accordionItems.length) return;

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            if (header) {
                header.addEventListener('click', () => {
                    item.classList.toggle('active');
                });
            }
        });
    })();

    // -------------------- 계좌번호 복사 기능 --------------------
    (function () {
        const copyButtons = document.querySelectorAll('.copy-btn');
        if (!copyButtons.length) return;

        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const parentP = e.target.closest('.account-number');
                const accountNumberSpan = parentP.querySelector('span');
                if (accountNumberSpan) {
                    navigator.clipboard.writeText(accountNumberSpan.textContent).then(() => {
                        alert('계좌번호가 복사되었습니다.');
                    });
                }
            });
        });
    })();

    // -------------------- BGM 기능 --------------------
    (function () {
        const soundBtn = document.getElementById('sound-btn');
        const bgmPlayer = document.getElementById('bgm-player');
        if (!soundBtn || !bgmPlayer) return;

        const soundIcon = soundBtn.querySelector('i');
        let isPlaying = false;
        
        const playMusic = () => {
            if (!isPlaying) {
                bgmPlayer.play().catch(e => console.error("BGM 자동재생 실패:", e));
                isPlaying = true;
                document.body.removeEventListener('click', playMusic);
            }
        };
        document.body.addEventListener('click', playMusic);

        soundBtn.addEventListener('click', () => {
            if (bgmPlayer.paused) {
                bgmPlayer.play();
                soundIcon.className = 'fa-solid fa-volume-high';
            } else {
                bgmPlayer.pause();
                soundIcon.className = 'fa-solid fa-volume-xmark';
            }
        });
    })();

    // -------------------- 목차(TOC) 기능 --------------------
    (function () {
        const tocBtn = document.getElementById('toc-btn');
        const tocMenu = document.getElementById('toc-menu');
        if (!tocBtn || !tocMenu) return;

        const tocMenuLinks = tocMenu.querySelectorAll('.toc-link');
        tocBtn.addEventListener('click', () => {
            tocMenu.classList.toggle('active');
        });
        tocMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                tocMenu.classList.remove('active');
            });
        });
    })();

    // -------------------- 공유 기능 --------------------
    (function () {
        const shareBtn = document.getElementById('share-btn');
        const shareOptionsModal = document.getElementById('share-options-modal');
        if (!shareBtn || !shareOptionsModal) return;

        const closeShareModalBtn = document.getElementById('close-share-modal-btn');
        const kakaoShareBtn = document.getElementById('kakao-share-btn');
        const urlCopyBtn = document.getElementById('url-copy-btn');
        const qrCodeBtn = document.getElementById('qr-code-btn');
        const qrCodeModal = document.getElementById('qr-code-modal');
        const qrCodeDisplay = document.getElementById('qr-code-display');
        
        if (!closeShareModalBtn || !kakaoShareBtn || !urlCopyBtn || !qrCodeBtn) return;

        // 카카오 SDK 초기화
        try {
            if(Kakao) Kakao.init('c107792fb1ee4e1fffe1ff7c78a53d6d');
        } catch (e) { console.error("Kakao SDK 초기화 실패:", e); }

        shareBtn.addEventListener('click', () => shareOptionsModal.classList.add('active'));
        closeShareModalBtn.addEventListener('click', () => shareOptionsModal.classList.remove('active'));
        shareOptionsModal.addEventListener('click', (e) => {
            if (e.target === shareOptionsModal) shareOptionsModal.classList.remove('active');
        });

        kakaoShareBtn.addEventListener('click', () => {
            if (!Kakao) return alert('카카오 공유 기능을 불러오지 못했습니다.');
            Kakao.Share.sendDefault({
                objectType: 'feed',
                content: {
                    title: '재혁과 진영의 결혼식에 초대합니다',
                    description: '#결혼 #청첩장 #초대 #사랑의결실',
                    imageUrl: 'https://your-domain.com/images/main-image.jpg', // 대표 이미지 주소로 변경
                    link: { mobileWebUrl: window.location.href, webUrl: window.location.href },
                },
                buttons: [{ title: '청첩장 보러가기', link: { mobileWebUrl: window.location.href, webUrl: window.location.href }}]
            });
        });

        urlCopyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('주소가 복사되었습니다.');
                shareOptionsModal.classList.remove('active');
            });
        });

        qrCodeBtn.addEventListener('click', () => {
            // QR코드 관련 HTML이 없으므로 알림만 표시
            if (!qrCodeModal || !qrCodeDisplay) {
                return alert('QR코드 표시 영역이 HTML에 없습니다.');
            }
            if (typeof QRCode === 'undefined') return alert('QR 코드 기능을 잠시 후 다시 시도해 주세요.');
            
            qrCodeDisplay.innerHTML = '';
            new QRCode(qrCodeDisplay, { text: window.location.href, width: 200, height: 200 });
            shareOptionsModal.classList.remove('active');
            qrCodeModal.classList.add('active');
        });

        // qrCodeModal이 있을 경우에만 이벤트 리스너 추가
        if (qrCodeModal) {
            qrCodeModal.addEventListener('click', (e) => {
                if (e.target === qrCodeModal) qrCodeModal.classList.remove('active');
            });
        }
    })();
});