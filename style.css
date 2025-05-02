:root {
    --primary-color: #2c3e50;
    --accent-color: #3498db;
    --hover-color: #2980b9;
    --bg-color: #ecf0f1;
    --text-color: #2c3e50;
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: var(--bg-color);
    color: var(--text-color);
    display: flex;
    min-height: 100vh;
}

#header {
    position: fixed;
    top: 0;
    width: 100%;
    background: var(--primary-color);
    padding: 1rem;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.logo-letter {
    display: inline-block;
    font-size: 2.5rem;
    color: white;
    transition: all 0.3s ease;
    cursor: pointer;
}

.logo-letter:hover {
    transform: scale(1.2);
    margin: 0 10px;
    color: var(--accent-color);
}

#sidebar {
    width: 250px;
    background: white;
    padding: 20px;
    position: fixed;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: auto;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
}

.nav-item {
    margin: 10px 0;
    padding: 12px;
    border-radius: 5px;
    transition: all 0.3s ease;
}

.nav-item:hover {
    background: var(--bg-color);
    transform: translateX(10px);
}

.nav-item a {
    text-decoration: none;
    color: var(--text-color);
    font-weight: bold;
}

#content {
    margin-left: 290px;
    margin-top: 80px;
    padding: 20px;
    flex-grow: 1;
}

.thread-card {
    background: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
    cursor: pointer;
}

.thread-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.post-form {
    max-width: 800px;
    margin: 20px auto;
}

#post-content {
    width: 100%;
    height: 150px;
    padding: 15px;
    border: 2px solid var(--accent-color);
    border-radius: 8px;
    resize: vertical;
    transition: all 0.3s ease;
}

#post-content:focus {
    border-color: var(--hover-color);
    box-shadow: 0 0 10px rgba(52,152,219,0.3);
}

.submit-btn {
    background: var(--accent-color);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 25px;
    cursor: pointer;
    transition: all 0.3s ease;
    float: right;
    margin-top: 10px;
}

.submit-btn:hover {
    background: var(--hover-color);
    transform: scale(1.05);
}

.message {
    background: #f8f9fa;
    padding: 15px;
    border-left: 4px solid var(--accent-color);
    margin: 15px 0;
    border-radius: 5px;
    animation: slideIn 0.3s ease;
}

@keyframes slideIn {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

#thread-search {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 25px;
    margin: 20px 0;
    transition: all 0.3s ease;
}

#thread-search:focus {
    border-color: var(--accent-color);
    box-shadow: 0 0 15px rgba(52,152,219,0.2);
}
