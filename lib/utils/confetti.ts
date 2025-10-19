export function triggerConfetti() {
  if (typeof window === "undefined") return;

  // Create confetti particles
  const colors = ["#8247e5", "#7c3aed", "#a78bfa", "#c4b5fd", "#ddd6fe"];
  const confettiCount = 50;

  for (let i = 0; i < confettiCount; i++) {
    createConfettiParticle(colors[Math.floor(Math.random() * colors.length)]);
  }
}

function createConfettiParticle(color: string) {
  const confetti = document.createElement("div");
  confetti.style.position = "fixed";
  confetti.style.width = "10px";
  confetti.style.height = "10px";
  confetti.style.backgroundColor = color;
  confetti.style.left = Math.random() * window.innerWidth + "px";
  confetti.style.top = "-10px";
  confetti.style.opacity = "1";
  confetti.style.pointerEvents = "none";
  confetti.style.zIndex = "9999";
  confetti.style.borderRadius = "50%";

  document.body.appendChild(confetti);

  const fall = confetti.animate(
    [
      {
        transform: `translate(0, 0) rotate(0deg)`,
        opacity: 1,
      },
      {
        transform: `translate(${Math.random() * 200 - 100}px, ${window.innerHeight}px) rotate(${Math.random() * 720}deg)`,
        opacity: 0,
      },
    ],
    {
      duration: Math.random() * 2000 + 3000,
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    }
  );

  fall.onfinish = () => {
    confetti.remove();
  };
}

