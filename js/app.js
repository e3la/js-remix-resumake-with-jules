document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'resumake_data';

  // Initialize state
  let resumeData = loadData();

  // Cache DOM elements
  const previewContainer = document.getElementById('resume-preview');
  const templateSelect = document.getElementById('template-select');
  const latexModal = document.getElementById('latex-modal');
  const latexCode = document.getElementById('latex-code');
  const copyLatexBtn = document.getElementById('copy-latex-btn');
  const downloadLatexBtn = document.getElementById('download-latex-btn');
  const closeLatexModalBtn = document.getElementById('close-latex-modal');
  const jsonFileInput = document.getElementById('json-file-input');

  // Set initial template selector
  if (templateSelect) {
    templateSelect.value = resumeData.selectedTemplate || 'modern';
  }

  // Accordion section open state
  const openSections = { theme: false, printSetup: false, basics: true, work: false, education: false, projects: false, skills: false, awards: false };

  // Initial render
  renderForm();
  updatePreview();

  // --- Event Listeners for Header Actions ---

  // Template select change
  if (templateSelect) {
    templateSelect.addEventListener('change', (e) => {
      resumeData.selectedTemplate = e.target.value;
      saveData();
      updatePreview();
    });
  }

  // Regenerate Preview Button
  document.getElementById('btn-regenerate')?.addEventListener('click', () => {
    saveData();
    renderForm();
    updatePreview();
    const icon = document.querySelector('#btn-regenerate i');
    if (icon) {
      icon.classList.add('fa-spin');
      setTimeout(() => icon.classList.remove('fa-spin'), 500);
    }
  });

  // Load Sample Data Button
  document.getElementById('btn-sample-data')?.addEventListener('click', () => {
    if (confirm('Load sample data? This will overwrite your current edits.')) {
      resumeData = JSON.parse(JSON.stringify(window.sampleResumeData));
      if (templateSelect) templateSelect.value = resumeData.selectedTemplate;
      saveData();
      renderForm();
      updatePreview();
    }
  });

  // Clear Form Button
  document.getElementById('btn-clear-form')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all data?')) {
      resumeData = {
        selectedTemplate: templateSelect ? templateSelect.value : 'modern',
        headings: { work: 'Experience', education: 'Education', skills: 'Skills', projects: 'Projects', awards: 'Awards' },
        basics: { name: '', email: '', phone: '', location: { address: '' }, website: '', summary: '' },
        work: [],
        education: [],
        skills: [],
        projects: [],
        awards: []
      };
      saveData();
      renderForm();
      updatePreview();
    }
  });

  // Export JSON
  document.getElementById('btn-export-json')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resumeData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(resumeData.basics?.name || 'resume').toLowerCase().replace(/\s+/g, '_')}_resume.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Import JSON
  document.getElementById('btn-import-json')?.addEventListener('click', () => {
    jsonFileInput.click();
  });

  jsonFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        resumeData = normalizeImportedData(imported);
        if (templateSelect) templateSelect.value = resumeData.selectedTemplate || 'modern';
        saveData();
        renderForm();
        updatePreview();
        alert('Resume data imported successfully!');
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    jsonFileInput.value = '';
  });

  // View LaTeX Code
  document.getElementById('btn-view-latex')?.addEventListener('click', () => {
    const tex = window.generateLatex(resumeData);
    latexCode.value = tex;
    latexModal.classList.add('active');
  });

  closeLatexModalBtn?.addEventListener('click', () => {
    latexModal.classList.remove('active');
  });

  latexModal?.addEventListener('click', (e) => {
    if (e.target === latexModal) {
      latexModal.classList.remove('active');
    }
  });

  copyLatexBtn?.addEventListener('click', () => {
    latexCode.select();
    navigator.clipboard.writeText(latexCode.value);
    copyLatexBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
      copyLatexBtn.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
    }, 2000);
  });

  downloadLatexBtn?.addEventListener('click', () => {
    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(latexCode.value);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${(resumeData.basics?.name || 'resume').toLowerCase().replace(/\s+/g, '_')}.tex`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  });

  // Download PDF / Print
  document.getElementById('btn-download-pdf')?.addEventListener('click', () => {
    // If html2pdf is loaded, use html2pdf for direct download, else window.print()
    if (window.html2pdf) {
      const element = document.getElementById('resume-preview');
      const filename = `${(resumeData.basics?.name || 'resume').toLowerCase().replace(/\s+/g, '_')}_resume.pdf`;
      const opt = {
        margin:       0,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().set(opt).from(element).save();
    } else {
      window.print();
    }
  });


  // Mobile drawer toggle for form editor
  const toggleDrawerBtn = document.getElementById('toggle-editor-btn');
  const sidebar = document.querySelector('.editor-sidebar');
  if (toggleDrawerBtn && sidebar) {
    toggleDrawerBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }

  // --- Core State & Form Functions ---

  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load from localStorage', e);
    }
    // Fallback to sample resume data
    return JSON.parse(JSON.stringify(window.sampleResumeData));
  }

  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }

  function updatePreview() {
    window.renderResumePreview(resumeData, previewContainer);
  }

  function renderForm() {
    const formContainer = document.getElementById('editor-form-container');
    if (!formContainer) return;

    formContainer.innerHTML = `
      <!-- THEME & DATE STYLING SECTION -->
      <section id="section-theme" class="form-section ${openSections.theme ? 'open' : ''}">
        <button type="button" class="accordion-header" onclick="toggleAccordion('theme')">
          <span class="accordion-title"><i class="fas fa-paint-brush"></i> Theme & Date Styling</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </button>
        <div class="accordion-body">
          <div class="form-grid-2">
            <div class="form-group grid-span-2">
              <label>Date & Location Font Style</label>
              <select id="theme-date-font" class="select-input" data-key="theme.dateFont" style="width:100%;">
                <option value="default" ${(resumeData.theme?.dateFont === 'default' || !resumeData.theme?.dateFont) ? 'selected' : ''}>Standard Default</option>
                <option value="italic" ${resumeData.theme?.dateFont === 'italic' ? 'selected' : ''}>Italic Accent</option>
                <option value="monospace" ${resumeData.theme?.dateFont === 'monospace' ? 'selected' : ''}>Monospace Tech</option>
                <option value="serif" ${resumeData.theme?.dateFont === 'serif' ? 'selected' : ''}>Georgia Serif</option>
                <option value="sans" ${resumeData.theme?.dateFont === 'sans' ? 'selected' : ''}>Bold Sans-Serif</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- PRINT & PAGE FIT SETUP SECTION -->
      <section id="section-print-setup" class="form-section ${openSections.printSetup ? 'open' : ''}">
        <button type="button" class="accordion-header" onclick="toggleAccordion('printSetup')">
          <span class="accordion-title"><i class="fas fa-compress-alt"></i> Page Fit & Print Setup</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </button>
        <div class="accordion-body">
          <div style="margin-bottom: 12px;">
            <button type="button" class="btn btn-primary btn-sm btn-block" id="btn-auto-fit">
              <i class="fas fa-magic"></i> Auto-Fit Resume to 1 Page
            </button>
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label>Page Scale: <span id="scale-val-label">${resumeData.printSetup?.scale || 100}%</span></label>
              <input type="range" min="60" max="100" step="1" id="print-scale-input" value="${resumeData.printSetup?.scale || 100}">
            </div>
            <div class="form-group">
              <label>Margin Padding</label>
              <select id="print-margin-select" class="select-input">
                <option value="normal" ${(resumeData.printSetup?.margins === 'normal' || !resumeData.printSetup?.margins) ? 'selected' : ''}>Normal (0.6in / 0.75in)</option>
                <option value="compact" ${resumeData.printSetup?.margins === 'compact' ? 'selected' : ''}>Compact (0.4in / 0.5in)</option>
                <option value="relaxed" ${resumeData.printSetup?.margins === 'relaxed' ? 'selected' : ''}>Relaxed (0.8in / 1.0in)</option>
              </select>
            </div>
            <div class="form-group grid-span-2">
              <label>Section Spacing</label>
              <select id="print-spacing-select" class="select-input">
                <option value="normal" ${(resumeData.printSetup?.spacing === 'normal' || !resumeData.printSetup?.spacing) ? 'selected' : ''}>Normal Spacing</option>
                <option value="tight" ${resumeData.printSetup?.spacing === 'tight' ? 'selected' : ''}>Tight Spacing</option>
                <option value="spacious" ${resumeData.printSetup?.spacing === 'spacious' ? 'selected' : ''}>Spacious</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- BASICS SECTION -->
      <section id="section-basics" class="form-section ${openSections.basics ? 'open' : ''}">
        <button type="button" class="accordion-header" onclick="toggleAccordion('basics')">
          <span class="accordion-title"><i class="fas fa-user"></i> Personal Information</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </button>
        <div class="accordion-body">
          <div class="form-grid-2">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" data-key="basics.name" value="${escapeAttr(resumeData.basics?.name)}" placeholder="Jane Doe">
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" data-key="basics.email" value="${escapeAttr(resumeData.basics?.email)}" placeholder="jane@example.com">
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" data-key="basics.phone" value="${escapeAttr(resumeData.basics?.phone)}" placeholder="(555) 000-0000">
            </div>
            <div class="form-group">
              <label>Location / City, State</label>
              <input type="text" data-key="basics.location.address" value="${escapeAttr(resumeData.basics?.location?.address)}" placeholder="San Francisco, CA">
            </div>
            <div class="form-group grid-span-2">
              <label>Website / Portfolio URL</label>
              <input type="url" data-key="basics.website" value="${escapeAttr(resumeData.basics?.website)}" placeholder="https://janedoe.dev">
            </div>
            <div class="form-group grid-span-2">
              <label>Summary / Professional Profile</label>
              <textarea data-key="basics.summary" rows="3" placeholder="Brief statement summarizing your experience and goals...">${escapeHtmlText(resumeData.basics?.summary)}</textarea>
            </div>
          </div>
        </div>
      </section>

      <!-- WORK EXPERIENCE SECTION -->
      <section id="section-work" class="form-section ${openSections.work ? 'open' : ''}">
        <button type="button" class="accordion-header" onclick="toggleAccordion('work')">
          <span class="accordion-title"><i class="fas fa-briefcase"></i> Work Experience</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </button>
        <div class="accordion-body">
          <div class="section-header-flex">
            <label class="page-break-toggle">
              <input type="checkbox" onchange="togglePageBreak('section-work', this.checked)" ${resumeData.pageBreaks?.['section-work'] ? 'checked' : ''}>
              Page Break Before Section
            </label>
            <div style="display:flex; gap:6px; align-items:center;">
              <button type="button" class="btn-icon danger" onclick="clearSection('work')" title="Clear entire Work section"><i class="fas fa-trash"></i></button>
              <input type="text" class="heading-input" data-key="headings.work" value="${escapeAttr(resumeData.headings?.work || 'Experience')}" placeholder="Section Title">
            </div>
          </div>
          <div id="work-items-container"></div>
          <button type="button" class="btn btn-secondary btn-sm btn-block" id="add-work-btn"><i class="fas fa-plus"></i> Add Work Experience</button>
        </div>
      </section>

      <!-- EDUCATION SECTION -->
      <section id="section-education" class="form-section ${openSections.education ? 'open' : ''}">
        <button type="button" class="accordion-header" onclick="toggleAccordion('education')">
          <span class="accordion-title"><i class="fas fa-graduation-cap"></i> Education</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </button>
        <div class="accordion-body">
          <div class="section-header-flex">
            <label class="page-break-toggle">
              <input type="checkbox" onchange="togglePageBreak('section-education', this.checked)" ${resumeData.pageBreaks?.['section-education'] ? 'checked' : ''}>
              Page Break Before Section
            </label>
            <div style="display:flex; gap:6px; align-items:center;">
              <button type="button" class="btn-icon danger" onclick="clearSection('education')" title="Clear entire Education section"><i class="fas fa-trash"></i></button>
              <input type="text" class="heading-input" data-key="headings.education" value="${escapeAttr(resumeData.headings?.education || 'Education')}" placeholder="Section Title">
            </div>
          </div>
          <div id="education-items-container"></div>
          <button type="button" class="btn btn-secondary btn-sm btn-block" id="add-education-btn"><i class="fas fa-plus"></i> Add Education</button>
        </div>
      </section>

      <!-- PROJECTS SECTION -->
      <section id="section-projects" class="form-section ${openSections.projects ? 'open' : ''}">
        <button type="button" class="accordion-header" onclick="toggleAccordion('projects')">
          <span class="accordion-title"><i class="fas fa-code-branch"></i> Projects</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </button>
        <div class="accordion-body">
          <div class="section-header-flex">
            <label class="page-break-toggle">
              <input type="checkbox" onchange="togglePageBreak('section-projects', this.checked)" ${resumeData.pageBreaks?.['section-projects'] ? 'checked' : ''}>
              Page Break Before Section
            </label>
            <div style="display:flex; gap:6px; align-items:center;">
              <button type="button" class="btn-icon danger" onclick="clearSection('projects')" title="Clear entire Projects section"><i class="fas fa-trash"></i></button>
              <input type="text" class="heading-input" data-key="headings.projects" value="${escapeAttr(resumeData.headings?.projects || 'Projects')}" placeholder="Section Title">
            </div>
          </div>
          <div id="projects-items-container"></div>
          <button type="button" class="btn btn-secondary btn-sm btn-block" id="add-projects-btn"><i class="fas fa-plus"></i> Add Project</button>
        </div>
      </section>

      <!-- SKILLS SECTION -->
      <section id="section-skills" class="form-section ${openSections.skills ? 'open' : ''}">
        <button type="button" class="accordion-header" onclick="toggleAccordion('skills')">
          <span class="accordion-title"><i class="fas fa-tools"></i> Skills</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </button>
        <div class="accordion-body">
          <div class="section-header-flex">
            <label class="page-break-toggle">
              <input type="checkbox" onchange="togglePageBreak('section-skills', this.checked)" ${resumeData.pageBreaks?.['section-skills'] ? 'checked' : ''}>
              Page Break Before Section
            </label>
            <div style="display:flex; gap:6px; align-items:center;">
              <button type="button" class="btn-icon danger" onclick="clearSection('skills')" title="Clear entire Skills section"><i class="fas fa-trash"></i></button>
              <input type="text" class="heading-input" data-key="headings.skills" value="${escapeAttr(resumeData.headings?.skills || 'Skills')}" placeholder="Section Title">
            </div>
          </div>
          <div id="skills-items-container"></div>
          <button type="button" class="btn btn-secondary btn-sm btn-block" id="add-skills-btn"><i class="fas fa-plus"></i> Add Skill Group</button>
        </div>
      </section>

      <!-- AWARDS SECTION -->
      <section id="section-awards" class="form-section ${openSections.awards ? 'open' : ''}">
        <button type="button" class="accordion-header" onclick="toggleAccordion('awards')">
          <span class="accordion-title"><i class="fas fa-trophy"></i> Awards & Certifications</span>
          <i class="fas fa-chevron-down accordion-icon"></i>
        </button>
        <div class="accordion-body">
          <div class="section-header-flex">
            <label class="page-break-toggle">
              <input type="checkbox" onchange="togglePageBreak('section-awards', this.checked)" ${resumeData.pageBreaks?.['section-awards'] ? 'checked' : ''}>
              Page Break Before Section
            </label>
            <div style="display:flex; gap:6px; align-items:center;">
              <button type="button" class="btn-icon danger" onclick="clearSection('awards')" title="Clear entire Awards section"><i class="fas fa-trash"></i></button>
              <input type="text" class="heading-input" data-key="headings.awards" value="${escapeAttr(resumeData.headings?.awards || 'Awards')}" placeholder="Section Title">
            </div>
          </div>
          <div id="awards-items-container"></div>
          <button type="button" class="btn btn-secondary btn-sm btn-block" id="add-awards-btn"><i class="fas fa-plus"></i> Add Award</button>
        </div>
      </section>
    `;

    renderWorkItems();
    renderEducationItems();
    renderProjectsItems();
    renderSkillsItems();
    renderAwardsItems();

    // Attach dynamic input/select listeners
    formContainer.querySelectorAll('input, textarea, select').forEach(input => {
      if (!input.id || (!input.id.startsWith('print-') && input.id !== 'btn-auto-fit')) {
        input.addEventListener('input', handleInputChange);
        input.addEventListener('change', handleInputChange);
      }
    });

    // Page Fit / Print setup listeners
    const scaleInput = document.getElementById('print-scale-input');
    const marginSelect = document.getElementById('print-margin-select');
    const spacingSelect = document.getElementById('print-spacing-select');
    const autoFitBtn = document.getElementById('btn-auto-fit');

    if (scaleInput) {
      scaleInput.addEventListener('input', (e) => {
        if (!resumeData.printSetup) resumeData.printSetup = {};
        resumeData.printSetup.scale = parseInt(e.target.value, 10);
        document.getElementById('scale-val-label').textContent = `${resumeData.printSetup.scale}%`;
        saveData();
        updatePreview();
      });
    }

    if (marginSelect) {
      marginSelect.addEventListener('change', (e) => {
        if (!resumeData.printSetup) resumeData.printSetup = {};
        resumeData.printSetup.margins = e.target.value;
        saveData();
        updatePreview();
      });
    }

    if (spacingSelect) {
      spacingSelect.addEventListener('change', (e) => {
        if (!resumeData.printSetup) resumeData.printSetup = {};
        resumeData.printSetup.spacing = e.target.value;
        saveData();
        updatePreview();
      });
    }

    if (autoFitBtn) {
      autoFitBtn.addEventListener('click', autoFitToSinglePage);
    }

    // Dynamic buttons
    document.getElementById('add-work-btn')?.addEventListener('click', () => {
      resumeData.work.push({ company: '', position: '', location: '', startDate: '', endDate: '', highlights: [''] });
      saveData();
      renderWorkItems();
      updatePreview();
    });

    document.getElementById('add-education-btn')?.addEventListener('click', () => {
      resumeData.education.push({ institution: '', area: '', studyType: '', location: '', startDate: '', endDate: '', score: '' });
      saveData();
      renderEducationItems();
      updatePreview();
    });

    document.getElementById('add-projects-btn')?.addEventListener('click', () => {
      resumeData.projects.push({ name: '', description: '', url: '', keywords: [] });
      saveData();
      renderProjectsItems();
      updatePreview();
    });

    document.getElementById('add-skills-btn')?.addEventListener('click', () => {
      resumeData.skills.push({ name: '', keywords: [] });
      saveData();
      renderSkillsItems();
      updatePreview();
    });

    document.getElementById('add-awards-btn')?.addEventListener('click', () => {
      resumeData.awards.push({ title: '', awarder: '', date: '', summary: '' });
      saveData();
      renderAwardsItems();
      updatePreview();
    });
  }

  function handleInputChange(e) {
    const key = e.target.getAttribute('data-key');
    if (!key) return;
    setNestedValue(resumeData, key, e.target.value);
    saveData();
    updatePreview();
  }

  // Render Sub-Sections
  function renderWorkItems() {
    const container = document.getElementById('work-items-container');
    if (!container) return;
    container.innerHTML = (resumeData.work || []).map((job, idx) => `
      <div class="dynamic-card">
        <div class="card-header">
          <span class="card-title">${escapeHtmlText(job.company || `Job #${idx + 1}`)}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <label class="page-break-toggle">
              <input type="checkbox" onchange="togglePageBreak('work-${idx}', this.checked)" ${resumeData.pageBreaks?.[`work-${idx}`] ? 'checked' : ''}> Break
            </label>
            <button type="button" class="btn-icon danger" onclick="removeWorkItem(${idx})"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Company / Organization</label>
            <input type="text" data-key="work.${idx}.company" value="${escapeAttr(job.company)}" placeholder="Acme Inc.">
          </div>
          <div class="form-group">
            <label>Position / Role Title</label>
            <input type="text" data-key="work.${idx}.position" value="${escapeAttr(job.position)}" placeholder="Software Engineer">
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" data-key="work.${idx}.location" value="${escapeAttr(job.location)}" placeholder="City, State">
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label>Start Date</label>
              <input type="text" data-key="work.${idx}.startDate" value="${escapeAttr(job.startDate)}" placeholder="2020">
            </div>
            <div class="form-group">
              <label>End Date</label>
              <input type="text" data-key="work.${idx}.endDate" value="${escapeAttr(job.endDate)}" placeholder="Present">
            </div>
          </div>
          <div class="form-group grid-span-2">
            <label>Highlights / Responsibilities (One per line)</label>
            <textarea data-key="work.${idx}.highlights" rows="3" placeholder="Key achievement 1&#10;Key achievement 2" oninput="handleWorkHighlightsChange(event, ${idx})">${escapeHtmlText((job.highlights || []).join('\n'))}</textarea>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('input').forEach(input => input.addEventListener('input', handleInputChange));
  }

  function renderEducationItems() {
    const container = document.getElementById('education-items-container');
    if (!container) return;
    container.innerHTML = (resumeData.education || []).map((edu, idx) => `
      <div class="dynamic-card">
        <div class="card-header">
          <span class="card-title">${escapeHtmlText(edu.institution || `School #${idx + 1}`)}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <label class="page-break-toggle">
              <input type="checkbox" onchange="togglePageBreak('education-${idx}', this.checked)" ${resumeData.pageBreaks?.[`education-${idx}`] ? 'checked' : ''}> Break
            </label>
            <button type="button" class="btn-icon danger" onclick="removeEducationItem(${idx})"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group grid-span-2">
            <label>Institution / School Name</label>
            <input type="text" data-key="education.${idx}.institution" value="${escapeAttr(edu.institution)}" placeholder="UC Berkeley">
          </div>
          <div class="form-group">
            <label>Degree Type</label>
            <input type="text" data-key="education.${idx}.studyType" value="${escapeAttr(edu.studyType)}" placeholder="B.S.">
          </div>
          <div class="form-group">
            <label>Field of Study / Area</label>
            <input type="text" data-key="education.${idx}.area" value="${escapeAttr(edu.area)}" placeholder="Computer Science">
          </div>
          <div class="form-group">
            <label>Location</label>
            <input type="text" data-key="education.${idx}.location" value="${escapeAttr(edu.location)}" placeholder="Berkeley, CA">
          </div>
          <div class="form-group">
            <label>GPA / Score (Optional)</label>
            <input type="text" data-key="education.${idx}.score" value="${escapeAttr(edu.score)}" placeholder="3.8 / 4.0">
          </div>
          <div class="form-group">
            <label>Start Date</label>
            <input type="text" data-key="education.${idx}.startDate" value="${escapeAttr(edu.startDate)}" placeholder="2016">
          </div>
          <div class="form-group">
            <label>End Date / Grad Year</label>
            <input type="text" data-key="education.${idx}.endDate" value="${escapeAttr(edu.endDate)}" placeholder="2020">
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('input').forEach(input => input.addEventListener('input', handleInputChange));
  }

  function renderProjectsItems() {
    const container = document.getElementById('projects-items-container');
    if (!container) return;
    container.innerHTML = (resumeData.projects || []).map((proj, idx) => `
      <div class="dynamic-card">
        <div class="card-header">
          <span class="card-title">${escapeHtmlText(proj.name || `Project #${idx + 1}`)}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <label class="page-break-toggle">
              <input type="checkbox" onchange="togglePageBreak('projects-${idx}', this.checked)" ${resumeData.pageBreaks?.[`projects-${idx}`] ? 'checked' : ''}> Break
            </label>
            <button type="button" class="btn-icon danger" onclick="removeProjectItem(${idx})"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Project Name</label>
            <input type="text" data-key="projects.${idx}.name" value="${escapeAttr(proj.name)}" placeholder="My Cool App">
          </div>
          <div class="form-group">
            <label>Project URL</label>
            <input type="text" data-key="projects.${idx}.url" value="${escapeAttr(proj.url)}" placeholder="https://github.com/...">
          </div>
          <div class="form-group grid-span-2">
            <label>Technologies / Keywords (Comma separated)</label>
            <input type="text" value="${escapeAttr((proj.keywords || []).join(', '))}" placeholder="React, Node.js, MongoDB" oninput="handleKeywordsChange(event, 'projects', ${idx})">
          </div>
          <div class="form-group grid-span-2">
            <label>Project Description</label>
            <textarea data-key="projects.${idx}.description" rows="2" placeholder="Brief overview of what you built and achieved...">${escapeHtmlText(proj.description)}</textarea>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('input, textarea').forEach(input => {
      if (input.getAttribute('data-key')) input.addEventListener('input', handleInputChange);
    });
  }

  function renderSkillsItems() {
    const container = document.getElementById('skills-items-container');
    if (!container) return;
    container.innerHTML = (resumeData.skills || []).map((skill, idx) => `
      <div class="dynamic-card">
        <div class="card-header">
          <span class="card-title">${escapeHtmlText(skill.name || `Skill Group #${idx + 1}`)}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <label class="page-break-toggle">
              <input type="checkbox" onchange="togglePageBreak('skills-${idx}', this.checked)" ${resumeData.pageBreaks?.[`skills-${idx}`] ? 'checked' : ''}> Break
            </label>
            <button type="button" class="btn-icon danger" onclick="removeSkillItem(${idx})"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Category Name</label>
            <input type="text" data-key="skills.${idx}.name" value="${escapeAttr(skill.name)}" placeholder="e.g. Languages / Frameworks">
          </div>
          <div class="form-group">
            <label>Skills / Keywords (Comma separated)</label>
            <input type="text" value="${escapeAttr((skill.keywords || []).join(', '))}" placeholder="JavaScript, Python, Go" oninput="handleKeywordsChange(event, 'skills', ${idx})">
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('input').forEach(input => {
      if (input.getAttribute('data-key')) input.addEventListener('input', handleInputChange);
    });
  }

  function renderAwardsItems() {
    const container = document.getElementById('awards-items-container');
    if (!container) return;
    container.innerHTML = (resumeData.awards || []).map((award, idx) => `
      <div class="dynamic-card">
        <div class="card-header">
          <span class="card-title">${escapeHtmlText(award.title || `Award #${idx + 1}`)}</span>
          <div style="display:flex; align-items:center; gap:8px;">
            <label class="page-break-toggle">
              <input type="checkbox" onchange="togglePageBreak('awards-${idx}', this.checked)" ${resumeData.pageBreaks?.[`awards-${idx}`] ? 'checked' : ''}> Break
            </label>
            <button type="button" class="btn-icon danger" onclick="removeAwardItem(${idx})"><i class="fas fa-trash-alt"></i></button>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label>Award / Certification Title</label>
            <input type="text" data-key="awards.${idx}.title" value="${escapeAttr(award.title)}" placeholder="1st Place Winner">
          </div>
          <div class="form-group">
            <label>Issuer / Organization</label>
            <input type="text" data-key="awards.${idx}.awarder" value="${escapeAttr(award.awarder)}" placeholder="Global Hackathon">
          </div>
          <div class="form-group">
            <label>Date Received</label>
            <input type="text" data-key="awards.${idx}.date" value="${escapeAttr(award.date)}" placeholder="2022">
          </div>
          <div class="form-group">
            <label>Summary / Details</label>
            <input type="text" data-key="awards.${idx}.summary" value="${escapeAttr(award.summary)}" placeholder="Awarded for...">
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('input').forEach(input => input.addEventListener('input', handleInputChange));
  }

  // Accordion Toggle
  window.toggleAccordion = (sectionKey) => {
    openSections[sectionKey] = !openSections[sectionKey];
    renderForm();
  };

  // Standalone Print View Listener
  document.getElementById('btn-print-view')?.addEventListener('click', () => {
    openPrintWindow();
  });

  function openPrintWindow() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocked! Please allow pop-ups for this site to open the standalone print view.');
      return;
    }

    const previewHTML = document.getElementById('resume-preview').innerHTML;
    const printSetup = resumeData.printSetup || {};
    const templateClass = `template-${resumeData.selectedTemplate || 'modern'}`;
    const dateFontClass = `date-font-${resumeData.theme?.dateFont || 'default'}`;
    const marginClass = `margin-${printSetup.margins || 'normal'}`;
    const spacingClass = `spacing-${printSetup.spacing || 'normal'}`;
    const scaleFactor = (printSetup.scale || 100) / 100;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtmlText(resumeData.basics?.name || 'Resume')} - Print View</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="stylesheet" href="css/style.css">
        <style>
          body {
            background: #f4f6f8;
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            overflow-y: auto;
            height: auto;
          }
          .standalone-wrapper {
            background: #fff;
            color: #111;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            width: 8.5in;
            min-height: 11in;
            box-sizing: border-box;
            transform: scale(${scaleFactor});
            transform-origin: top center;
          }
          @media print {
            body {
              background: #fff;
              padding: 0;
              display: block;
            }
            .standalone-wrapper {
              box-shadow: none;
              width: 100%;
            }
          }
        </style>
      </head>
      <body>
        <div class="standalone-wrapper resume-paper ${templateClass} ${dateFontClass} ${marginClass} ${spacingClass}">
          ${previewHTML}
        </div>
        <script>
          // Automatically trigger print dialog on render if desired, or user can use native browser print controls
          window.addEventListener('load', () => {
            // setTimeout(() => window.print(), 300);
          });
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  function autoFitToSinglePage() {
    const previewEl = document.getElementById('resume-preview');
    if (!previewEl) return;

    // Reset temporary inline zoom/transforms on element before measuring scroll height
    previewEl.style.transform = 'none';
    previewEl.style.transformOrigin = 'top center';

    // Target height for standard letter page: 11in (1056px at 96 DPI)
    const targetPx = 1056;
    const currentScrollHeight = previewEl.scrollHeight;

    if (!resumeData.printSetup) resumeData.printSetup = {};

    if (currentScrollHeight <= targetPx) {
      resumeData.printSetup.scale = 100;
      resumeData.printSetup.spacing = 'normal';
      resumeData.printSetup.margins = 'normal';
    } else {
      // Calculate needed scale ratio
      let calculatedScale = Math.floor((targetPx / currentScrollHeight) * 100);

      // Clamp between 60% and 100%
      if (calculatedScale < 60) {
        calculatedScale = 60;
        resumeData.printSetup.spacing = 'tight';
        resumeData.printSetup.margins = 'compact';
      } else if (calculatedScale < 85) {
        resumeData.printSetup.spacing = 'tight';
        resumeData.printSetup.margins = 'compact';
      } else if (calculatedScale < 95) {
        resumeData.printSetup.spacing = 'tight';
      }
      resumeData.printSetup.scale = calculatedScale;
    }

    saveData();
    renderForm();
    updatePreview();
  }

  window.togglePageBreak = (key, isChecked) => {
    if (!resumeData.pageBreaks) resumeData.pageBreaks = {};
    resumeData.pageBreaks[key] = isChecked;
    saveData();
    updatePreview();
  };

  // --- Global Window Helpers for Dynamic Delete/Key handlers ---
  window.clearSection = (sectionName) => {
    if (confirm(`Are you sure you want to clear all items in ${sectionName}?`)) {
      resumeData[sectionName] = [];
      saveData();
      renderForm();
      updatePreview();
    }
  };

  window.removeWorkItem = (idx) => {
    resumeData.work.splice(idx, 1);
    saveData();
    renderWorkItems();
    updatePreview();
  };

  window.removeEducationItem = (idx) => {
    resumeData.education.splice(idx, 1);
    saveData();
    renderEducationItems();
    updatePreview();
  };

  window.removeProjectItem = (idx) => {
    resumeData.projects.splice(idx, 1);
    saveData();
    renderProjectsItems();
    updatePreview();
  };

  window.removeSkillItem = (idx) => {
    resumeData.skills.splice(idx, 1);
    saveData();
    renderSkillsItems();
    updatePreview();
  };

  window.removeAwardItem = (idx) => {
    resumeData.awards.splice(idx, 1);
    saveData();
    renderAwardsItems();
    updatePreview();
  };

  window.handleWorkHighlightsChange = (e, idx) => {
    const lines = e.target.value.split('\n');
    if (!resumeData.work[idx]) return;
    resumeData.work[idx].highlights = lines;
    saveData();
    updatePreview();
  };

  window.handleKeywordsChange = (e, section, idx) => {
    const keywords = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
    if (!resumeData[section][idx]) return;
    resumeData[section][idx].keywords = keywords;
    saveData();
    updatePreview();
  };

  // --- Utility Helpers ---
  function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i];
      if (!current[k]) {
        current[k] = isNaN(keys[i + 1]) ? {} : [];
      }
      current = current[k];
    }
    current[keys[keys.length - 1]] = value;
  }

  function escapeAttr(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/"/g, '&quot;');
  }

  function escapeHtmlText(val) {
    if (val === null || val === undefined) return '';
    return String(val)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function normalizeImportedData(data) {
    return {
      selectedTemplate: data.selectedTemplate || 'modern',
      theme: Object.assign({ dateFont: 'default' }, data.theme || {}),
      printSetup: Object.assign({ scale: 100, margins: 'normal', spacing: 'normal' }, data.printSetup || {}),
      pageBreaks: Object.assign({}, data.pageBreaks || {}),
      headings: Object.assign({ work: 'Experience', education: 'Education', skills: 'Skills', projects: 'Projects', awards: 'Awards' }, data.headings || {}),
      basics: Object.assign({ name: '', email: '', phone: '', location: { address: '' }, website: '', summary: '' }, data.basics || {}),
      work: Array.isArray(data.work) ? data.work : [],
      education: Array.isArray(data.education) ? data.education : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      awards: Array.isArray(data.awards) ? data.awards : []
    };
  }
});
