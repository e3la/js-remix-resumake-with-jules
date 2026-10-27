function renderResumePreview(data, container) {
  if (!container) return;

  const template = data.selectedTemplate || 'modern';
  const basics = data.basics || {};
  const work = data.work || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const projects = data.projects || [];
  const awards = data.awards || [];
  const headings = data.headings || {
    work: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    awards: 'Awards'
  };

  container.className = `resume-paper resume-page template-${template}`;

  let html = '';

  // 1. Header Section
  html += `<header class="resume-header">`;
  html += `<h1 class="resume-name">${escapeHtml(basics.name || 'Your Name')}</h1>`;

  const contactItems = [];
  if (basics.location && basics.location.address) {
    contactItems.push(`<span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(basics.location.address)}</span>`);
  }
  if (basics.phone) {
    contactItems.push(`<span><i class="fas fa-phone"></i> ${escapeHtml(basics.phone)}</span>`);
  }
  if (basics.email) {
    contactItems.push(`<span><i class="fas fa-envelope"></i> <a href="mailto:${escapeHtml(basics.email)}">${escapeHtml(basics.email)}</a></span>`);
  }
  if (basics.website) {
    contactItems.push(`<span><i class="fas fa-globe"></i> <a href="${escapeHtml(basics.website)}" target="_blank" rel="noopener">${escapeHtml(cleanUrl(basics.website))}</a></span>`);
  }

  if (contactItems.length > 0) {
    html += `<div class="resume-contact">${contactItems.join('<span class="divider">•</span>')}</div>`;
  }
  html += `</header>`;

  // 2. Summary
  if (basics.summary) {
    html += `
      <section class="resume-section">
        <h2 class="section-title">Summary</h2>
        <p class="summary-text">${escapeHtml(basics.summary)}</p>
      </section>
    `;
  }

  // 3. Experience
  if (work && work.length > 0 && work.some(w => w.company || w.position)) {
    html += `
      <section class="resume-section">
        <h2 class="section-title">${escapeHtml(headings.work || 'Experience')}</h2>
        <div class="section-content">
    `;
    work.forEach(job => {
      if (!job.company && !job.position) return;
      const dates = [job.startDate, job.endDate].filter(Boolean).join(' – ');
      html += `
        <div class="resume-item">
          <div class="item-header">
            <div class="item-title-group">
              <span class="item-company">${escapeHtml(job.company || job.name || '')}</span>
              ${job.position ? `<span class="item-position">${escapeHtml(job.position)}</span>` : ''}
            </div>
            <div class="item-meta">
              ${job.location ? `<span class="item-location">${escapeHtml(job.location)}</span>` : ''}
              ${dates ? `<span class="item-dates">${escapeHtml(dates)}</span>` : ''}
            </div>
          </div>
      `;
      if (job.highlights && job.highlights.length > 0) {
        html += `<ul class="item-highlights">`;
        job.highlights.forEach(h => {
          if (h && h.trim()) {
            html += `<li>${escapeHtml(h)}</li>`;
          }
        });
        html += `</ul>`;
      }
      html += `</div>`;
    });
    html += `</div></section>`;
  }

  // 4. Education
  if (education && education.length > 0 && education.some(e => e.institution || e.area)) {
    html += `
      <section class="resume-section">
        <h2 class="section-title">${escapeHtml(headings.education || 'Education')}</h2>
        <div class="section-content">
    `;
    education.forEach(edu => {
      if (!edu.institution && !edu.area) return;
      const dates = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
      const degreeText = [edu.studyType, edu.area].filter(Boolean).join(' in ');
      html += `
        <div class="resume-item">
          <div class="item-header">
            <div class="item-title-group">
              <span class="item-institution">${escapeHtml(edu.institution || '')}</span>
              ${degreeText ? `<span class="item-degree">${escapeHtml(degreeText)} ${edu.score ? `(GPA: ${escapeHtml(edu.score)})` : ''}</span>` : ''}
            </div>
            <div class="item-meta">
              ${edu.location ? `<span class="item-location">${escapeHtml(edu.location)}</span>` : ''}
              ${dates ? `<span class="item-dates">${escapeHtml(dates)}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    });
    html += `</div></section>`;
  }

  // 5. Projects
  if (projects && projects.length > 0 && projects.some(p => p.name || p.description)) {
    html += `
      <section class="resume-section">
        <h2 class="section-title">${escapeHtml(headings.projects || 'Projects')}</h2>
        <div class="section-content">
    `;
    projects.forEach(proj => {
      if (!proj.name && !proj.description) return;
      html += `
        <div class="resume-item">
          <div class="item-header">
            <div class="item-title-group">
              <span class="item-project-name">${escapeHtml(proj.name || '')}</span>
              ${proj.keywords && proj.keywords.length > 0 ? `<span class="item-keywords">(${escapeHtml(proj.keywords.join(', '))})</span>` : ''}
            </div>
            ${proj.url ? `<a href="${escapeHtml(proj.url)}" target="_blank" rel="noopener" class="item-url">${escapeHtml(cleanUrl(proj.url))}</a>` : ''}
          </div>
          ${proj.description ? `<p class="item-description">${escapeHtml(proj.description)}</p>` : ''}
        </div>
      `;
    });
    html += `</div></section>`;
  }

  // 6. Skills
  if (skills && skills.length > 0 && skills.some(s => s.name || (s.keywords && s.keywords.length))) {
    html += `
      <section class="resume-section">
        <h2 class="section-title">${escapeHtml(headings.skills || 'Skills')}</h2>
        <div class="skills-grid">
    `;
    skills.forEach(skill => {
      if (!skill.name && (!skill.keywords || skill.keywords.length === 0)) return;
      html += `
        <div class="skill-row">
          <span class="skill-category">${escapeHtml(skill.name || 'Misc')}:</span>
          <span class="skill-list">${escapeHtml((skill.keywords || []).join(', '))}</span>
        </div>
      `;
    });
    html += `</div></section>`;
  }

  // 7. Awards
  if (awards && awards.length > 0 && awards.some(a => a.title)) {
    html += `
      <section class="resume-section">
        <h2 class="section-title">${escapeHtml(headings.awards || 'Awards')}</h2>
        <div class="section-content">
    `;
    awards.forEach(award => {
      if (!award.title) return;
      html += `
        <div class="resume-item">
          <div class="item-header">
            <div class="item-title-group">
              <span class="item-award-title">${escapeHtml(award.title)}</span>
              ${award.awarder ? `<span class="item-awarder">— ${escapeHtml(award.awarder)}</span>` : ''}
            </div>
            ${award.date ? `<span class="item-dates">${escapeHtml(award.date)}</span>` : ''}
          </div>
          ${award.summary ? `<p class="item-description">${escapeHtml(award.summary)}</p>` : ''}
        </div>
      `;
    });
    html += `</div></section>`;
  }

  container.innerHTML = html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanUrl(url) {
  if (!url) return '';
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
}

window.renderResumePreview = renderResumePreview;
