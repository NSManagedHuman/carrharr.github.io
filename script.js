const projects = [
    {
        name: "Work in progress, for now just a lorem ipsum",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas consequat faucibus odio, in dapibus purus tincidunt ut. Donec consectetur commodo lorem, sed tincidunt dui dictum at. Aliquam blandit convallis iaculis. In nunc arcu, convallis eu ex ut, pellentesque laoreet elit."
    }
];

let currentProjectIndex = 0;

function typeText(element, text, delay = 20) { // Increased typing speed
    return new Promise((resolve) => {
        let index = 0;
        function addChar() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(addChar, delay);
            } else {
                resolve();
            }
        }
        addChar();
    });
}

let currentTypingCleanup = null;

function showScreen(screenId) {
    isTypingDefinition = false;

    if (currentTypingCleanup) {
        currentTypingCleanup();
        currentTypingCleanup = null;
    }

    // Hide all screens
    document.querySelectorAll('#welcomeScreen, #definitionScreen, #projectsScreen')
        .forEach(screen => {
            screen.style.display = 'none';
        });
    
    // Show the target screen
    const targetScreen = document.getElementById(screenId);
    targetScreen.style.display = 'block';
    
    // Adjust window height to content
    const window = document.querySelector('.window');
    const editor = document.querySelector('.editor');
    const content = targetScreen.getBoundingClientRect();
    const headerHeight = document.querySelector('.window-header').offsetHeight;
    const padding = 40;
    const totalHeight = content.height + headerHeight + padding;
    
    requestAnimationFrame(() => {
        window.style.height = `${totalHeight}px`;
        editor.style.height = `${content.height + padding}px`;
    });
}

async function typeInitialScreen() {
    const comments = document.querySelectorAll('#welcomeScreen .comment');
    await typeText(comments[0], '// Hi', 20);
    await typeText(comments[1], '//', 20);
    await typeText(comments[2], '// Welcome to dannyharris.eu', 20);
    await typeText(comments[3], '//', 20);

    const code = document.querySelector('#welcomeScreen .code');
    code.innerHTML = '<span class="keyword">let</span> <span class="function">me</span> <span class="operator">=</span> <span class="function presentMyself">presentMyself</span><span class="operator">()</span>';
    
    document.getElementById('continueButton').style.display = 'block';
}

let isTypingDefinition = false;

async function typeDefinition() {
    if (isTypingDefinition) return;
    isTypingDefinition = true;

    const codeContent = document.getElementById('codeContent');
    codeContent.innerHTML = '';

    const lines = [
        { number: 1, content: '<span class="keyword">func</span> <span class="function">presentMyself</span><span class="operator">() -></span> <span class="function">Developer</span> <span class="operator">{</span>', indent: false },
        { number: 2, content: '<span class="keyword">var</span> <span class="operator">i =</span> <span class="function">Developer</span><span class="operator">(type: .</span><span class="keyword">iOS</span><span class="operator">)</span>', indent: true },
        { number: 3, content: '<span class="operator">i.am = </span><span class="string">"Daniel Carrillo Harris"</span>', indent: true },
        { number: 4, content: '<span class="operator">i.workFor = </span><span class="string">"TUI Group"</span>', indent: true },
        { number: 5, content: '<span class="operator">i.writeIn = [.</span><span class="keyword">swift</span><span class="operator">, .</span><span class="keyword">objc</span><span class="operator">, .</span><span class="keyword">bash</span><span class="operator">, .</span><span class="keyword">python</span><span class="operator">]</span>', indent: true },
        { number: 6, content: '<span class="operator">i.mainlyDevelopFor = [.</span><span class="keyword">iOS</span><span class="operator">, .</span><span class="keyword">iPadOS</span><span class="operator">, .</span><span class="keyword">internalTooling</span><span class="operator">]</span>', indent: true },
        { number: 7, content: '<span class="operator">i.amFrom = </span><span class="string">"Tenerife, 🇮🇨, 🇪🇸"</span>', indent: true },
        { number: 8, content: '<span class="operator">i.liveIn = </span><span class="string">"London, 🏴󠁧󠁢󠁥󠁮󠁧󠁿, 🇬🇧"</span>', indent: true },
        { number: 9, content: '<span class="operator">i.canBeContactedAt = </span><span class="string" id="email"><a class="string" href="mailto:hello@dannyharris.eu">"hello@dannyharris.eu"</a></span>', indent: true },
        { number: 10, content: '<span class="operator">}</span>', indent: false }
    ];

    try {
        for (const line of lines) {
            console.log(line)
            const lineDiv = document.createElement('div');
            lineDiv.className = 'line';
            lineDiv.innerHTML = `
                <div class="line-number">${line.number}</div>
                <div class="line-content ${line.indent ? 'indented' : ''}">${line.content}</div>
            `;
            codeContent.appendChild(lineDiv);
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        document.getElementById('viewProjectsButton').style.display = 'block';
    } finally {
        isTypingDefinition = false;
    }
}

function updateProject() {
    const project = projects[currentProjectIndex];
    const content = document.getElementById('currentProject');
    content.innerHTML = `
        <div class="line">
            <div class="line-number">1</div>
            <div class="line-content">
                <span class="keyword">let</span> <span class="function">project</span> <span class="operator">=</span> <span class="string">"${project.name}"</span>
            </div>
        </div>
        <div class="line">
            <div class="line-number">2</div>
            <div class="line-content">
                <span class="keyword">let</span> <span class="function">description</span> <span class="operator">=</span> <span class="string">"""</span>
            </div>
        </div>
        <div class="line">
            <div class="line-number">3</div>
            <div class="line-content indented">
                <span class="string">${project.description}</span>
            </div>
        </div>
        <div class="line">
            <div class="line-number">4</div>
            <div class="line-content">
                <span class="string">"""</span>
            </div>
        </div>
    `;

    document.getElementById('prevProject').disabled = currentProjectIndex === 0;
    document.getElementById('nextProject').disabled = currentProjectIndex === projects.length - 1;
}

// Event Listeners
document.getElementById('continueButton').addEventListener('click', () => {
    const bubble = document.getElementById('definitionBubble');
    const functionElement = document.querySelector('.presentMyself');
    const rect = functionElement.getBoundingClientRect();
    const editorRect = document.querySelector('.editor').getBoundingClientRect();
    
    bubble.style.display = 'block';
    bubble.style.left = `${rect.left - editorRect.left}px`;
    bubble.style.top = `${rect.top - editorRect.top - 40}px`;
});

document.getElementById('viewProjectsButton').addEventListener('click', () => {
    showScreen('projectsScreen');
    document.querySelector('#projectsScreen .back-button').style.display = 'block';
    updateProject();
});

document.getElementById('prevProject').addEventListener('click', () => {
    if (currentProjectIndex > 0) {
        currentProjectIndex--;
        updateProject();
    }
});

document.getElementById('nextProject').addEventListener('click', () => {
    if (currentProjectIndex < projects.length - 1) {
        currentProjectIndex++;
        updateProject();
    }
});

document.getElementById('definitionBubble').addEventListener('click', async () => {
    showScreen('definitionScreen');
    document.querySelector('#definitionScreen .back-button').style.display = 'block';
    await typeDefinition();
    showScreen('definitionScreen');
});

document.getElementById('viewProjectsButton').addEventListener('click', () => {
    showScreen('projectsScreen');
    document.querySelector('#projectsScreen .back-button').style.display = 'block';
    updateProject();
    setTimeout(() => showScreen('projectsScreen'), 50);
});

// Update back button handlers
document.querySelectorAll('.back-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const currentScreen = e.target.closest('[id$="Screen"]');
        if (currentScreen.id === 'projectsScreen') {
            showScreen('definitionScreen');
        } else {
            showScreen('welcomeScreen');
            document.getElementById('definitionBubble').style.display = 'none';
        }
        setTimeout(() => showScreen(currentScreen.id === 'projectsScreen' ? 'definitionScreen' : 'welcomeScreen'), 50);
    });
});

document.querySelectorAll('.back-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const currentScreen = e.target.closest('[id$="Screen"]');
        if (currentScreen.id === 'projectsScreen') {
            showScreen('definitionScreen');
        } else {
            showScreen('welcomeScreen');
            document.getElementById('definitionBubble').style.display = 'none';
        }
    });
});

typeInitialScreen();
