const predefinedThreads = {
    '/wn': 'World News',
    '/shit': 'Дичь',
    '/political': 'Политика',
    '/ru': 'Русское сообщество',
    '/en': 'Англоязычное сообщество',
    '/memes': 'Мемы',
    '/programing': 'Программирование',
    '/PTTK': 'Обсуждение имиджборды'
};

let threads = JSON.parse(localStorage.getItem('threads')) || {};
let posts = JSON.parse(localStorage.getItem('posts')) || {};
let currentPath = window.location.pathname;

// Инициализация хранилища
function initStorage() {
    Object.entries(predefinedThreads).forEach(([path, title]) => {
        if (!threads[path]) {
            threads[path] = {
                title,
                isPredefined: true,
                createdAt: new Date().toISOString(),
                replies: 0,
                lastActivity: new Date().toISOString()
            };
        }
    });
    localStorage.setItem('threads', JSON.stringify(threads));
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Генератор уникальных кодов
function generateThreadCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code;
    
    do {
        code = Array.from({length: 4}, () => chars[Math.floor(Math.random() * 52)]).join('') +
               Array.from({length: 2}, () => chars[52 + Math.floor(Math.random() * 10)]).join('') +
               Array.from({length: 2}, () => chars[Math.floor(Math.random() * 52)]).join('') +
               Array.from({length: 4}, () => chars[52 + Math.floor(Math.random() * 10)]).join('');
    } while (Object.keys(threads).some(k => k.includes(code)));
    
    return code;
}

// Отображение контента
function renderContent() {
    const container = document.getElementById('thread-container');
    const path = window.location.pathname;
    
    if (path === '/freeM') {
        renderFreeMPage();
        return;
    }
    
    if (path.startsWith('/freeM/') || Object.keys(predefinedThreads).includes(path)) {
        renderThreadPage(path);
        return;
    }
    
    renderMainPage();
}

// Главная страница
function renderMainPage() {
    const container = document.getElementById('thread-container');
    let html = '<h2>Активные ветки</h2>';
    
    Object.entries(threads).forEach(([path, thread]) => {
        if (thread.isPredefined) {
            html += 
                <div class="thread-card" onclick="navigateTo('${path}')">
                    <h3>${thread.title}</h3>
                    <p>Сообщений: ${posts[path]?.length || 0}</p>
                    <small>Последняя активность: ${new Date(thread.lastActivity).toLocaleString()}</small>
                </div>
            ;
        }
    });
    
    container.innerHTML = html;
    document.getElementById('post-form').style.display = 'none';
}

// Страница FreeM
function renderFreeMPage() {
    const container = document.getElementById('thread-container');
    let html = 
        <div class="thread-header">
            <h2>Свободные ветки</h2>
            <button onclick="createNewThread()" class="submit-btn">Создать ветку</button>
        </div>
    ;
    
    Object.entries(threads).forEach(([path, thread]) => {
        if (path.startsWith('/freeM/')) {
            html += 
                <div class="thread-card" onclick="navigateTo('${path}')">
                    <h3>/${path.split('/').pop()}</h3>
                    <p>${thread.title}</p>
                    <p>Сообщений: ${posts[path]?.length || 0}</p>
                    <small>Создана: ${new Date(thread.createdAt).toLocaleDateString()}</small>
                </div>
            ;
        }
    });
    
    container.innerHTML = html;
    document.getElementById('post-form').style.display = 'none';
}

// Страница ветки
function renderThreadPage(path) {
    const container = document.getElementById('thread-container');
    const thread = threads[path];
    
    if (!thread) {
        window.location.href = '/';
        return;
    }
    
    let html = 
        <div class="thread-header">
            <h2>${thread.title}</h2>
            <button onclick="window.history.back()" class="submit-btn">Назад</button>
        </div>
    ;
    
    if (posts[path]) {
        posts[path].forEach((post, index) => {
            html += 
                <div class="message">
                    <div class="post-content">${post.text}</div>
                    <div class="post-meta">
                        <span class="post-id">#${index + 1}</span>
                        <span class="post-date">${new Date(post.date).toLocaleString()}</span>
                    </div>
                </div>
            ;
        });
    }
    
    container.innerHTML = html;
    document.getElementById('post-form').style.display = 'block';
}

// Навигация
function navigateTo(path) {
    window.history.pushState({}, '', path);
    renderContent();
}

// Создание новой ветки
function createNewThread() {
    const code = generateThreadCode();
    const path = /freeM/${code};
    
    threads[path] = {
        title: Ветка /${code},
        isPredefined: false,
        createdAt: new Date().toISOString(),
        replies: 0,
        lastActivity: new Date().toISOString()
    };
    
    localStorage.setItem('threads', JSON.stringify(threads));
    navigateTo(path);
}

// Отправка сообщения
function submitPost() {
    const text = document.getElementById('post-content').value.trim();
    if (!text) return;
    
    const path = window.location.pathname;
    const post = {
        text,
        date: new Date().toISOString()
    };
    
    posts[path] = posts[path] || [];
    posts[path].push(post);
    
    threads[path].replies++;
    threads[path].lastActivity = new Date().toISOString();
    
    localStorage.setItem('posts', JSON.stringify(posts));
    localStorage.setItem('threads', JSON.stringify(threads));
    
    document.getElementById('post-content').value = '';
    renderThreadPage(path);
}

// Поиск веток
document.getElementById('thread-search').addEventListener('input', _.debounce(e => {
    const query = e.target.value.toLowerCase();
    const cards = document.getElementsByClassName('thread-card');
    
    Array.from(cards).forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
    });
}, 300));

// Инициализация
window.addEventListener('DOMContentLoaded', () => {
    initStorage();
    renderContent();
    window.onpopstate = renderContent;
});

// Режим реального времени
setInterval(() => {
    const newPosts = JSON.parse(localStorage.getItem('posts'));
    if (JSON.stringify(newPosts) !== JSON.stringify(posts)) {
        posts = newPosts;
        renderContent();
    }
}, 1000);

const predefinedThreads = {
    '/wn': 'World News',
    '/shit': 'Дичь',
    '/political': 'Политика',
    '/ru': 'Русское сообщество',
    '/en': 'Англоязычное сообщество',
    '/memes': 'Мемы',
    '/programing': 'Программирование',
    '/PTTK': 'Обсуждение имиджборды'
};

let threads = JSON.parse(localStorage.getItem('threads')) || {};
let posts = JSON.parse(localStorage.getItem('posts')) || {};
let currentPath = window.location.pathname;

// Инициализация хранилища
function initStorage() {
    Object.entries(predefinedThreads).forEach(([path, title]) => {
        if (!threads[path]) {
            threads[path] = {
                title,
                isPredefined: true,
                createdAt: new Date().toISOString(),
                replies: 0,
                lastActivity: new Date().toISOString()
            };
        }
    });
    localStorage.setItem('threads', JSON.stringify(threads));
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Генератор уникальных кодов
function generateThreadCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code;
    
    do {
        code = Array.from({length: 4}, () => chars[Math.floor(Math.random() * 52)]).join('') +
               Array.from({length: 2}, () => chars[52 + Math.floor(Math.random() * 10)]).join('') +
               Array.from({length: 2}, () => chars[Math.floor(Math.random() * 52)]).join('') +
               Array.from({length: 4}, () => chars[52 + Math.floor(Math.random() * 10)]).join('');
    } while (Object.keys(threads).some(k => k.includes(code)));
    
    return code;
}

// Отображение контента
function renderContent() {
    const container = document.getElementById('thread-container');
    const path = window.location.pathname;
    
    if (path === '/freeM') {
        renderFreeMPage();
        return;
    }
    
    if (path.startsWith('/freeM/') || Object.keys(predefinedThreads).includes(path)) {
        renderThreadPage(path);
        return;
    }
    
    renderMainPage();
}

// Главная страница
function renderMainPage() {
    const container = document.getElementById('thread-container');
    let html = '<h2>Активные ветки</h2>';
    
    Object.entries(threads).forEach(([path, thread]) => {
        if (thread.isPredefined) {
            html += 
                <div class="thread-card" onclick="navigateTo('${path}')">
                    <h3>${thread.title}</h3>
                    <p>Сообщений: ${posts[path]?.length || 0}</p>
                    <small>Последняя активность: ${new Date(thread.lastActivity).toLocaleString()}</small>
                </div>
            ;
        }
    });
    
    container.innerHTML = html;
    document.getElementById('post-form').style.display = 'none';
}

// Страница FreeM
function renderFreeMPage() {
    const container = document.getElementById('thread-container');
    let html = 
        <div class="thread-header">
            <h2>Свободные ветки</h2>
            <button onclick="createNewThread()" class="submit-btn">Создать ветку</button>
        </div>
    ;
    
    Object.entries(threads).forEach(([path, thread]) => {
        if (path.startsWith('/freeM/')) {
            html += 
                <div class="thread-card" onclick="navigateTo('${path}')">
                    <h3>/${path.split('/').pop()}</h3>
                    <p>${thread.title}</p>
                    <p>Сообщений: ${posts[path]?.length || 0}</p>
                    <small>Создана: ${new Date(thread.createdAt).toLocaleDateString()}</small>
                </div>
            ;
        }
    });
    
    container.innerHTML = html;
    document.getElementById('post-form').style.display = 'none';
}

// Страница ветки
function renderThreadPage(path) {
    const container = document.getElementById('thread-container');
    const thread = threads[path];
    
    if (!thread) {
        window.location.href = '/';
        return;
    }
    
    let html = 
        <div class="thread-header">
            <h2>${thread.title}</h2>
            <button onclick="window.history.back()" class="submit-btn">Назад</button>
        </div>
    ;
    
    if (posts[path]) {
        posts[path].forEach((post, index) => {
            html += 
                <div class="message">
                    <div class="post-content">${post.text}</div>
                    <div class="post-meta">
                        <span class="post-id">#${index + 1}</span>
                        <span class="post-date">${new Date(post.date).toLocaleString()}</span>
                    </div>
                </div>
            ;
        });
    }
    
    container.innerHTML = html;
    document.getElementById('post-form').style.display = 'block';
}

// Навигация
function navigateTo(path) {
    window.history.pushState({}, '', path);
    renderContent();
}

// Создание новой ветки
function createNewThread() {
    const code = generateThreadCode();
    const path = /freeM/${code};
    
    threads[path] = {
        title: Ветка /${code},
        isPredefined: false,
        createdAt: new Date().toISOString(),
        replies: 0,
        lastActivity: new Date().toISOString()
    };
    
    localStorage.setItem('threads', JSON.stringify(threads));
    navigateTo(path);
}

// Отправка сообщения
function submitPost() {
    const text = document.getElementById('post-content').value.trim();
    if (!text) return;
    
    const path = window.location.pathname;
    const post = {
        text,
        date: new Date().toISOString()
    };
    
    posts[path] = posts[path] || [];
    posts[path].push(post);
    
    threads[path].replies++;
    threads[path].lastActivity = new Date().toISOString();
    
    localStorage.setItem('posts', JSON.stringify(posts));
    localStorage.setItem('threads', JSON.stringify(threads));
    
    document.getElementById('post-content').value = '';
    renderThreadPage(path);
}

// Поиск веток
document.getElementById('thread-search').addEventListener('input', _.debounce(e => {
    const query = e.target.value.toLowerCase();
    const cards = document.getElementsByClassName('thread-card');
    
    Array.from(cards).forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        card.style.display = title.includes(query) ? 'block' : 'none';
    });
}, 300));

// Инициализация
window.addEventListener('DOMContentLoaded', () => {
    initStorage();
    renderContent();
    window.onpopstate = renderContent;
});

// Режим реального времени
setInterval(() => {
    const newPosts = JSON.parse(localStorage.getItem('posts'));
    if (JSON.stringify(newPosts) !== JSON.stringify(posts)) {
        posts = newPosts;
        renderContent();
    }
}, 1000);
