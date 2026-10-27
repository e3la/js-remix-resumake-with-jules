function escapeLatex(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([%$&_#{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function generateLatex(data) {
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

  if (template === 'classic' || template === 'template1') {
    return generateClassicLatex(basics, work, education, skills, projects, awards, headings);
  } else if (template === 'minimal') {
    return generateMinimalLatex(basics, work, education, skills, projects, awards, headings);
  } else if (template === 'compact') {
    return generateCompactLatex(basics, work, education, skills, projects, awards, headings);
  } else {
    // Default to Modern
    return generateModernLatex(basics, work, education, skills, projects, awards, headings);
  }
}

function generateModernLatex(basics, work, education, skills, projects, awards, headings) {
  const name = escapeLatex(basics.name || '');
  const email = escapeLatex(basics.email || '');
  const phone = escapeLatex(basics.phone || '');
  const address = escapeLatex(basics.location?.address || '');
  const website = escapeLatex(basics.website || '');

  let headerDetails = [address, phone, email, website ? `\\url{${website}}` : ''].filter(Boolean).join(' | ');

  let latex = `\\documentclass[letterpaper,11pt]{article}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}

\\pagestyle{fancy}
\\fancyhf{}
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-0.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}
\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\hline \\vspace{-5pt}]

\\begin{document}

%----------HEADING-----------------
\\begin{center}
    {\\Huge \\scshape ${name}} \\\\ \\vspace{4pt}
    ${headerDetails}
\\end{center}

`;

  if (basics.summary) {
    latex += `\\section{Summary}\n${escapeLatex(basics.summary)}\n\\vspace{6pt}\n\n`;
  }

  if (education.length > 0) {
    latex += `\\section{${escapeLatex(headings.education || 'Education')}}\n\\begin{itemize}[leftmargin=*]\n`;
    education.forEach(edu => {
      const inst = escapeLatex(edu.institution || '');
      const loc = escapeLatex(edu.location || '');
      const deg = escapeLatex(edu.studyType || '');
      const area = escapeLatex(edu.area || '');
      const dates = escapeLatex([edu.startDate, edu.endDate].filter(Boolean).join(' -- '));
      const gpa = edu.score ? ` (GPA: ${escapeLatex(edu.score)})` : '';
      latex += `  \\item\n    \\begin{tabularx}{\\linewidth}{X r}\n      \\textbf{${inst}} & ${loc} \\\\\n      \\textit{${deg}${area ? ' in ' + area : ''}${gpa}} & \\textit{${dates}} \\\\\n    \\end{tabularx}\n`;
    });
    latex += `\\end{itemize}\n\\vspace{4pt}\n\n`;
  }

  if (work.length > 0) {
    latex += `\\section{${escapeLatex(headings.work || 'Experience')}}\n\\begin{itemize}[leftmargin=*]\n`;
    work.forEach(job => {
      const comp = escapeLatex(job.company || job.name || '');
      const pos = escapeLatex(job.position || '');
      const loc = escapeLatex(job.location || '');
      const dates = escapeLatex([job.startDate, job.endDate].filter(Boolean).join(' -- '));
      latex += `  \\item\n    \\begin{tabularx}{\\linewidth}{X r}\n      \\textbf{${comp}} & ${loc} \\\\\n      \\textit{${pos}} & \\textit{${dates}} \\\\\n    \\end{tabularx}\n`;
      if (job.highlights && job.highlights.length > 0) {
        latex += `    \\begin{itemize}[leftmargin=15pt]\n`;
        job.highlights.forEach(h => {
          latex += `      \\item ${escapeLatex(h)}\n`;
        });
        latex += `    \\end{itemize}\n`;
      }
    });
    latex += `\\end{itemize}\n\\vspace{4pt}\n\n`;
  }

  if (projects.length > 0) {
    latex += `\\section{${escapeLatex(headings.projects || 'Projects')}}\n\\begin{itemize}[leftmargin=*]\n`;
    projects.forEach(proj => {
      const pName = escapeLatex(proj.name || '');
      const pUrl = escapeLatex(proj.url || '');
      const pDesc = escapeLatex(proj.description || '');
      const pKw = proj.keywords ? proj.keywords.map(escapeLatex).join(', ') : '';
      latex += `  \\item \\textbf{${pName}}${pKw ? ' (' + pKw + ')' : ''}${pUrl ? ' - \\url{' + pUrl + '}' : ''}: ${pDesc}\n`;
    });
    latex += `\\end{itemize}\n\\vspace{4pt}\n\n`;
  }

  if (skills.length > 0) {
    latex += `\\section{${escapeLatex(headings.skills || 'Skills')}}\n\\begin{itemize}[leftmargin=*]\n`;
    skills.forEach(skill => {
      const sName = escapeLatex(skill.name || '');
      const sKw = skill.keywords ? skill.keywords.map(escapeLatex).join(', ') : '';
      latex += `  \\item \\textbf{${sName}}: ${sKw}\n`;
    });
    latex += `\\end{itemize}\n\\vspace{4pt}\n\n`;
  }

  if (awards.length > 0) {
    latex += `\\section{${escapeLatex(headings.awards || 'Awards')}}\n\\begin{itemize}[leftmargin=*]\n`;
    awards.forEach(award => {
      const title = escapeLatex(award.title || '');
      const awarder = escapeLatex(award.awarder || '');
      const date = escapeLatex(award.date || '');
      const sum = escapeLatex(award.summary || '');
      latex += `  \\item \\textbf{${title}}${awarder ? ' - ' + awarder : ''}${date ? ' (' + date + ')' : ''}${sum ? ': ' + sum : ''}\n`;
    });
    latex += `\\end{itemize}\n\\vspace{4pt}\n\n`;
  }

  latex += `\\end{document}\n`;
  return latex;
}

function generateClassicLatex(basics, work, education, skills, projects, awards, headings) {
  const name = escapeLatex(basics.name || '');
  const email = escapeLatex(basics.email || '');
  const phone = escapeLatex(basics.phone || '');
  const address = escapeLatex(basics.location?.address || '');
  const website = escapeLatex(basics.website || '');

  let line2 = [address, email, phone, website ? `\\href{${website}}{${website}}` : ''].filter(Boolean).join(' $\\cdot$ ');

  let latex = `\\documentclass[a4paper]{article}
\\usepackage{fullpage}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{textcomp}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\textheight=10in
\\pagestyle{empty}
\\raggedright
\\usepackage[left=0.8in,right=0.8in,bottom=0.8in,top=0.8in]{geometry}
\\usepackage[hidelinks]{hyperref}

\\newcommand{\\lineunder}{
    \\vspace*{-8pt} \\\\
    \\hspace*{-18pt} \\hrulefill \\\\
}

\\newcommand{\\header}[1]{
    {\\hspace*{-18pt}\\vspace*{6pt} \\textsc{#1}}
    \\vspace*{-6pt} \\lineunder
}

\\begin{document}
\\vspace*{-40pt}

\\vspace*{-10pt}
\\begin{center}
  {\\Huge \\scshape {${name}}}\\\\
  ${line2}\\\\
\\end{center}

`;

  if (education.length > 0) {
    latex += `\\header{${escapeLatex(headings.education || 'Education')}}\n`;
    education.forEach(edu => {
      const inst = escapeLatex(edu.institution || '');
      const loc = escapeLatex(edu.location || '');
      const deg = escapeLatex(edu.studyType || '');
      const area = escapeLatex(edu.area || '');
      const score = edu.score ? ` \\textit{GPA: ${escapeLatex(edu.score)}}` : '';
      const dates = escapeLatex([edu.startDate, edu.endDate].filter(Boolean).join(' - '));
      latex += `\\textbf{${inst}} \\hfill ${loc}\\\\
${deg ? deg + ' ' : ''}${area ? 'in ' + area : ''}${score} \\hfill ${dates}\\\\
\\vspace{2mm}\n`;
    });
  }

  if (work.length > 0) {
    latex += `\\header{${escapeLatex(headings.work || 'Experience')}}\n\\vspace{1mm}\n`;
    work.forEach(job => {
      const comp = escapeLatex(job.company || job.name || '');
      const pos = escapeLatex(job.position || '');
      const loc = escapeLatex(job.location || '');
      const dates = escapeLatex([job.startDate, job.endDate].filter(Boolean).join(' - '));
      latex += `\\textbf{${comp}} \\hfill ${loc}\\\\
\\textit{${pos}} \\hfill ${dates}\\\\
`;
      if (job.highlights && job.highlights.length > 0) {
        latex += `\\vspace{-1mm}\n\\begin{itemize} \\itemsep 1pt\n`;
        job.highlights.forEach(h => {
          latex += `  \\item ${escapeLatex(h)}\n`;
        });
        latex += `\\end{itemize}\n`;
      }
    });
  }

  if (skills.length > 0) {
    latex += `\\header{${escapeLatex(headings.skills || 'Skills')}}\n\\begin{tabular}{ l l }\n`;
    skills.forEach(s => {
      const sName = escapeLatex(s.name || 'Misc');
      const kw = s.keywords ? s.keywords.map(escapeLatex).join(', ') : '';
      latex += `${sName}: & ${kw} \\\\\n`;
    });
    latex += `\\end{tabular}\n\\vspace{2mm}\n`;
  }

  if (projects.length > 0) {
    latex += `\\header{${escapeLatex(headings.projects || 'Projects')}}\n`;
    projects.forEach(p => {
      const pName = escapeLatex(p.name || '');
      const pKw = p.keywords ? p.keywords.map(escapeLatex).join(', ') : '';
      const pUrl = p.url ? `\\hfill \\href{${escapeLatex(p.url)}}{${escapeLatex(p.url)}}` : '';
      const pDesc = escapeLatex(p.description || '');
      latex += `{\\textbf{${pName}}} {\\sl ${pKw}} ${pUrl}\\\\
${pDesc}\\\\
\\vspace*{2mm}\n`;
    });
  }

  latex += `\\end{document}\n`;
  return latex;
}

function generateMinimalLatex(basics, work, education, skills, projects, awards, headings) {
  return generateModernLatex(basics, work, education, skills, projects, awards, headings);
}

function generateCompactLatex(basics, work, education, skills, projects, awards, headings) {
  return generateClassicLatex(basics, work, education, skills, projects, awards, headings);
}

window.generateLatex = generateLatex;
