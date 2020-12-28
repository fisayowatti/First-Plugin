// HELPER FUNCTIONS
function clone(val) {
    const type = typeof val;
    if (val === null) {
        return null;
    }
    else if (type === 'undefined' || type === 'number' ||
        type === 'string' || type === 'boolean') {
        return val;
    }
    else if (type === 'object') {
        if (val instanceof Array) {
            return val.map(x => clone(x));
        }
        else if (val instanceof Uint8Array) {
            return new Uint8Array(val);
        }
        else {
            let o = {};
            for (const key in val) {
                o[key] = clone(val[key]);
            }
            return o;
        }
    }
    throw 'unknown';
}
;
const base16to10 = (num) => {
    const translateLetterToNumber = (letterOrNumber) => {
        if (letterOrNumber === 'a' || letterOrNumber === 'A') {
            return '10';
        }
        else if (letterOrNumber === 'b' || letterOrNumber === 'B') {
            return '11';
        }
        else if (letterOrNumber === 'c' || letterOrNumber === 'C') {
            return '12';
        }
        else if (letterOrNumber === 'd' || letterOrNumber === 'D') {
            return '13';
        }
        else if (letterOrNumber === 'e' || letterOrNumber === 'E') {
            return '14';
        }
        else if (letterOrNumber === 'f' || letterOrNumber === 'F') {
            return '15';
        }
        else {
            return letterOrNumber;
        }
    };
    for (let i = 0; i < num.length; i++) {
        let figure = num.slice(i, i + 1);
    }
    let splitNum = num.split("").reverse();
    let result = splitNum.reduce((acc, curr, idx) => {
        const figure = parseInt(translateLetterToNumber(curr)) * Math.pow(16, idx);
        acc += figure;
        return acc;
    }, 0);
    return result;
};
const hexToRGBA = (hex, alpha = 0) => {
    const redHex = hex.slice(1, 3);
    const greenHex = hex.slice(3, 5);
    const blueHex = hex.slice(5, 7);
    const redChannel = base16to10(redHex);
    const greenChannel = base16to10(greenHex);
    const blueChannel = base16to10(blueHex);
    console.log('huha', redChannel, greenChannel, blueChannel);
    return {
        r: redChannel / 255,
        g: greenChannel / 255,
        b: blueChannel / 255,
        a: alpha
    };
};
const lightenHex = (hexColor, alpha) => {
    const rgb = hexToRGBA(hexColor);
    return {
        r: Math.min(1, rgb.r * 1.1),
        g: Math.min(1, rgb.g * 1.1),
        b: Math.min(1, rgb.b * 1.1),
        a: alpha
    };
};
const darkenHex = (hexColor, alpha) => {
    const rgb = hexToRGBA(hexColor);
    return {
        r: Math.max(0, rgb.r * 0.9),
        g: Math.max(0, rgb.g * 0.9),
        b: Math.max(0, rgb.b * 0.9),
        a: alpha
    };
};
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-rectangles') {
        const nodes = [];
        for (let i = 0; i < msg.count; i++) {
            const rect = figma.createRectangle();
            rect.x = i * 150;
            rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
figma.on('selectionchange', () => {
    // const newNode = figma.createNodeFromSvg(figma.currentPage.selection.map(node => node.vectorPaths[0])[0].data)
    console.log(figma.currentPage.selection[0]);
});
let desiredFill = {
    type: "GRADIENT_RADIAL",
    visible: true,
    opacity: 1,
    blendMode: "NORMAL",
    gradientStops: [
        {
            color: { r: 1, g: 1, b: 1, a: 0.40 },
            position: 0
        },
        {
            color: { r: 1, g: 1, b: 1, a: 0 },
            position: 1
        }
    ],
    gradientTransform: [
        [0.35403570532798767, 0.16025729477405548, 0.48570701479911804],
        [-0.1602572798728943, 0.16398245096206665, 0.49627482891082764]
    ]
};
let desiredStrokeLighterBg = {
    type: "GRADIENT_RADIAL",
    visible: true,
    opacity: 1,
    blendMode: "NORMAL",
    gradientStops: [
        {
            color: { r: 0.40572917461395264, g: 0.6258341670036316, b: 0.7916666865348816, a: 1 },
            position: 0
        },
        {
            color: { r: 0.40392157435417175, g: 0.6274510025978088, b: 0.7921568751335144, a: 0 },
            position: 1
        }
    ],
    gradientTransform: [
        [0.36374300718307495, 0.16152098774909973, 0.4829544126987457],
        [-0.16152098774909973, 0.16847868263721466, 0.49491479992866516]
    ]
};
let desiredStrokeDarkerBg = {
    type: "GRADIENT_RADIAL",
    visible: true,
    opacity: 1,
    blendMode: "NORMAL",
    gradientStops: [
        {
            color: { r: 0.19055557250976562, g: 0.5476345419883728, b: 0.8166666626930237, a: 1 },
            position: 0
        },
        {
            color: { r: 0.1921568661928177, g: 0.5490196347236633, b: 0.8156862854957581, a: 0 },
            position: 1
        }
    ],
    gradientTransform: [
        [-0.3619246184825897, -0.16460323333740234, 1.014169692993164],
        [0.16460323333740234, -0.167636439204216, 0.5019176602363586]
    ]
};
let desiredStrokeLightSource = {
    type: "GRADIENT_RADIAL",
    visible: true,
    opacity: 1,
    blendMode: "NORMAL",
    gradientStops: [
        {
            color: { r: 1, g: 1, b: 1, a: 0.90 },
            position: 0
        },
        {
            color: { r: 1, g: 1, b: 1, a: 0 },
            position: 1
        }
    ],
    gradientTransform: [
        [0.36374300718307495, 0.16152098774909973, 0.4829544126987457],
        [-0.16152098774909973, 0.16847868263721466, 0.49491479992866516]
    ]
};
const desiredStrokeWeight = 3;
const desiredEffects = [
    { type: "BACKGROUND_BLUR", radius: 42, visible: true }
];
const glassify = (node, lightIntensity, lightColor, bgColor) => {
    //change the color of the light at the edge of the stroke facing the light source
    desiredStrokeLightSource.gradientStops[0].color = hexToRGBA(lightColor, lightIntensity / 100);
    //change the alpha (representing the light brightness/intensity) at the edge of the stroke facing the light source
    // desiredStrokeLightSource.gradientStops[0].color.a = lightIntensity / 100;
    //change the color of the light at the edge of the stroke away from the light source
    desiredStrokeLightSource.gradientStops[1].color = hexToRGBA(lightColor);
    //change the color of the light that affects the fill of the shape
    desiredFill.gradientStops[0].color = hexToRGBA(lightColor, 0.40);
    desiredStrokeLighterBg.gradientStops[0].color = lightenHex(bgColor, 1);
    desiredStrokeLighterBg.gradientStops[1].color = lightenHex(bgColor, 0);
    desiredStrokeDarkerBg.gradientStops[0].color = darkenHex(bgColor, 1);
    desiredStrokeDarkerBg.gradientStops[1].color = darkenHex(bgColor, 0);
    console.log('rubbish?', desiredStrokeLightSource, desiredStrokeLighterBg, desiredStrokeDarkerBg);
    node.fills = [desiredFill];
    node.strokes = [desiredStrokeLighterBg, desiredStrokeDarkerBg, desiredStrokeLightSource];
    node.strokeWeight = 3;
    node.effects = desiredEffects;
    // const fills = clone(node.fills);
};
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'glassify') {
        // const nodes: SceneNode[] = [];
        // for (let i = 0; i < msg.count; i++) {
        //   const rect = figma.createRectangle();
        //   rect.x = i * 150;
        //   rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
        //   figma.currentPage.appendChild(rect);
        //   nodes.push(rect);
        // }
        // figma.currentPage.selection = nodes;
        // figma.viewport.scrollAndZoomIntoView(nodes);
        for (let selection of figma.currentPage.selection) {
            // if(selection.children) {return};
            glassify(selection, msg.lightIntensity, msg.lightColor, msg.bgColor);
        }
        // glassify(figma.currentPage.selection[0]);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
