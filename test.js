// ============ Breathing 4-7-8 ============
(function () {
    const circle = document.getElementById('breathCircle');
    const label = document.getElementById('breathLabel');
    const startBtn = document.getElementById('breathStart');
    const stopBtn = document.getElementById('breathStop');
    const hint = document.getElementById('breathHint');
    if (!circle) return;

    let timer = null;
    let phaseTimer = null;
    let cycle = 0;
    const TOTAL_CYCLES = 4;

    const phases = [
        { name: 'inhale', text: 'Вдох', secs: 4 },
        { name: 'hold', text: 'Задержка', secs: 7 },
        { name: 'exhale', text: 'Выдох', secs: 8 },
    ];

    const setPhase = (phase, secsLeft) => {
        circle.classList.remove('inhale', 'hold', 'exhale');
        circle.classList.add(phase.name);
        label.textContent = `${phase.text} ${secsLeft}`;
    };

    const runPhase = (idx, onComplete) => {
        const phase = phases[idx];
        let left = phase.secs;
        setPhase(phase, left);
        phaseTimer = setInterval(() => {
            left -= 1;
            if (left <= 0) {
                clearInterval(phaseTimer);
                onComplete();
            } else {
                setPhase(phase, left);
            }
        }, 1000);
    };

    const runCycle = () => {
        if (cycle >= TOTAL_CYCLES) {
            stop(true);
            return;
        }
        cycle += 1;
        hint.textContent = `Цикл ${cycle} из ${TOTAL_CYCLES}. Дышите спокойно, не форсируйте.`;
        runPhase(0, () => runPhase(1, () => runPhase(2, runCycle)));
    };

    const stop = (finished) => {
        if (timer) clearTimeout(timer);
        if (phaseTimer) clearInterval(phaseTimer);
        timer = null;
        phaseTimer = null;
        cycle = 0;
        circle.classList.remove('inhale', 'hold', 'exhale');
        label.textContent = finished ? 'Готово 🌿' : 'Начать';
        startBtn.disabled = false;
        stopBtn.disabled = true;
        if (finished) {
            hint.textContent = 'Готово. Если тревога ещё высокая — повторите ещё один подход.';
        } else {
            hint.textContent = 'Сядьте ровно, расслабьте плечи. Готово? Нажимайте «Запустить».';
        }
    };

    startBtn.addEventListener('click', () => {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        cycle = 0;
        runCycle();
    });

    stopBtn.addEventListener('click', () => stop(false));
})();

// ============ Pomodoro ============
(function () {
    const display = document.getElementById('pomoDisplay');
    const mode = document.getElementById('pomoMode');
    const startBtn = document.getElementById('pomoStart');
    const resetBtn = document.getElementById('pomoReset');
    const skipBtn = document.getElementById('pomoSkip');
    if (!display) return;

    const FOCUS = 25 * 60;
    const SHORT = 5 * 60;
    const LONG = 15 * 60;

    let phase = 'focus'; // 'focus' | 'short' | 'long'
    let secondsLeft = FOCUS;
    let running = false;
    let interval = null;
    let pomodoros = 0;

    const fmt = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    const setMode = (text) => (mode.textContent = text);

    const renderPhase = () => {
        if (phase === 'focus') {
            secondsLeft = FOCUS;
            setMode('Фокус • 25 минут');
        } else if (phase === 'short') {
            secondsLeft = SHORT;
            setMode('Короткий перерыв • 5 минут');
        } else {
            secondsLeft = LONG;
            setMode('Длинный перерыв • 15 минут');
        }
        display.textContent = fmt(secondsLeft);
    };

    const nextPhase = () => {
        if (phase === 'focus') {
            pomodoros += 1;
            phase = pomodoros % 4 === 0 ? 'long' : 'short';
        } else {
            phase = 'focus';
        }
        renderPhase();
    };

    const tick = () => {
        secondsLeft -= 1;
        if (secondsLeft < 0) {
            stop();
            try {
                document.title = '⏰ Время! ' + (phase === 'focus' ? 'Перерыв' : 'Фокус');
                setTimeout(() => (document.title = document.title.replace(/^⏰ [^•]+• ?/, '')), 4000);
            } catch (e) {}
            nextPhase();
            start();
            return;
        }
        display.textContent = fmt(secondsLeft);
    };

    const start = () => {
        if (running) return;
        running = true;
        startBtn.textContent = 'Пауза';
        interval = setInterval(tick, 1000);
    };

    const stop = () => {
        running = false;
        startBtn.textContent = 'Старт';
        if (interval) clearInterval(interval);
        interval = null;
    };

    startBtn.addEventListener('click', () => {
        if (running) stop();
        else start();
    });
    resetBtn.addEventListener('click', () => {
        stop();
        phase = 'focus';
        pomodoros = 0;
        renderPhase();
    });
    skipBtn.addEventListener('click', () => {
        stop();
        nextPhase();
    });

    renderPhase();
})();

// ============ Reframe ============
(function () {
    const input = document.getElementById('reframeInput');
    const btn = document.getElementById('reframeBtn');
    const output = document.getElementById('reframeOutput');
    if (!input) return;

    const tips = [
        'Что я могу сделать в ближайшие 30 минут, чтобы немного приблизиться к цели?',
        'Какая одна тема меня больше всего пугает? Открою учебник на этой странице и прочитаю первый абзац.',
        'Кому я могу написать с вопросом по этой теме (учитель, репетитор, одноклассник)?',
        'Какой результат я считаю «достаточным» для себя? (не «идеальный», а реалистичный)',
        'На что я опираюсь, когда мне страшно: какие свои сильные стороны я знаю?',
    ];

    btn.addEventListener('click', () => {
        const value = input.value.trim();
        if (!value) {
            input.focus();
            input.placeholder = 'Сначала запишите тревожную мысль';
            return;
        }
        const tip = tips[Math.floor(Math.random() * tips.length)];
        output.innerHTML = `
            <strong>Вместо тревоги — конкретный шаг:</strong>
            <p style="margin:6px 0 0;">${tip}</p>
            <p style="margin:8px 0 0; color:#3c5d4a;">Маленькое действие важнее идеального плана. Сделайте только этот шаг — дальше будет легче.</p>
        `;
        output.hidden = false;
    });
})();
