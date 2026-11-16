/**
 * Dharmander Thakur - Portfolio Scripts
 * Interactive features: Filter, Terminal CLI, Copy to Clipboard, Mobile Nav
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = menuToggle.querySelector('i');
      if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Close mobile nav when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }

  // Project Category Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });

  // Copy Email to Clipboard
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');

  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener('click', () => {
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        const icon = copyEmailBtn.querySelector('i');
        icon.classList.remove('fa-regular', 'fa-copy');
        icon.classList.add('fa-solid', 'fa-check');
        copyEmailBtn.style.color = '#10b981';

        setTimeout(() => {
          icon.classList.remove('fa-solid', 'fa-check');
          icon.classList.add('fa-regular', 'fa-copy');
          copyEmailBtn.style.color = '';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy email:', err);
      });
    });
  }

  // Interactive CLI / Terminal Emulator
  const terminalForm = document.getElementById('terminalForm');
  const terminalInput = document.getElementById('terminalInput');
  const terminalBody = document.getElementById('terminalBody');
  const quickCmdBtns = document.querySelectorAll('.cmd-pill');

  const commands = {
    help: `Available commands:
  • <span class="cmd-highlight">whoami</span>     : Display quick profile summary
  • <span class="cmd-highlight">skills</span>     : Core languages, ML frameworks, and tools
  • <span class="cmd-highlight">projects</span>   : Top featured engineering projects
  • <span class="cmd-highlight">education</span>  : University and academic background
  • <span class="cmd-highlight">contact</span>    : Email, LinkedIn, and GitHub links
  • <span class="cmd-highlight">clear</span>      : Clear the terminal console output`,

    whoami: `<span style="color:#6366f1; font-weight:bold;">Dharmander Thakur</span>
  Age: 20
  Program: B.Tech in CSE (Artificial Intelligence) @ Shoolini University
  Focus: Low-level system performance (C/C++) + AI / Machine Learning (Python/Scikit-Learn) + Full-Stack Web.
  Mission: Creating efficient, scalable ML models and deploying them into accessible user-centric applications.`,

    skills: `<span style="color:#a855f7; font-weight:bold;">Core Technical Stack:</span>
  - Languages: C, C++, Python, JavaScript (ES6+), TypeScript, SQL, HTML5/CSS3
  - AI & ML: Scikit-Learn, Pandas, NumPy, K-Means Clustering, Regression, EDA, Data Cleaning, NLP (exploring)
  - Full-Stack: React, Vite, Tailwind CSS, Zustand, Flask, REST APIs
  - Tools: Git, GitHub (20+ repos), Jupyter Notebook, VS Code, Linux/PowerShell`,

    projects: `<span style="color:#06b6d4; font-weight:bold;">Top Highlights:</span>
  1. EduPulse: Next-Gen Campus Intelligence Cockpit (5,000+ students, Early Alert, Placement Engine)
  2. Delhi House Price Prediction: Regression valuation engine in Python
  3. Crop Classification: Smart agriculture AI recommender with web frontend
  4. Credit Card Fraud Detection: Anomaly detection on imbalanced financial transactions
  5. Customer Segmentation: Unsupervised K-Means clustering with Elbow validation
  6. Scribble Sync: Real-time collaborative canvas in TypeScript`,

    education: `<span style="color:#10b981; font-weight:bold;">Academic History:</span>
  Degree: B.Tech in Computer Science & Engineering (Artificial Intelligence)
  Institution: Shoolini University, Solan, Himachal Pradesh, India
  Status: Pursuing (Age 20)`,

    contact: `<span style="color:#f59e0b; font-weight:bold;">Contact & Social Profiles:</span>
  • Email    : <a href="mailto:dt4854539@gmail.com" style="color:#38bdf8;">dt4854539@gmail.com</a>
  • LinkedIn : <a href="https://www.linkedin.com/in/dharmander-thakur-944840399/" target="_blank" style="color:#38bdf8;">dharmander-thakur-944840399</a>
  • GitHub   : <a href="https://github.com/dharmander-081" target="_blank" style="color:#38bdf8;">github.com/dharmander-081</a>`,

    github: `Opening GitHub profile: <a href="https://github.com/dharmander-081" target="_blank" style="color:#38bdf8;">https://github.com/dharmander-081</a>`,
    linkedin: `Opening LinkedIn profile: <a href="https://www.linkedin.com/in/dharmander-thakur-944840399/" target="_blank" style="color:#38bdf8;">https://www.linkedin.com/in/dharmander-thakur-944840399/</a>`
  };

  function runTerminalCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    // Append input line
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span style="color:#10b981;">dharmander@shoolini:~$</span> <span style="color:#f1f5f9;">${cmdRaw}</span>`;
    terminalBody.appendChild(userLine);

    if (cmd === 'clear') {
      terminalBody.innerHTML = '';
      return;
    }

    const responseLine = document.createElement('div');
    responseLine.className = 'terminal-line';

    if (commands[cmd]) {
      responseLine.innerHTML = commands[cmd].replace(/\n/g, '<br>');
    } else {
      responseLine.innerHTML = `<span style="color:#ef4444;">command not found: "${cmd}". Type <span class="cmd-highlight">help</span> for a list of available commands.</span>`;
    }

    terminalBody.appendChild(responseLine);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  if (terminalForm && terminalInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      runTerminalCommand(terminalInput.value);
      terminalInput.value = '';
    });
  }

  quickCmdBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        runTerminalCommand(cmd);
      }
    });
  });
});
