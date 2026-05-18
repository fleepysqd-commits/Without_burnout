// Research charts (Chart.js)
(function () {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.font.family = "'Manrope', system-ui, sans-serif";
    Chart.defaults.color = '#5a6072';
    Chart.defaults.font.size = 12;

    const palette = {
        red: '#e26d6d',
        amber: '#f0a85c',
        green: '#52c08e',
        blue: '#5b8def',
        teal: '#54bdb5',
        violet: '#9b87f5',
    };

    const baseDoughnut = (ctx, data) =>
        new Chart(ctx, {
            type: 'doughnut',
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '62%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            boxHeight: 12,
                            padding: 14,
                            usePointStyle: true,
                            pointStyle: 'circle',
                        },
                    },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
                        },
                    },
                },
            },
        });

    const baseBar = (ctx, data, opts = {}) =>
        new Chart(ctx, {
            type: 'bar',
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: opts.horizontal ? 'y' : 'x',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => `${ctx.parsed[opts.horizontal ? 'x' : 'y']}%`,
                        },
                    },
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(0,0,0,0.04)' },
                        ticks: { callback: (v) => v + (opts.horizontal ? '%' : '%') },
                        beginAtZero: true,
                        max: opts.horizontal ? 100 : undefined,
                    },
                    y: {
                        grid: { color: 'rgba(0,0,0,0.04)' },
                        ticks: { callback: (v) => v + (opts.horizontal ? '' : '%') },
                        beginAtZero: true,
                        max: opts.horizontal ? undefined : 100,
                    },
                },
            },
        });

    const safeCtx = (id) => {
        const el = document.getElementById(id);
        return el ? el.getContext('2d') : null;
    };

    // 1. Усталость
    {
        const ctx = safeCtx('chartFatigue');
        if (ctx)
            baseDoughnut(ctx, {
                labels: ['Постоянно', 'Периодически', 'Почти не чувствую'],
                datasets: [
                    {
                        data: [52, 36, 12],
                        backgroundColor: [palette.red, palette.amber, palette.green],
                        borderWidth: 0,
                    },
                ],
            });
    }

    // 2. Тревожность
    {
        const ctx = safeCtx('chartAnxiety');
        if (ctx)
            baseDoughnut(ctx, {
                labels: ['Часто/сильно', 'Иногда', 'Нет'],
                datasets: [
                    {
                        data: [60, 32, 8],
                        backgroundColor: [palette.red, palette.amber, palette.green],
                        borderWidth: 0,
                    },
                ],
            });
    }

    // 3. Интерес
    {
        const ctx = safeCtx('chartInterest');
        if (ctx)
            baseDoughnut(ctx, {
                labels: ['Заметно снизился', 'Немного снизился', 'Без изменений'],
                datasets: [
                    {
                        data: [44, 36, 20],
                        backgroundColor: [palette.red, palette.amber, palette.green],
                        borderWidth: 0,
                    },
                ],
            });
    }

    // 4. Сон
    {
        const ctx = safeCtx('chartSleep');
        if (ctx)
            baseBar(
                ctx,
                {
                    labels: ['Меньше 6 ч', '6–7 ч', '7–8 ч', 'Больше 8 ч'],
                    datasets: [
                        {
                            data: [56, 28, 12, 4],
                            backgroundColor: [palette.red, palette.amber, palette.teal, palette.green],
                            borderRadius: 8,
                            borderSkipped: false,
                            barThickness: 32,
                        },
                    ],
                },
                {}
            );
    }

    // 5. План
    {
        const ctx = safeCtx('chartPlan');
        if (ctx)
            baseDoughnut(ctx, {
                labels: ['Чёткий план', 'Частично', 'Нет плана'],
                datasets: [
                    {
                        data: [28, 56, 16],
                        backgroundColor: [palette.green, palette.amber, palette.red],
                        borderWidth: 0,
                    },
                ],
            });
    }

    // 6. Способы снижения стресса
    {
        const ctx = safeCtx('chartStress');
        if (ctx)
            baseBar(
                ctx,
                {
                    labels: ['Регулярно', 'Нерегулярно', 'Почти не использую'],
                    datasets: [
                        {
                            data: [48, 36, 16],
                            backgroundColor: [palette.green, palette.amber, palette.red],
                            borderRadius: 8,
                            borderSkipped: false,
                        },
                    ],
                },
                { horizontal: true }
            );
    }
})();
