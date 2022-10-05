import { getXstring, computeBounderis, line, isOver, circle } from './utils.js';

export function Chart(canvas, data) {
    const ctx = canvas.getContext('2d');

    let raf;
    let Yscale;
    let Xscale;

    const WIDTH = canvas.clientWidth;
    const HEIGHT = canvas.clientHeight;
    const DPI_WIDTH = WIDTH * 2;
    const DPI_HEIGHT = HEIGHT * 2;
    const ROWS_COUNT = 5;

    const CIRCLE_RADIUS = 8;
    const PADDING = 40;
    const VUE_HEIGTH = DPI_HEIGHT - PADDING * 2;
    const VUE_WIDTH = DPI_WIDTH;
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;

    let proxy = new Proxy({}, {
        set(...args) {
            let arg = args;
            //console.log(arg)
            const result = Reflect.set(...args);
            raf = requestAnimationFrame(paint);

            //console.log(result)
            return result
        }
    })

    function mousemove(event) {
        let { clientX } = event;
        let { left } = canvas.getBoundingClientRect()
        proxy.mouse = {
            x: (clientX - left) * 2
        }
    }

    function mouseleave() {
        proxy.mouse = null;
    }

    function paint() {
        clear(ctx);
        let [yMin, yMax] = computeBounderis(data);
        Yscale = VUE_HEIGTH / (yMax - yMin);
        Xscale = VUE_WIDTH / (data.columns[0].length - 2);

        const yData = data.columns.filter((coll) => data.types[coll[0]] === 'line');
        const xData = data.columns.filter((coll) => data.types[coll[0]] !== 'line')[0];

        yAxis(yMax, yMin);
        xAxis(xData);

        yData.forEach((col) => {
            let color = data.colors[col[0]];
            const cords = col.
            map(toCords()).filter((_, i) => i !== 0);
            line(ctx, cords, color);

            for (let [x, y] of cords) {
                if (isOver(proxy.mouse, x, cords.length, DPI_WIDTH)) {
                    circle(ctx, x, y, color, CIRCLE_RADIUS);
                    break;
                }
            }
        })
    }

    function clear(ctx) {
        ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
    }
    //utils
    function yAxis(yMax, yMin) {
        let steps = ROWS_COUNT;
        let step = VUE_HEIGTH / steps;
        let textStep = (yMax - yMin) / steps;
        ctx.beginPath();
        ctx.strokeStyle = "#bbb";
        ctx.lineWidth = 2;

        for (let i = 1; i <= ROWS_COUNT; i++) {
            const y = step * i;

            ctx.font = 'normal 20px Helvetica';
            ctx.fillStyle = '#96a2aa';
            ctx.fillText(Math.round(textStep * (ROWS_COUNT - i)), 5, y - 10 + PADDING);

            ctx.moveTo(0, y + PADDING);
            ctx.lineTo(DPI_WIDTH, y + PADDING);
            // console.log(ctx.lineWidth)
            ctx.stroke();
        }
        ctx.closePath();
    }

    function xAxis(data) {
        let { mouse } = proxy;

        let colsCount = 6;
        let step = Math.round(data.length / colsCount);
        ctx.beginPath();

        for (let i = 1; i < data.length; i++) {
            let x = i * Xscale;
            if ((i - 1) % step === 0) {
                let text = getXstring(data[i]);
                ctx.fillText(text.toString(), x, DPI_HEIGHT - 10)
            }

            if (isOver(mouse, x, data.length, DPI_WIDTH)) {
                ctx.save();

                ctx.lineWidth = 1;
                ctx.moveTo(x, PADDING / 2);
                ctx.lineTo(x, DPI_HEIGHT - PADDING);
                ctx.stroke();


                // console.log(`over`)
                ctx.restore();
            }
        }
        ctx.closePath();
    }

    function toCords() {
        return (y, index) => [Math.floor((index - 1) * Xscale), Math.floor(DPI_HEIGHT - PADDING - y * Yscale)];
    }

    return {
        init() {
            paint();
            canvas.addEventListener('mousemove', mousemove);
            canvas.addEventListener('mouseleave', mouseleave);
        },
        destoy() {
            cancelAnimationFrame(raf);
            canvas.removeEventListener('mousemove', mousemove);
            canvas.removeEventListener('mouseleave', mouseleave);
        }
    }
}