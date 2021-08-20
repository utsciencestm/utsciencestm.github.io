function show_growth(members) {
  const balls = [];
  const colors = ["LightGray", "Chocolate", "DarkOrange", "Cornsilk", "Khaki", "Aqua", "Tomato", "Violet"];

  for (var name in members) {
    var point = members[name];
    let ball = document.createElement("div");
    ball.classList.add("ball");
    ball.style.left = `${Math.floor(Math.random() * 100)}vw`;
    ball.style.top = `${Math.floor(Math.random() * 100)}vh`;
    ball.style.transform = `scale(${Math.random()})`;
    // Math.pow(point, 1/2)
    ball.style.width = `${Math.pow(point, 1/2)}em`; // `${Math.random()}em`;
    ball.style.height = ball.style.width;
    ball.style.background = `${colors[parseInt(Math.pow((point+10)/3, 1/2))]}`;
    // colors[Math.floor(Math.random() * colors.length)];
    ball.innerHTML = name;
    balls.push(ball);
    document.body.append(ball);
  }

  // Keyframes
  balls.forEach((el, i, ra) => {
    let to = {
      x: Math.random() * (i % 2 === 0 ? -11 : 11),
      y: Math.random() * 12
    };

    let anim = el.animate(
      [{
          transform: "translate(0, 0)"
        },
        {
          transform: `translate(${to.x}rem, ${to.y}rem)`
        }
      ], {
        duration: (Math.random() + 1) * 2000, // random duration
        direction: "alternate",
        fill: "both",
        iterations: Infinity,
        easing: "ease-in-out"
      }
    );
  });
}
