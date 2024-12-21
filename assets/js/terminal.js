const outputElement = document.getElementById('output');
const inputElement = document.getElementById('input');
const helpOverlay = document.createElement('div');
helpOverlay.id = 'help-overlay';
helpOverlay.style.display = 'none';
helpOverlay.style.position = 'fixed';
helpOverlay.style.top = '0';
helpOverlay.style.left = '0';
helpOverlay.style.width = '100%';
helpOverlay.style.height = '100%';
helpOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
helpOverlay.style.color = '#ffffff';
helpOverlay.style.fontFamily = 'Ubuntu Mono, monospace';
helpOverlay.style.padding = '20px';
helpOverlay.style.overflowY = 'auto';
helpOverlay.style.zIndex = '1000';
document.body.appendChild(helpOverlay);

const blogs = {
  'port-scanning': { content: 'Port scanning is a key technique in cybersecurity, revealing open doors to network services and potential vulnerabilities. By uncovering which ports are accessible, you can gain insights into network.', url: 'https://parthak314.gitbook.io/docs/~/changes/1zPhlIMzZERAXpdxecSv/parthak314-bytedocs-314-bytes/introduction-to-port-scanning' },
  'advent-of-cyber-2024': { content: 'Wait, this blog is yet to be released!', url: '' },
  'books-2024': { content: 'Wait, this blog is yet to be released!', url: '' }
};

const projects = {
  'finance': {
    'algothon-2024': { content: 'Every 19 minutes, Slack provides credentials for stock data used by a trading algorithm, with results submitted via Google Form.', url: 'https://parthak314.gitbook.io/docs/projects/algothon-2024' }
  },
  'hardware': {
    'riscv-processor': { content: 'This is the content of project 3.', url: 'https://example.com/project3' },
    'drone': { content: 'Design a high-speed, agile racing drone with advanced controls and FPV for competitive drone racing.', url: '' }
  },
  'cybersecurity': {
    'tbc': { content: 'Wait, this project is yet to be released!', url: '' }
  }
};

const commands = {
  'ls': 'List available blogs and projects',
  'cat [blog/project]': 'View content of a specific blog or project',
  'help': 'Show available commands',
  'clear': 'Clear the terminal',
  'echo [text]': 'Display text',
  'pwd': 'Print working directory',
  'cd [directory]': 'Change directory (blogs or projects)',
  'open [blog/project]': 'Open a blog or project URL in a new tab',
  'rename [new_name]': 'Rename the user',
  'fortune': 'Display a random fortune or quote',
  'date': 'Display the current date and time',
  'history': 'Show command history'
};

const history = [];
let historyIndex = -1;

let currentDirectory = '/';
let username = 'user';

inputElement.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    const command = inputElement.value.trim().toLowerCase();
    handleCommand(command);
    inputElement.value = '';
    historyIndex = -1; // Reset history index
  } else if (event.key === 'ArrowUp') {
    if (history.length > 0) {
      historyIndex = (historyIndex + 1) % history.length;
      inputElement.value = history[history.length - 1 - historyIndex];
    }
  } else if (event.key === 'Tab') {
    event.preventDefault();
    handleAutoComplete();
  } else if (event.key === 'q' && helpOverlay.style.display === 'block') {
    helpOverlay.style.display = 'none';
    inputElement.focus();
  }
});

function handleCommand(command) {
  history.push(command);
  const [cmd, ...args] = command.split(' ');

  switch (cmd) {
    case 'ls':
      if (currentDirectory === '/blogs') {
        outputElement.innerHTML += getPrompt() + command + '<br>' + Object.keys(blogs).join('<br>') + '<br>';
      } else if (currentDirectory.startsWith('/projects')) {
        const subDir = currentDirectory.split('/')[2];
        if (subDir && projects[subDir]) {
          outputElement.innerHTML += getPrompt() + command + '<br>' + Object.keys(projects[subDir]).join('<br>') + '<br>';
        } else {
          outputElement.innerHTML += getPrompt() + command + '<br>' + Object.keys(projects).join('<br>') + '<br>';
        }
      } else {
        outputElement.innerHTML += getPrompt() + command + '<br>' + 'blogs<br>projects<br>';
      }
      break;
    case 'cat':
      const itemName = args[0];
      if (currentDirectory.startsWith('/projects')) {
        const subDir = currentDirectory.split('/')[2];
        if (subDir && projects[subDir] && projects[subDir][itemName]) {
          outputElement.innerHTML += getPrompt() + command + '<br>' + projects[subDir][itemName].content + '<br>';
        } else {
          outputElement.innerHTML += getPrompt() + command + '<br>' + 'Item not found.<br>';
        }
      } else if (currentDirectory === '/blogs' && blogs[itemName]) {
        outputElement.innerHTML += getPrompt() + command + '<br>' + blogs[itemName].content + '<br>';
      } else {
        outputElement.innerHTML += getPrompt() + command + '<br>' + 'Item not found.<br>';
      }
      break;
    case 'help':
      showHelp();
      break;
    case 'clear':
      outputElement.innerHTML = '';
      break;
    case 'echo':
      const text = args.join(' ');
      outputElement.innerHTML += getPrompt() + command + '<br>' + text + '<br>';
      break;
    case 'pwd':
      outputElement.innerHTML += getPrompt() + command + '<br>' + currentDirectory + '<br>';
      break;
    case 'cd':
      const directory = args[0];
      console.log(`Attempting to change directory to: ${directory}`);
      if (directory === '..') {
        if (currentDirectory !== '/') {
          currentDirectory = currentDirectory.substring(0, currentDirectory.lastIndexOf('/')) || '/';
          console.log(`Changed directory to: ${currentDirectory}`);
          outputElement.innerHTML += getPrompt() + command + '<br>' + 'Changed directory to ' + currentDirectory + '<br>';
        } else {
          console.log('Already at root directory.');
          outputElement.innerHTML += getPrompt() + command + '<br>' + 'Already at root directory.<br>';
        }
      } else if (directory === 'blogs' || directory === 'projects') {
        currentDirectory = currentDirectory === '/' ? `/${directory}` : `${currentDirectory}/${directory}`;
        console.log(`Changed directory to: ${currentDirectory}`);
        outputElement.innerHTML += getPrompt() + command + '<br>' + 'Changed directory to ' + currentDirectory + '<br>';
      } else if (currentDirectory === '/projects' && projects[directory]) {
        currentDirectory = `${currentDirectory}/${directory}`;
        console.log(`Changed directory to: ${currentDirectory}`);
        outputElement.innerHTML += getPrompt() + command + '<br>' + 'Changed directory to ' + currentDirectory + '<br>';
      } else if (currentDirectory.startsWith('/projects') && projects[currentDirectory.split('/')[2]] && projects[currentDirectory.split('/')[2]][directory]) {
        currentDirectory = `${currentDirectory}/${directory}`;
        console.log(`Changed directory to: ${currentDirectory}`);
        outputElement.innerHTML += getPrompt() + command + '<br>' + 'Changed directory to ' + currentDirectory + '<br>';
      } else {
        console.log('Directory not found.');
        outputElement.innerHTML += getPrompt() + command + '<br>' + 'Directory not found.<br>';
      }
      break;
    case 'open':
      const itemToOpen = args[0];
      if (currentDirectory.startsWith('/projects')) {
        const subDir = currentDirectory.split('/')[2];
        if (subDir && projects[subDir] && projects[subDir][itemToOpen]) {
          const projectUrl = projects[subDir][itemToOpen].url;
          window.open(projectUrl, '_blank');
          outputElement.innerHTML += getPrompt() + command + '<br>' + 'Opened ' + projectUrl + ' in a new tab.<br>';
        } else {
          console.log('Item not found or cannot be opened.');
          outputElement.innerHTML += getPrompt() + command + '<br>' + 'Item not found or cannot be opened.<br>';
        }
      } else if (currentDirectory === '/blogs' && blogs[itemToOpen]) {
        const blogUrl = blogs[itemToOpen].url;
        window.open(blogUrl, '_blank');
        outputElement.innerHTML += getPrompt() + command + '<br>' + 'Opened ' + blogUrl + ' in a new tab.<br>';
      } else {
        console.log('Item not found or cannot be opened.');
        outputElement.innerHTML += getPrompt() + command + '<br>' + 'Item not found or cannot be opened.<br>';
      }
      break;
    case 'rename':
      const newName = args[0];
      if (newName) {
        username = newName;
        console.log(`Username changed to: ${username}`);
        outputElement.innerHTML += getPrompt() + command + '<br>' + 'Username changed to ' + username + '<br>';
      } else {
        console.log('Please provide a new username.');
        outputElement.innerHTML += getPrompt() + command + '<br>' + 'Please provide a new username.<br>';
      }
      break;
    case 'fortune':
      const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      outputElement.innerHTML += getPrompt() + command + '<br>' + randomFortune + '<br>';
      break;
    case 'date':
      const currentDate = new Date().toLocaleString();
      outputElement.innerHTML += getPrompt() + command + '<br>' + currentDate + '<br>';
      break;
    case 'history':
      outputElement.innerHTML += getPrompt() + command + '<br>' + history.join('<br>') + '<br>';
      break;
    default:
      console.log('Command not found.');
      outputElement.innerHTML += getPrompt() + command + '<br>' + 'Command not found.<br>';
  }
  outputElement.scrollTop = outputElement.scrollHeight;
  inputElement.focus(); // Ensure the input field is always focused
}

function handleAutoComplete() {
  const input = inputElement.value.trim().toLowerCase();
  const [cmd, ...args] = input.split(' ');

  let suggestions = [];

  if (args.length === 0) {
    // Suggest commands
    suggestions = Object.keys(commands).filter(command => command.startsWith(cmd));
  } else if (cmd === 'cd') {
    // Suggest directories
    if (currentDirectory === '/') {
      suggestions = ['blogs', 'projects'].filter(dir => dir.startsWith(args[0]));
    } else if (currentDirectory === '/projects') {
      suggestions = Object.keys(projects).filter(dir => dir.startsWith(args[0]));
    } else if (currentDirectory.startsWith('/projects')) {
      const subDir = currentDirectory.split('/')[2];
      if (projects[subDir]) {
        suggestions = Object.keys(projects[subDir]).filter(dir => dir.startsWith(args[0]));
      }
    }
  } else if (cmd === 'cat' || cmd === 'open') {
    // Suggest blogs or projects
    if (currentDirectory === '/blogs') {
      suggestions = Object.keys(blogs).filter(item => item.startsWith(args[0]));
    } else if (currentDirectory.startsWith('/projects')) {
      const subDir = currentDirectory.split('/')[2];
      if (projects[subDir]) {
        suggestions = Object.keys(projects[subDir]).filter(item => item.startsWith(args[0]));
      }
    }
  }

  if (suggestions.length === 1) {
    inputElement.value = `${cmd} ${suggestions[0]}`;
  } else if (suggestions.length > 1) {
    outputElement.innerHTML += getPrompt() + input + '<br>' + suggestions.join('<br>') + '<br>';
  }
}

function showHelp() {
  helpOverlay.innerHTML = '<h3>Available commands:</h3><br>' + Object.entries(commands).map(([cmd, desc]) => `${cmd} - ${desc}`).join('<br>') + '<br><br><br>Press q to exit.';
  helpOverlay.style.display = 'block';
  inputElement.blur();
}

function getPrompt() {
  return `${username}@parthak314.github.io:${currentDirectory}$ `;
}