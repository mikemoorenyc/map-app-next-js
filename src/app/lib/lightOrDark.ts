function lightOrDark(color:string) : "light"|"dark"{

    // Variables for red, green, blue values
    let r = 0, g = 0, b = 0;
    
    // Check the format of the color, HEX or RGB?
    if (color.startsWith("rgb")) {

        // If RGB --> store the red, green, blue values in separate variables
        const match = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
             );

    if (!match) throw new Error("Invalid RGB color format");
        
        r = parseInt(match[1], 10);
        g = parseInt(match[2], 10);
        b = parseInt(match[3], 10);
    } 
    else {
        
        let hex = color.replace(/^#/, "");
        if (hex.length === 3) {
             hex = hex
            .split("")
            .map((char) => char + char)
            .join("");
        
        const num = parseInt(hex, 16);
        r = (num >> 16) & 255;
        g = (num >> 8) & 255;
        b = num & 255;}

    }
    
    // HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
    const hsp = Math.sqrt(
    0.299 * (r * r) +
      0.587 * (g * g) +
      0.114 * (b * b)
    );

    // Using the HSP value, determine whether the color is light or dark
     return hsp > 127.5 ? "light" : "dark";
}

export default lightOrDark
