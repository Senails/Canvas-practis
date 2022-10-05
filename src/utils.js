export function getXstring(timestamp) {
    let arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let date = new Date(timestamp);
    return arr[date.getMonth()] + ' ' + date.getFullYear();
}

export function computeBounderis({ types, columns }) {
    let min;
    let max;

    columns.forEach((col => {
        if (types[col[0]] !== "line") return;

        if (typeof min !== "number") min = col[1];
        if (typeof max !== "number") max = col[1];

        for (let i = 1; i <= col.length; i++) {
            if (min > col[i]) {
                // console.log(`Min ${min} => ${col[i]}`)
                min = col[i]
            };
            if (max < col[i]) {
                // console.log(`Max ${max} => ${col[i]}`)
                max = col[i]
            };
        }
    }))
    return [min, max];
}

export function line(ctx, cords, color) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    for (let [x, y] of cords) {
        //  ctx.lineTo(x, DPI_HEIGHT - PADDING - y * Yscale);
        ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.closePath();
}

export function isOver(mouse, x, lenght, Dwidth) {
    if (!mouse) return false;
    if (!mouse.x) return false;
    let width = Dwidth / lenght;
    //console.log(Math.abs((x - mouse.x)) < (width / 2));
    return Math.abs((x - mouse.x)) < (width / 2);
}

export function circle(ctx, x, y, color, radius) {
    ctx.beginPath();

    ctx.fillStyle = '#fff';
    ctx.strokeStyle = color;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    ctx.closePath();
}

export function css(elem, styles = {}) {
    elem.style = {...elem.style, styles };
}