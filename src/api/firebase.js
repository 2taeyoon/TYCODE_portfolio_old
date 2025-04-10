import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, get, set } from "firebase/database";
import { badWordKor } from '../data/badWord';

const firebaseConfig = {
		projectId: process.env.REACT_APP_FIREBASE_DB_URL,
		apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
		authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
		databaseURL: process.env.REACT_APP_FIREBASE_DB_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const contactDate = (date) => {
    const hour = date.getHours(); // 로컬 시간 추출
    const minute = date.getMinutes(); // 로컬 분 추출
    const ampm = hour >= 12 ? '오후' : '오전'; // 12를 기준으로 오후와 오전을 표시
    const hour12 = hour % 12 || 12; // 24시간의 시간 형식을 12시간으로 변환 || 연산자를 사용하여 0인 경우에는 12를 할당

    const dateTimeString = date.toLocaleString('ko-KR', { // 한국어로 설정된 데이터 문자열을 반환 밑에는 옵션값
        year: '2-digit', // 연도를 2자리로 표기
        month: 'long', // 월을 긴 형식으로 표기
        day: 'numeric' // 일을 숫자 형식으로 표기
    });

    const timeString = `${ampm} ${hour12.toString()}시 ${minute.toString().padStart(2, '0')}분`; // padStart 메소드를 이용하여 지정한 길이(현재는 2)보다 작을 경우 '0'으로 길이를 채움
    const dateTime = dateTimeString + " " + timeString;
    return dateTime; // contactDate 함수를 호출한 곳에서 반환된 dateTime 변수를 사용하기 위해 return 사용
}

export const handleCommentSubmit = (event, labelRef) => {
    event.preventDefault();

    const now = new Date();
    const dateTime = contactDate(now); // contactDate 함수의 인자로 로컬의 현재 시간 값을 보내줌

    const commentInput = event.target[1];
    if (commentInput.value.trim() === '') { // 문자열의 앞뒤 공백을 제거(trim)하여 빈 문자열일 경우 return 시킴
        return alert('내용을 입력해주세요.');
    }
    if (badWordKor.includes(commentInput.value)) { // 금칙어 목록에서 commentInput의 value값을 순회하여 일치하면(includes) return 시킴
        return alert('금칙어가 포함되어 있습니다.');
    }
    const labelBackgroundImage = labelRef.current.style.backgroundImage; // labelRef useRef로 component에서만 사용이 가능하므로 우선 인자로 넘겨준다

    const commentsRef = ref(database, 'comments'); // firebase의 database의 'comments'에 접근

    const newComment = { // firebase에 저장할 객체
        comment: commentInput.value,
        dateTime: dateTime,
        image: labelBackgroundImage
    };

    push(commentsRef, newComment); // 접근한 database의 'comments'에 newComment 객체 저장
    commentInput.value = ''; // 입력창 초기화
};

export const fetchComments = (callback) => {
    const commentsRef = ref(database, 'comments');
    onValue(commentsRef, (snapshot) => {
        const commentsData = snapshot.val();
        const commentsList = commentsData ? Object.values(commentsData) : [];
        commentsList.reverse(); // 댓글 리스트를 불러올 때 배열의 역순으로 반환
        callback(commentsList);
    })
}

export const getHits = (callback) => {
    const hitsRef = ref(database, 'hits');
    get(hitsRef)
        .then((snapshot) => {
            const hitsData = snapshot.val();
            const hitCount = hitsData ? hitsData : null;
            callback(hitCount); // 데이터베이스에서 읽은 조회수를 콜백으로 전달
        })
}


// 조회수를 업데이트하는 함수
export const updateHits = (hitCount/*hitCount*/) => { // 새로운 인자로 조회수를 받도록 수정
    const hitsRef = ref(database, 'hits');
    const newHits = hitCount + 1; // 기존 조회수에 1을 더한 값을 새로운 조회수로 설정
    set(hitsRef, newHits, { merge: true }); // { merge: true } = 새 데이터를 기존 데이터와 병합합니다.
}