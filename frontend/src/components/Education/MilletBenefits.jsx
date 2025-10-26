import React from 'react';
import { FaLeaf, FaHeart, FaBolt, FaShieldAlt } from 'react-icons/fa';
import './Education.css';

const MilletBenefits = () => {
  const benefits = [
    {
      icon: <FaHeart />,
      title: 'Heart Health',
      description: 'Rich in magnesium and fiber, millets help reduce cholesterol and maintain cardiovascular health.',
      color: '#E91E63'
    },
    {
      icon: <FaBolt />,
      title: 'Energy Booster',
      description: 'High in complex carbohydrates and B vitamins, providing sustained energy throughout the day.',
      color: '#FF9800'
    },
    {
      icon: <FaShieldAlt />,
      title: 'Diabetes Management',
      description: 'Low glycemic index helps regulate blood sugar levels and is ideal for diabetic patients.',
      color: '#4CAF50'
    },
    {
      icon: <FaLeaf />,
      title: 'Gluten-Free',
      description: 'Naturally gluten-free, making it perfect for people with celiac disease or gluten sensitivity.',
      color: '#6B8E23'
    }
  ];

  const milletTypes = [
    {
      name: 'Pearl Millet (Bajra)',
      image: '🌾',
      benefits: ['Rich in iron', 'Good for anemia', 'Boosts immunity'],
      nutritions: { protein: '11g', fiber: '8g', iron: '8mg' }
    },
    {
      name: 'Finger Millet (Ragi)',
      image: '🌾',
      benefits: ['High in calcium', 'Strong bones', 'Good for babies'],
      nutritions: { protein: '7g', fiber: '11g', calcium: '364mg' }
    },
    {
      name: 'Foxtail Millet',
      image: '🌾',
      benefits: ['Weight loss', 'Controls diabetes', 'Heart health'],
      nutritions: { protein: '12g', fiber: '8g', iron: '3mg' }
    },
    {
      name: 'Little Millet',
      image: '🌾',
      benefits: ['Digestive health', 'Rich in antioxidants', 'Anti-aging'],
      nutritions: { protein: '9g', fiber: '7g', iron: '5mg' }
    }
  ];

  return (
    <div className="education-container">
      <div className="container">
        <div className="education-header">
          <h1>🌾 Amazing Benefits of Millets</h1>
          <p>Discover why millets are called the "superfood of the future"</p>
        </div>

        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon" style={{ backgroundColor: `${benefit.color}20`, color: benefit.color }}>
                {benefit.icon}
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>

        <section className="millets-section">
          <h2>Types of Millets & Their Benefits</h2>
          <div className="millets-grid">
            {milletTypes.map((millet, index) => (
              <div key={index} className="millet-card">
                <div className="millet-icon">{millet.image}</div>
                <h3>{millet.name}</h3>
                <ul className="benefits-list">
                  {millet.benefits.map((benefit, i) => (
                    <li key={i}>✓ {benefit}</li>
                  ))}
                </ul>
                <div className="nutrition-info">
                  <h4>Per 100g:</h4>
                  <div className="nutrition-values">
                    {Object.entries(millet.nutritions).map(([key, value]) => (
                      <span key={key}>
                        <strong>{key}:</strong> {value}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="why-millets">
          <h2>Why Choose Millets?</h2>
          <div className="reasons-grid">
            <div className="reason-card">
              <h3>🌍 Sustainable</h3>
              <p>Requires less water and grows in harsh conditions, making it environmentally friendly.</p>
            </div>
            <div className="reason-card">
              <h3>💪 Nutrient-Dense</h3>
              <p>Packed with vitamins, minerals, and essential amino acids for complete nutrition.</p>
            </div>
            <div className="reason-card">
              <h3>🍽️ Versatile</h3>
              <p>Can be used in various dishes from breakfast to dinner, sweet to savory.</p>
            </div>
            <div className="reason-card">
              <h3>👶 Family-Friendly</h3>
              <p>Suitable for all ages - from babies to elderly, providing essential nutrients.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <h2>Ready to Make the Switch?</h2>
          <p>Start your healthy journey with millets today!</p>
          <a href="/marketplace" className="btn btn-primary btn-large">
            Shop Millets Now
          </a>
        </section>
      </div>
    </div>
  );
};

export default MilletBenefits;