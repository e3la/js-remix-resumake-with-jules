window.sampleResumeData = {
  selectedTemplate: 'modern',
  headings: {
    work: 'Experience',
    education: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    awards: 'Awards'
  },
  basics: {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '(555) 019-2834',
    location: {
      address: 'San Francisco, CA'
    },
    website: 'https://janedoe.dev',
    summary: 'Senior Full Stack Software Engineer with 6+ years of experience building scalable web applications, distributed systems, and modern user interfaces.'
  },
  work: [
    {
      company: 'TechCorp Solutions',
      position: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2021',
      endDate: 'Present',
      highlights: [
        'Architected and deployed microservices handling over 10M daily active requests with 99.99% uptime.',
        'Mentored a team of 6 junior and mid-level engineers, enforcing modern engineering practices and CI/CD pipelines.',
        'Reduced database query latent times by 45% through aggressive caching strategies and index optimization.'
      ]
    },
    {
      company: 'DataFlow Inc.',
      position: 'Frontend Engineer',
      location: 'Oakland, CA',
      startDate: '2018',
      endDate: '2021',
      highlights: [
        'Built real-time analytics dashboard using React, TypeScript, and WebSockets.',
        'Collaborated closely with UX designers to establish a company-wide design system used across 5 products.'
      ]
    }
  ],
  education: [
    {
      institution: 'University of California, Berkeley',
      area: 'Computer Science',
      studyType: 'B.S.',
      location: 'Berkeley, CA',
      startDate: '2014',
      endDate: '2018',
      score: '3.8/4.0'
    }
  ],
  skills: [
    {
      name: 'Languages',
      keywords: ['JavaScript', 'TypeScript', 'Python', 'Go', 'HTML5/CSS3', 'SQL']
    },
    {
      name: 'Frameworks & Tools',
      keywords: ['React', 'Next.js', 'Node.js', 'Docker', 'GraphQL', 'Git', 'TailwindCSS']
    }
  ],
  projects: [
    {
      name: 'OpenSource CLI Toolkit',
      description: 'A lightning-fast command-line tool for automated code generation and project bootstrapping.',
      url: 'https://github.com/janedoe/cli-toolkit',
      keywords: ['Go', 'CLI', 'GitHub Actions']
    },
    {
      name: 'Realtime Docs Editor',
      description: 'Collaborative document editor supporting CRDTs for seamless multi-user conflict-free editing.',
      url: 'https://github.com/janedoe/realtime-docs',
      keywords: ['TypeScript', 'WebSockets', 'React']
    }
  ],
  awards: [
    {
      title: 'Hackathon First Place Winner',
      awarder: 'SF Tech Innovation Summit',
      date: '2022',
      summary: 'Awarded 1st place among 50+ competing teams for building an AI-powered accessibility tool.'
    }
  ]
};
