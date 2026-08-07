import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "hub" | "node";
}

export function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let nodes: Node[] = [];
    let animationFrameId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      const count = window.innerWidth < 768 ? 30 : 60;
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          type: Math.random() > 0.8 ? "hub" : "node",
        });
      }
    };

    const updateNode = (node: Node) => {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
      if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
    };

    const drawNode = (node: Node) => {
      ctx.beginPath();
      if (node.type === "hub") {
        ctx.fillStyle = "#5E8DAF";
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
      } else {
        ctx.fillStyle = "#7DA6BC";
        ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const drawFrame = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 0.5;

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        updateNode(nodeA);

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeB = nodes[j];
          const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);

          if (dist < 150) {
            ctx.strokeStyle = `rgba(94, 141, 175, ${0.22 * (1 - dist / 150)})`;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }

        drawNode(nodeA);
      }
    };

    const animate = () => {
      drawFrame();
      animationFrameId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="lm-network fixed top-0 left-0 h-full w-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
