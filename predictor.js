// ===== MAIN JAVASCRIPT =====

// Set current year in footer
document.addEventListener('DOMContentLoaded', () => {
  const yearSpan = document.getElementById('year');
  const year2Span = document.getElementById('year2');
  const currentYear = new Date().getFullYear();
  
  if (yearSpan) yearSpan.textContent = currentYear;
  if (year2Span) year2Span.textContent = currentYear;
  
  // Initialize animations
  initScrollAnimations();
  initParticles();
});

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, observerOptions);

  // Observe all elements that should animate on scroll
  document.querySelectorAll('.feature-card, .card, .param').forEach(el => {
    el.classList.add('scroll-reveal');
    observer.observe(el);
  });
}

// ===== FLOATING PARTICLES EFFECT =====
function initParticles() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;

  for (let i = 0; i < 15; i++) {
    createParticle(heroSection);
  }
}

function createParticle(container) {
  const particle = document.createElement('div');
  particle.style.position = 'absolute';
  particle.style.width = Math.random() * 6 + 2 + 'px';
  particle.style.height = particle.style.width;
  particle.style.background = `rgba(74, 144, 226, ${Math.random() * 0.3 + 0.1})`;
  particle.style.borderRadius = '50%';
  particle.style.pointerEvents = 'none';
  particle.style.left = Math.random() * 100 + '%';
  particle.style.top = Math.random() * 100 + '%';
  particle.style.animation = `floatParticle ${Math.random() * 10 + 10}s ease-in-out infinite`;
  particle.style.animationDelay = Math.random() * 5 + 's';
  
  container.style.position = 'relative';
  container.appendChild(particle);
}

// Add particle animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes floatParticle {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(1.5);
      opacity: 0.8;
    }
    90% {
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// ===== PREDICTOR FUNCTIONALITY =====
if (document.getElementById('runPrediction')) {
  // Sync range and number inputs
  const syncInputs = (rangeId, numberId) => {
    const range = document.getElementById(rangeId);
    const number = document.getElementById(numberId);
    
    range.addEventListener('input', () => {
      number.value = range.value;
      animateInput(range);
    });
    
    number.addEventListener('input', () => {
      range.value = number.value;
      animateInput(number);
    });
  };

  syncInputs('phRange', 'phNumber');
  syncInputs('doRange', 'doNumber');
  syncInputs('nh3Range', 'nh3Number');

  // Animate input on change
  function animateInput(element) {
    element.style.transform = 'scale(1.05)';
    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 200);
  }

  // Run prediction
  document.getElementById('runPrediction').addEventListener('click', () => {
    const ph = parseFloat(document.getElementById('phNumber').value);
    const DO = parseFloat(document.getElementById('doNumber').value);
    const nh3 = parseFloat(document.getElementById('nh3Number').value);

    const result = predictMortality(ph, DO, nh3);
    displayResult(result);
    
    // Add button animation
    const btn = document.getElementById('runPrediction');
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
      btn.style.transform = 'scale(1)';
    }, 100);
  });
}

function predictMortality(ph, DO, nh3) {
  let risk = 'Low';
  let color = '#4ECDC4';
  let recommendations = [];
  let mortalityRate = 0;

  // Priority 1: NH3
  if (nh3 > 0.05) {
    risk = 'High';
    color = '#FF6B6B';
    mortalityRate += (nh3 - 0.05) * 40;
    recommendations.push('⚠️ Immediate water change required! NH3 is toxic.');
    recommendations.push('💧 Add zeolite to absorb ammonia');
    recommendations.push('🔄 Increase water circulation');
  }

  // Priority 2: DO
  if (DO < 4.0) {
    if (risk !== 'High') risk = 'Medium';
    if (color === '#4ECDC4') color = '#FFD93D';
    mortalityRate += (4.0 - DO) * 15;
    recommendations.push('🌊 Increase aeration immediately');
    recommendations.push('⚙️ Check aerator functionality');
    recommendations.push('🐟 Reduce feeding temporarily');
  }

  // Priority 3: pH
  if (ph < 7.0 || ph > 8.5) {
    if (risk === 'Low') risk = 'Medium';
    if (color === '#4ECDC4') color = '#FFD93D';
    mortalityRate += Math.abs(7.5 - ph) * 5;
    if (ph < 7.0) {
      recommendations.push('📈 pH too low - add lime to increase pH');
    } else {
      recommendations.push('📉 pH too high - partial water change needed');
    }
  }

  mortalityRate = Math.min(mortalityRate, 95);

  if (risk === 'Low') {
    recommendations.push('✅ All parameters are within optimal range');
    recommendations.push('👍 Continue regular monitoring');
    recommendations.push('📊 Maintain current water management');
  }

  return {
    risk,
    color,
    recommendations,
    mortalityRate: mortalityRate.toFixed(1),
    ph,
    DO,
    nh3
  };
}

function displayResult(result) {
  const resultCard = document.getElementById('resultCard');
  
  // Create animated result display
  resultCard.innerHTML = `
    <div style="text-align: center; width: 100%; animation: scaleIn 0.5s ease;">
      <div style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 1s ease;">
        ${result.risk === 'High' ? '🚨' : result.risk === 'Medium' ? '⚠️' : '✅'}
      </div>
      <h2 style="color: ${result.color}; margin-bottom: 1rem; font-size: 2rem;">
        ${result.risk} Risk
      </h2>
      <div style="background: linear-gradient(135deg, ${result.color}20, ${result.color}10); 
                  padding: 1.5rem; border-radius: 15px; margin-bottom: 1.5rem;
                  border-left: 4px solid ${result.color};">
        <h3 style="color: #2C3E50; margin-bottom: 0.5rem;">Estimated Mortality Rate</h3>
        <div style="font-size: 3rem; font-weight: bold; color: ${result.color};">
          ${result.mortalityRate}%
        </div>
      </div>
      <div style="text-align: left; background: #f8f9fa; padding: 1.5rem; border-radius: 15px;">
        <h3 style="color: #4A90E2; margin-bottom: 1rem;">📋 Recommendations:</h3>
        ${result.recommendations.map(rec => 
          `<div style="padding: 0.8rem; margin-bottom: 0.5rem; background: white; 
                      border-radius: 10px; border-left: 3px solid #FF9D42;
                      animation: slideInRight 0.5s ease;">
            ${rec}
          </div>`
        ).join('')}
      </div>
      <div style="margin-top: 1.5rem; display: grid; grid-template-columns: repeat(3, 1fr); 
                  gap: 1rem; text-align: center;">
        <div style="background: #E3F2FD; padding: 1rem; border-radius: 10px;">
          <div style="font-size: 0.9rem; color: #5A6C7D;">pH</div>
          <div style="font-size: 1.5rem; font-weight: bold; color: #4A90E2;">${result.ph}</div>
        </div>
        <div style="background: #E3F2FD; padding: 1rem; border-radius: 10px;">
          <div style="font-size: 0.9rem; color: #5A6C7D;">DO</div>
          <div style="font-size: 1.5rem; font-weight: bold; color: #4A90E2;">${result.DO}</div>
        </div>
        <div style="background: #E3F2FD; padding: 1rem; border-radius: 10px;">
          <div style="font-size: 0.9rem; color: #5A6C7D;">NH3</div>
          <div style="font-size: 1.5rem; font-weight: bold; color: #4A90E2;">${result.nh3}</div>
        </div>
      </div>
    </div>
  `;

  // Add scale-in animation
  const scaleInStyle = document.createElement('style');
  scaleInStyle.textContent = `
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    @keyframes slideInRight {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `;
  document.head.appendChild(scaleInStyle);

  // Scroll to result
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ===== NEWSLETTER SUBSCRIPTION =====
const subscribeBtn = document.getElementById('subscribeBtn');
if (subscribeBtn) {
  subscribeBtn.addEventListener('click', () => {
    const emailInput = subscribeBtn.previousElementSibling;
    const email = emailInput.value;
    
    if (email && email.includes('@')) {
      // Success animation
      subscribeBtn.textContent = '✓ Subscribed!';
      subscribeBtn.style.background = '#4ECDC4';
      emailInput.value = '';
      
      setTimeout(() => {
        subscribeBtn.textContent = 'Subscribe';
        subscribeBtn.style.background = '#FF9D42';
      }, 3000);
    } else {
      // Error shake
      emailInput.style.animation = 'shake 0.5s';
      setTimeout(() => {
        emailInput.style.animation = '';
      }, 500);
    }
  });
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }
`;
document.head.appendChild(shakeStyle);

// ===== SMOOTH SCROLL FOR NAVIGATION =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== ADD HOVER SOUND EFFECT (Optional) =====
document.querySelectorAll('.btn, .nav-link, .card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  });
});

// ===== PARALLAX EFFECT FOR HERO =====
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector('.hero');
  
  if (hero) {
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    hero.style.opacity = 1 - (scrolled / 800);
  }
});

// ===== DYNAMIC BACKGROUND GRADIENT =====
let hue = 200;
setInterval(() => {
  hue = (hue + 1) % 360;
  document.body.style.background = `linear-gradient(135deg, 
    hsl(${hue}, 70%, 95%) 0%, 
    hsl(${hue + 20}, 70%, 100%) 100%)`;
}, 100);

console.log('🌊 AquaMonitor Enhanced - Loaded successfully!');