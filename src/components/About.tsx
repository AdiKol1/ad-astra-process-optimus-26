import React from 'react';

const teamMembers = [
  {
    name: "Adi Kol",
    role: "CEO & AI Strategist",
    linkedin: "https://www.linkedin.com/in/adi-kol-46078522/",
    description: "AI and process optimization expert with extensive experience in implementing AI solutions for business growth."
  }
];

const About = () => {
  return (
    <section className="py-24 bg-muted" id="about">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            About Ad Astra
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            We combine cutting-edge AI technology with proven marketing strategies to help businesses reach new heights.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1">
          {teamMembers.map((member, index) => (
            <div 
              key={index} 
              className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">
                {member.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {member.role}
              </p>
              <p className="text-muted-foreground mb-6">
                {member.description}
              </p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Connect on LinkedIn
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;