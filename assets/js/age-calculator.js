// ========================================
// Age Calculator Logic
// ========================================
document.addEventListener("DOMContentLoaded", () => {
  // Set max date to today
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];
  document.getElementById("birthDate").setAttribute("max", maxDate);

  // Set current date to today by default
  document.getElementById("currentDate").value = maxDate;

  // Calculate button event
  const calculateBtn = document.getElementById("calculateBtn");
  const resultsCard = document.getElementById("resultsCard");

  calculateBtn.addEventListener("click", calculateAge);

  // Allow Enter key to trigger calculation
  document.getElementById("birthDate").addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateAge();
  });

  document.getElementById("currentDate").addEventListener("keypress", (e) => {
    if (e.key === "Enter") calculateAge();
  });

  function calculateAge() {
    const birthDateInput = document.getElementById("birthDate").value;
    const currentDateInput =
      document.getElementById("currentDate").value || maxDate;

    if (!birthDateInput) {
      alert("Please enter your birth date");
      return;
    }

    const birthDate = new Date(birthDateInput);
    const currentDate = new Date(currentDateInput);

    // Validate dates
    if (birthDate > currentDate) {
      alert("Birth date cannot be in the future");
      return;
    }

    // Calculate age breakdown
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const prevMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0,
      );
      days += prevMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate totals
    const timeDiff = currentDate - birthDate;
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = years * 12 + months;
    const totalHours = Math.floor(timeDiff / (1000 * 60 * 60));
    const totalMinutes = Math.floor(timeDiff / (1000 * 60));

    // Calculate next birthday
    let nextBirthday = new Date(
      currentDate.getFullYear(),
      birthDate.getMonth(),
      birthDate.getDate(),
    );

    if (nextBirthday < currentDate) {
      nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }

    const daysUntilBirthday = Math.ceil(
      (nextBirthday - currentDate) / (1000 * 60 * 60 * 24),
    );

    // Update UI
    animateValue("ageYears", 0, years, 800);
    animateValue("ageMonths", 0, months, 800);
    animateValue("ageDays", 0, days, 800);

    document.getElementById("totalMonths").textContent =
      totalMonths.toLocaleString();
    document.getElementById("totalWeeks").textContent =
      totalWeeks.toLocaleString();
    document.getElementById("totalDays").textContent =
      totalDays.toLocaleString();
    document.getElementById("totalHours").textContent =
      totalHours.toLocaleString();
    document.getElementById("totalMinutes").textContent =
      totalMinutes.toLocaleString();

    // Next birthday info
    const birthdayOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    document.getElementById("nextBirthdayDate").textContent =
      nextBirthday.toLocaleDateString("en-US", birthdayOptions);

    if (daysUntilBirthday === 0) {
      document.getElementById("nextBirthdayCountdown").textContent =
        "🎉 Happy Birthday! 🎉";
    } else if (daysUntilBirthday === 1) {
      document.getElementById("nextBirthdayCountdown").textContent =
        "Tomorrow! 🎂";
    } else {
      document.getElementById("nextBirthdayCountdown").textContent =
        `In ${daysUntilBirthday} days`;
    }

    // Show results with animation
    resultsCard.style.display = "block";
    setTimeout(() => {
      resultsCard.style.opacity = "1";
      resultsCard.style.transform = "translateY(0)";
    }, 10);
  }

  // Animate number counting
  function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (
        (increment > 0 && current >= end) ||
        (increment < 0 && current <= end)
      ) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  // Initial results card styling
  resultsCard.style.opacity = "0";
  resultsCard.style.transform = "translateY(20px)";
  resultsCard.style.transition = "all 0.5s ease";
});
