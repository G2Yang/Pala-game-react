import React, { useRef, useEffect, useState } from 'react';
import './Tablero.css';

const Tablero = () => {
    const canvasRef = useRef(null);
    const leftPaddleRef = useRef({ x: 10, y: 150, width: 10, height: 100, dy: 0 });
    const rightPaddleRef = useRef({ x: 780, y: 150, width: 10, height: 100, dy: 0 });
    const ballRef = useRef({ x: 400, y: 200, size: 13, dx: 5, dy: 5 });
    const [puntos1, setPuntos1] = useState(0);
    const [puntos2, setPuntos2] = useState(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const drawPaddle = (paddle) => {
            const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y);
            gradient.addColorStop(0, 'green');
            gradient.addColorStop(1, 'orange');
            ctx.fillStyle = gradient;
            ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        };

        const drawBall = () => {
            const ballImage = new Image();
            ballImage.src = './pokeball.png'; // Reemplaza con la ruta de tu imagen de pelota
            ctx.drawImage(ballImage, ballRef.current.x, ballRef.current.y, ballRef.current.size, ballRef.current.size);
        };

        const update = () => {
            const leftPaddle = leftPaddleRef.current;
            const rightPaddle = rightPaddleRef.current;
            const ball = ballRef.current;

            leftPaddle.y = Math.min(Math.max(leftPaddle.y + leftPaddle.dy, 0), canvas.height - leftPaddle.height);
            rightPaddle.y = Math.min(Math.max(rightPaddle.y + rightPaddle.dy, 0), canvas.height - rightPaddle.height);

            ball.x += ball.dx;
            ball.y += ball.dy;

            if (ball.y + ball.size > canvas.height || ball.y < 0) {
                ball.dy *= -1;
            }

            if (
                (ball.x < leftPaddle.x + leftPaddle.width && ball.y + ball.size > leftPaddle.y && ball.y < leftPaddle.y + leftPaddle.height) ||
                (ball.x + ball.size > rightPaddle.x && ball.y + ball.size > rightPaddle.y && ball.y < rightPaddle.y + rightPaddle.height)
            ) {
                ball.dx *= -1;
            }

            if (ball.x < 0) {
                ball.x = canvas.width / 2;
                ball.y = canvas.height / 2;
                ball.dx *= -1;
                ball.dy *= -1;

                setPuntos1((prevPuntos1) => prevPuntos1 + 1);
            }
            if (ball.x + ball.size > canvas.width) {
                ball.x = canvas.width / 2;
                ball.y = canvas.height / 2;
                ball.dx *= -1;
                ball.dy *= -1;

                setPuntos2((prevPuntos2) => prevPuntos2 + 1);
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPaddle(leftPaddleRef.current);
            drawPaddle(rightPaddleRef.current);
            drawBall();
        };

        const gameLoop = () => {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        };

        gameLoop();

        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                    rightPaddleRef.current.dy = -5;
                    break;
                case 'ArrowDown':
                    rightPaddleRef.current.dy = 5;
                    break;
                case 'w':
                    leftPaddleRef.current.dy = -5;
                    break;
                case 's':
                    leftPaddleRef.current.dy = 5;
                    break;
                default:
                    break;
            }
        };

        const handleKeyUp = (e) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowDown':
                    rightPaddleRef.current.dy = 0;
                    break;
                case 'w':
                case 's':
                    leftPaddleRef.current.dy = 0;
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    useEffect(() => {
        if (puntos1 === 10) {
            alert('Jugador 1 gana');
        } else if (puntos2 === 10) {
            alert('Jugador 2 gana');
        }
    }, [puntos1, puntos2]);

    return (
        <>
            <div style={{backgroundColor: 'white'}}>
                <p style={{ textAlign: 'center', color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }}>Puntos Player 1: {puntos1} </p>
                <p style={{ textAlign: 'center', color: 'black', fontWeight: 'bold', fontSize: '1.5rem' }}>Puntos Player 2: {puntos2}</p>

            </div>

            <canvas ref={canvasRef} width="800" height="400"></canvas>
        </>
    );
};

export default Tablero;
