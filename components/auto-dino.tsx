"use client";

import { useEffect, useRef } from "react";

const SCENE_WIDTH = 420;
const SCENE_HEIGHT = 92;
const GROUND_Y = 68;
const DINO_X = 44;

type Obstacle = {
  id: number;
  x: number;
  width: number;
  height: number;
};

export function AutoDino() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const dpr = window.devicePixelRatio || 1;

    canvas.width = SCENE_WIDTH * dpr;
    canvas.height = SCENE_HEIGHT * dpr;
    context.scale(dpr, dpr);

    let dinoY = 0;
    let dinoVelocity = 0;
    let lastTimestamp = performance.now();
    let obstacleIndex = 0;
    let obstacleSeed = 0;
    let groundOffset = 0;
    let score = 0;
    let highScore = 0;
    let runCount = 0;
    let animationFrame = 0;
    let obstacles = createInitialObstacles();

    function createInitialObstacles() {
      return [
        createObstacle(SCENE_WIDTH + 46, obstacleIndex++),
        createObstacle(SCENE_WIDTH + 224, obstacleIndex++),
      ];
    }

    function resetRun() {
      highScore = Math.max(highScore, Math.floor(score));
      score = 0;
      runCount += 1;
      dinoY = 0;
      dinoVelocity = 0;
      groundOffset = 0;
      obstacleSeed += 13;
      obstacles = createInitialObstacles();
    }

    const render = (timestamp: number) => {
      const deltaSeconds = Math.min((timestamp - lastTimestamp) / 1000, 0.032);
      lastTimestamp = timestamp;

      context.clearRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);

      const nextObstacle = obstacles[0];
      const obstacleDistance = nextObstacle.x - DINO_X;
      const jumpDistance = getJumpDistance(nextObstacle.id, runCount);
      const shouldFumble = shouldSkipJump(nextObstacle.id, runCount);

      if (dinoY === 0 && obstacleDistance < jumpDistance && !shouldFumble) {
        dinoVelocity = 305;
      }

      dinoY += dinoVelocity * deltaSeconds;
      dinoVelocity -= 760 * deltaSeconds;
      score += deltaSeconds * 12;

      if (dinoY < 0) {
        dinoY = 0;
        dinoVelocity = 0;
      }

      obstacles = obstacles.map((obstacle) => ({
        ...obstacle,
        x: obstacle.x - 178 * deltaSeconds,
      }));

      if (obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
        obstacles.push(
          createObstacle(
            obstacles[obstacles.length - 1].x + 148 + (obstacleSeed % 52),
            obstacleIndex++,
          ),
        );
        obstacleSeed += 17;
      }

      groundOffset = (groundOffset + 124 * deltaSeconds) % 28;

      if (hasCollision(dinoY, obstacles)) {
        resetRun();
      }

      drawScene(context, dinoY, obstacles, groundOffset, Math.floor(score), highScore);
      animationFrame = window.requestAnimationFrame(render);
    };

    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={SCENE_WIDTH}
      height={SCENE_HEIGHT}
      aria-hidden="true"
      className="mt-5 h-[92px] w-full bg-[var(--field)]"
    />
  );
}

function createObstacle(x: number, seed: number): Obstacle {
  const widths = [10, 14, 18];
  const heights = [22, 28, 18];
  const index = seed % widths.length;

  return {
    id: seed,
    x,
    width: widths[index],
    height: heights[(seed + 1) % heights.length],
  };
}

function getJumpDistance(obstacleId: number, runCount: number) {
  const baseDistance = 92;
  const jitter = ((obstacleId + runCount * 3) % 4) * 7;

  return baseDistance + jitter;
}

function shouldSkipJump(obstacleId: number, runCount: number) {
  return (obstacleId + runCount) % 7 === 5;
}

function hasCollision(dinoY: number, obstacles: Obstacle[]) {
  const dinoBox = {
    x: DINO_X + 1,
    y: GROUND_Y - 26 - dinoY,
    width: 20,
    height: 24,
  };

  return obstacles.some((obstacle) => {
    const obstacleBox = {
      x: obstacle.x,
      y: GROUND_Y + 8 - obstacle.height,
      width: obstacle.width,
      height: obstacle.height,
    };

    return (
      dinoBox.x < obstacleBox.x + obstacleBox.width &&
      dinoBox.x + dinoBox.width > obstacleBox.x &&
      dinoBox.y < obstacleBox.y + obstacleBox.height &&
      dinoBox.y + dinoBox.height > obstacleBox.y
    );
  });
}

function drawScene(
  context: CanvasRenderingContext2D,
  dinoY: number,
  obstacles: Obstacle[],
  groundOffset: number,
  score: number,
  highScore: number,
) {
  context.fillStyle = "#0f1012";
  context.fillRect(0, 0, SCENE_WIDTH, SCENE_HEIGHT);

  context.font = '12px "IBM Plex Mono", monospace';
  context.textBaseline = "top";

  context.fillStyle = "#8a8a8f";
  context.textAlign = "left";
  context.fillText(formatScore(score), 12, 10);
  context.textAlign = "right";
  context.fillText(`HI ${formatScore(highScore)}`, SCENE_WIDTH - 12, 10);

  context.fillStyle = "#202228";
  context.fillRect(0, GROUND_Y + 8, SCENE_WIDTH, 1);

  context.fillStyle = "#2b2f36";

  for (let x = -groundOffset; x < SCENE_WIDTH + 12; x += 28) {
    context.fillRect(x, GROUND_Y + 12, 14, 1);
  }

  context.fillStyle = "#f2f2f3";
  context.fillRect(DINO_X, GROUND_Y - 22 - dinoY, 16, 16);
  context.fillRect(DINO_X + 11, GROUND_Y - 30 - dinoY, 10, 10);
  context.fillRect(DINO_X + 18, GROUND_Y - 28 - dinoY, 3, 3);
  context.fillRect(DINO_X + 3, GROUND_Y - 6 - dinoY, 3, 10);
  context.fillRect(DINO_X + 10, GROUND_Y - 6 - dinoY, 3, 10);
  context.fillRect(DINO_X + 1, GROUND_Y - 18 - dinoY, 4, 3);

  context.fillStyle = "#8a8a8f";

  for (const obstacle of obstacles) {
    context.fillRect(
      obstacle.x,
      GROUND_Y + 8 - obstacle.height,
      obstacle.width,
      obstacle.height,
    );
    context.fillRect(
      obstacle.x + obstacle.width * 0.5 - 1,
      GROUND_Y + 2 - obstacle.height,
      2,
      8,
    );
  }
}

function formatScore(value: number) {
  return value.toString().padStart(4, "0");
}
