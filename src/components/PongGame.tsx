import { useEffect, useRef } from 'react';

interface PongGameProps {
  onExit: () => void;
}

const W = 640;
const H = 400;

const PADDLE_W = 10;
const PADDLE_H = 70;
const BALL_SIZE = 10;
const PLAYER_SPEED = 3.6;
const AI_SPEED = 2.3;
const BALL_SPEED_INIT = 2.5;
const BALL_SPEED_MAX = 7;
const BALL_VY_INIT = 2;
const WIN_SCORE = 11;

const GREEN = '#33ff33';
const GREEN_DIM = '#1a8c1a';
const BG = '#0a0a0a';

type GamePhase = 'playing' | 'confirming-exit' | 'game-over';

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Paddle {
  y: number;
}

interface Score {
  player: number;
  ai: number;
}

export default function PongGame({ onExit }: PongGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onExitRef = useRef(onExit);

  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;

    const phase = { current: 'playing' as GamePhase };
    const winner = { current: '' };
    const keys = new Set<string>();

    const ball: Ball = { x: W / 2, y: H / 2, vx: BALL_SPEED_INIT, vy: BALL_VY_INIT };
    const player: Paddle = { y: H / 2 - PADDLE_H / 2 };
    const ai: Paddle = { y: H / 2 - PADDLE_H / 2 };
    const score: Score = { player: 0, ai: 0 };

    function launchBall(towardPlayer: boolean) {
      const dir = towardPlayer ? 1 : -1;
      const vy = (Math.random() > 0.5 ? 1 : -1) * (BALL_VY_INIT + Math.random() * 1.5);
      ball.x = W / 2;
      ball.y = H / 2;
      ball.vx = dir * BALL_SPEED_INIT;
      ball.vy = vy;
    }

    function resetGame() {
      score.player = 0;
      score.ai = 0;
      player.y = H / 2 - PADDLE_H / 2;
      ai.y = H / 2 - PADDLE_H / 2;
      launchBall(Math.random() > 0.5);
      phase.current = 'playing';
    }

    function clampPaddle(p: Paddle) {
      if (p.y < 0) p.y = 0;
      if (p.y + PADDLE_H > H) p.y = H - PADDLE_H;
    }

    function update() {
      if (phase.current !== 'playing') return;

      // Player input
      if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) {
        player.y -= PLAYER_SPEED;
      }
      if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) {
        player.y += PLAYER_SPEED;
      }
      clampPaddle(player);

      // AI tracks ball when ball is moving toward it
      const aiCenter = ai.y + PADDLE_H / 2;
      const ballCenter = ball.y + BALL_SIZE / 2;
      if (ball.vx < 0) {
        if (aiCenter < ballCenter - 4) {
          ai.y += Math.min(AI_SPEED, ballCenter - aiCenter);
        } else if (aiCenter > ballCenter + 4) {
          ai.y -= Math.min(AI_SPEED, aiCenter - ballCenter);
        }
      } else {
        // drift back to center
        const mid = H / 2 - PADDLE_H / 2;
        if (Math.abs(ai.y - mid) > 1) {
          ai.y += ai.y < mid ? Math.min(AI_SPEED * 0.4, mid - ai.y) : -Math.min(AI_SPEED * 0.4, ai.y - mid);
        }
      }
      clampPaddle(ai);

      // Move ball
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Top / bottom wall bounce
      if (ball.y <= 0) {
        ball.y = 0;
        ball.vy = Math.abs(ball.vy);
      } else if (ball.y + BALL_SIZE >= H) {
        ball.y = H - BALL_SIZE;
        ball.vy = -Math.abs(ball.vy);
      }

      // Player paddle (right side)
      const playerX = W - PADDLE_W - 12;
      if (
        ball.x + BALL_SIZE >= playerX &&
        ball.x <= playerX + PADDLE_W &&
        ball.y + BALL_SIZE >= player.y &&
        ball.y <= player.y + PADDLE_H &&
        ball.vx > 0
      ) {
        ball.x = playerX - BALL_SIZE;
        const hitPos = (ball.y + BALL_SIZE / 2 - player.y) / PADDLE_H;
        const newSpeed = Math.min(Math.abs(ball.vx) + 0.4, BALL_SPEED_MAX);
        ball.vx = -newSpeed;
        ball.vy = (hitPos - 0.5) * 10;
        if (Math.abs(ball.vy) < 1) ball.vy = ball.vy < 0 ? -1 : 1;
      }

      // AI paddle (left side)
      const aiX = 12;
      if (
        ball.x <= aiX + PADDLE_W &&
        ball.x >= aiX &&
        ball.y + BALL_SIZE >= ai.y &&
        ball.y <= ai.y + PADDLE_H &&
        ball.vx < 0
      ) {
        ball.x = aiX + PADDLE_W;
        const hitPos = (ball.y + BALL_SIZE / 2 - ai.y) / PADDLE_H;
        const newSpeed = Math.min(Math.abs(ball.vx) + 0.4, BALL_SPEED_MAX);
        ball.vx = newSpeed;
        ball.vy = (hitPos - 0.5) * 10;
        if (Math.abs(ball.vy) < 1) ball.vy = ball.vy < 0 ? -1 : 1;
      }

      // Scoring
      if (ball.x + BALL_SIZE < 0) {
        score.player++;
        if (score.player >= WIN_SCORE) {
          winner.current = 'player';
          phase.current = 'game-over';
        } else {
          launchBall(false);
        }
      } else if (ball.x > W) {
        score.ai++;
        if (score.ai >= WIN_SCORE) {
          winner.current = 'ai';
          phase.current = 'game-over';
        } else {
          launchBall(true);
        }
      }
    }

    function draw() {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, W, H);

      // Center dashed line
      ctx.strokeStyle = GREEN_DIM;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 10]);
      ctx.beginPath();
      ctx.moveTo(W / 2, 0);
      ctx.lineTo(W / 2, H);
      ctx.stroke();
      ctx.setLineDash([]);

      // Score
      ctx.fillStyle = GREEN;
      ctx.font = '36px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(String(score.ai), W / 4, 10);
      ctx.fillText(String(score.player), (W * 3) / 4, 10);

      // AI paddle (left)
      ctx.fillStyle = GREEN;
      ctx.fillRect(12, ai.y, PADDLE_W, PADDLE_H);

      // Player paddle (right)
      ctx.fillRect(W - PADDLE_W - 12, player.y, PADDLE_W, PADDLE_H);

      // Ball (hidden during game-over)
      if (phase.current !== 'game-over') {
        ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
      }

      // Controls hint (bottom)
      ctx.fillStyle = GREEN_DIM;
      ctx.font = '14px "VT323", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText('W / S  or  ↑ / ↓  to move   |   ESC to exit', W / 2, H - 4);

      // Confirm-exit overlay
      if (phase.current === 'confirming-exit') {
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, H / 2 - 28, W, 56);
        ctx.strokeStyle = GREEN_DIM;
        ctx.lineWidth = 1;
        ctx.strokeRect(20, H / 2 - 28, W - 40, 56);
        ctx.fillStyle = GREEN;
        ctx.font = '22px "VT323", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Press ESC again to exit, or Enter to continue', W / 2, H / 2);
      }

      // Game-over overlay
      if (phase.current === 'game-over') {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, W, H);

        ctx.strokeStyle = GREEN_DIM;
        ctx.lineWidth = 2;
        ctx.strokeRect(60, H / 2 - 70, W - 120, 140);

        const playerWon = winner.current === 'player';
        ctx.fillStyle = GREEN;
        ctx.font = '64px "VT323", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(playerWon ? 'YOU WIN!' : 'YOU LOSE', W / 2, H / 2 - 28);

        ctx.font = '26px "VT323", monospace';
        ctx.fillStyle = GREEN_DIM;
        ctx.fillText(`${score.ai}  —  ${score.player}`, W / 2, H / 2 + 10);

        ctx.font = '20px "VT323", monospace';
        ctx.fillStyle = GREEN;
        ctx.fillText('Enter — try again   |   ESC — exit', W / 2, H / 2 + 46);
      }
    }

    let animId: number;

    function loop() {
      update();
      draw();
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        if (phase.current === 'game-over') {
          cancelAnimationFrame(animId);
          onExitRef.current();
        } else if (phase.current === 'playing') {
          phase.current = 'confirming-exit';
        } else if (phase.current === 'confirming-exit') {
          cancelAnimationFrame(animId);
          onExitRef.current();
        }
        return;
      }

      if (e.key === 'Enter') {
        e.preventDefault();
        if (phase.current === 'game-over') {
          resetGame();
        } else if (phase.current === 'confirming-exit') {
          phase.current = 'playing';
        }
        return;
      }

      keys.add(e.key);

      if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      keys.delete(e.key);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '8px 0' }}>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        style={{ display: 'block', maxWidth: '100%', imageRendering: 'pixelated' }}
      />
    </div>
  );
}
