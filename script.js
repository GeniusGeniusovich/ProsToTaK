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

// Инициализация предустановленных веток
Object.keys(predefinedThreads).forEach(path => {
    if (!threads[path]) {
        threads[path] = {
            title: predefinedThreads[path],
            isPredefined: true,
            createdAt: new Date().toISOString()
        };
    }
});

function generateCode() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let code = '';
    
    const pattern = [
        [letters, 4],
        [numbers, 2],
        [letters, 2],
        [numbers, 4]
    ];
    
    do {
        code = pattern.map(([chars, length]) => 
            Array.from({length}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        ).join('');
    } while (threads['/freeM/' + code]);
    
    return code;
}

function renderPage() {
    const path = window.location.pathname;
    const content = document.getElementById('content');
    
    if (path === '/freeM') {
        renderFreeM();
        return;
    }
    
    if (path.startsWith('/freeM/')) {
        renderThread(path);
        return;
    }
    
    if (predefinedThreads[path]) {
        renderThread(path);
        return;
    }
    
    // Главная страница
    content.innerHTML = 
        <h2>Закреплённые ветки</h2>
        ${Object.entries(predefinedThreads).map(([path, title]) => 
            <div class="thread">
                <a href="${path}">${title}</a>
            </div>
        ).join('')}
    ;
}

function renderFreeM() {
    const content = document.getElementById('content');
    content.innerHTML = 
        <h2>Свобода общения</h2>
        <button onclick="createNewThread()">Создать новую ветку</button>
        ${Object.keys(threads)
            .filter(path => path.startsWith('/freeM/'))
            .map(path => 
                <div class="thread">
                    <a href="${path}">${path.replace('/freeM/', '')}</a>
                </div>
            ).join('')}
    ;
}

function createNewThread() {
    const code = generateCode();
    const path = /freeM/${code};
    
    threads[path] = {
        title: code,
        isPredefined: false,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('threads', JSON.stringify(threads));
    window.location.href = path;
}

function renderThread(path) {
    if (!threads[path]) {
        window.location.href = '/';
        return;
    }
    
    const content = document.getElementById('content');
    document.getElementById('createThread').style.display = 'block';
    
    content.innerHTML = 
        <h2>${threads[path].title}</h2>
        <div id="messages">
            ${(posts[path] || []).map(post => 
                <div class="message">
                    <div>${post.text}</div>
                    <small>${new Date(post.date).toLocaleString()}</small>
                </div>
            ).join('')}
        </div>
    ;
}

function postMessage() {
    const text = document.getElementById('newMessage').value;
    if (!text) return;
    
    const path = window.location.pathname;
    const post = {
        text,
        date: new Date().toISOString()
    };
    
    posts[path] = posts[path] || [];
    posts[path].push(post);
    
    localStorage.setItem('posts', JSON.stringify(posts));
    document.getElementById('newMessage').value = '';
    renderThread(path);
}

// Инициализация
window.onload = () => {
    renderPage();
    window.onpopstate = renderPage;
};
