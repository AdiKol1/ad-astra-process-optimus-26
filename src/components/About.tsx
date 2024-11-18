import React from 'react';

const teamMembers = [
  {
    name: "Adi Kol",
    role: "CEO & AI Strategist",
    linkedin: "https://www.linkedin.com/in/adi-kol-46078522/"
  }
];

const About = () => {
  return (
    <section className="py-16 bg-gray-50" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            About Ad Astra
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We combine cutting-edge AI technology with proven marketing strategies to help businesses reach new heights.
          </p>
        </div>

        <div className="mt-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900">
                {member.name}
              </h3>
              <p className="mt-2 text-gray-600">
                {member.role}
              </p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800"
              >
                LinkedIn Profile
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;