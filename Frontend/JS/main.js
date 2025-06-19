// Time-based greeting
function setGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const greetingElement = document.getElementById('greeting');
  
  let greeting = '';
  if (hour < 12) {
    greeting = 'Good morning! We\'re here to help you with your reimbursement claim.';
  } else if (hour < 17) {
    greeting = 'Good afternoon! Thank you for taking the time to file your claim.';
  } else {
    greeting = 'Good evening! We appreciate your patience in this process.';
  }
  
  greetingElement.textContent = greeting;
}

// Case ID generation
function generateCaseID() {
  const prefixes = ['RD', 'RC', 'RF', 'RB', 'RA'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const numbers = Math.floor(Math.random() * 900000) + 100000;
  const suffix = String.fromCharCode(65 + Math.floor(Math.random() * 26)) + 
                 String.fromCharCode(65 + Math.floor(Math.random() * 26));
  
  return `${prefix}-${numbers}-${suffix}`;
}

// SSN formatting
function formatSSN(value) {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 5) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  }
}

// Character counter for textarea
function updateCharacterCounter() {
  const textarea = document.getElementById('incidentDetails');
  const counter = document.getElementById('charCount');
  
  if (textarea && counter) {
    const count = textarea.value.length;
    counter.textContent = count;
    
    // Change color based on character count
    if (count > 450) {
      counter.style.color = '#f44336';
    } else if (count > 300) {
      counter.style.color = '#ff9800';
    } else {
      counter.style.color = '#7986cb';
    }
  }
}

// Enhanced form validation
function validateStep1() {
  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const identification = document.getElementById('identification').value;
  const ssn = document.getElementById('ssn').value.trim();
  
  if (!fullName || !email || !address || !identification || !ssn) {
    showValidationError('Please fill in all required fields.');
    return false;
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showValidationError('Please enter a valid email address.');
    return false;
  }
  
  if (ssn.replace(/\D/g, '').length !== 9) {
    showValidationError('Please enter a valid 9-digit Social Security Number.');
    return false;
  }
  
  return true;
}

function validateStep2() {
  const paymentMethod = document.getElementById('paymentMethod').value;
  const incidentDetails = document.getElementById('incidentDetails').value.trim();
  const bankPreference = document.getElementById('bankPreference').value.trim();
  
  if (!paymentMethod || !incidentDetails || !bankPreference) {
    showValidationError('Please fill in all required fields.');
    return false;
  }
  
  if (incidentDetails.length < 50) {
    showValidationError('Please provide a more detailed explanation (minimum 50 characters).');
    return false;
  }
  
  return true;
}

// Enhanced validation error display
function showValidationError(message) {
  // Create or update error message element
  let errorElement = document.getElementById('validation-error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.id = 'validation-error';
    errorElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #f44336, #e57373);
      color: white;
      padding: 15px 20px;
      border-radius: 12px;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(244, 67, 54, 0.3);
      z-index: 10000;
      animation: errorSlideIn 0.4s ease-out;
      max-width: 300px;
      font-size: 0.9rem;
    `;
    document.body.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  errorElement.style.animation = 'errorSlideIn 0.4s ease-out';
  
  // Auto remove after 4 seconds
  setTimeout(() => {
    if (errorElement) {
      errorElement.style.animation = 'errorSlideOut 0.4s ease-out';
      setTimeout(() => {
        if (errorElement && errorElement.parentNode) {
          errorElement.parentNode.removeChild(errorElement);
        }
      }, 400);
    }
  }, 4000);
}

// Step navigation with enhanced animations
function showStep(stepNumber) {
  const steps = document.querySelectorAll('.form-step');
  const currentStep = document.querySelector('.form-step.active');
  
  // Add exit animation to current step
  if (currentStep) {
    currentStep.style.animation = 'stepSlideOut 0.4s ease-out';
    setTimeout(() => {
      currentStep.classList.remove('active');
      currentStep.style.animation = '';
    }, 400);
  }
  
  // Show new step with entrance animation
  setTimeout(() => {
    const targetStep = document.getElementById(`step${stepNumber}`);
    targetStep.classList.add('active');
    targetStep.style.animation = 'stepSlideIn 0.6s ease-out';
    
    // Trigger input animations
    const inputGroups = targetStep.querySelectorAll('.input-group');
    inputGroups.forEach((group, index) => {
      group.style.animationDelay = `${index * 0.1}s`;
      group.style.animation = 'inputSlideUp 0.6s ease-out';
    });
  }, 200);
}

// Enhanced form submission handlers
function handleStep1Submit(e) {
  e.preventDefault();
  
  if (!validateStep1()) {
    return;
  }
  
  const button = e.target.querySelector('.continue-btn');
  button.classList.add('loading');
  
  // Add success feedback
  setTimeout(() => {
    button.classList.remove('loading');
    button.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
    button.querySelector('.btn-text').textContent = 'Information Saved!';
    button.querySelector('.btn-icon').textContent = '✓';
    
    setTimeout(() => {
      showStep(2);
      // Reset button after transition
      setTimeout(() => {
        button.style.background = '';
        button.querySelector('.btn-text').textContent = 'Continue to Incident Details';
        button.querySelector('.btn-icon').textContent = '→';
      }, 500);
    }, 800);
  }, 1500);
}

function handleStep2Submit(e) {
  e.preventDefault();
  
  if (!validateStep2()) {
    return;
  }
  
  const button = e.target.querySelector('.submit-btn');
  button.classList.add('loading');
  
  setTimeout(() => {
    button.classList.remove('loading');
    button.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
    button.querySelector('.btn-text').textContent = 'Case Generated!';
    button.querySelector('.btn-icon').textContent = '✓';
    
    setTimeout(() => {
      showSuccessModal();
    }, 800);
  }, 2000);
}

// Enhanced success modal
function showSuccessModal() {
  const modal = document.getElementById('successModal');
  const caseIdElement = document.getElementById('caseId');
  
  const caseId = generateCaseID();
  caseIdElement.textContent = `Case ID: ${caseId}`;
  
  modal.style.display = 'block';
  
  // Store case ID in localStorage for tracking
  const caseHistory = JSON.parse(localStorage.getItem('caseHistory') || '[]');
  caseHistory.push({
    id: caseId,
    timestamp: new Date().toISOString(),
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value
  });
  localStorage.setItem('caseHistory', JSON.stringify(caseHistory));
}

// Enhanced reset form
function resetForm() {
  document.getElementById('personalForm').reset();
  document.getElementById('incidentForm').reset();
  document.getElementById('successModal').style.display = 'none';
  showStep(1);
  
  // Clear any validation states and reset buttons
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.classList.remove('error');
  });
  
  const buttons = document.querySelectorAll('.continue-btn, .submit-btn');
  buttons.forEach(button => {
    button.style.background = '';
    button.classList.remove('loading');
  });
  
  // Reset button texts
  const continueBtn = document.querySelector('.continue-btn');
  const submitBtn = document.querySelector('.submit-btn');
  
  if (continueBtn) {
    continueBtn.querySelector('.btn-text').textContent = 'Continue to Incident Details';
    continueBtn.querySelector('.btn-icon').textContent = '→';
  }
  
  if (submitBtn) {
    submitBtn.querySelector('.btn-text').textContent = 'Generate Case ID';
    submitBtn.querySelector('.btn-icon').textContent = '✨';
  }
}

// Enhanced animation delays for form elements
function addAnimationDelays() {
  const inputGroups = document.querySelectorAll('.input-group');
  inputGroups.forEach((group, index) => {
    group.style.animationDelay = `${index * 0.15}s`;
  });
}

// Logo click animation
function addLogoInteraction() {
  const logo = document.getElementById('logo');
  logo.addEventListener('click', () => {
    logo.style.animation = 'logoClick 0.6s ease-out';
    setTimeout(() => {
      logo.style.animation = 'logoFloat 6s ease-in-out infinite';
    }, 600);
  });
}

// Initialize app with enhanced features
function init() {
  setGreeting();
  addAnimationDelays();
  addLogoInteraction();
  
  // SSN formatting
  const ssnInput = document.getElementById('ssn');
  ssnInput.addEventListener('input', (e) => {
    e.target.value = formatSSN(e.target.value);
  });
  
  // Character counter for incident details
  const incidentTextarea = document.getElementById('incidentDetails');
  incidentTextarea.addEventListener('input', updateCharacterCounter);
  
  // Form event listeners
  document.getElementById('personalForm').addEventListener('submit', handleStep1Submit);
  document.getElementById('incidentForm').addEventListener('submit', handleStep2Submit);
  
  // Close modal when clicking outside
  document.getElementById('successModal').addEventListener('click', (e) => {
    if (e.target.id === 'successModal') {
      resetForm();
    }
  });
  
  // Enhanced input interactions
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', (e) => {
      e.target.parentElement.style.transform = 'scale(1.02)';
      e.target.parentElement.style.zIndex = '10';
    });
    
    input.addEventListener('blur', (e) => {
      e.target.parentElement.style.transform = 'scale(1)';
      e.target.parentElement.style.zIndex = '1';
    });
    
    // Add typing animation effect
    input.addEventListener('input', (e) => {
      const inputGroup = e.target.parentElement;
      inputGroup.style.animation = 'inputPulse 0.3s ease-out';
      setTimeout(() => {
        inputGroup.style.animation = '';
      }, 300);
    });
  });
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes errorSlideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes errorSlideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(100%);
      opacity: 0;
    }
  }
  
  @keyframes stepSlideOut {
    from {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
    to {
      opacity: 0;
      transform: translateX(-60px) scale(0.95);
    }
  }
  
  @keyframes inputPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);

// Global functions for HTML onclick handlers
window.resetForm = resetForm;

// Start the app
document.addEventListener('DOMContentLoaded', init);