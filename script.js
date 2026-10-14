// ==========================================================================
// 1. VISA SELECTION & MODAL POPUP LOGIC
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {
  const destSelect = document.getElementById("destinationSelect");
  const allCards = document.querySelectorAll(".visa-dest-card");

  if (destSelect) {
    destSelect.addEventListener("change", function () {
      const selectedDest = this.value.trim().toLowerCase();

      allCards.forEach(card => {
        const titleEl = card.querySelector(".dest-overlay-text h3") || card.querySelector("h3");
        const cardTitle = titleEl ? titleEl.textContent.trim().toLowerCase() : "";

        if (!selectedDest || selectedDest.includes("select")) {
          card.style.display = "block";
        } else if (cardTitle === selectedDest || cardTitle.includes(selectedDest)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  }
});

function openVisaModal(country, visaType, embassyFee, serviceFee, totalFee) {
  const modal = document.getElementById("visaModal");
  if (!modal) return;

  country = country || "Selected Destination";
  visaType = visaType || "Short Stay Tourist Visa";
  embassyFee = embassyFee || "₹11,000.00";
  serviceFee = serviceFee || "₹3,000.00";
  totalFee = totalFee || "₹14,000.00";

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };

  setVal("selectedCountry", country);
  setVal("selectedVisaType", visaType);
  setVal("selectedEmbassyFee", embassyFee);
  setVal("selectedServiceFee", serviceFee);
  setVal("selectedTotalFee", totalFee);

  const detailsHeader = document.getElementById("modalVisaDetails");
  if (detailsHeader) {
    detailsHeader.innerText = `${country}\n${visaType}`;
  }

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val || "₹0";
  };

  setText("displayEmbassyFee", embassyFee);
  setText("displayServiceFee", serviceFee);
  setText("displayTotalFee", totalFee);

  modal.classList.add("active");
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeVisaModal() {
  const modal = document.getElementById("visaModal");
  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }
  document.body.style.overflow = "auto";

  const form = document.getElementById("visaApplicationForm");
  if (form) form.reset();

  const status = document.getElementById("formStatus");
  if (status) {
    status.innerText = "";
    status.className = "form-status-msg";
  }
}

window.onclick = function(event) {
  const modal = document.getElementById("visaModal");
  if (event.target === modal) {
    closeVisaModal();
  }
};


// ==========================================================================
// 2. UNIFIED SUBMISSION HANDLERS
// ==========================================================================

const SERVICES_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz52AHofagx_XpnHpN0YxBi4Gn62Z1OcfVBeIvZ37yYmZdlxUF6EamwySWv7btN0IxV/exec";

function submitFormData(form, formType, statusMsg, submitBtn, callback) {
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerText = "Submitting Inquiry...";
  }
  if (statusMsg) {
    statusMsg.innerText = "";
    statusMsg.className = "form-status-msg";
  }

  const refNo = "SKY-" + Math.floor(100000 + Math.random() * 900000);
  const formData = new FormData(form);
  
  const payload = { formType: formType, refNo: refNo };
  formData.forEach((value, key) => {
    payload[key] = value;
  });

  fetch(SERVICES_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  })
  .then(() => {
    if (statusMsg) {
      statusMsg.className = "form-status-msg success";
      statusMsg.style.color = "#166534";
      statusMsg.style.fontWeight = "600";
      statusMsg.innerText = `✓ Inquiry Submitted! Reference No: ${refNo}. A confirmation email has been sent.`;
    }
    form.reset();
    if (callback) callback();
  })
  .catch(() => {
    if (statusMsg) {
      statusMsg.className = "form-status-msg error";
      statusMsg.style.color = "#dc2626";
      statusMsg.style.fontWeight = "600";
      statusMsg.innerText = "❌ Submission failed. Please try again or contact us directly.";
    }
  })
  .finally(() => {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerText = "Submit Inquiry";
    }
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const submitBtn = document.getElementById("submitBtn");
  const statusMsg = document.getElementById("formStatus");
  submitFormData(e.target, "Visa Inquiry", statusMsg, submitBtn, () => {
    setTimeout(() => { closeVisaModal(); }, 3500);
  });
}

function handleGenericFormSubmit(e, formType) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  
  let statusMsg = form.querySelector('.form-status-msg');
  if (!statusMsg) {
    statusMsg = document.createElement('div');
    statusMsg.className = 'form-status-msg';
    if (submitBtn) {
      form.insertBefore(statusMsg, submitBtn);
    } else {
      form.appendChild(statusMsg);
      }
    }

    submitFormData(form, formType, statusMsg, submitBtn);
  }

document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById("hamburger-btn");
  const mainNav = document.querySelector(".main-nav");

  if (hamburgerBtn && mainNav) {
    hamburgerBtn.addEventListener("click", function () {
      mainNav.classList.toggle("active");
    });
  }
});

// document.addEventListener("DOMContentLoaded", function () {
//   const visaForm = document.getElementById("visaForm") || document.getElementById("visaApplicationForm");
//   if (visaForm) visaForm.addEventListener("submit", handleFormSubmit);

//   const flightForm = document.getElementById("flightForm");
//   if (flightForm) flightForm.addEventListener("submit", (e) => handleGenericFormSubmit(e, "Flight Inquiry"));

//   const passportForm = document.getElementById("passportForm");
//   if (passportForm) passportForm.addEventListener("submit", (e) => handleGenericFormSubmit(e, "Passport Service"));

//   const hotelForm = document.getElementById("hotelForm");
//   if (hotelForm) hotelForm.addEventListener("submit", (e) => handleGenericFormSubmit(e, "Hotel Quote"));

//   const insuranceForm = document.getElementById("insuranceForm");
//   if (insuranceForm) insuranceForm.addEventListener("submit", (e) => handleGenericFormSubmit(e, "Insurance Quote"));

//   const contactForm = document.getElementById("contactForm");
//   if (contactForm) contactForm.addEventListener("submit", (e) => handleGenericFormSubmit(e, "Contact Us"));

//   const trackForm = document.getElementById("trackForm");
//   if (trackForm) trackForm.addEventListener("submit", trackApplication);
// });


// ==========================================================================
// 3. APPLICATION STATUS TRACKING LOOKUP
// ==========================================================================

// 1. Core tracking function
async function trackApplication(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const refInput = document.getElementById("refId");
  const resultContainer = document.getElementById("statusResult");

  if (!refInput || !resultContainer) {
    console.error("Missing elements!");
    return false;
  }

  const refId = refInput.value.trim();
  console.log("Searching for Reference ID:", refId);

  if (!refId) {
    resultContainer.innerHTML = `<p style="color: #dc2626; font-weight: 600;">Please enter a valid Reference ID.</p>`;
    return false;
  }

  resultContainer.innerHTML = `<p style="color: #0088cc; font-weight: 600;">🔍 Searching application status...</p>`;

  try {
    const url = `${SERVICES_SCRIPT_URL}?ref=${encodeURIComponent(refId)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "success") {
      resultContainer.innerHTML = `
        <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #cbd5e1; text-align: left; margin-top: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h4 style="margin-top: 0; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">Application Status Details</h4>
          <p style="margin: 8px 0;"><strong>Reference ID:</strong> ${data.referenceNo}</p>
          <p style="margin: 8px 0;"><strong>Customer Name:</strong> ${data.customerName}</p>
          <p style="margin: 8px 0;"><strong>Service Type:</strong> ${data.serviceType}</p>
          <p style="margin: 8px 0;"><strong>Current Status:</strong> <span style="background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 4px; font-weight: 600;">${data.currentStatus}</span></p>
          <p style="font-size: 12px; color: #64748b; margin-top: 15px; margin-bottom: 0;">Last updated: ${new Date(data.lastUpdated).toLocaleString()}</p>
        </div>
      `;
    } else {
      resultContainer.innerHTML = `<p style="color: #dc2626; font-weight: 600; margin-top: 15px;">❌ ${data.message || "No record found for this Reference ID."}</p>`;
    }
  } catch (err) {
    console.error("Tracking Error:", err);
    resultContainer.innerHTML = `<p style="color: #dc2626; font-weight: 600; margin-top: 15px;">❌ Unable to fetch status right now.</p>`;
  }

  return false;
}
