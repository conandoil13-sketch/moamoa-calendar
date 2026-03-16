export const courseData = [
    { id: 'cd_01', title: '디자인과 글쓰기', professor: '이디자인', avgTime: '04:12', activeNodes: 32, weeklyData: [30, 45, 20, 60, 40, 20, 32] },
    { id: 'cd_02', title: '타이포그래피 1', professor: '김활자', avgTime: '06:45', activeNodes: 45, weeklyData: [45, 60, 50, 75, 40, 55, 45] },
    { id: 'cd_03', title: '인터랙션 디자인', professor: '박웹', avgTime: '08:20', activeNodes: 60, weeklyData: [50, 70, 80, 60, 90, 65, 60] }
];

export const calendarEventsMock = [
    { id: 'evt_fixed_1', title: '수강과목 확인 및 변경', date: 4, type: 'fixed', color: '#0047FF' },
    { id: 'evt_fixed_2', title: '전공 진입 신청 마감', date: 15, type: 'fixed', color: '#0047FF' },
    { id: 'evt_fixed_3', title: '종합시험(졸업전시)', date: 28, type: 'fixed', color: '#0047FF' },
    { id: 'evt_user_1', title: '타이포그래피 리서치', date: 6, type: 'user', color: '#FF3B30' },
    { id: 'evt_user_2', title: '코딩 과제 마감', date: 12, type: 'user', color: '#0047FF' },
    { id: 'evt_user_3', title: '야작 파티 참여', date: 20, type: 'user', color: '#FFD60A' }
];

export const mealMenuMock = {
    bokji: { name: '복지관', lunch: ['참치마요 덮밥', '미니 우동', '단무지무침'], dinner: ['돈가스 정식', '양배추 샐러드'] },
    hanul: { name: '한울식당', lunch: ['제육볶음', '된장찌개', '상추쌈'], dinner: ['김치찌개', '계란말이'] },
    chunghyang: { name: '청향', lunch: ['명란 오일 파스타', '마늘바게트'], dinner: ['스테이크 덮밥', '미니우동'] },
    staff: { name: '교직원식당', lunch: ['건강 백반 정식', '고등어 구이', '나물무침'], dinner: ['운영 안 함'] }
};

export const partyListMock = [
    { id: 'pty_01', title: '법학관 학식 돈가스 팟', time: '12:00', place: '법학관 식당', current: 2, max: 4, joined: false },
    { id: 'pty_02', title: '조형관 밤샘 야작 파티', time: '22:00', place: '조형관 2층', current: 4, max: 8, joined: false },
    { id: 'pty_03', title: '타이포 팀플 회의', time: '15:30', place: '디자인도서관', current: 1, max: 3, joined: false }
];

export const equipmentMock = {
    'cd_01': [{ id: 'eq_1', name: 'A4 트레이싱지', checked: true }, { id: 'eq_2', name: '0.3mm 라이너', checked: false }],
    'cd_02': [{ id: 'eq_3', name: '영문 타이포 책', checked: true }, { id: 'eq_4', name: '노트북 (일러스트레이터)', checked: true }],
    'cd_03': [{ id: 'eq_5', name: '피그마 뷰어 앱', checked: false }, { id: 'eq_6', name: 'UX 리서치 노트', checked: false }]
};

export const feedbackMock = [
    {
        id: 'fb_1',
        title: '그리드 시스템 여백 문제',
        text: '그리드 시스템이 좀 더 명확했으면 좋겠어요. 여백이 튑니다.',
        author: '익명_A',
        timestamp: '14:20',
        takeCount: 2,
        sameProf: true,
        comments: [
            { id: 'c_1', author: '익명_B', text: '동감합니다. 레이아웃 엔진 5.6 업데이트로 해결될까요?', timestamp: '14:22' },
            { id: 'c_2', author: '익명_C', text: '패딩 값을 조절해보시면 좋을 것 같아요.', timestamp: '14:30' }
        ]
    },
    {
        id: 'fb_2',
        title: '프로토타입 인터랙션 검토',
        text: '프로토타입 인터랙션이 훌륭합니다. 타이밍 로직만 다듬어보세요.',
        author: '익명_D',
        timestamp: '15:05',
        takeCount: 0,
        sameProf: true,
        comments: [
            { id: 'c_3', author: '익명_E', text: '감사합니다! 혹시 어떤 큐가 어색했나요?', timestamp: '15:10' }
        ]
    },
    {
        id: 'fb_3',
        title: '레퍼런스 조사 퀄리티 공유',
        text: '레퍼런스 조사가 돋보입니다. 굿!',
        author: '익명_F',
        timestamp: '16:45',
        takeCount: 1,
        sameProf: false,
        comments: []
    }
];

export const audioChartMock = {
    general: [
        { id: 's_1', title: 'Lofi Hip Hop Radio', artist: 'Lofi Girl', url: 'https://youtube.com/results?search_query=lofi+hip+hop', likes: 128, isLiked: true },
        { id: 's_2', title: 'Neon Chillwave', artist: 'Synthboi', url: 'https://youtube.com/results?search_query=neon+chillwave', likes: 84, isLiked: false },
        { id: 's_3', title: 'Acoustic Study', artist: 'Wood C.', url: 'https://youtube.com/results?search_query=acoustic+study', likes: 210, isLiked: true }
    ],
    focused: [
        { id: 's_4', title: 'White Noise / Rain', artist: 'Nature Sounds', url: 'https://youtube.com/results?search_query=white+noise+rain', likes: 256, isLiked: false },
        { id: 's_5', title: 'Deep Focus Ambient', artist: 'Brainwave', url: 'https://youtube.com/results?search_query=deep+focus+ambient', likes: 190, isLiked: true }
    ]
};

export const todoDataMock = [
    { id: 'todo_1', text: '타이포그래피 리서치 정리', completed: true },
    { id: 'todo_2', text: '그리드 시스템 실습 과제', completed: false },
    { id: 'todo_3', text: '피그마 컴포넌트 라이브러리 제작', completed: false },
    { id: 'todo_4', text: '중간고사 범위 복습 (디자인사)', completed: false }
];

export const rankingDataMock = [
    { id: 'rank_1', name: 'User_X (나)', hours: 42.5, trend: 'up', avatar: 'X' },
    { id: 'rank_2', name: 'Design_King', hours: 38.2, trend: 'down', avatar: 'D' },
    { id: 'rank_3', name: 'Layout_Master', hours: 35.8, trend: 'stable', avatar: 'L' },
    { id: 'rank_4', name: 'Pixel_Pusher', hours: 31.2, trend: 'up', avatar: 'P' },
    { id: 'rank_5', name: 'Font_Lover', hours: 28.5, trend: 'stable', avatar: 'F' }
];
