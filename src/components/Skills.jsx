import React, { useState, useEffect } from 'react';
import { SITE_TITLE_CORE } from '../brand.js';
import './Skills.css';

const SKILL_GROUPS = [
  {
    title: 'Frontend',
    skills: [
      { name: 'HTML5', level: 75 },
      { name: 'CSS3', level: 75 },
      { name: 'JavaScript', level: 75 },
      { name: 'React', level: 60 }
    ]
  },
  {
    title: 'Backend',
    skills: [
      { name: 'Node.js', level: 50 },
      { name: 'Express', level: 55 },
      { name: 'NestJS', level: 45 },
      { name: 'SQL / Databases', level: 60 }
    ]
  },
  {
    title: 'QA & Testing',
    skills: [
      { name: 'Manual Testing', level: 65 },
      { name: 'Bug Tracking', level: 70 },
      { name: 'API Testing (Postman)', level: 60 }
    ]
  },
  {
    title: 'Tools & Tech',
    skills: [
      { name: 'Git & GitHub', level: 65 },
      { name: 'VS Code', level: 70 }
    ]
  }
];

const Skills = () => {
  const [animatedLevels, setAnimatedLevels] = useState(() => {
    const initialLevels = {};
    SKILL_GROUPS.forEach((group) => {
      group.skills.forEach((skill) => {
        initialLevels[skill.name] = 0;
      });
    });
    return initialLevels;
  });

  useEffect(() => {
    document.title = `${SITE_TITLE_CORE} | Skills`;

    // Trigger animation to actual levels
    const timer = setTimeout(() => {
      const targetLevels = {};
      SKILL_GROUPS.forEach((group) => {
        group.skills.forEach((skill) => {
          targetLevels[skill.name] = skill.level;
        });
      });
      setAnimatedLevels(targetLevels);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="skills" className="skills">
      <div className="skills-container">
        <div className="section-header">
          <h2 className="section-title">Skills</h2>
          <div className="section-divider"></div>
        </div>

        <div className="skills-grid">
          {SKILL_GROUPS.map((group) => (
            <article key={group.title} className="skill-card">
              <h3 className="skill-title">{group.title}</h3>
              <div className="skills-list">
                {group.skills.map((skill) => (
                  <div key={skill.name} className="skill-row">
                    <div className="skill-row-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percent">{skill.level}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <div
                        className="skill-bar-fill"
                        style={{ width: `${animatedLevels[skill.name] ?? 0}%` }}
                        role="progressbar"
                        aria-valuenow={skill.level}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-label={`${skill.name} proficiency`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
