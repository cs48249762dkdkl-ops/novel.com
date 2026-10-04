// ========================================
// 내 소설 보관함
// ========================================

const STORAGE_KEY = "my-novels";

let editingId = null;


// ========================================
// HTML 요소
// ========================================

const newNovelBtn = document.getElementById("newNovelBtn");
const emptyNewBtn = document.getElementById("emptyNewBtn");

const closeEditorBtn = document.getElementById("closeEditorBtn");
const cancelBtn = document.getElementById("cancelBtn");
const saveNovelBtn = document.getElementById("saveNovelBtn");

const searchInput = document.getElementById("searchInput");

const editor = document.getElementById("editor");
const novelList = document.getElementById("novelList");
const emptyMessage = document.getElementById("emptyMessage");
const novelCount = document.getElementById("novelCount");

const novelTitle = document.getElementById("novelTitle");
const novelGenre = document.getElementById("novelGenre");
const novelDescription = document.getElementById("novelDescription");
const novelContent = document.getElementById("novelContent");

const reader = document.getElementById("reader");
const closeReaderBtn = document.getElementById("closeReaderBtn");

const readerGenre = document.getElementById("readerGenre");
const readerTitle = document.getElementById("readerTitle");
const readerDescription = document.getElementById("readerDescription");
const readerContent = document.getElementById("readerContent");


// ========================================
// 저장된 소설 불러오기
// ========================================

function getNovels() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        console.error("소설 데이터 오류:", error);
        return [];
    }
}


// ========================================
// 소설 저장하기
// ========================================

function saveNovels(novels) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(novels)
    );
}


// ========================================
// 새 소설 작성
// ========================================

function openNewEditor() {
    editingId = null;

    document.getElementById("editorTitle").textContent =
        "새 소설 작성";

    novelTitle.value = "";
    novelGenre.value = "판타지";
    novelDescription.value = "";
    novelContent.value = "";

    editor.classList.remove("hidden");

    novelTitle.focus();
}


// ========================================
// 작성창 닫기
// ========================================

function closeEditor() {
    editor.classList.add("hidden");
    editingId = null;
}


// ========================================
// 소설 저장
// ========================================

function saveNovel() {
    console.log("저장 버튼이 눌렸습니다.");

    const title = novelTitle.value.trim();
    const genre = novelGenre.value;
    const description = novelDescription.value.trim();
    const content = novelContent.value.trim();

    if (title === "") {
        alert("소설 제목을 입력해주세요.");
        novelTitle.focus();
        return;
    }

    if (content === "") {
        alert("소설 본문을 입력해주세요.");
        novelContent.focus();
        return;
    }

    const novels = getNovels();

    if (editingId !== null) {
        const index = novels.findIndex(
            novel => novel.id === editingId
        );

        if (index !== -1) {
            novels[index].title = title;
            novels[index].genre = genre;
            novels[index].description = description;
            novels[index].content = content;
            novels[index].updatedAt =
                new Date().toLocaleString("ko-KR");
        }
    } else {
        const novel = {
            id: Date.now(),
            title: title,
            genre: genre,
            description: description,
            content: content,
            createdAt:
                new Date().toLocaleString("ko-KR"),
            updatedAt:
                new Date().toLocaleString("ko-KR")
        };

        novels.unshift(novel);
    }

    saveNovels(novels);

    console.log("소설 저장 완료:", novels);

    renderNovels();

    closeEditor();

    alert("소설이 저장되었습니다.");
}


// ========================================
// 소설 목록 표시
// ========================================

function renderNovels(searchText = "") {
    const novels = getNovels();

    novelList.innerHTML = "";

    const filteredNovels = novels.filter(function (novel) {
        return novel.title
            .toLowerCase()
            .includes(searchText.toLowerCase());
    });

    novelCount.textContent =
        filteredNovels.length + "편";

    if (filteredNovels.length === 0) {
        emptyMessage.classList.remove("hidden");

        if (searchText !== "") {
            emptyMessage.querySelector("h3").textContent =
                "검색 결과가 없습니다.";

            emptyMessage.querySelector("p").textContent =
                "다른 제목으로 검색해보세요.";

            emptyNewBtn.classList.add("hidden");
        } else {
            emptyMessage.querySelector("h3").textContent =
                "아직 저장된 소설이 없습니다.";

            emptyMessage.querySelector("p").textContent =
                "「＋ 새 소설」 버튼을 눌러 첫 번째 소설을 작성해보세요.";

            emptyNewBtn.classList.remove("hidden");
        }

        return;
    }

    emptyMessage.classList.add("hidden");

    filteredNovels.forEach(function (novel) {
        const card = document.createElement("div");
        card.className = "novel-card";

        const genre = document.createElement("span");
        genre.className = "novel-genre";
        genre.textContent = novel.genre;

        const title = document.createElement("h3");
        title.textContent = novel.title;

        const description = document.createElement("p");
        description.className = "novel-description";
        description.textContent =
            novel.description || "작품 설명이 없습니다.";

        const date = document.createElement("div");
        date.className = "novel-date";
        date.textContent =
            "마지막 수정: " + novel.updatedAt;

        const buttons = document.createElement("div");
        buttons.className = "card-buttons";


        const readButton = document.createElement("button");
        readButton.className = "read-button";
        readButton.textContent = "📖 읽기";

        readButton.addEventListener("click", function () {
            readNovel(novel.id);
        });


        const editButton = document.createElement("button");
        editButton.className = "edit-button";
        editButton.textContent = "✏️ 수정";

        editButton.addEventListener("click", function () {
            editNovel(novel.id);
        });


        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "🗑️ 삭제";

        deleteButton.addEventListener("click", function () {
            deleteNovel(novel.id);
        });


        buttons.appendChild(readButton);
        buttons.appendChild(editButton);
        buttons.appendChild(deleteButton);

        card.appendChild(genre);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(date);
        card.appendChild(buttons);

        novelList.appendChild(card);
    });
}


// ========================================
// 소설 수정
// ========================================

function editNovel(id) {
    const novels = getNovels();

    const novel = novels.find(function (item) {
        return item.id === id;
    });

    if (!novel) {
        alert("소설을 찾을 수 없습니다.");
        return;
    }

    editingId = id;

    document.getElementById("editorTitle").textContent =
        "소설 수정";

    novelTitle.value = novel.title;
    novelGenre.value = novel.genre;
    novelDescription.value = novel.description;
    novelContent.value = novel.content;

    editor.classList.remove("hidden");

    novelTitle.focus();
}


// ========================================
// 소설 삭제
// ========================================

function deleteNovel(id) {
    const novels = getNovels();

    const novel = novels.find(function (item) {
        return item.id === id;
    });

    if (!novel) {
        return;
    }

    const result = confirm(
        '"' + novel.title + '" 소설을 삭제하시겠습니까?'
    );

    if (!result) {
        return;
    }

    const newNovels = novels.filter(function (item) {
        return item.id !== id;
    });

    saveNovels(newNovels);

    renderNovels();
}


// ========================================
// 소설 읽기
// ========================================

function readNovel(id) {
    const novels = getNovels();

    const novel = novels.find(function (item) {
        return item.id === id;
    });

    if (!novel) {
        return;
    }

    readerGenre.textContent = novel.genre;
    readerTitle.textContent = novel.title;
    readerDescription.textContent = novel.description;
    readerContent.textContent = novel.content;

    reader.classList.remove("hidden");
}


// ========================================
// 읽기창 닫기
// ========================================

function closeReader() {
    reader.classList.add("hidden");
}


// ========================================
// 버튼 연결
// ========================================

newNovelBtn.addEventListener(
    "click",
    openNewEditor
);

emptyNewBtn.addEventListener(
    "click",
    openNewEditor
);

closeEditorBtn.addEventListener(
    "click",
    closeEditor
);

cancelBtn.addEventListener(
    "click",
    closeEditor
);

saveNovelBtn.addEventListener(
    "click",
    saveNovel
);

closeReaderBtn.addEventListener(
    "click",
    closeReader
);


// ========================================
// 검색
// ========================================

searchInput.addEventListener(
    "input",
    function () {
        renderNovels(
            searchInput.value.trim()
        );
    }
);


// ========================================
// 읽기창 바깥쪽 클릭
// ========================================

reader.addEventListener(
    "click",
    function (event) {
        if (event.target === reader) {
            closeReader();
        }
    }
);


// ========================================
// 프로그램 시작
// ========================================

renderNovels();

console.log(
    "내 소설 보관함 JavaScript가 정상적으로 실행되었습니다."
);

